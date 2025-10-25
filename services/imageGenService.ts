/**
 * **V6.2 FINAL FIX:**
 * - Sử dụng uniqueSeedInput (ưu tiên planId) để tạo seed DUY NHẤT cho ảnh fallback.
 */

// Hàm hash giữ nguyên
const simpleHash = (str: string): number => {
  let hash = 0;
  if (!str || str.length === 0) return 12345; // Seed mặc định nếu chuỗi rỗng
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  return Math.abs(hash); // Trả về số dương
};

// Danh sách ICONIC_IMAGES giữ nguyên (bạn có thể mở rộng thêm)
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
    "https://images.unsplash.com/photo-1543974407-9b4f6ce7dy94?w=1600&h=900&fit=crop",
  mumbai:
    "https://images.unsplash.com/photo-1567157577821-f0da1ee3785e?w=1600&h=900&fit=crop",
  dubai:
    "https://images.unsplash.com/photo-1518684079-3c830dcef090?w=1600&h=900&fit=crop",
  "hong kong":
    "https://images.unsplash.com/photo-1516081031341-197e42d79c13?w=1600&h=900&fit=crop",
  taipei:
    "https://images.unsplash.com/photo-1518623380753-8561 M9A83?w=1600&h=900&fit=crop",
  "kuala lumpur":
    "https://images.unsplash.com/photo-1587780003290-db1c5f355529?w=1600&h=900&fit=crop",
  // Châu Âu
  paris:
    "https://images.unsplash.com/photo-1502602898657-3e91760c0341?w=1600&h=900&fit=crop",
  rome: "https://images.unsplash.com/photo-1519558194017-e174ffb61b13?w=1600&h=900&fit=crop",
  london:
    "https://images.unsplash.com/photo-1505761671935-60b3a7427bad?w=1600&h=900&fit=crop",
  barcelona:
    "https://images.unsplash.com/photo-1511527661048-7fe73d85e9a4?w=1600&h=900&fit=crop",
  amsterdam:
    "https://images.unsplash.com/photo-1512470876302-972faa2aa9a4?w=1600&h=900&fit=crop",
  prague:
    "https://images.unsplash.com/photo-1519677100294-432f86146671?w=1600&h=900&fit=crop",
  berlin:
    "https://images.unsplash.com/photo-1528728329032-ef09015159b7?w=1600&h=900&fit=crop",
  vienna:
    "https://images.unsplash.com/photo-1582760711904-89389e78e24a?w=1600&h=900&fit=crop",
  lisbon:
    "https://images.unsplash.com/photo-1509218762116-8c46059d479c?w=1600&h=900&fit=crop",
  athens:
    "https://images.unsplash.com/photo-1586170138402-81d09f759f96?w=1600&h=900&fit=crop",
  moscow:
    "https://images.unsplash.com/photo-1520106212299-d99c443e4568?w=1600&h=900&fit=crop",
  // Châu Mỹ
  "new york":
    "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=1600&h=900&fit=crop",
  "los angeles":
    "https://images.unsplash.com/photo-1522898467493-49726bf28193?w=1600&h=900&fit=crop",
  "rio de janeiro":
    "https://images.unsplash.com/photo-1483729558449-fb8ef46eedaa?w=1600&h=900&fit=crop",
  "mexico city":
    "https://images.unsplash.com/photo-1574041539276-464e8b31a57c?w=1600&h=900&fit=crop",
  toronto:
    "https://images.unsplash.com/photo-1503206591834-3d6c7014aef0?w=1600&h=900&fit=crop",
  "san francisco":
    "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=1600&h=900&fit=crop",
  "buenos aires":
    "https://images.unsplash.com/photo-1580402263162-d401f400a4d0?w=1600&h=900&fit=crop",
  havana:
    "https://images.unsplash.com/photo-1518638150340-f706e86a5191?w=1600&h=900&fit=crop",
  cusco:
    "https://images.unsplash.com/photo-1526392060635-9d6019884377?w=1600&h=900&fit=crop",
  // Châu Phi & Úc
  cairo:
    "https://images.unsplash.com/photo-1552841847-0e031d2d8548?w=1600&h=900&fit=crop",
  "cape town":
    "https://images.unsplash.com/photo-1549026466-4c1271a364f7?w=1600&h=900&fit=crop",
  sydney:
    "https://images.unsplash.com/photo-1523059623039-a9ed027e7fad?w=1600&h=900&fit=crop",
  marrakech:
    "https://images.unsplash.com/photo-1579471120159-1e3a964f433b?w=1600&h=900&fit=crop",
  melbourne:
    "https://images.unsplash.com/photo-1514395462725-fb4566210144?w=1600&h=900&fit=crop",
  zanzibar:
    "https://images.unsplash.com/photo-1580218765416-2487216ef308?w=1600&h=900&fit=crop",
  auckland:
    "https://images.unsplash.com/photo-1507699622108- MjA3c_w8_w?w=1600&h=900&fit=crop",
};

const MAP_IMAGE_URL =
  "https://images.unsplash.com/photo-1594398932025-913c375b47e3?w=800&h=800&fit=crop";

export const imageGenService = {
  simulateImageGeneration: (
    prompt: string,
    width: number = 1200,
    height: number = 800,
    // **V6.2:** uniqueSeedInput giờ đây RẤT QUAN TRỌNG cho fallback
    uniqueSeedInput: string | number = prompt // Mặc định vẫn là prompt nếu id chưa có
  ): Promise<string> => {
    const delay = Math.random() * 800 + 400;
    const lowerPrompt = prompt.toLowerCase();
    let imageURL = "";
    let isMap = false;

    if (lowerPrompt.includes("map") || lowerPrompt.includes("vector")) {
      imageURL = MAP_IMAGE_URL;
      isMap = true;
      console.log(
        `[ImageSimV6.2 FINAL] Detected MAP prompt: "${prompt.substring(
          0,
          50
        )}..."`
      );
    } else {
      let foundIconic = false;
      const sortedKeys = Object.keys(ICONIC_IMAGES).sort(
        (a, b) => b.length - a.length
      );
      for (const key of sortedKeys) {
        // Không kiểm tra key 'default' ở đây
        if (lowerPrompt.includes(key)) {
          imageURL = ICONIC_IMAGES[key];
          foundIconic = true;
          console.log(`[ImageSimV6.2 FINAL] Found iconic key: "${key}"`);
          break;
        }
      }
      // **V6.2 FIX:** Dùng uniqueSeedInput (planId) cho fallback DUY NHẤT
      if (!foundIconic) {
        // Sử dụng simpleHash để đảm bảo seed là số, kể cả khi input là UUID
        const fallbackSeed = simpleHash(String(uniqueSeedInput));
        // Sử dụng picsum.photos cho fallback với seed duy nhất
        imageURL = `https://picsum.photos/seed/${fallbackSeed}/${width}/${height}`;
        console.log(
          `[ImageSimV6.2 FINAL] No iconic key. Using fallback picsum with UNIQUE seed: ${fallbackSeed} from input: ${uniqueSeedInput}`
        );
      }
    }

    // Áp dụng kích thước (giữ nguyên)
    if (imageURL.includes("picsum.photos")) {
      // Picsum dùng path
    } else if (imageURL.includes("images.unsplash.com")) {
      imageURL = imageURL
        .replace(/w=\d+/, `w=${width}`)
        .replace(/h=\d+/, `h=${height}`);
    }

    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(
          `[ImageSimV6.2 FINAL] Resolved URL: ${imageURL} (isMap: ${isMap})`
        );
        resolve(imageURL);
      }, delay);
    });
  },
};
