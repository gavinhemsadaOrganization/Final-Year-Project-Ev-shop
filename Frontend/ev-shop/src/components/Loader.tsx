import React from "react";
import { PulseLoader } from "react-spinners";

interface LoaderProps {
  size: number;          // spinner size in pixels
  color?: string;         // spinner color
  speedMultiplier?: number; // speed factor
  className?: string;     // optional wrapper class
  loading?: boolean;      // show/hide control
}

const Loader: React.FC<LoaderProps> = ({
  size ,
  color ,        // default: Tailwind blue-600
  speedMultiplier = 1,
  className ,
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

export default Loader;
