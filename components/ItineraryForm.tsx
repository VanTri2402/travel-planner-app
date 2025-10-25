
import React from 'react';
import { SparklesIcon, MapPinIcon, CalendarIcon } from './icons';

interface ItineraryFormProps {
  destination: string;
  setDestination: (value: string) => void;
  duration: number;
  setDuration: (value: number) => void;
  interests: string;
  setInterests: (value: string) => void;
  isGenerating: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

const ItineraryForm: React.FC<ItineraryFormProps> = ({
  destination,
  setDestination,
  duration,
  setDuration,
  interests,
  setInterests,
  isGenerating,
  onSubmit,
}) => {
  return (
    <form onSubmit={onSubmit} className="w-full max-w-2xl mx-auto space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="destination" className="block text-sm font-medium text-indigo-300 mb-2">
            Destination
          </label>
          <div className="relative">
            <MapPinIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              id="destination"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="e.g., Kyoto, Japan"
              required
              className="w-full bg-gray-900/50 border border-gray-700 rounded-lg py-3 pl-10 pr-4 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
            />
          </div>
        </div>
        <div>
          <label htmlFor="duration" className="block text-sm font-medium text-indigo-300 mb-2">
            Duration (days)
          </label>
          <div className="relative">
            <CalendarIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="number"
              id="duration"
              value={duration}
              onChange={(e) => setDuration(Math.max(1, parseInt(e.target.value, 10)))}
              min="1"
              max="14"
              required
              className="w-full bg-gray-900/50 border border-gray-700 rounded-lg py-3 pl-10 pr-4 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
            />
          </div>
        </div>
      </div>
      <div>
        <label htmlFor="interests" className="block text-sm font-medium text-indigo-300 mb-2">
          Interests & Vibe
        </label>
        <textarea
          id="interests"
          value={interests}
          onChange={(e) => setInterests(e.target.value)}
          placeholder="e.g., a relaxing foodie trip with a focus on history and nature"
          rows={3}
          required
          className="w-full bg-gray-900/50 border border-gray-700 rounded-lg py-3 px-4 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
        />
      </div>
      <div>
        <button
          type="submit"
          disabled={isGenerating}
          className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 disabled:bg-indigo-900/80 disabled:text-gray-400 disabled:cursor-not-allowed transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-indigo-500/50 hover:shadow-lg hover:shadow-indigo-600/40"
        >
          {isGenerating ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Weaving your journey...
            </>
          ) : (
            <>
              <SparklesIcon className="w-5 h-5" />
              Generate Itinerary
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default ItineraryForm;
