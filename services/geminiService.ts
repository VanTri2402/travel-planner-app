import { GoogleGenAI } from "@google/genai";
import {
  UserLocation,
  ItineraryPlan, // Giữ lại vì GeneratedPlan dùng nó
  GroundingSource,
  GeneratedPlan,
} from "../types";

// **V6.1 FIX:** Kiểm tra API Key (giữ nguyên)
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
    // **V6.1 FIX:** Thêm ràng buộc số ngày vào prompt
    const prompt = `You are an expert travel planner, an "AI Journey Weaver." 
    Create a detailed, creative travel itinerary for a ${duration}-day trip to ${destination}. 
    Traveler's interests: "${interests}". 
    The user is near ${location.latitude}, ${location.longitude}.

    **CRITICAL: YOUR RESPONSE MUST BE A SINGLE, VALID JSON OBJECT.**
    Do NOT use markdown (like \`\`\`json\`).
    The JSON object must have these exact keys:
    
    1.  "itineraryText": A string containing the full itinerary in MARKDOWN format.
        - Use "### Day N: [Title]" for each day's heading.
        - Use "EAT:", "VISIT:", "DO:" prefixes for specific activities.
        - **Constraint:** Generate *exactly* ${duration} day sections in the itineraryText, starting from "### Day 1" up to "### Day ${duration}". Do NOT generate more or fewer days than requested (${duration} days).
    
    2.  "seoTitle": A catchy, short title for this specific ${duration}-day trip to ${destination}.
    
    3.  "imageGenerationPrompt": A high-quality, English prompt for an AI image generator (like DALL-E) to create a stunning hero banner image representing ${destination}.
        - Example: "A stunning, cinematic photo of Kyoto's Gion district at dusk, lanterns glowing, travel photography, 8K, hyper-realistic."
    
    4.  "mapGenerationPrompt": A high-quality, English prompt for an AI to generate a minimalist vector map highlighting key areas for this trip in ${destination}.
        - Example: "A clean, minimalist vector map of Kyoto, Japan, highlighting Gion, Arashiyama, and Fushimi Inari shrine. No text labels, simple icons, focus on travel routes."
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash", // Hoặc model bạn đang dùng
      contents: prompt,
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
      // **QUAN TRỌNG:** Yêu cầu Gemini trả về JSON
      responseMimeType: "application/json",
    });

    const groundingChunks =
      response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const sources: GroundingSource[] = groundingChunks
      .filter((chunk) => chunk.maps && chunk.maps.uri && chunk.maps.title)
      .map((chunk) => ({
        uri: chunk.maps.uri,
        title: chunk.maps.title,
      }));

    // Phân tích JSON (logic từ v6.0)
    let parsedResponse: any;
    try {
      // response.text giờ đây là đối tượng JSON đã được parse sẵn nếu responseMimeType hoạt động
      parsedResponse = response.candidates[0].content.parts[0].text
        ? JSON.parse(response.candidates[0].content.parts[0].text)
        : null;
      if (!parsedResponse) {
        throw new Error("Gemini response text is empty or null.");
      }
    } catch (e) {
      console.error(
        "Failed to parse JSON response from Gemini. Falling back.",
        e,
        "Raw response:",
        response.text
      );
      // Fallback giữ nguyên
      return {
        plan: {
          itineraryText: `Error: Could not generate itinerary for ${destination}. Gemini response format issue. Raw: ${response.text}`,
          sources: sources,
        },
        seoTitle: `Your Trip to ${destination}`,
        imageGenerationPrompt: `A beautiful cinematic photo of ${destination}`,
        mapGenerationPrompt: `A minimalist vector map of ${destination}`,
      };
    }

    if (
      !parsedResponse.itineraryText ||
      !parsedResponse.seoTitle ||
      !parsedResponse.imageGenerationPrompt ||
      !parsedResponse.mapGenerationPrompt
    ) {
      console.error("Incomplete JSON response:", parsedResponse);
      throw new Error(
        "AI returned incomplete data. Missing required JSON keys."
      );
    }

    // **V6.1 FIX:** Kiểm tra lại số ngày trả về (optional, để log)
    const dayCount = (parsedResponse.itineraryText.match(/### Day \d+/g) || [])
      .length;
    if (dayCount !== duration) {
      console.warn(
        `Gemini generated ${dayCount} days, but ${duration} were requested.`
      );
      // Bạn có thể chọn cách xử lý ở đây: cắt bớt text hoặc báo lỗi
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
  } catch (error) {
    console.error("Error generating itinerary:", error);
    if (error instanceof Error) {
      // Bao gồm cả thông báo lỗi gốc
      throw new Error(`Failed to generate itinerary: ${error.message}`);
    }
    throw new Error(
      "An unknown error occurred while generating the itinerary."
    );
  }
};
