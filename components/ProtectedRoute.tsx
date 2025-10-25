import React from "react";
import { useKindeAuth } from "@kinde-oss/kinde-auth-react";
import { Navigate } from "react-router-dom";
import LoadingSpinner from "./LoadingSpinner"; // Giả sử bạn có spinner

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { isAuthenticated, isLoading } = useKindeAuth();

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-7xl p-8 text-center">
        <LoadingSpinner text="Checking authentication..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    // Chuyển hướng đến trang chủ nếu chưa đăng nhập
    return <Navigate to="/" replace />;
  }

  // Hiển thị component con nếu đã đăng nhập
  return <>{children}</>;
};

export default ProtectedRoute;
