import React from "react";
import { NavLink } from "react-router-dom";
import { CompassIcon } from "./icons";
import { useKindeAuth } from "@kinde-oss/kinde-auth-react";

const Navbar: React.FC = () => {
  // **V6.0 MỚI:** Lấy trạng thái xác thực
  const { isAuthenticated, user, login, register, logout } = useKindeAuth();

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-medium transition-colors ${
      isActive ? "text-teal-600" : "text-gray-600 hover:text-gray-900"
    }`;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <NavLink to="/" className="flex items-center gap-2 flex-shrink-0">
            <CompassIcon className="w-8 h-8 text-teal-500" />
            <span className="text-xl font-bold text-gray-900 font-lexend hidden sm:block">
              AI Journey Weaver
            </span>
          </NavLink>

          <div className="flex items-center space-x-6">
            <NavLink to="/" className={linkClass}>
              Create
            </NavLink>
            {/* **V6.0 MỚI:** Chỉ hiển thị link private nếu đã đăng nhập */}
            {isAuthenticated && (
              <>
                <NavLink to="/history" className={linkClass}>
                  History
                </NavLink>
                <NavLink to="/destinations" className={linkClass}>
                  Destinations
                </NavLink>
              </>
            )}
          </div>

          {/* **V6.0 MỚI:** Logic Auth UI */}
          <div className="flex items-center space-x-4">
            {!isAuthenticated ? (
              <>
                <button
                  onClick={() => login()}
                  className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Sign in
                </button>
                <button
                  onClick={() => register()}
                  className="text-sm font-medium bg-teal-500 hover:bg-teal-600 text-white py-2 px-4 rounded-lg transition-colors"
                >
                  Sign up
                </button>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => logout()}
                  className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Sign out
                </button>
                <NavLink to="/profile">
                  <img
                    src={
                      user?.picture ||
                      `https://ui-avatars.com/api/?name=${user?.given_name}&background=random`
                    }
                    alt="Profile"
                    className="w-9 h-9 rounded-full border-2 border-gray-300 hover:border-teal-500 transition-colors"
                  />
                </NavLink>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
