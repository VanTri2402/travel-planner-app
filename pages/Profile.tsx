import React, { useState, useEffect } from "react";
import { storageService } from "../services/storageService";

// Component UI cho Theme Toggle (chưa có logic, theo yêu cầu)
const ThemeToggleUI: React.FC = () => {
  return (
    <div>
      <label className="text-base font-medium text-gray-900">Theme</label>
      <p className="text-sm text-gray-500">
        Select your preferred interface theme.
      </p>
      <fieldset className="mt-4">
        <legend className="sr-only">Theme selection</legend>
        <div className="space-y-4 sm:flex sm:items-center sm:space-y-0 sm:space-x-4">
          <div className="flex items-center">
            <input
              id="theme-light"
              name="theme"
              type="radio"
              defaultChecked
              className="h-4 w-4 border-gray-300 text-teal-600 focus:ring-teal-500"
            />
            <label
              htmlFor="theme-light"
              className="ml-3 block text-sm font-medium text-gray-700"
            >
              Light
            </label>
          </div>
          <div className="flex items-center">
            <input
              id="theme-dark"
              name="theme"
              type="radio"
              className="h-4 w-4 border-gray-300 text-teal-600 focus:ring-teal-500"
            />
            <label
              htmlFor="theme-dark"
              className="ml-3 block text-sm font-medium text-gray-700"
            >
              Dark
            </label>
          </div>
        </div>
      </fieldset>
    </div>
  );
};

const Profile: React.FC = () => {
  const [tripCount, setTripCount] = useState<number>(0);

  useEffect(() => {
    setTripCount(storageService.getSavedItineraries().length);
  }, []);

  return (
    <div className="container mx-auto max-w-4xl p-4 sm:p-6 lg:p-8 animate-fade-in-up">
      <h1 className="text-4xl font-bold text-gray-900 font-lexend mb-8">
        Your Profile
      </h1>

      {/* Statistics Section */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-lg p-8 mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 font-lexend mb-6">
          Statistics
        </h2>
        <div className="flex items-center bg-gray-100 rounded-xl p-6">
          <div className="flex-shrink-0">
            {/* Bạn có thể dùng CalendarIcon hoặc icon khác */}
          </div>
          <div className="ml-4">
            <div className="text-5xl font-bold text-teal-600">{tripCount}</div>
            <div className="text-lg font-medium text-gray-600">
              Journeys Planned
            </div>
          </div>
        </div>
      </div>

      {/* Settings Section */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-semibold text-gray-900 font-lexend mb-6">
          Settings
        </h2>
        <ThemeToggleUI />
      </div>
    </div>
  );
};

export default Profile;
