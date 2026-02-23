// src/components/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { isAuthed } from "../lib/auth";

export default function ProtectedRoute({ children }) {
  // This component acts like a gatekeeper.
  // If the user is not authenticated (no valid token),
  // we immediately redirect them to the login page

  if (!isAuthed()) 
    // "replace" prevents users from going back
    // to the protected page using the browser back button.
    return <Navigate to="/login" replace />;
    
  // If authenticated, render the protected content.
  return children;
}