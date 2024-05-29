import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import { useSelector } from "react-redux";
import { AppState } from "../store";

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute:React.FC<PrivateRouteProps> = () => {
  const currentUser = useSelector((state: AppState) => state.currentUser);
  if (!currentUser) return <Navigate to="/landing" />;
  return <Outlet />;
};

export default PrivateRoute;