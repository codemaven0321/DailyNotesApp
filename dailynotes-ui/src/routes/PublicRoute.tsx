import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const PublicRoute: React.FC = () => {
  const authToken = localStorage.getItem("AuthToken");

  if (authToken) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default PublicRoute;
