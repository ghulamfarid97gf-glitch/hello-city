import React from "react";

const ProtectedRoute = ({ children }) => {
  // This component is now mainly for future extensibility
  // The main authentication logic is handled at the App level
  // But you can add additional route-specific logic here if needed
  return <>{children}</>;
};

export default ProtectedRoute;
