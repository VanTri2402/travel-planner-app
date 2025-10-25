/**
 * **V6.2 FIX:**
 * - Mở rộng danh sách ảnh kỳ quan.
 * - Sửa lỗi seed ngẫu nhiên cho ảnh fallback để đảm bảo tính duy nhất dựa trên prompt.
 * - Xác minh lại logic map.
 */

// Hàm tạo seed đơn giản từ chuỗi (để dùng cho fallback)
const simpleHash = (str: string): number => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  return Math.abs(hash); // Trả về số dương
};

const ICONIC_IMAGES: Record<string, string> = {
  // Châu Á
  tokyo:
    "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1600&h=900&fit=crop",
  "ho chi minh":
    "https://images.unsplash.com/photo-1574328541334-9d5a76380c62?w=1600&h=900&fit=crop",
  saigon:
    "https://images.unsplash.com/photo-1574328541334-9d5a76380c62?w=1600&h=900&fit=crop",
  kyoto:
    "https://images.unsplash.com/photo-1524413840807-0c3cb6fa808d?w=1600&h=900&fit=crop",
  hanoi:
    "https://images.unsplash.com/photo-1526065509230-e376811e74b6?w=1600&h=900&fit=crop",
  seoul:
    "https://images.unsplash.com/photo-1547893183-80 FAA6f1a84?w=1600&h=900&fit=crop",
  bangkok:
    "https://images.unsplash.com/photo-1528181304800-259b08848526?w=1600&h=900&fit=crop",
  singapore:
    "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=1600&h=900&fit=crop",
  bali: "https://images.unsplash.com/photo-1547291197-e4d38c9c6465?w=1600&h=900&fit=crop",
  beijing:
    "https://images.unsplash.com/photo-1543974407-9b4f6ce7dy94?w=1600&h=900&fit=crop", // Great Wall
  mumbai:
    "https://images.unsplash.com/photo-1567157577821-f0da1ee3785e?w=1600&h=900&fit=crop", // Gateway of India

  // Châu Âu
  paris:
    "https://images.unsplash.com/photo-1502602898657-3e91760c0341?w=1600&h=900&fit=crop",
  rome: "https://images.unsplash.com/photo-1519558194017-e174ffb61b13?w=1600&h=900&fit=crop",
  london:
    "https://images.unsplash.com/photo-1505761671935-60b3a7427bad?w=1600&h=900&fit=crop",
  barcelona:
    "https://images.unsplash.com/photo-1511527661048-7fe73d85e9a4?w=1600&h=900&fit=crop", // Sagrada Familia
  amsterdam:
    "https://images.unsplash.com/photo-1512470876302-972faa2aa9a4?w=1600&h=900&fit=crop", // Canals
  prague:
    "https://images.unsplash.com/photo-1519677100294-432f86146671?w=1600&h=900&fit=crop", // Charles Bridge
  berlin:
    "https://images.unsplash.com/photo-1528728329032-ef09015159b7?w=1600&h=900&fit=crop", // Brandenburg Gate

  // Châu Mỹ
  "new york":
    "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=1600&h=900&fit=crop", // Times Square
  "los angeles":
    "https://images.unsplash.com/photo-1522898467493-49726bf28193?w=1600&h=900&fit=crop", // Hollywood Sign
  "rio de janeiro":
    "https://images.unsplash.com/photo-1483729558449-fb8ef46eedaa?w=1600&h=900&fit=crop", // Christ the Redeemer
  "mexico city":
    "https://images.unsplash.com/photo-1574041539276-464e8b31a57c?w=1600&h=900&fit=crop", // Palacio de Bellas Artes
  toronto:
    "https://images.unsplash.com/photo-1503206591834-3d6c7014aef0?w=1600&h=900&fit=crop", // CN Tower

  // Châu Phi & Úc
  cairo:
    "https://images.unsplash.com/photo-1552841847-0e031d2d8548?w=1600&h=900&fit=crop", // Pyramids
  "cape town":
    "https://images.unsplash.com/photo-1549026466-4c1271a364f7?w=1600&h=900&fit=crop", // Table Mountain
  sydney:
    "https://images.unsplash.com/photo-1523059623039-a9ed027e7fad?w=1600&h=900&fit=crop", // Opera House
};

const MAP_IMAGE_URL =
  "https://images.unsplash.com/photo-1594398932025-913c375b47e3?w=800&h=800&fit=crop";

export const imageGenService = {
  simulateImageGeneration: (
    prompt: string,
    width: number = 1200,
    height: number = 800
  ): Promise<string> => {
    const delay = Math.random() * 1000 + 500; // Giảm delay để test nhanh hơn
    const lowerPrompt = prompt.toLowerCase();
    let imageURL = ""; // Khởi tạo rỗng
    let isMap = false;

    // Ưu tiên kiểm tra map trước
    if (lowerPrompt.includes("map") || lowerPrompt.includes("vector")) {
      imageURL = MAP_IMAGE_URL;
      isMap = true;
      console.log(
        `[ImageSimV6.2] Detected MAP prompt: "${prompt.substring(0, 50)}..."`
      );
    } else {
      // Tìm từ khóa kỳ quan
      let foundIconic = false;
      for (const key in ICONIC_IMAGES) {
        // Bỏ qua key 'default' khi tìm kiếm
        if (key !== "default" && lowerPrompt.includes(key)) {
          imageURL = ICONIC_IMAGES[key];
          foundIconic = true;
          console.log(`[ImageSimV6.2] Found iconic key: "${key}"`);
          break;
        }
      }
      // Nếu không tìm thấy ảnh kỳ quan, dùng fallback với seed từ prompt
      if (!foundIconic) {
        const fallbackSeed = simpleHash(prompt); // Tạo seed từ prompt
        imageURL = ICONIC_IMAGES["default"](fallbackSeed); // Gọi hàm default với seed
        console.log(
          `[ImageSimV6.2] No iconic key found. Using fallback with seed: ${fallbackSeed}`
        );
      }
    }

    // Áp dụng kích thước vào URL (xử lý cả picsum và unsplash)
    if (imageURL.includes("picsum.photos")) {
      imageURL = imageURL.replace(/\/1600\/900$/, `/${width}/${height}`); // Thay thế kích thước cuối URL
    } else if (imageURL.includes("images.unsplash.com")) {
      imageURL = imageURL.replace(/w=\d+&h=\d+/, `w=${width}&h=${height}`);
    } else {
      // Xử lý các nguồn ảnh khác nếu có
    }

    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(
          `[ImageSimV6.2] Resolved URL: ${imageURL} (isMap: ${isMap})`
        );
        resolve(imageURL);
      }, delay);
    });
  },
};
