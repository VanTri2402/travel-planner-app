import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";

import { imageGenService } from "../services/imageGenService";
import ItineraryDisplay from "../components/ItineraryDisplay";
import LoadingSpinner from "../components/LoadingSpinner";
import ConfirmationModal from "../components/ConfirmationModal"; // **V6.0 MỚI**
import { MapPinIcon, TrashIcon } from "../components/icons";
import { useStorage } from "@/hooks/storageService";

const PlannerDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // **V6.0 MỚI:** Dùng hook useStorage
  const {
    getItineraryById,
    updateNotes,
    updateGeneratedImageURLs,
    deleteItinerary,
    isLoading: isStorageLoading,
  } = useStorage();

  const [plan, setPlan] = useState<any | null>(null); // Dùng 'any' vì state nội bộ
  const [isGeneratingImages, setIsGeneratingImages] = useState(false);
  const [notes, setNotes] = useState<string>("");
  const [modalOpen, setModalOpen] = useState(false); // **V6.0 MỚI**

  useEffect(() => {
    if (!id || isStorageLoading) return;

    const loadedPlan = getItineraryById(id);
    if (!loadedPlan) {
      // Nếu không tìm thấy plan (ví dụ: đã bị xóa hoặc sai ID)
      navigate("/404"); // Chuyển hướng đến trang 404
      return;
    }

    setPlan(loadedPlan);
    setNotes(loadedPlan.notes);

    if (!loadedPlan.heroImageURL && !loadedPlan.mapImageURL) {
      setIsGeneratingImages(true);
      Promise.all([
        imageGenService.simulateImageGeneration(
          loadedPlan.generatedPlan.imageGenerationPrompt,
          1600,
          900
        ),
        imageGenService.simulateImageGeneration(
          loadedPlan.generatedPlan.mapGenerationPrompt,
          800,
          800
        ),
      ]).then(([heroURL, mapURL]) => {
        updateGeneratedImageURLs(id, heroURL, mapURL); // Lưu vào storage
        setPlan((prev) => ({
          ...prev,
          heroImageURL: heroURL,
          mapImageURL: mapURL,
        })); // Cập nhật state
        setIsGeneratingImages(false);
      });
    }
  }, [
    id,
    isStorageLoading,
    getItineraryById,
    updateGeneratedImageURLs,
    navigate,
  ]);

  const handleNotesBlur = () => {
    if (plan) {
      updateNotes(plan.id, notes); // Dùng hàm từ hook
    }
  };

  // **V6.0 MỚI:** Xử lý Xóa
  const handleConfirmDelete = () => {
    if (plan) {
      deleteItinerary(plan.id);
      setModalOpen(false);
      navigate("/history"); // Chuyển hướng về trang lịch sử
    }
  };

  // ... (Hàm renderHeroContent và renderMapContent không đổi từ v5.0) ...
  const renderHeroContent = () => {
    /* ... giữ nguyên v5.0 ... */
  };
  const renderMapContent = () => {
    /* ... giữ nguyên v5.0 ... */
  };

  if (isStorageLoading || !plan) {
    return (
      <div className="container p-8 text-center">
        <LoadingSpinner text="Loading journey details..." />
      </div>
    );
  }

  return (
    <>
      <ConfirmationModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete This Journey"
        message="Are you sure you want to permanently delete this itinerary? This action cannot be undone."
      />
      <div className="animate-fade-in-up">
        {/* 1. Hero Banner */}
        <div className="relative w-full h-80 lg:h-96 bg-gray-200 border-b border-gray-200">
          {/* ... (Nội dung Hero) ... */}
        </div>

        {/* 2. Nội dung chi tiết */}
        <div className="container mx-auto max-w-7xl p-4 sm:p-6 lg:p-8 mt-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <ItineraryDisplay plan={plan.generatedPlan.plan} />
            </div>

            <div className="lg:col-span-1">
              <div className="sticky top-24 bg-white border border-gray-200 rounded-2xl shadow-xl p-6 transition-all duration-300 hover:shadow-2xl">
                <h3 className="text-2xl font-bold text-gray-900 font-lexend mb-4 flex items-center gap-2">
                  <MapPinIcon className="w-6 h-6 text-teal-500" />
                  Trip Assets
                </h3>

                {/* Map Động */}
                {renderMapContent()}

                {/* My Notes */}
                <div className="mt-6">
                  <h4 className="text-lg font-semibold text-gray-900 font-lexend">
                    My Notes
                  </h4>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    onBlur={handleNotesBlur}
                    className="w-full h-32 mt-2 bg-white border border-gray-300 rounded-lg p-3 text-gray-900 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition"
                    placeholder="Add your personal notes here..."
                  />
                </div>

                {/* **V6.0 MỚI:** Nút Xóa */}
                <div className="mt-6 border-t border-gray-200 pt-6">
                  <button
                    onClick={() => setModalOpen(true)}
                    className="w-full flex items-center justify-center gap-2 bg-red-100 hover:bg-red-200 text-red-700 font-semibold py-3 px-6 rounded-lg transition-all duration-300"
                  >
                    <TrashIcon className="w-5 h-5" />
                    Delete This Journey
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PlannerDetail;
