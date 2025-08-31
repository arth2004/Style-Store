import React from "react";

const Loader = ({
  fullScreen = false,
  showImage = false,
  spinnerSize = "h-16 w-16",
  spinnerBorder = "border-4",
  overlayBg = "bg-black/50",
  className = "",
  label = "Loading...",
  showProgress = false,
  progress = 0,
}) => {
  const containerClasses = fullScreen
    ? `fixed inset-0 z-50 flex flex-col items-center justify-center ${overlayBg} backdrop-blur-sm`
    : `flex flex-col items-center justify-center ${className}`;

  return (
    <div role="status" aria-live="polite" className={containerClasses}>
      {showImage ? (
        <div className="relative">
          <img
            src="https://www.svgrepo.com/show/509001/avatar-thinking-9.svg"
            alt={label}
            loading="lazy"
            className={`rounded-full ${spinnerSize} animate-bounce`}
          />
          <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-emerald-500 rounded-full animate-ping" />
        </div>
      ) : (
        <div className="relative">
          <div
            className={`rounded-full ${spinnerSize} ${spinnerBorder} border-t-transparent border-emerald-500 animate-spin`}
            aria-hidden="true"
          />
          <div
            className={`absolute inset-0 rounded-full ${spinnerSize} ${spinnerBorder} border-t-transparent border-emerald-300 animate-ping opacity-20`}
            aria-hidden="true"
          />
        </div>
      )}

      {label && (
        <div className="mt-4 text-lg font-medium text-emerald-600">{label}</div>
      )}

      {showProgress && (
        <div className="w-64 mt-4">
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="h-2.5 rounded-full bg-emerald-500 transition-all duration-300 ease-out"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
          <div className="text-center mt-2 text-sm text-emerald-600">
            {Math.round(progress)}%
          </div>
        </div>
      )}

      <span className="sr-only">{label}</span>
    </div>
  );
};

export default Loader;
