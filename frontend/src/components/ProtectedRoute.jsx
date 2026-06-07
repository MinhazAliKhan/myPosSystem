import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../store/AuthContext";

const ProtectedRoute = ({ children, role }) => {
  const { isLogin, user, loading } = useAuth();

  if (loading) return <p className="p-4">Loading...</p>;
  if (!isLogin) return <Navigate to="/login" />;

  // Case-insensitive role check
  if (role && user.role?.toUpperCase() !== role.toUpperCase())
    return <p className="p-4 text-red-600">Access Denied</p>;

  return children;
};

export default ProtectedRoute;
