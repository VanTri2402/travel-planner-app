import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { SavedItinerary } from "../types";
import { storageService } from "../services/storageService";
import { CalendarIcon } from "../components/icons";

const HistoryCard: React.FC<{ item: SavedItinerary }> = ({ item }) => {
  const formattedDate = new Date(item.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Link
      to={`/planner/${item.id}`}
      className="block bg-gray-900 border border-gray-700/50 rounded-2xl shadow-xl overflow-hidden transition-all duration-300 hover:border-teal-500/50 hover:shadow-teal-500/10 hover:-translate-y-1"
    >
      {/* Placeholder hình ảnh */}
      <div className="h-48 w-full bg-gradient-to-r from-gray-800 to-gray-700 flex items-center justify-center">
        <span className="text-gray-500">Image Placeholder</span>
      </div>
      <div className="p-5">
        <h3
          className="text-xl font-bold text-white font-lexend truncate"
          title={item.destination}
        >
          {item.destination}
        </h3>
        <p className="text-gray-300 mt-1">{item.duration} Days</p>
        <div className="flex items-center gap-2 text-gray-400 text-sm mt-3 pt-3 border-t border-gray-700/50">
          <CalendarIcon className="w-4 h-4" />
          <span>{formattedDate}</span>
        </div>
      </div>
    </Link>
  );
};

const History: React.FC = () => {
  const [history, setHistory] = useState<SavedItinerary[]>([]);

  useEffect(() => {
    setHistory(storageService.getSavedItineraries());
  }, []);

  return (
    <div className="container mx-auto max-w-7xl p-4 sm:p-6 lg:p-8 animate-fade-in-up">
      <h1 className="text-4xl font-bold text-white font-lexend mb-8">
        Your Saved Journeys
      </h1>

      {history.length === 0 ? (
        <div className="text-center py-20 bg-gray-900 border border-gray-700/50 rounded-2xl">
          <h2 className="text-2xl font-semibold text-gray-300">
            No journeys saved yet.
          </h2>
          <p className="text-gray-400 mt-2">
            Go to the{" "}
            <Link to="/" className="text-teal-400 hover:underline">
              Create
            </Link>{" "}
            page to plan your first trip!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {history.map((item) => (
            <HistoryCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
};

export default History;
