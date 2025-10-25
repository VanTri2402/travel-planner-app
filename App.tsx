import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import CreatePlanner from "./pages/CreatePlanner";
import History from "./pages/History";
import PlannerDetail from "./pages/PlannerDetail";
import Destinations from "./pages/Destinations";
import Profile from "./pages/Profle";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-950 text-gray-100">
        <Navbar />

        {/* Nội dung trang sẽ được render bên dưới Navbar */}
        <main className="pt-20">
          {" "}
          {/* pt-20 để tạo khoảng trống cho Navbar sticky */}
          <Routes>
            <Route path="/" element={<CreatePlanner />} />
            <Route path="/history" element={<History />} />
            <Route path="/planner/:id" element={<PlannerDetail />} />

            {/* Stubbed Pages */}
            <Route path="/destinations" element={<Destinations />} />
            <Route path="/profile" element={<Profile />} />

            {/* Redirect nếu không tìm thấy route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>

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
    </BrowserRouter>
  );
};

export default App;
