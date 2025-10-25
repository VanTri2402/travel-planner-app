import React, { useState } from "react";
import { Link } from "react-router-dom";
// **FIX:** Đảm bảo import đúng type SavedItinerary
import { SavedItinerary } from "../types";
import { useStorage } from "../hooks/storageService";
import { CalendarIcon, SparklesIcon, TrashIcon } from "../components/icons";
import LoadingSpinner from "../components/LoadingSpinner";
import ConfirmationModal from "../components/ConfirmationModal";

// **FIX:** Sử dụng type SavedItinerary thay vì 'any'
const HistoryCard: React.FC<{
  item: SavedItinerary;
  onDelete: (id: string) => void;
}> = ({ item, onDelete }) => {
  const formattedDate = new Date(item.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    // **REMOVED DARK:** Loại bỏ dark styles khỏi card container
    <div className="bg-white border border-gray-200 rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl relative group">
      {/* Nút Xóa - Chỉ style light */}
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onDelete(item.id);
        }}
        className="absolute top-4 right-4 z-20 w-10 h-10 flex items-center justify-center bg-red-100/80 text-red-600 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-red-200 hover:scale-110"
        title="Delete this journey"
      >
        <TrashIcon className="w-5 h-5" />
      </button>

      <Link to={`/planner/${item.id}`} className="block">
        {item.heroImageURL ? (
          <img
            src={item.heroImageURL}
            alt={`Hero for ${item.destination}`}
            className="h-48 w-full object-cover" // Giữ nguyên
          />
        ) : (
          // **REMOVED DARK:** Loại bỏ dark styles khỏi placeholder
          <div className="h-48 w-full bg-gray-100 p-4 flex flex-col justify-center text-left">
            <div className="flex items-center gap-2 text-teal-700">
              <SparklesIcon className="w-4 h-4 flex-shrink-0" />
              <span className="text-xs font-semibold uppercase tracking-wider">
                Image Prompt
              </span>
            </div>
            <p className="text-gray-600 text-sm mt-2 line-clamp-5">
              {item.generatedPlan.imageGenerationPrompt}
            </p>
          </div>
        )}

        <div className="p-5">
          {/* **REMOVED DARK:** Loại bỏ dark styles khỏi text */}
          <h3
            className="text-xl font-bold text-gray-900 font-lexend truncate"
            title={item.destination}
          >
            {item.destination}
          </h3>
          <p className="text-gray-600 mt-1">{item.duration} Days</p>
          {/* **REMOVED DARK:** Loại bỏ dark styles khỏi date/border */}
          <div className="flex items-center gap-2 text-gray-500 text-sm mt-3 pt-3 border-t border-gray-200">
            <CalendarIcon className="w-4 h-4" />
            <span>{formattedDate}</span>
          </div>
        </div>
      </Link>
    </div>
  );
};

const History: React.FC = () => {
  const { plans, isLoading, deleteItinerary } = useStorage();
  const [modalOpen, setModalOpen] = useState(false);
  const [planToDelete, setPlanToDelete] = useState<string | null>(null);

  const openDeleteModal = (id: string) => {
    setPlanToDelete(id);
    setModalOpen(true);
  };
  const handleConfirmDelete = () => {
    if (planToDelete) {
      deleteItinerary(planToDelete);
    }
    setModalOpen(false);
    setPlanToDelete(null);
  };

  if (isLoading) {
    // Spinner không cần dark style
    return (
      <div className="container mx-auto p-8 text-center">
        <LoadingSpinner text="Loading your journeys..." />
      </div>
    );
  }

  return (
    <>
      {/* Modal không cần dark style */}
      <ConfirmationModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Journey"
        message="Are you sure you want to delete this journey? This action cannot be undone."
      />
      {/* Container chung không cần dark style */}
      <div className="container mx-auto max-w-7xl p-4 sm:p-6 lg:p-8 animate-fade-in-up">
        {/* **REMOVED DARK:** Loại bỏ dark style khỏi title */}
        <h1 className="text-4xl font-bold text-gray-900 font-lexend mb-8">
          Your Saved Journeys
        </h1>

        {plans.length === 0 ? (
          // **REMOVED DARK:** Loại bỏ dark styles khỏi empty state
          <div className="text-center py-20 bg-white border border-gray-200 rounded-2xl shadow-md">
            <h2 className="text-2xl font-semibold text-gray-700 font-lexend">
              No journeys saved yet.
            </h2>
            <p className="text-gray-500 mt-2">
              Go to the{" "}
              <Link to="/" className="text-teal-500 hover:underline">
                Create
              </Link>{" "}
              page to plan your first trip!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {plans.map((item) => (
              <HistoryCard
                key={item.id}
                item={item}
                onDelete={openDeleteModal}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default History;
