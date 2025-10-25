export interface UserLocation {
  latitude: number;
  longitude: number;
}

export interface GroundingSource {
  uri: string;
  title: string;
}

export interface ItineraryPlan {
  itineraryText: string;
  sources: GroundingSource[];
}

// MỚI: Định nghĩa cấu trúc lưu trữ trong localStorage
export interface SavedItinerary {
  id: string; // crypto.randomUUID()
  destination: string;
  duration: number;
  interests: string;
  plan: ItineraryPlan; // Kết quả từ Gemini
  createdAt: string; // ISO Date string
}