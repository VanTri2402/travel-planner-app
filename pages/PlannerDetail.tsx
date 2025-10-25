import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useStorage } from "../hooks/storageService";
import { imageGenService } from "../services/imageGenService";
import ItineraryDisplay from "../components/ItineraryDisplay"; // Đã được sửa ở trên
import LoadingSpinner from "../components/LoadingSpinner";
import ConfirmationModal from "../components/ConfirmationModal";
import { MapPinIcon, TrashIcon, SparklesIcon } from "../components/icons";

const PlannerDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const {
    getItineraryById,
    updateNotes,
    updateGeneratedImageURLs,
    deleteItinerary,
    isLoading: isStorageLoading,
  } = useStorage();

  const [plan, setPlan] = useState<any | null>(null);
  const [isGeneratingImages, setIsGeneratingImages] = useState(false);
  const [notes, setNotes] = useState<string>("");
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    console.log(
      `[PlannerDetail] useEffect - ID: ${id}, Storage Loading: ${isStorageLoading}`
    );

    if (id && !isStorageLoading) {
      const loadedPlan = getItineraryById(id);
      console.log(
        `[PlannerDetail] Storage loaded. Plan found:`,
        loadedPlan ? { ...loadedPlan } : null
      );

      if (!loadedPlan) {
        console.warn(
          `[PlannerDetail] Plan with ID ${id} not found. Navigating to 404.`
        );
        return;
      }

      setPlan(loadedPlan);
      setNotes(loadedPlan.notes);

      if (loadedPlan.heroImageURL === null || loadedPlan.mapImageURL === null) {
        console.log(
          `[PlannerDetail] Image URLs missing (Hero: ${loadedPlan.heroImageURL}, Map: ${loadedPlan.mapImageURL}). Starting generation...`
        );
        setIsGeneratingImages(true);

        const heroPrompt = loadedPlan.generatedPlan.imageGenerationPrompt;
        const mapPrompt = loadedPlan.generatedPlan.mapGenerationPrompt;

        Promise.all([
          loadedPlan.heroImageURL
            ? Promise.resolve(loadedPlan.heroImageURL)
            : imageGenService.simulateImageGeneration(heroPrompt, 1600, 900),
          loadedPlan.mapImageURL
            ? Promise.resolve(loadedPlan.mapImageURL)
            : imageGenService.simulateImageGeneration(mapPrompt, 800, 800),
        ])
          .then(([heroURL, mapURL]) => {
            console.log(
              `[PlannerDetail] Image generation complete. HeroURL: ${heroURL}, MapURL: ${mapURL}`
            );
            if (
              heroURL !== loadedPlan.heroImageURL ||
              mapURL !== loadedPlan.mapImageURL
            ) {
              console.log(
                `[PlannerDetail] Updating storage with new image URLs.`
              );
              updateGeneratedImageURLs(id, heroURL, mapURL);
            }
            setPlan((prev) => {
              const newState = {
                ...prev,
                heroImageURL: heroURL,
                mapImageURL: mapURL,
              };
              console.log(
                "[PlannerDetail] Updating component state:",
                newState
              );
              return newState;
            });
            setIsGeneratingImages(false);
          })
          .catch((error) => {
            console.error(
              "[PlannerDetail] Error simulating image generation:",
              error
            );
            setIsGeneratingImages(false);
          });
      } else {
        console.log(
          "[PlannerDetail] Both Image URLs already exist. Skipping generation."
        );
      }
    }
  }, [
    id,
    isStorageLoading,
    getItineraryById,
    updateGeneratedImageURLs,
    navigate,
  ]);

  const handleNotesBlur = () => {
    if (plan && id) {
      updateNotes(id, notes);
    }
  };
  const handleConfirmDelete = () => {
    if (plan && id) {
      deleteItinerary(id);
      setModalOpen(false);
      navigate("/history", { replace: true });
    }
  };

  // --- Render Hero Content (Chỉ Light) ---
  const renderHeroContent = () => {
    if (isGeneratingImages && !plan?.heroImageURL) {
      return (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <LoadingSpinner text="Generating hero image..." />
        </div>
      );
    }
    if (plan?.heroImageURL) {
      return (
        <>
          <img
            src={plan.heroImageURL}
            alt={plan.generatedPlan.seoTitle || "Trip hero image"}
            className="absolute inset-0 w-full h-full object-cover"
            onError={(e) => {
              console.error("Hero image load error:", e.currentTarget.src);
              e.currentTarget.style.display = "none";
            }}
          />
          <img
            src="https://wallpaperaccess.com/full/3917296.jpg"
            alt="default"
            className="absolute inset-0"
          />
        </>
      );
    }
    if (plan) {
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
    }
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
        <LoadingSpinner text="Loading hero data..." />
      </div>
    );
  };

  // --- Render Map Content (Chỉ Light) ---
  const renderMapContent = () => {
    console.log(
      `[PlannerDetail] renderMapContent called. isGenerating: ${isGeneratingImages}, mapURL: ${plan?.mapImageURL}`
    );
    if (isGeneratingImages && !plan?.mapImageURL) {
      return (
        <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
          <LoadingSpinner text="Generating map..." />
        </div>
      );
    }
    if (plan?.mapImageURL) {
      console.log(`[PlannerDetail] Rendering map image: ${plan.mapImageURL}`);
      return (
        <img
          src={plan.mapImageURL}
          alt="Generated map"
          className="h-64 w-full object-cover rounded-lg border border-gray-200"
          onError={(e) => {
            console.error("Map image load error:", e.currentTarget.src);
            e.currentTarget.style.display = "none";
          }}
        />
      );
    }
    if (plan) {
      console.log("[PlannerDetail] Rendering map prompt fallback.");
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
    }
    console.log("[PlannerDetail] Rendering map loading fallback.");
    return (
      <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
        <LoadingSpinner text="Loading map data..." />
      </div>
    );
  };

  // Loading tổng thể (Chỉ Light)
  if (isStorageLoading || (!plan && id)) {
    console.log(
      `[PlannerDetail] Overall Loading State: isStorageLoading=${isStorageLoading}, !plan=${!plan}, id=${id}`
    );
    return (
      <div className="container p-8 text-center">
        <LoadingSpinner text="Loading journey details..." />
      </div>
    );
  }

  // --- Phần JSX Render (Chỉ Light) ---
  console.log(
    "[PlannerDetail] Rendering main content. Plan:",
    plan ? { ...plan } : null
  );
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
          {plan && !isGeneratingImages && (
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
          <div className="gap-8">
            <div className="">
              {plan && <ItineraryDisplay plan={plan.generatedPlan.plan} />}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PlannerDetail;
