import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";
import { useKindeAuth } from "@kinde-oss/kinde-auth-react";

const Callback: React.FC = () => {
  const navigate = useNavigate();
  const { isLoading, isAuthenticated } = useKindeAuth();

  useEffect(() => {
    // Kinde sẽ xử lý, khi hết loading và đã auth,
    // chuyển hướng người dùng đến trang history.
    if (!isLoading && isAuthenticated) {
      navigate("/history");
    }
    // Nếu thất bại (chưa auth), Kinde tự động xử lý (hoặc bạn có thể redirect về '/')
    if (!isLoading && !isAuthenticated) {
      navigate("/");
    }
  }, [isLoading, isAuthenticated, navigate]);

  return (
    <div className="container mx-auto max-w-7xl p-8 text-center mt-20">
      <LoadingSpinner text="Authenticating..." />
    </div>
  );
};

export default Callback;
