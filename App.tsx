
import React, { useState, useEffect, useCallback } from 'react';
import { ItineraryPlan, UserLocation } from './types';
import { generateItinerary } from './services/geminiService';
import ItineraryForm from './components/ItineraryForm';
import ItineraryDisplay from './components/ItineraryDisplay';
import { CompassIcon } from './components/icons';

const App: React.FC = () => {
  const [destination, setDestination] = useState<string>('Kyoto, Japan');
  const [duration, setDuration] = useState<number>(5);
  const [interests, setInterests] = useState<string>('A mix of ancient temples, beautiful gardens, delicious food, and unique cultural experiences.');
  
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  
  const [itineraryPlan, setItineraryPlan] = useState<ItineraryPlan | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
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
          setLocationError("Could not get your location. Please enable location services. Using a default location.");
          // Fallback location (e.g., Googleplex)
          setUserLocation({ latitude: 37.422, longitude: -122.084 });
        }
      );
    } else {
      setLocationError("Geolocation is not supported by your browser. Using a default location.");
      setUserLocation({ latitude: 37.422, longitude: -122.084 });
    }
  }, []);

  const handleGenerateItinerary = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userLocation) {
        setError("Still trying to determine your location. Please wait a moment and try again.");
        return;
    }
    if (isGenerating) return;

    setIsGenerating(true);
    setError(null);
    setItineraryPlan(null);

    try {
      const plan = await generateItinerary(destination, duration, interests, userLocation);
      setItineraryPlan(plan);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred.');
      }
    } finally {
      setIsGenerating(false);
    }
  }, [destination, duration, interests, userLocation, isGenerating]);
  
  return (
    <div className="min-h-screen p-4 sm:p-6 md:p-8">
      <main className="container mx-auto">
        <header className="text-center my-12 md:my-16">
          <div className="inline-flex items-center justify-center gap-4">
            <CompassIcon className="w-16 h-16 text-indigo-400" />
            <div>
              <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 to-purple-400 font-lexend">
                AI Journey Weaver
              </h1>
              <p className="mt-2 text-lg text-gray-400">
                Your personal AI travel companion, powered by Gemini.
              </p>
            </div>
          </div>
        </header>

        <section className="glass-card shadow-2xl rounded-2xl p-6 sm:p-8">
          <ItineraryForm
            destination={destination}
            setDestination={setDestination}
            duration={duration}
            setDuration={setDuration}
            interests={interests}
            setInterests={setInterests}
            isGenerating={isGenerating}
            onSubmit={handleGenerateItinerary}
          />
        </section>

        {locationError && !userLocation && (
          <div className="text-center mt-6 p-3 bg-yellow-900/50 text-yellow-300 border border-yellow-700 rounded-lg">
            {locationError}
          </div>
        )}
        
        {error && (
          <div className="text-center mt-8 p-4 bg-red-900/50 text-red-300 border border-red-700 rounded-lg">
            <h3 className="font-semibold font-lexend">Generation Failed</h3>
            <p>{error}</p>
          </div>
        )}
        
        {itineraryPlan && (
          <section className="mt-12">
            <ItineraryDisplay plan={itineraryPlan} />
          </section>
        )}
      </main>

      <footer className="text-center text-gray-500 mt-24 pb-4">
        <p>Built with React, Tailwind CSS, and the Google Gemini API.</p>
      </footer>
      <style>{`
          @keyframes fade-in-up {
              from { opacity: 0; transform: translateY(20px); }
              to { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in-up {
              animation: fade-in-up 0.6s ease-out forwards;
              opacity: 0;
          }
      `}</style>
    </div>
  );
};

export default App;
