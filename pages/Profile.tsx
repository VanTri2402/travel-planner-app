import React from "react";

import LoadingSpinner from "../components/LoadingSpinner";

import { useKindeAuth } from "@kinde-oss/kinde-auth-react";

import { useStorage } from "@/hooks/storageService";

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
  // **V6.0 MỚI:** Lấy thông tin từ cả hai hook

  const { user, isLoading: isAuthLoading } = useKindeAuth();

  const { plans, isLoading: isStorageLoading } = useStorage();

  if (isAuthLoading || isStorageLoading) {
    return (
      <div className="container p-8 text-center">
        <LoadingSpinner text="Loading profile..." />
      </div>
    );
  }

  if (!user) {
    return <div className="container p-8 text-center">User not found.</div>;
  }

  return (
    <div className="container mx-auto max-w-4xl p-4 sm:p-6 lg:p-8 animate-fade-in-up">
      <div className="flex items-center gap-6 mb-8">
        <img
          src={
            user.picture ||
            `https://ui-avatars.com/api/?name=${user?.given_name}&background=random`
          }
          alt="Profile"
          className="w-24 h-24 rounded-full border-4 border-white shadow-lg"
        />

        <div>
          <h1 className="text-4xl font-bold text-gray-900 font-lexend">
            {user?.given_name} {user?.family_name}
          </h1>

          <p className="text-lg text-gray-600">{user.email}</p>
        </div>
      </div>

      {/* Statistics Section */}

      <div className="bg-white border border-gray-200 rounded-2xl shadow-lg p-8 mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 font-lexend mb-6">
          Statistics
        </h2>

        <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl p-6">
          <div className="ml-4">
            <div className="text-5xl font-bold text-teal-600 font-lexend">
              {plans.length}
            </div>

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
