import React from "react";

const WelcomeDisplay: React.FC = () => {
  return (
    <div className="relative h-96 w-full rounded-2xl overflow-hidden border border-gray-700/50 animate-fade-in-up">
      {/* Đề xuất Hình ảnh: 
        Sử dụng một ảnh chất lượng cao, truyền cảm hứng về du lịch tại đây. 
        Ví dụ: một cảnh quan núi non, một con đường mòn, hoặc một thành phố đẹp.
        Tôi sẽ dùng nền gradient để mô phỏng.
      */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-gradient-to-r from-emerald-900 to-sky-900"
        // style={{ backgroundImage: "url('https://your-image-source.com/image.jpg')" }}
      >
        <div className="absolute inset-0 bg-black/40" />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center p-8">
        <h2 className="text-4xl font-bold text-white font-lexend mb-3">
          Your Journey Awaits
        </h2>
        <p className="text-xl text-gray-200">
          Fill out the details on the left to weave your next adventure.
        </p>
      </div>
    </div>
  );
};

export default WelcomeDisplay;
