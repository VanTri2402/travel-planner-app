import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
// **FIX:** Bỏ import SavedItinerary không cần thiết ở đây
// import { SavedItinerary } from '../types';
import { useStorage } from "../hooks/storageService"; // Đã sửa đường dẫn import
import { imageGenService } from "../services/imageGenService";
import ItineraryDisplay from "../components/ItineraryDisplay";
import LoadingSpinner from "../components/LoadingSpinner";
import ConfirmationModal from "../components/ConfirmationModal";
import { MapPinIcon, TrashIcon, SparklesIcon } from "../components/icons"; // **FIX:** Thêm SparklesIcon

const PlannerDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const {
    getItineraryById,
    updateNotes,
    updateGeneratedImageURLs,
    deleteItinerary,
    isLoading: isStorageLoading, // Lấy trạng thái loading từ hook
  } = useStorage();

  const [plan, setPlan] = useState<any | null>(null);
  const [isGeneratingImages, setIsGeneratingImages] = useState(false);
  const [notes, setNotes] = useState<string>("");
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    // Chỉ chạy logic khi ID tồn tại VÀ storage không còn loading
    if (id && !isStorageLoading) {
      const loadedPlan = getItineraryById(id);

      if (!loadedPlan) {
        console.warn(`Plan with ID ${id} not found after storage loaded.`); // Log để debug
        return; // Dừng useEffect ở đây
      }

      // Nếu tìm thấy plan
      setPlan(loadedPlan);
      setNotes(loadedPlan.notes);

      // Kích hoạt tạo ảnh (logic này giữ nguyên)
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
        ])
          .then(([heroURL, mapURL]) => {
            updateGeneratedImageURLs(id, heroURL, mapURL);
            setPlan((prev) => ({
              ...prev,
              heroImageURL: heroURL,
              mapImageURL: mapURL,
            }));
            setIsGeneratingImages(false);
          })
          .catch((error) => {
            console.error("Error simulating image generation:", error);
            setIsGeneratingImages(false); // Đảm bảo tắt loading nếu có lỗi
          });
      }
    }
  }, [
    id,
    isStorageLoading,
    getItineraryById,
    updateGeneratedImageURLs,
    navigate,
  ]); // Thêm isStorageLoading vào dependency array

  const handleNotesBlur = () => {
    if (plan && id) {
      // **FIX:** Thêm kiểm tra 'id' cho chắc chắn
      updateNotes(id, notes);
    }
  };

  const handleConfirmDelete = () => {
    if (plan && id) {
      // **FIX:** Thêm kiểm tra 'id'
      deleteItinerary(id);
      setModalOpen(false);
      navigate("/history", { replace: true });
    }
  };

  // **FIX:** Sửa lại hàm render Hero/Map để xử lý trường hợp plan là null ban đầu
  const renderHeroContent = () => {
    // Nếu plan chưa tải xong hoặc đang tạo ảnh
    if (!plan || isGeneratingImages) {
      return (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <LoadingSpinner
            text={
              isGeneratingImages ? "Generating hero image..." : "Loading..."
            }
          />
        </div>
      );
    }

    // Nếu có URL ảnh
    if (plan.heroImageURL) {
      return (
        <>
          <img
            src={plan.heroImageURL}
            alt={plan.generatedPlan.seoTitle}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
        </>
      );
    }

    // Fallback: Hiển thị prompt
    return (
      <div className="p-8 h-full flex flex-col justify-end bg-gray-100">
        <div className="flex items-center gap-2 text-teal-700">
          <SparklesIcon className="w-5 h-5 flex-shrink-0" />
          <span className="text-sm font-semibold uppercase tracking-wider">
            Hero Image Prompt
          </span>
        </div>
        <p className="text-gray-700 text-lg mt-2 line-clamp-4">
          {plan.generatedPlan.imageGenerationPrompt}
        </p>
      </div>
    );
  };

  const renderMapContent = () => {
    if (!plan || isGeneratingImages) {
      return (
        <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
          <LoadingSpinner
            text={
              isGeneratingImages ? "Generating map..." : "Loading map data..."
            }
          />
        </div>
      );
    }

    if (plan.mapImageURL) {
      return (
        <img
          src={plan.mapImageURL}
          alt="Generated map"
          className="h-64 w-full object-cover rounded-lg border border-gray-200"
        />
      );
    }

    return (
      <div className="h-64 bg-gray-100 rounded-lg flex flex-col justify-center p-4 text-left">
        <span className="text-xs font-semibold uppercase tracking-wider text-teal-700">
          Map Prompt
        </span>
        <p className="text-gray-600 text-sm mt-2 line-clamp-5">
          {plan.generatedPlan.mapGenerationPrompt}
        </p>
      </div>
    );
  };

  // **FIX:** Xử lý trạng thái loading tổng thể của trang tốt hơn
  if (isStorageLoading || (!plan && !id)) {
    // Hiển thị loading nếu storage đang load HOẶC chưa có ID
    return (
      <div className="container p-8 text-center">
        <LoadingSpinner text="Loading journey details..." />
      </div>
    );
  }

  // Trường hợp ID có nhưng plan không tìm thấy (đã được xử lý bởi useEffect và navigate('/404'))
  // Code dưới đây chỉ chạy khi `plan` đã được load thành công.

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
        <div className="relative w-full h-80 lg:h-96 bg-gray-200 border-b border-gray-200 overflow-hidden">
          {renderHeroContent()}
          {plan &&
            !isGeneratingImages && ( // Chỉ hiển thị tiêu đề khi có plan và không đang tạo ảnh
              <div className="absolute bottom-0 left-0 right-0 z-10 container mx-auto max-w-7xl p-8 ">
                <h1
                  className={`text-5xl font-bold font-lexend ${
                    plan.heroImageURL
                      ? "text-white drop-shadow-lg"
                      : "text-gray-900"
                  }`}
                >
                  {plan.generatedPlan.seoTitle}
                </h1>
              </div>
            )}
        </div>

        {/* 2. Nội dung chi tiết */}
        <div className="container mx-auto max-w-7xl p-4 sm:p-6 lg:p-8 mt-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {/* Chỉ render ItineraryDisplay khi plan đã có */}
              {plan && <ItineraryDisplay plan={plan.generatedPlan.plan} />}
            </div>

            <div className="lg:col-span-1">
              <div className="sticky top-24 bg-white border border-gray-200 rounded-2xl shadow-xl p-6 transition-all duration-300 hover:shadow-2xl">
                <h3 className="text-2xl font-bold text-gray-900 font-lexend mb-4 flex items-center gap-2">
                  <MapPinIcon className="w-6 h-6 text-teal-500" />
                  Trip Assets
                </h3>

                {renderMapContent()}

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
