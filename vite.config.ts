import path from "path";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  // Tải các biến env từ file .env hoặc .env.local
  const env = loadEnv(mode, process.cwd(), "");

  return {
    server: {
      port: 3000,
      host: "0.0.0.0",
    },
    plugins: [react()],
    define: {
      "process.env.API_KEY": JSON.stringify(env.GEMINI_API_KEY),
      "process.env.GEMINI_API_KEY": JSON.stringify(env.GEMINI_API_KEY),

      // --- SỬA Ở ĐÂY ---
      // Thêm các dòng này để expose biến Kinde cho client
      "process.env.VITE_KINDE_DOMAIN": JSON.stringify(env.VITE_KINDE_DOMAIN),
      "process.env.VITE_KINDE_CLIENT_ID": JSON.stringify(
        env.VITE_KINDE_CLIENT_ID
      ),
      // --- KẾT THÚC SỬA ---
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "."),
      },
    },
  };
});
