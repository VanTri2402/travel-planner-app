import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { GeneratedPlan, UserLocation } from "../types";
import { generateItinerary } from "../services/geminiService";
import ItineraryForm from "../components/ItineraryForm";
import WelcomeDisplay from "../components/WelcomeDisplay";
import { CompassIcon } from "../components/icons";
import { useStorage } from "@/hooks/storageService"; // **V6.0 MỚI**

// **V4.0 RE-SKIN:** "Re-skin" component này sang chủ đề Sáng
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
    // Logic lấy location... (giữ nguyên từ các phiên bản trước)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          setLocationError(null);
        },
        (err) => {
          console.error("Geolocation error:", err);
          setLocationError("Could not get location. Using a default.");
          // Fallback location (e.g., Googleplex)
          setUserLocation({ latitude: 37.422, longitude: -122.084 });
        }
      );
    } else {
      setLocationError("Geolocation is not supported. Using a default.");
      setUserLocation({ latitude: 37.422, longitude: -122.084 });
    }
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
    if (isGenerating) {
      return (
        <div className="flex flex-col justify-center items-center h-full min-h-[50vh] animate-fade-in-up">
          <svg
            className="animate-spin h-10 w-10 text-teal-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <p className="text-xl mt-4 font-lexend text-gray-700">
            Weaving your journey...
          </p>
        </div>
      );
    }
    // Trạng thái thành công giờ là chuyển hướng, vì vậy chúng ta chỉ hiển thị Welcome
    return <WelcomeDisplay />;
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
