import React from "react";
import { PulseLoader } from "react-spinners";
import { motion } from "framer-motion";
import { Zap } from "lucide-react";

interface LoaderProps {
  size: number;          // spinner size in pixels
  color?: string;         // spinner color
  speedMultiplier?: number; // speed factor
  className?: string;     // optional wrapper class
  loading?: boolean;      // show/hide control
}

export const Loader: React.FC<LoaderProps> = ({
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

export const PageLoader: React.FC = () => (
  <div className="fixed inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-green-100 via-white to-blue-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 z-50">
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="flex flex-col items-center space-y-4"
    >
      {/* Icon */}
      <Zap className="w-10 h-10 text-blue-500 animate-pulse" />
    </motion.div>
  </div>
);
