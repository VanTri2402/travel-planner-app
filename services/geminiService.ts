import { GoogleGenAI } from "@google/genai";
import { UserLocation, ItineraryPlan, GroundingSource } from "../types";

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateItinerary = async (
  destination: string,
  duration: number,
  interests: string,
  location: UserLocation
): Promise<ItineraryPlan> => {
  try {
    const prompt = `You are an expert travel planner, an "AI Journey Weaver." Create a detailed, creative, and emotionally resonant travel itinerary for a ${duration}-day trip to ${destination}. The traveler's style and interests are: "${interests}". 
    
Instead of a simple list, weave a narrative or thematic journey. Focus on the flow of experiences.
    
**Output Formatting Rules (CRITICAL):**
1.  Structure the output in Markdown format.
2.  Use a heading for each day (e.g., "### Day 1: Arrival and Exploration").
3.  For each specific activity, you **MUST** prefix it with one of the following tags followed by a colon: \`EAT:\`, \`VISIT:\`, \`DO:\`.
4.  Use these tags to categorize points of interest, restaurants, and activities.
5.  For general descriptions, transitional text, or thematic notes for the day, do **NOT** use a prefix. Just write the text on its own line.

**Example:**
### Day 1: Serene Beginnings
Start your morning with a peaceful walk through the historic district to soak in the atmosphere.
* VISIT: Arashiyama Bamboo Grove to see it shimmer in the morning light.
* EAT: Lunch at a traditional soba restaurant near the river.
* DO: Participate in a traditional tea ceremony in the Gion district.

Your response will be parsed automatically, so adhering to this format is essential. The user is currently located near latitude ${location.latitude} and longitude ${location.longitude}, use this for context if relevant for travel planning.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
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

    const itineraryText = response.text;
    const groundingChunks =
      response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

    const sources: GroundingSource[] = groundingChunks
      .filter((chunk) => chunk.maps && chunk.maps.uri && chunk.maps.title)
      .map((chunk) => ({
        uri: chunk.maps.uri,
        title: chunk.maps.title,
      }));

    if (!itineraryText) {
      throw new Error(
        "The AI returned an empty itinerary. Please try again with a different prompt."
      );
    }

    return { itineraryText, sources };
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
