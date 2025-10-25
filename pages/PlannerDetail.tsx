import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { SavedItinerary } from "../types";
import { storageService } from "../services/storageService";
import ItineraryDisplay from "../components/ItineraryDisplay";
import { MapPinIcon } from "../components/icons";

const PlannerDetail: React.FC = () => {
  const [plan, setPlan] = useState<SavedItinerary | null>(null);
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    if (id) {
      setPlan(storageService.getItineraryById(id));
    }
  }, [id]);

  if (!plan) {
    return (
      <div className="container mx-auto max-w-4xl p-8 text-center animate-fade-in-up">
        <h1 className="text-3xl font-bold text-white font-lexend mb-4">
          Itinerary Not Found
        </h1>
        <p className="text-gray-400">
          We couldn't find the journey you're looking for.
        </p>
        <Link
          to="/history"
          className="inline-block mt-6 bg-teal-500 hover:bg-teal-600 text-white font-semibold py-2 px-5 rounded-lg transition-colors"
        >
          Back to History
        </Link>
      </div>
    );
  }

  return (
    <div className="animate-fade-in-up">
      {/* 1. Hero Banner Immersive */}
      <div className="relative w-full h-80 bg-gradient-to-r from-emerald-900 to-sky-900">
        {/* Placeholder cho ảnh điểm đến */}
        {/* <img src="..." alt={plan.destination} className="w-full h-full object-cover" /> */}
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 container mx-auto max-w-7xl p-8 h-full flex flex-col justify-end">
          <h1 className="text-5xl font-bold text-white font-lexend drop-shadow-lg">
            {plan.destination}
          </h1>
          <p className="text-xl text-gray-200 mt-2 drop-shadow-md">
            A {plan.duration}-day journey focused on: {plan.interests}
          </p>
        </div>
      </div>

      {/* 2. Nội dung chi tiết */}
      <div className="container mx-auto max-w-7xl p-4 sm:p-6 lg:p-8 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cột chính: Lịch trình */}
          <div className="lg:col-span-2">
            <ItineraryDisplay plan={plan.plan} />
          </div>

          {/* Cột phụ: Placeholder cho Bản đồ / Ghi chú */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-gray-900 border border-gray-700/50 rounded-2xl shadow-xl p-6">
              <h3 className="text-2xl font-bold text-white font-lexend mb-4 flex items-center gap-2">
                <MapPinIcon className="w-6 h-6 text-teal-400" />
                Trip Details
              </h3>
              <div className="h-64 bg-gray-800 rounded-lg flex items-center justify-center text-gray-500">
                Map Placeholder
              </div>
              <div className="mt-4">
                <h4 className="text-lg font-semibold text-gray-200">
                  My Notes
                </h4>
                <textarea
                  className="w-full h-32 mt-2 bg-gray-800 border border-gray-700 rounded-lg p-3 text-gray-100 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition"
                  placeholder="Add your personal notes here..."
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlannerDetail;
