/**
 * **V6.0 UPDATE:**
 * - Thay thế 'picsum.photos' bằng các ảnh kỳ quan được hardcode.
 * - Các URL này từ Unsplash, đảm bảo chất lượng cao.
 */
const ICONIC_IMAGES: Record<string, string> = {
  // Ảnh mặc định
  default:
    "https://images.unsplash.com/photo-1504150558240-0b4fd8946624?w=1600&h=900&fit=crop", // Máy bay

  // Từ khóa
  tokyo:
    "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1600&h=900&fit=crop", // Tháp Tokyo
  "ho chi minh":
    "https://images.unsplash.com/photo-1574328541334-9d5a76380c62?w=1600&h=900&fit=crop", // Landmark 81
  saigon:
    "https://images.unsplash.com/photo-1574328541334-9d5a76380c62?w=1600&h=900&fit=crop", // (Như trên)
  kyoto:
    "https://images.unsplash.com/photo-1524413840807-0c3cb6fa808d?w=1600&h=900&fit=crop", // Chùa Vàng Kinkaku-ji
  paris:
    "https://images.unsplash.com/photo-1502602898657-3e91760c0341?w=1600&h=900&fit=crop", // Tháp Eiffel
  hanoi:
    "https://images.unsplash.com/photo-1526065509230-e376811e74b6?w=1600&h=900&fit=crop", // Hồ Gươm
};

const MAP_IMAGES: Record<string, string> = {
  // Ảnh bản đồ vector tối giản
  default:
    "https://images.unsplash.com/photo-1594398932025-913c375b47e3?w=800&h=800&fit=crop",
  map: "https://images.unsplash.com/photo-1594398932025-913c375b47e3?w=800&h=800&fit=crop",
};

export const imageGenService = {
  simulateImageGeneration: (
    prompt: string,
    width: number = 1200,
    height: number = 800
  ): Promise<string> => {
    const delay = Math.random() * 1500 + 1000; // Giảm thời gian chờ
    const lowerPrompt = prompt.toLowerCase();

    // Xác định URL
    let imageURL = ICONIC_IMAGES["default"];

    // Nếu prompt là cho BẢN ĐỒ
    if (lowerPrompt.includes("map")) {
      imageURL = MAP_IMAGES["default"]; // Dùng ảnh bản đồ
    } else {
      // Tìm từ khóa kỳ quan
      for (const key in ICONIC_IMAGES) {
        if (lowerPrompt.includes(key)) {
          imageURL = ICONIC_IMAGES[key];
          break;
        }
      }
    }

    // Thêm kích thước vào URL (nếu là Unsplash)
    imageURL = imageURL.replace("w=1600&h=900", `w=${width}&h=${height}`);
    imageURL = imageURL.replace("w=800&h=800", `w=${width}&h=${height}`);

    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(
          `[ImageSimV6] Resolved: ${imageURL} for prompt: "${prompt.substring(
            0,
            30
          )}..."`
        );
        resolve(imageURL);
      }, delay);
    });
  },
};
