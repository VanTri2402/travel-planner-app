export interface UserLocation {
  latitude: number;
  longitude: number;
}

export interface GroundingSource {
  uri: string;
  title: string;
}

/**
 * Lõi của lịch trình do Gemini tạo ra.
 * Chỉ chứa văn bản và nguồn.
 */
export interface ItineraryPlan {
  itineraryText: string;
  sources: GroundingSource[];
}

/**
 * **V4.0 UPDATE:**
 * Đối tượng đầy đủ do geminiService trả về.
 * Bao gồm các prompt được tạo ra.
 */
export interface GeneratedPlan {
  plan: ItineraryPlan;
  seoTitle: string;
  imageGenerationPrompt: string;
  mapGenerationPrompt: string;
}

/**
 * **V4.0 UPDATE:**
 * Cấu trúc đầy đủ được lưu trong localStorage.
 * Đã thêm các trường mới.
 */
export interface SavedItinerary {
  id: string; // crypto.randomUUID()
  destination: string;
  duration: number;
  interests: string;
  createdAt: string; // ISO Date string

  generatedPlan: GeneratedPlan; // Lồng đối tượng kế hoạch đã tạo

  notes: string; // Đã kích hoạt
  heroImageURL: string | null;
  mapImageURL: string | null; // Để dùng trong tương lai
}
