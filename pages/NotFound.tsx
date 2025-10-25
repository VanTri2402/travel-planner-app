import React from "react";
import { Link } from "react-router-dom";
import { CompassIcon } from "../components/icons";

const NotFound: React.FC = () => {
  return (
    <div className="container mx-auto max-w-2xl p-8 text-center mt-20 animate-fade-in-up">
      <CompassIcon className="w-24 h-24 text-teal-200 mx-auto" />
      <h1 className="text-6xl font-bold text-gray-900 font-lexend mt-6">404</h1>
      <h2 className="text-3xl font-semibold text-gray-700 font-lexend mt-2">
        Page Not Found
      </h2>
      <p className="text-lg text-gray-600 mt-4">
        Oops! The page you are looking for does not exist. It might have been
        moved or deleted.
      </p>
      <Link
        to="/"
        className="inline-block mt-8 bg-teal-500 hover:bg-teal-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors shadow-lg hover:shadow-teal-500/40"
      >
        Go Back Home
      </Link>
    </div>
  );
};

export default NotFound;
