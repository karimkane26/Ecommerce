import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../Contexts/AuthContext";
const PrivateRoute = () => {
  const { userInfo } = useAuth();
  return userInfo ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
