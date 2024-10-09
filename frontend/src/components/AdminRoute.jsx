import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../Contexts/AuthContext";
const AdminRoute = () => {
  const { userInfo } = useAuth();
  return userInfo && userInfo.isAdmin ? (
    <Outlet />
  ) : (
    <Navigate to="/login" replace />
  );
};

export default AdminRoute;
