import React, { useState, useRef, useEffect } from "react";
import { BellIcon } from "@/assets/icons/icons";
import type { ActiveTab, Notification } from "@/types";

/**
 * Props for the NotificationDropdown component.
 */
export type NotificationDropdownProps = {
  /** An array of notification objects to display. */
  notifications: Notification[];
  /** Callback function to set the active tab in the parent component. */
  setActiveTab: (tab: ActiveTab) => void;
};

/**
 * A dropdown component that displays a list of notifications.
 * It includes a bell icon that shows a badge with the number of unread notifications.
 * Clicking on a notification or the "View all" button navigates the user to the main notifications tab.
 */
export const NotificationDropdown: React.FC<NotificationDropdownProps> = ({
  notifications,
  setActiveTab,
}) => {
  // State to manage the visibility of the dropdown.
  const [isOpen, setIsOpen] = useState(false);
  // Ref to the dropdown's root element, used to detect clicks outside of it.
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Effect hook to add and remove a mousedown event listener.
  // This is used to close the dropdown when a user clicks outside of it.
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // If the dropdown is open and the click is outside the dropdown's DOM node, close it.
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    // Add the event listener when the component mounts.
    document.addEventListener("mousedown", handleClickOutside);
    // Clean up the event listener when the component unmounts.
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  /**
   * Handles the "View all notifications" action.
   * It closes the dropdown and sets the active tab to 'notification'.
   */
  const handleViewAll = () => {
    setIsOpen(false);
    setActiveTab("notification");
  };

  /**
   * Handles clicking on an individual notification.
   * It closes the dropdown and navigates to the 'notification' tab.
   */
  const handleView = () => {
    setIsOpen(false);
    setActiveTab("notification");
  };

  return (
    // The main container for the dropdown, with a ref for detecting outside clicks.
    <div className="relative" ref={dropdownRef}>
      {/* Notification bell icon button that toggles the dropdown's visibility. */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-full text-gray-500 hover:bg-gray-200 hover:text-greay-700 focus:outline-non"
      >
        <BellIcon className="h-6 w-6" />

        {/* Badge displaying the number of notifications. Only shown if there are notifications. */}
        {notifications.length > 0 && (
          <span className="absolute -top-0.5 right-0.5 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center border-2 border-white">
            {notifications.length}
          </span>
        )}
      </button>

      {/* The dropdown panel, conditionally rendered based on the `isOpen` state. */}
      {isOpen && (
        <div className="animate-popIn absolute right-0 mt-2 w-80 max-w-sm bg-white rounded-lg shadow-xl border border-gray-300 z-50">
          {/* Dropdown Header */}
          <div className="p-4 flex justify-between items-center border-b">
            <h3 className="font-bold text-lg">Notifications</h3>
          </div>

          {/* Scrollable list of notifications. */}
          <div className="flex flex-col max-h-96 overflow-y-auto">
            {/* Map over the notifications array to render each item. */}
            {notifications.map((notif) => (
              <div
                key={notif.id}
                className="p-4 border-b hover:bg-gray-50 cursor-pointer"
                onClick={handleView}
              >
                <p className="text-sm text-gray-700">{notif.message}</p>

                {/* Notification metadata and action link. */}
                <div className="flex items-center justify-between mt-1">
                  <p className="text-xs text-blue-600">{notif.time}</p>
                  <a
                    onClick={handleView}
                    className="text-sm font-semibold text-blue-600 hover:underline"
                  >
                    View details
                  </a>
                </div>
              </div>
            ))}

            {/* Message displayed when there are no notifications. */}
            {notifications.length === 0 && (
              <p className="p-4 text-sm text-gray-500 text-center">
                You have no new notifications.
              </p>
            )}
          </div>

          {/* Dropdown Footer with a "View all" button. */}
          <div className="p-2 bg-gray-50 rounded-b-lg">
            <button
              onClick={handleViewAll}
              className="w-full py-2 text-sm font-semibold text-blue-600 hover:bg-gray-100 rounded"
            >
              View all notifications
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
