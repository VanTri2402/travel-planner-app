import React from "react";
import { NavLink } from "react-router-dom";
import { CompassIcon } from "./icons";
// **FIX:** Thêm import cho SVG inline hoặc từ icons.tsx nếu bạn đã tạo
// import { GithubIcon, MailIcon } from './icons';

const Footer: React.FC = () => {
  return (
    // **REMOVED DARK:** Loại bỏ dark styles
    <footer className="bg-white border-t border-gray-200 mt-24">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          {/* Logo & Copyright */}
          <div className="flex flex-col items-center md:items-start">
            <NavLink to="/" className="flex items-center gap-2 mb-2">
              <CompassIcon className="w-7 h-7 text-teal-500" />
              <span className="text-lg font-bold text-gray-900 font-lexend">
                AI Journey Weaver
              </span>
            </NavLink>
            <p className="text-sm text-gray-600">
              © {new Date().getFullYear()} AI Journey Weaver.
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Powered by Google Gemini
            </p>
          </div>

          {/* Liên hệ & GitHub */}
          <div className="flex items-center space-x-6">
            <a
              href="https://github.com/vantri2402/travel-planner-app" // **Sử dụng Link GitHub của bạn**
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-gray-900 transition-colors"
              title="View Source on GitHub"
            >
              {/* SVG Icon GitHub */}
              <svg
                className="w-6 h-6"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.036 1.531 1.036.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="sr-only">GitHub</span>
            </a>
            <a
              href="mailto:contact@journeyweaver.com" // **Email liên hệ của bạn**
              className="text-gray-500 hover:text-gray-900 transition-colors"
              title="Contact Us via Email"
            >
              {/* SVG Icon Mail */}
              <svg
                className="w-6 h-6"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M21.75 6.75V17.25a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3V6.75a3 3 0 0 1 3-3h13.5a3 3 0 0 1 3 3zM19.5 7.426V6.75a1.5 1.5 0 0 0-1.5-1.5H6a1.5 1.5 0 0 0-1.5 1.5v.676L12 11.127l7.5-3.701zM4.5 9.176v8.074c0 .83.67 1.5 1.5 1.5h12a1.5 1.5 0 0 0 1.5-1.5V9.176l-7.3 3.593a.75.75 0 0 1-.7 0l-7.3-3.593z" />
              </svg>
              <span className="sr-only">Email</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
