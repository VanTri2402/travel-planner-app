import React from "react";
import { NavLink } from "react-router-dom";
import { CompassIcon } from "./icons";

const Navbar: React.FC = () => {
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-medium transition-colors ${
      isActive ? "text-teal-400" : "text-gray-400 hover:text-gray-200"
    }`;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-950/80 backdrop-blur-lg border-b border-gray-700/50">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo / Brand */}
          <NavLink to="/" className="flex items-center gap-2 flex-shrink-0">
            <CompassIcon className="w-8 h-8 text-teal-400" />
            <span className="text-xl font-bold text-white font-lexend hidden sm:block">
              AI Journey Weaver
            </span>
          </NavLink>

          {/* Main Navigation */}
          <div className="flex items-center space-x-6">
            <NavLink to="/" className={linkClass}>
              Create
            </NavLink>
            <NavLink to="/history" className={linkClass}>
              History
            </NavLink>
            <NavLink to="/destinations" className={linkClass}>
              Destinations
            </NavLink>
          </div>

          {/* Profile / Right Aligned */}
          <div className="flex items-center">
            <NavLink to="/profile" className={linkClass}>
              Profile
            </NavLink>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
