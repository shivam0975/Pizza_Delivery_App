//This file defines the private routes for the app providing acess control

import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const PrivateRoute = ({ children, adminOnly = false }) => {
  const { user, authLoading } = useContext(AuthContext);

  if (authLoading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (adminOnly && !user.isAdmin) return <Navigate to="/" replace />;
  return children;
};

export default PrivateRoute;