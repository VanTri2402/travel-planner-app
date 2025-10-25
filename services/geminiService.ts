import { GoogleGenAI } from "@google/genai";
import {
  UserLocation,
  ItineraryPlan,
  GroundingSource,
  GeneratedPlan,
} from "../types";

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * **V4.0 UPDATE (CRITICAL):**
 * - Prompt đã được đại tu để yêu cầu Gemini trả về MỘT ĐỐI TƯỢNG JSON duy nhất.
 * - Yêu cầu này bao gồm các trường mới: seoTitle, imageGenerationPrompt, và mapGenerationPrompt.
 * - Hàm này không còn trả về 'ItineraryPlan' nữa mà trả về 'GeneratedPlan'.
 */
export const generateItinerary = async (
  destination: string,
  duration: number,
  interests: string,
  location: UserLocation
): Promise<GeneratedPlan> => {
  try {
    const prompt = `You are an expert travel planner, an "AI Journey Weaver." 
    Create a detailed, creative travel itinerary for a ${duration}-day trip to ${destination}. 
    Traveler's interests: "${interests}". 
    The user is near ${location.latitude}, ${location.longitude}.

    **CRITICAL: YOUR RESPONSE MUST BE A SINGLE, VALID JSON OBJECT.**
    Do NOT use markdown (like \`\`\`json\`).
    The JSON object must have these exact keys:
    
    1.  "itineraryText": A string containing the full itinerary in MARKDOWN format.
        - Use "### Day 1: [Title]" for each day.
        - Use "EAT:", "VISIT:", "DO:" prefixes for activities.
    
    2.  "seoTitle": A catchy, short title for this trip (e.g., "5-Day Foodie & Temple Tour of Kyoto").
    
    3.  "imageGenerationPrompt": A high-quality, English prompt for an AI image generator (like DALL-E) 
        to create a stunning hero banner.
        - Example: "A stunning, cinematic photo of Kyoto's Gion district at dusk, lanterns glowing, travel photography, 8K, hyper-realistic."
    
    4.  "mapGenerationPrompt": A high-quality, English prompt for an AI vector map generator.
        - Example: "A clean, minimalist vector map of Kyoto, Japan, highlighting Gion, Arashiyama, and Fushimi Inari shrine. No text labels, simple icons."
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
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
    });

    const groundingChunks =
      response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const sources: GroundingSource[] = groundingChunks
      .filter((chunk) => chunk.maps && chunk.maps.uri && chunk.maps.title)
      .map((chunk) => ({
        uri: chunk.maps.uri,
        title: chunk.maps.title,
      }));

    // **V4.0 UPDATE: Phân tích cú pháp JSON thay vì văn bản thô **
    let parsedResponse: any;
    try {
      // Cố gắng phân tích cú pháp toàn bộ phản hồi
      parsedResponse = JSON.parse(response.text);
    } catch (e) {
      console.error(
        "Failed to parse JSON response from Gemini. Falling back.",
        e
      );
      // Fallback: Nếu Gemini không trả về JSON, tạo dữ liệu mặc định
      return {
        plan: {
          itineraryText:
            response.text || "Error: Could not retrieve itinerary text.",
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
      throw new Error(
        "AI returned incomplete data. Missing required JSON keys."
      );
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
      throw new Error(`Failed to generate itinerary: ${error.message}`);
    }
    throw new Error(
      "An unknown error occurred while generating the itinerary."
    );
  }
};
