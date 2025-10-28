import React, { useState, useRef, useEffect } from "react";
import {
  ChevronDownIcon,
  UserCircleIcon,
  QuestionMarkCircleIcon,
  LogoutIcon,
} from "@/assets/icons/icons";
import type { ActiveTab } from "@/types";

export const ProfileDropdown: React.FC<{
  user: any;
  onLogout: () => void;
  setActiveTab: (tab: ActiveTab) => void;
}> = ({ user, onLogout, setActiveTab }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  const handleDropdownItemClick = (action: "profile" | "help" | "logout") => {
    setIsDropdownOpen(false); // Close dropdown on click
    switch (action) {
      case "profile":
        setActiveTab("profile");
        break;
      case "help":
        // Add your help logic here (e.g., open modal, navigate to /help)
        console.log("Help clicked");
        break;
      case "logout":
        onLogout();
        break;
    }
  };
  return (
    <div className="relative" ref={dropdownRef}>
      {/* This is the button that toggles the dropdown */}
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex items-center space-x-2 rounded-full p-1 transition-colors"
      >
        {/* This is your user snippet */}
        <div className="flex items-center space-x-2">
          <img
            src={user.avatar}
            alt="User Avatar"
            className="h-9 w-9 sm:h-10 sm:w-10 rounded-full object-cover"
          />
          <div className="hidden md:block text-left">
            <p className="font-semibold text-sm truncate max-w-[150px]">
              {user.name}
            </p>
            <p className="text-xs text-gray-500 truncate max-w-[150px]">
              {user.email}
            </p>
          </div>
        </div>

        {/* End of your user snippet */}
        <ChevronDownIcon
          className={`h-4 w-4 text-gray-800 transition-transform ${
            isDropdownOpen ? "rotate-180" : "rotate-0"
          }`}
        />
      </button>

      {/* --- The Dropdown Menu --- */}
      {isDropdownOpen && (
        <div className="animate-popIn absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg py-2 z-50 ring-1 ring-gray-300 ring-opacity-5">
          <button
            onClick={() => handleDropdownItemClick("profile")}
            className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-3"
          >
            <UserCircleIcon className="h-5 w-5 text-gray-500" />
            User Profile
          </button>
          <button
            onClick={() => handleDropdownItemClick("help")}
            className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-3"
          >
            <QuestionMarkCircleIcon className="h-5 w-5 text-gray-500" />
            Help Center
          </button>
          <div className="border-t border-gray-100 my-1"></div>
          <button
            onClick={() => handleDropdownItemClick("logout")}
            className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-3"
          >
            <LogoutIcon className="h-5 w-5" />
            Logout
          </button>
        </div>
      )}
    </div>
  );
};
