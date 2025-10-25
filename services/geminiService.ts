import { GoogleGenAI } from "@google/genai";
import {
  UserLocation,
  GroundingSource,
  GeneratedPlan,
  ItineraryPlan,
} from "../types";

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateItinerary = async (
  destination: string,
  duration: number,
  interests: string,
  location: UserLocation
): Promise<GeneratedPlan> => {
  try {
    // **V6.2:** Prompt với ràng buộc ngày mạnh mẽ hơn
    const prompt = `You are an expert travel planner, an "AI Journey Weaver."
    Create a detailed, creative travel itinerary for a ${duration}-day trip to ${destination}.
    Traveler's interests: "${interests}".
    The user is near ${location.latitude}, ${location.longitude}.

    **CRITICAL: YOUR RESPONSE MUST BE A SINGLE, VALID JSON OBJECT.**
    Do NOT use markdown fences (\`\`\`json ... \`\`\`). Do not add any text before or after the JSON object.
    The JSON object must contain these exact keys with string values:

    1.  "itineraryText": String containing the full itinerary in MARKDOWN format.
        - MUST use "### Day N: [Title]" for each day's heading (e.g., "### Day 1: Arrival").
        - MUST use "EAT:", "VISIT:", "DO:", "STAY:" prefixes (followed by a colon and a space) for specific activities.
        - **ABSOLUTE CONSTRAINT:** Generate *exactly* ${duration} day sections (from "### Day 1" to "### Day ${duration}"). No more, no less. Verify the day count before finalizing the response. The structure must strictly follow the requested number of days.

    2.  "seoTitle": A catchy, short string title for this specific ${duration}-day trip to ${destination}.

    3.  "imageGenerationPrompt": A high-quality, English string prompt for an AI image generator (like DALL-E) to create a stunning hero banner image representing ${destination}. Focus on visual details and mood.

    4.  "mapGenerationPrompt": A high-quality, English string prompt for an AI to generate a minimalist vector map highlighting key areas mentioned in the itinerary for this trip in ${destination}. Focus on landmarks and simplicity.
    `;

    console.log("[geminiService] Sending prompt to Gemini:", prompt); // DEBUG

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash", // Using Flash model
      contents: prompt,
      // config and toolConfig remain the same
      config: {
        tools: [{ googleMaps: {} }],
        toolConfig: {
          retrievalConfig: {
            latLng: {
              latitude: location.latitude,
              longitude: location.longitude,
            },
          },
        },
      },
      responseMimeType: "application/json",
    });

    console.log(
      "[geminiService] Received response object from Gemini:",
      response
    ); // DEBUG full response object
    console.log(
      "[geminiService] Raw candidate content:",
      response?.candidates?.[0]?.content
    ); // DEBUG content part

    const groundingChunks =
      response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const sources: GroundingSource[] = groundingChunks
      .filter((chunk) => chunk.maps && chunk.maps.uri && chunk.maps.title)
      .map((chunk) => ({ uri: chunk.maps.uri, title: chunk.maps.title }));

    let rawJsonText: string | null = null;
    let parsedResponse: any;

    try {
      // **V6.2:** An toàn hơn khi truy cập text
      rawJsonText = response.candidates?.[0]?.content?.parts?.[0]?.text ?? null;
      console.log("[geminiService] Raw text extracted:", rawJsonText); // DEBUG extracted text

      if (!rawJsonText) {
        throw new Error("Gemini response did not contain text content."); // Lỗi cụ thể hơn
      }

      // **V6.2:** Làm sạch JSON một cách an toàn hơn
      let cleanedJsonText = rawJsonText.trim();
      // Kiểm tra và loại bỏ backticks chỉ khi chúng bao quanh toàn bộ chuỗi
      if (
        cleanedJsonText.startsWith("```json") &&
        cleanedJsonText.endsWith("```")
      ) {
        cleanedJsonText = cleanedJsonText
          .substring(7, cleanedJsonText.length - 3)
          .trim();
        console.log("[geminiService] Cleaned ```json fences."); // DEBUG
      } else if (
        cleanedJsonText.startsWith("```") &&
        cleanedJsonText.endsWith("```")
      ) {
        cleanedJsonText = cleanedJsonText
          .substring(3, cleanedJsonText.length - 3)
          .trim();
        console.log("[geminiService] Cleaned ``` fences."); // DEBUG
      }
      // Thêm bước thử loại bỏ ký tự không mong muốn ở đầu (nếu có)
      cleanedJsonText = cleanedJsonText.replace(/^[^{]*/, ""); // Loại bỏ mọi thứ trước dấu { đầu tiên

      if (!cleanedJsonText) {
        throw new Error("JSON text is empty after cleaning.");
      }

      console.log(
        "[geminiService] Attempting to parse cleaned JSON:",
        cleanedJsonText
      ); // DEBUG before parse
      parsedResponse = JSON.parse(cleanedJsonText);
      console.log("[geminiService] Successfully parsed JSON:", parsedResponse); // DEBUG
    } catch (e: any) {
      console.error(
        "[geminiService] Failed to parse JSON response. Falling back.",
        "Error:",
        e.message,
        "Raw Text:",
        rawJsonText
      );
      // Fallback với thông báo lỗi rõ ràng hơn
      const errorPlan: ItineraryPlan = {
        itineraryText: `**Error:**\nCould not correctly parse the itinerary generated by the AI for **${destination}**. \nThis often happens due to unexpected formatting in the AI response. \nPlease try generating again. \n\n(Technical details: JSON parsing failed - ${e.message})`,
        sources: sources,
      };
      return {
        plan: errorPlan,
        seoTitle: `Error Generating Trip`,
        imageGenerationPrompt: `Error`,
        mapGenerationPrompt: `Error`,
      };
    }

    // Kiểm tra các trường bắt buộc
    const requiredKeys = [
      "itineraryText",
      "seoTitle",
      "imageGenerationPrompt",
      "mapGenerationPrompt",
    ];
    for (const key of requiredKeys) {
      if (!parsedResponse[key] || typeof parsedResponse[key] !== "string") {
        console.error(
          `Incomplete/invalid JSON: Key "${key}" missing or not a string.`,
          parsedResponse
        );
        throw new Error(
          `AI response JSON is missing or has invalid type for key "${key}".`
        );
      }
    }

    // Kiểm tra số ngày
    const dayCount = (parsedResponse.itineraryText.match(/### Day \d+/g) || [])
      .length;
    console.log(
      `[geminiService] Requested days: ${duration}, Generated days: ${dayCount}`
    ); // DEBUG
    if (dayCount !== duration) {
      console.warn(
        `[geminiService] Mismatch: Gemini generated ${dayCount} days, but ${duration} were requested.`
      );
      // Cân nhắc thêm: Nếu số ngày sai, có thể trả về lỗi để người dùng biết và thử lại
      // throw new Error(`AI generated ${dayCount} days instead of the requested ${duration}. Please try again.`);
    }

    const generatedPlan: GeneratedPlan = {
      plan: {
        itineraryText: parsedResponse.itineraryText,
        sources: sources,
      },
      seoTitle: parsedResponse.seoTitle,
      imageGenerationPrompt: parsedResponse.imageGenerationPrompt,
      mapGenerationPrompt: parsedResponse.mapGenerationPrompt,
    };

    return generatedPlan;
  } catch (error: any) {
    console.error(
      "[geminiService] Error during API call or processing:",
      error
    );
    const errorPlan: ItineraryPlan = {
      itineraryText: `**Error:**\nAn unexpected error occurred while generating the itinerary for **${destination}**. \nPlease try again later. \n\n(Technical details: ${
        error.message || "Unknown API error"
      })`,
      sources: [],
    };
    return {
      plan: errorPlan,
      seoTitle: `Error Generating Trip`,
      imageGenerationPrompt: `Error`,
      mapGenerationPrompt: `Error`,
    };
  }
};
