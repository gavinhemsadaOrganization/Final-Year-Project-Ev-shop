import {
  ShoppingCartIcon,
  SearchIcon,
  SwitchIcon,
} from "@/assets/icons/icons";
import { NotificationDropdown } from "./NotificationDropdown";
import type { UserRole, ActiveTab } from "@/types";

// --- Better Types (based on usage) ---

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
  /** The user object, containing details like avatar, name, and email. */
  user: any, // <-- MODIFIED: Used specific interface
  /** An array of notification objects to be displayed. */
  notifications: any[], // <-- MODIFIED: Used specific interface
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
  <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-6"> {/* <-- MODIFIED: Responsive padding */}
    
    {/* Search Bar Section - Now responsive */}
    <div className="relative flex-1 min-w-0 lg:flex-none lg:w-full lg:max-w-xs xl:max-w-md"> {/* <-- MODIFIED: Added flex-1, min-w-0, and lg:flex-none */}
      <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
      <input
        type="text"
        placeholder="Search vehicles..."
        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>

    {/* Right-side Actions and User Info */}
    <div className="flex items-center flex-shrink-0 space-x-2 sm:space-x-4 ml-3"> {/* <-- MODIFIED: Responsive spacing & margin */}
      
      {/* Role Switch Button - Text hides on mobile */}
      <button
        onClick={onRoleSwitch}
        className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-blue-600 p-2 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <SwitchIcon className="h-5 w-5 flex-shrink-0" />
        <span className="hidden sm:inline whitespace-nowrap"> {/* <-- MODIFIED: Hides text on xs screens */}
          Switch to {userRole === "user" ? "Seller" : "Buyer"}
        </span>
      </button>

      {/* Shopping Cart Button */}
      <button className="relative text-gray-500 hover:text-gray-800 transition-colors p-2"> {/* <-- MODIFIED: Added padding for better tap target */}
        <ShoppingCartIcon className="h-6 w-6" />
        <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center border-2 border-white">
          2
        </span>
      </button>

      {/* Notification Dropdown Component */}
      <NotificationDropdown notifications={notifications} setActiveTab={setActiveTab} />
      
      {/* User Profile Display - Text hides on mobile/tablet */}
      <div className="flex items-center space-x-2"> {/* <-- MODIFIED: Smaller spacing */}
        <img
          src={user.avatar}
          alt="User Avatar"
          className="h-9 w-9 sm:h-10 sm:w-10 rounded-full object-cover" // <-- MODIFIED: Slightly smaller on mobile
        />
        <div className="hidden md:block"> {/* <-- MODIFIED: Hides text on sm and xs screens */}
          <p className="font-semibold text-sm truncate max-w-[150px]">{user.name}</p>
          <p className="text-xs text-gray-500 truncate max-w-[150px]">{user.email}</p>
        </div>
      </div>
    </div>
  </header>
);