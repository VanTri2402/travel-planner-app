import React from "react";

const WelcomeDisplay: React.FC = () => {
  return (
    // **V4.0 RE-SKIN:** bg-white, border-gray-200
    <div className="relative h-96 w-full rounded-2xl overflow-hidden border border-gray-200 shadow-md animate-fade-in-up">
      {/* **V4.0 RE-SKIN:** Gradient sáng, nhẹ nhàng. 
        Bạn có thể thay bằng ảnh thật.
      */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-gradient-to-r from-teal-50 to-cyan-50"
        // style={{ backgroundImage: "url('https://your-image-source.com/image.jpg')" }}
      >
        <div className="absolute inset-0 bg-white/10" />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center p-8">
        {/* **V4.0 RE-SKIN:** text-gray-900, text-gray-700 */}
        <h2 className="text-4xl font-bold text-gray-900 font-lexend mb-3">
          Your Journey Awaits
        </h2>
        <p className="text-xl text-gray-700">
          Fill out the details on the left to weave your next adventure.
        </p>
      </div>
    </div>
  );
};

export default WelcomeDisplay;
