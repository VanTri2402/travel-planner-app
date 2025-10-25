import { ItineraryPlan, SavedItinerary } from "../types";

const STORAGE_KEY = "aiJourneyWeaverHistory";

export const storageService = {
  getSavedItineraries: (): SavedItinerary[] => {
    try {
      const rawData = localStorage.getItem(STORAGE_KEY);
      if (!rawData) return [];
      const plans: SavedItinerary[] = JSON.parse(rawData);
      // Sắp xếp, mới nhất lên đầu
      return plans.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } catch (error) {
      console.error("Failed to parse itineraries from localStorage", error);
      return [];
    }
  },

  getItineraryById: (id: string): SavedItinerary | null => {
    const plans = storageService.getSavedItineraries();
    return plans.find((plan) => plan.id === id) || null;
  },

  saveItinerary: (
    destination: string,
    duration: number,
    interests: string,
    plan: ItineraryPlan
  ): SavedItinerary => {
    const plans = storageService.getSavedItineraries();

    const newSavedItinerary: SavedItinerary = {
      id: crypto.randomUUID(),
      destination,
      duration,
      interests,
      plan,
      createdAt: new Date().toISOString(),
    };

    const updatedPlans = [newSavedItinerary, ...plans];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPlans));

    return newSavedItinerary;
  },
};
