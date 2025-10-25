import React from "react";
import ItineraryForm from "./ItineraryForm";
import { CompassIcon } from "./icons";

interface HeaderAndFormProps {
  destination: string;
  setDestination: (value: string) => void;
  duration: number;
  setDuration: (value: number) => void;
  interests: string;
  setInterests: (value: string) => void;
  isGenerating: boolean;
  onSubmit: (e: React.FormEvent) => void;
  locationError: string | null;
}

const HeaderAndForm: React.FC<HeaderAndFormProps> = (props) => {
  return (
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
};

export default HeaderAndForm;
