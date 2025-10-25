import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ItineraryPlan, UserLocation } from "../types";
import { generateItinerary } from "../services/geminiService";
import { storageService } from "../services/storageService";
import ItineraryDisplay from "../components/ItineraryDisplay";
import ItineraryForm from "../components/ItineraryForm"; // Đổi tên từ HeaderAndForm
import WelcomeDisplay from "../components/WelcomeDisplay";
import { CompassIcon } from "../components/icons";

// Đổi tên component 'HeaderAndForm' thành 'PlannerFormCard' để rõ nghĩa hơn
const PlannerFormCard: React.FC<any> = (props) => (
  <>
    <header className="mb-8">
      <div className="flex items-center gap-4">
        <CompassIcon className="w-12 h-12 text-teal-400" />
        <div>
          <h1 className="text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-teal-300 to-cyan-400 font-lexend">
            AI Journey Weaver
          </h1>
          <p className="mt-1 text-lg text-gray-400">
            Your personal AI travel companion.
          </p>
        </div>
      </div>
    </header>
    <section className="bg-gray-900 border border-gray-700/50 rounded-2xl p-6 sm:p-8 shadow-xl">
      <ItineraryForm {...props} />
    </section>
    {props.locationError && (
      <div className="text-center mt-6 p-3 bg-yellow-900/50 text-yellow-300 border border-yellow-700 rounded-lg">
        {props.locationError}
      </div>
    )}
  </>
);

// Trang chính để tạo
const CreatePlanner: React.FC = () => {
  const navigate = useNavigate();
  const [destination, setDestination] = useState<string>("Kyoto, Japan");
  const [duration, setDuration] = useState<number>(5);
  const [interests, setInterests] = useState<string>(
    "A mix of ancient temples, beautiful gardens, delicious food, and unique cultural experiences."
  );

  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);

  const [itineraryPlan, setItineraryPlan] = useState<ItineraryPlan | null>(
    null
  );
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Logic lấy location... (giữ nguyên)
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
          setLocationError("Could not get location. Using a default.");
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
        setError(
          "Still trying to determine your location. Please wait a moment and try again."
        );
        return;
      }
      if (isGenerating) return;

      setIsGenerating(true);
      setError(null);
      setItineraryPlan(null);

      try {
        const plan = await generateItinerary(
          destination,
          duration,
          interests,
          userLocation
        );
        setItineraryPlan(plan);

        // LƯU VÀO LOCALSTORAGE VÀ CHUYỂN HƯỚNG
        const savedPlan = storageService.saveItinerary(
          destination,
          duration,
          interests,
          plan
        );
        // Tùy chọn: Tự động chuyển hướng đến trang chi tiết
        navigate(`/planner/${savedPlan.id}`);
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
    [destination, duration, interests, userLocation, isGenerating, navigate]
  );

  const renderRightColumn = () => {
    if (isGenerating) {
      return (
        <div className="flex flex-col justify-center items-center h-full min-h-[50vh] animate-fade-in-up">
          <svg
            className="animate-spin h-10 w-10 text-teal-400"
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
          <p className="text-xl mt-4 font-lexend text-gray-300">
            Weaving your journey...
          </p>
        </div>
      );
    }
    if (error) {
      return (
        <div className="text-center mt-8 p-6 bg-red-900/50 text-red-300 border border-red-700 rounded-xl animate-fade-in-up">
          <h3 className="font-semibold text-lg font-lexend">
            Generation Failed
          </h3>
          <p className="mt-2">{error}</p>
        </div>
      );
    }
    // Ghi chú: ItineraryDisplay sẽ chỉ hiển thị trong giây lát trước khi chuyển hướng
    if (itineraryPlan) {
      return (
        <section className="animate-fade-in-up">
          <ItineraryDisplay plan={itineraryPlan} />
        </section>
      );
    }
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
              locationError && !userLocation ? locationError : null
            }
          />
        </div>
        <div className="md:col-span-2 mt-12 md:mt-0">{renderRightColumn()}</div>
      </div>
    </div>
  );
};

export default CreatePlanner;
