import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { GeneratedPlan, UserLocation } from "../types"; //
import { generateItinerary } from "../services/geminiService"; //
import ItineraryForm from "../components/ItineraryForm"; //
import WelcomeDisplay from "../components/WelcomeDisplay"; //
import { CompassIcon } from "../components/icons"; //
import { useStorage } from "../hooks/storageService"; //

// Component PlannerFormCard (Bao gồm ItineraryForm)
// **FIX:** Đảm bảo component này nhận và truyền TẤT CẢ props cần thiết xuống ItineraryForm
const PlannerFormCard: React.FC<{
  destination: string;
  setDestination: (value: string) => void;
  duration: number;
  setDuration: (value: number) => void;
  interests: string;
  setInterests: (value: string) => void;
  isGenerating: boolean;
  onSubmit: (e: React.FormEvent) => void;
  locationError: string | null;
}> = (
  props // Component này nhận TẤT CẢ props của ItineraryForm + locationError
) => (
  <>
    <header className="mb-8">
      <div className="flex items-center gap-4">
        <CompassIcon className="w-12 h-12 text-teal-500" /> {/* */}
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
    <section className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-lg">
      {/* Truyền TẤT CẢ props xuống ItineraryForm */}
      <ItineraryForm
        destination={props.destination}
        setDestination={props.setDestination}
        duration={props.duration}
        setDuration={props.setDuration}
        interests={props.interests}
        setInterests={props.setInterests}
        isGenerating={props.isGenerating}
        onSubmit={props.onSubmit}
      />
    </section>
    {/* Hiển thị lỗi (bao gồm lỗi generation/auth) */}
    {props.locationError && (
      <div className="text-center mt-6 p-3 bg-yellow-100 text-yellow-800 border border-yellow-300 rounded-lg">
        {props.locationError}
      </div>
    )}
  </>
);

// Component Trang Chính
const CreatePlanner: React.FC = () => {
  const navigate = useNavigate();
  const { saveItinerary, isAuthenticated } = useStorage(); //

  // **FIX:** Đảm bảo các state này được định nghĩa đúng bằng useState
  const [destination, setDestination] = useState<string>("Tokyo, Japan");
  const [duration, setDuration] = useState<number>(5);
  const [interests, setInterests] = useState<string>(
    "A mix of ancient temples, beautiful gardens, delicious food, and unique cultural experiences."
  );
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null); //
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Logic lấy location (giữ nguyên)
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
      if (!isAuthenticated) {
        //
        setError("Please sign in or sign up to create and save a new journey.");
        return;
      }
      if (isGenerating) return;

      setIsGenerating(true);
      setError(null);

      try {
        const generatedPlan: GeneratedPlan = await generateItinerary(
          //
          destination,
          duration,
          interests,
          userLocation
        );

        const savedPlan = saveItinerary(
          //
          destination,
          duration,
          interests,
          generatedPlan
        );

        if (savedPlan) {
          navigate(`/planner/${savedPlan.id}`);
        } else {
          setError("Could not save the plan. Are you logged in?");
        }
      } catch (err) {
        if (err instanceof Error) {
          setError(`Generation failed: ${err.message}`);
          console.error("Error during generation or saving:", err);
        } else {
          setError("An unexpected error occurred during generation.");
          console.error("Unexpected error:", err);
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
      isAuthenticated, //
    ]
  );

  // Hàm renderRightColumn (không đổi)
  const renderRightColumn = () => {
    /* ... */
  }; //

  return (
    <div className="container mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
      <div className="md:grid md:grid-cols-3 md:gap-12">
        <div className="md:col-span-1 md:sticky md:top-24 md:h-[calc(100vh-8rem)] overflow-y-auto md:pr-4">
          {/* **FIX:** Truyền đúng và đủ props xuống PlannerFormCard */}
          <PlannerFormCard
            destination={destination}
            setDestination={setDestination}
            duration={duration}
            setDuration={setDuration}
            interests={interests}
            setInterests={setInterests}
            isGenerating={isGenerating}
            onSubmit={handleGenerateItinerary}
            // Truyền lỗi vào đây để hiển thị
            locationError={
              locationError || (error && !isGenerating ? error : null)
            }
          />
        </div>
        <div className="md:col-span-2 mt-12 md:mt-0">{renderRightColumn()}</div>
      </div>
    </div>
  );
};

export default CreatePlanner;
