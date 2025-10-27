import {
  ShoppingCartIcon,
  SearchIcon,
  SwitchIcon,
} from "@/assets/icons/icons";
import { NotificationDropdown } from "./NotificationDropdown";
import type {UserRole,ActiveTab } from "@/types";

/**
 * Props for the Header component.
 */
type HeaderProps = {
  /** The current value of the search input. */
  searchTerm: string;
  /** Callback function to update the search term state. */
  setSearchTerm: (term: string) => void;
  /** The current role of the user (e.g., 'user' or 'seller'). */
  userRole: UserRole;
  /** Callback function to handle the role switching action. */
  onRoleSwitch: () => void;
  /** The user object, containing details like avatar, name, and email. Note: 'any' should be replaced with a more specific User type. */
  user: any,
  /** An array of notification objects to be displayed. Note: 'any' should be replaced with a more specific Notification[] type. */
  notifications: any,
  /** Callback function to set the active tab in the parent component, used by the NotificationDropdown. */
  setActiveTab: (tab: ActiveTab) => void;
};

/**
 * Header component for the buyer dashboard.
 * It includes a search bar, role switch button, shopping cart, notification dropdown, and user profile display.
 */
export const Header: React.FC<HeaderProps> = ({
  searchTerm,
  setSearchTerm,
  userRole,
  onRoleSwitch,
  user,
  notifications,
  setActiveTab
}) => (
  <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
    {/* Search Bar Section */}
    <div className="relative w-full max-w-xs xl:max-w-md">
      <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
      <input
        type="text"
        placeholder="Search vehicles and models..."
        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>

    {/* Right-side Actions and User Info */}
    <div className="flex items-center space-x-3 md:space-x-5">
      {/* Role Switch Button */}
      <button
        onClick={onRoleSwitch}
        className="hidden sm:flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-blue-600 p-2 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <SwitchIcon className="h-5 w-5" />
        <span className="whitespace-nowrap">
          Switch to {userRole === "user" ? "Seller" : "Buyer"} View
        </span>
      </button>

      {/* Shopping Cart Button */}
      <button className="relative text-gray-500 hover:text-gray-800 transition-colors">
        <ShoppingCartIcon className="h-6 w-6" />
        {/* Hardcoded cart item count badge. This should be dynamic. */}
        <span className="absolute -top-2 -right-2 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center border-2 border-white">
          2
        </span>
      </button>

      {/* Notification Dropdown Component */}
      <NotificationDropdown notifications={notifications} setActiveTab={setActiveTab} />
      {/* User Profile Display */}
      <div className="flex items-center space-x-3">
        <img
          src={user.avatar}
          alt="User Avatar"
          className="h-10 w-10 rounded-full object-cover"
        />
        {/* User name and email, hidden on smaller screens */}
        <div className="hidden lg:block">
          <p className="font-semibold text-sm">{user.name}</p>
          <p className="text-xs text-gray-500">{user.email}</p>
        </div>
      </div>
    </div>
  </header>
);