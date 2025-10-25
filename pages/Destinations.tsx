import React from "react";
import { Link } from "react-router-dom";

const Destinations: React.FC = () => {
  return (
    <div className="container mx-auto max-w-4xl p-8 text-center animate-fade-in-up">
      <h1 className="text-4xl font-bold text-white font-lexend mb-4">
        Explore Destinations
      </h1>
      <p className="text-lg text-gray-400">
        This feature is coming soon! You'll be able to discover amazing new
        places here.
      </p>
      <Link
        to="/"
        className="inline-block mt-8 bg-teal-500 hover:bg-teal-600 text-white font-semibold py-2 px-5 rounded-lg transition-colors"
      >
        Create a Plan
      </Link>
    </div>
  );
};

export default Destinations;
