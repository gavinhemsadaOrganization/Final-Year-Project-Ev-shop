import React from "react";
import { PulseLoader } from "react-spinners";

interface LoaderProps {
  size: number; // spinner size in pixels
  color?: string; // spinner color
  speedMultiplier?: number; // speed factor
  className?: string; // optional wrapper class
  loading?: boolean; // show/hide control
}

export const Loader: React.FC<LoaderProps> = ({
  size,
  color,
  speedMultiplier = 1,
  className,
  loading = true,
}) => {
  return (
    <div
      className={`flex items-center justify-center ${className}`}
      style={{ width: size * 2, height: size * 2 }}
    >
      <PulseLoader
        color={color}
        size={size}
        speedMultiplier={speedMultiplier}
        loading={loading}
      />
    </div>
  );
};

export const PageLoader: React.FC = () => (
  <div className="flex items-center justify-center min-h-screen">
      <div className="relative w-20 h-20">
        {/* Outer rotating circle */}
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-green-500 border-r-green-500 animate-spin"></div>
        
        {/* Inner circle segments */}
        <div className="absolute inset-2 rounded-full border-4 border-transparent border-t-green-500 border-r-green-500 opacity-60 animate-spin" style={{ animationDuration: '1.5s', animationDirection: 'reverse' }}></div>
        
        {/* Center lightning bolt icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <svg 
            className="w-12 h-12 text-gray-700 dark:text-white" 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            fill="currentColor"
          >
            <path d="M13 2L3 14h8l-1 8 10-12h-8l1-8z" />
          </svg>
        </div>
      </div>
    </div>
);
