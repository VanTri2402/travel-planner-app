/**
 * **V6.1 FIX:** Đã kiểm tra lại logic và URL
 */
const ICONIC_IMAGES: Record<string, string> = {
  default:
    "https://images.unsplash.com/photo-1504150558240-0b4fd8946624?w=1600&h=900&fit=crop",
  tokyo:
    "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1600&h=900&fit=crop",
  "ho chi minh":
    "https://images.unsplash.com/photo-1574328541334-9d5a76380c62?w=1600&h=900&fit=crop",
  saigon:
    "https://images.unsplash.com/photo-1574328541334-9d5a76380c62?w=1600&h=900&fit=crop",
  kyoto:
    "https://images.unsplash.com/photo-1524413840807-0c3cb6fa808d?w=1600&h=900&fit=crop",
  paris:
    "https://images.unsplash.com/photo-1502602898657-3e91760c0341?w=1600&h=900&fit=crop",
  hanoi:
    "https://images.unsplash.com/photo-1526065509230-e376811e74b6?w=1600&h=900&fit=crop",
};

// **V6.1 FIX:** Đã kiểm tra URL này - hoạt động tốt.
const MAP_IMAGE_URL =
  "https://images.unsplash.com/photo-1594398932025-913c375b47e3?w=800&h=800&fit=crop";

export const imageGenService = {
  simulateImageGeneration: (
    prompt: string,
    width: number = 1200,
    height: number = 800
  ): Promise<string> => {
    const delay = Math.random() * 1500 + 1000;
    const lowerPrompt = prompt.toLowerCase();
    let imageURL = ICONIC_IMAGES["default"]; // Mặc định là ảnh máy bay
    let isMap = false;

    // **V6.1 FIX:** Logic xác định map rõ ràng hơn
    if (lowerPrompt.includes("map") || lowerPrompt.includes("vector")) {
      imageURL = MAP_IMAGE_URL;
      isMap = true;
      console.log(
        `[ImageSimV6.1] Detected MAP prompt: "${prompt.substring(0, 30)}..."`
      );
    } else {
      // Tìm từ khóa kỳ quan (logic cũ giữ nguyên)
      for (const key in ICONIC_IMAGES) {
        if (lowerPrompt.includes(key)) {
          imageURL = ICONIC_IMAGES[key];
          break;
        }
      }
    }

    // Áp dụng kích thước vào URL
    if (isMap) {
      imageURL = imageURL.replace(/w=\d+&h=\d+/, `w=${width}&h=${height}`);
    } else {
      imageURL = imageURL.replace(/w=\d+&h=\d+/, `w=${width}&h=${height}`);
    }

    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`[ImageSimV6.1] Resolved: ${imageURL} (isMap: ${isMap})`);
        resolve(imageURL);
      }, delay);
    });
  },
};
