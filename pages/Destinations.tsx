import React from "react";
import { Link } from "react-router-dom";
import { MapPinIcon } from "../components/icons";
import LoadingSpinner from "../components/LoadingSpinner";
import { useStorage } from "@/hooks/storageService";

const Destinations: React.FC = () => {
  // **V6.0 MỚI:** Dùng hook useStorage
  const { plans, isLoading } = useStorage();

  const destinations = [...new Set(plans.map((p) => p.destination))];

  if (isLoading) {
    return (
      <div className="container p-8 text-center">
        <LoadingSpinner text="Loading your destinations..." />
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-7xl p-4 sm:p-6 lg:p-8 animate-fade-in-up">
      <h1 className="text-4xl font-bold text-gray-900 font-lexend mb-4">
        Your Destinations
      </h1>
      <p className="text-lg text-gray-600 mb-8">
        A list of all the unique places you've planned trips for.
      </p>

      {destinations.length === 0 ? (
        <div className="text-center py-20 bg-white border border-gray-200 rounded-2xl shadow-md">
          <h2 className="text-2xl font-semibold text-gray-700 font-lexend">
            No destinations yet.
          </h2>
          <p className="text-gray-500 mt-2">
            <Link to="/" className="text-teal-500 hover:underline">
              Plan a trip
            </Link>{" "}
            to see your destinations here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {destinations.map((dest, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-2xl shadow-lg p-6 flex flex-col items-center justify-center text-center transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
            >
              <MapPinIcon className="w-10 h-10 text-teal-500 mb-3" />
              <h3 className="text-lg font-bold text-gray-900 font-lexend">
                {dest}
              </h3>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Destinations;
