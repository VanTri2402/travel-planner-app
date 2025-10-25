import React from "react";
import { NavLink } from "react-router-dom";
import { CompassIcon } from "./icons";

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-200 mt-24">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col items-center md:items-start">
            <NavLink to="/" className="flex items-center gap-2 mb-2">
              <CompassIcon className="w-7 h-7 text-teal-500" />
              <span className="text-lg font-bold text-gray-900 font-lexend">
                AI Journey Weaver
              </span>
            </NavLink>
            <p className="text-sm text-gray-600">
              © {new Date().getFullYear()} AI Journey Weaver. All rights
              reserved.
            </p>
          </div>

          <div className="flex items-center space-x-6">
            <NavLink
              to="/"
              className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              Create
            </NavLink>
            <NavLink
              to="/history"
              className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              History
            </NavLink>
            {/* **V6.0 MỚI:** Thêm link Contact */}
            <a
              href="mailto:contact@journeyweaver.com"
              className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
