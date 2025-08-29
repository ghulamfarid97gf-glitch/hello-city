// Reusable Loading component
import React from "react";

const Loading = ({
  size = "medium",
  text = "Loading...",
  overlay = false,
  className = "",
}) => {
  const sizeClasses = {
    small: "w-4 h-4",
    medium: "w-8 h-8",
    large: "w-12 h-12",
  };

  const LoadingSpinner = () => (
    <div
      className={`animate-spin rounded-full border-2 border-gray-300 border-t-blue-600 ${sizeClasses[size]}`}
    />
  );

  const LoadingContent = () => (
    <div
      className={`flex flex-col items-center justify-center gap-3 ${className}`}
    >
      <LoadingSpinner />
      {text && <p className="text-gray-600 text-sm">{text}</p>}
    </div>
  );

  if (overlay) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 shadow-lg">
          <LoadingContent />
        </div>
      </div>
    );
  }

  return <LoadingContent />;
};

// Inline loading spinner for buttons
export const ButtonSpinner = ({ size = "small" }) => (
  <div
    className={`animate-spin rounded-full border-2 border-white border-t-transparent ${
      size === "small" ? "w-4 h-4" : "w-5 h-5"
    }`}
  />
);

export default Loading;
