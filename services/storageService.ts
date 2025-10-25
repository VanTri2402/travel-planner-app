import { SavedItinerary, GeneratedPlan } from "../types";

const STORAGE_KEY = "aiJourneyWeaverHistory_v4"; // Vẫn dùng key v4

export const storageService = {
  getSavedItineraries: (): SavedItinerary[] => {
    try {
      const rawData = localStorage.getItem(STORAGE_KEY);
      if (!rawData) return [];
      const plans: SavedItinerary[] = JSON.parse(rawData);
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

  /**
   * **V5.0 UPDATE:**
   * - Khởi tạo 'mapImageURL' là null.
   */
  saveItinerary: (
    destination: string,
    duration: number,
    interests: string,
    generatedPlan: GeneratedPlan
  ): SavedItinerary => {
    const plans = storageService.getSavedItineraries();

    const newSavedItinerary: SavedItinerary = {
      id: crypto.randomUUID(),
      destination,
      duration,
      interests,
      generatedPlan,
      createdAt: new Date().toISOString(),
      notes: "",
      heroImageURL: null,
      mapImageURL: null, // Khởi tạo là null
    };

    const updatedPlans = [newSavedItinerary, ...plans];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPlans));

    return newSavedItinerary;
  },

  updateNotes: (id: string, notes: string): void => {
    // ... (logic không đổi)
    const plans = storageService.getSavedItineraries();
    const planIndex = plans.findIndex((plan) => plan.id === id);

    if (planIndex !== -1) {
      plans[planIndex].notes = notes;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(plans));
    }
  },

  /**
   * **V5.0 MỚI:**
   * - Hàm mới để cập nhật URL ảnh sau khi tạo xong.
   */
  updateGeneratedImageURLs: (
    id: string,
    heroURL: string,
    mapURL: string
  ): void => {
    const plans = storageService.getSavedItineraries();
    const planIndex = plans.findIndex((plan) => plan.id === id);

    if (planIndex !== -1) {
      plans[planIndex].heroImageURL = heroURL;
      plans[planIndex].mapImageURL = mapURL;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(plans));
    } else {
      console.error("Could not find plan to update image URLs");
    }
  },
};
