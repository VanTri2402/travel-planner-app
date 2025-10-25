import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { GeneratedPlan, UserLocation } from "../types";
import { generateItinerary } from "../services/geminiService";
import ItineraryForm from "../components/ItineraryForm";
import WelcomeDisplay from "../components/WelcomeDisplay";
import { CompassIcon } from "../components/icons";
import { useStorage } from "@/hooks/storageService";
const PlannerFormCard: React.FC<any> = (props) => (
  <>
    <header className="mb-8">
      <div className="flex items-center gap-4">
        <CompassIcon className="w-12 h-12 text-teal-500" />

        <div>
          <h1 className="text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-teal-500 to-cyan-600 font-lexend">
            AI Journey Weaver
          </h1>

          <p className="mt-1 text-lg text-gray-600">
            Your personal AI travel companion.
          </p>
        </div>
      </div>
    </header>

    {/* **V4.0 RE-SKIN:** bg-white, border, shadow */}

    <section className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-lg">
      <ItineraryForm {...props} />
    </section>

    {props.locationError && (
      <div className="text-center mt-6 p-3 bg-yellow-100 text-yellow-800 border border-yellow-300 rounded-lg">
        {props.locationError}
      </div>
    )}
  </>
);

const CreatePlanner: React.FC = () => {
  const navigate = useNavigate();
  // **V6.0 MỚI:** Lấy hàm save và thông tin auth
  const { saveItinerary, isAuthenticated } = useStorage();

  const [destination, setDestination] = useState<string>("Tokyo, Japan");
  // ... (các state khác: duration, interests, userLocation, ... không đổi) ...
  const [duration, setDuration] = useState<number>(5);
  const [interests, setInterests] = useState<string>(
    "A mix of ancient temples, beautiful gardens, delicious food, and unique cultural experiences."
  );
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    /* ... (logic lấy location không đổi) ... */
  }, []);

  const handleGenerateItinerary = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!userLocation) {
        setError("Still trying to determine your location...");
        return;
      }
      // **V6.0 MỚI:** Kiểm tra auth trước khi tạo
      if (!isAuthenticated) {
        setError("Please sign in or sign up to create and save a new journey.");
        return;
      }
      if (isGenerating) return;

      setIsGenerating(true);
      setError(null);

      try {
        const generatedPlan = await generateItinerary(
          destination,
          duration,
          interests,
          userLocation
        );

        // **V6.0 MỚI:** Dùng hàm save từ hook
        const savedPlan = saveItinerary(
          destination,
          duration,
          interests,
          generatedPlan
        );

        if (savedPlan) {
          navigate(`/planner/${savedPlan.id}`); // Chuyển hướng
        } else {
          setError("Could not save the plan. Are you logged in?");
        }
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unexpected error occurred.");
        }
      } finally {
        setIsGenerating(false);
      }
    },
    [
      destination,
      duration,
      interests,
      userLocation,
      isGenerating,
      navigate,
      saveItinerary,
      isAuthenticated,
    ]
  );

  // ... (hàm renderRightColumn không đổi) ...
  const renderRightColumn = () => {
    /* ... */
  };

  return (
    <div className="container mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
      <div className="md:grid md:grid-cols-3 md:gap-12">
        <div className="md:col-span-1 md:sticky md:top-24 md:h-[calc(100vh-8rem)] overflow-y-auto md:pr-4">
          <PlannerFormCard
            destination={destination}
            setDestination={setDestination}
            duration={duration}
            setDuration={setDuration}
            interests={interests}
            setInterests={setInterests}
            isGenerating={isGenerating}
            onSubmit={handleGenerateItinerary}
            locationError={
              locationError || (error && !isGenerating ? error : null)
            } // **V6.0 MỚI:** Hiển thị lỗi auth ở đây
          />
        </div>
        <div className="md:col-span-2 mt-12 md:mt-0">{renderRightColumn()}</div>
      </div>
    </div>
  );
};

export default CreatePlanner;
