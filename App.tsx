import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute"; // **V6.0 MỚI**
import CreatePlanner from "./pages/CreatePlanner";
import History from "./pages/History";
import PlannerDetail from "./pages/PlannerDetail";
import Destinations from "./pages/Destinations";
import Profile from "./pages/Profile";
import Callback from "./pages/Callback"; // **V6.0 MỚI**
import NotFound from "./pages/NotFound"; // **V6.0 MỚI**

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col">
      <Navbar />

      <main className="pt-20 flex-grow">
        <Routes>
          {/* Routes Công khai */}
          <Route path="/" element={<CreatePlanner />} />
          <Route path="/callback" element={<Callback />} />

          {/* **V6.0 UPDATE:** Routes được bảo vệ */}
          <Route
            path="/history"
            element={
              <ProtectedRoute>
                <History />
              </ProtectedRoute>
            }
          />
          <Route
            path="/planner/:id"
            element={
              <ProtectedRoute>
                <PlannerDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/destinations"
            element={
              <ProtectedRoute>
                <Destinations />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          {/* Trang 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <Footer />

      <style>{`
          @keyframes fade-in-up {
              from { opacity: 0; transform: translateY(20px); }
              to { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in-up {
              animation: fade-in-up 0.6s ease-out forwards;
              opacity: 0;
          }
      `}</style>
    </div>
  );
};

export default App;
