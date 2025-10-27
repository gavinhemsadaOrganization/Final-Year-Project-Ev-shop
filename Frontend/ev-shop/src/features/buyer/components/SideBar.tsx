import {
  CarIcon,
  ShoppingCartIcon,
  UserIcon,
  HeartIcon,
  SettingsIcon,
  LogoutIcon,
  BellIcon,
  // Chevron icons are no longer needed
} from "@/assets/icons/icons";
import type { ActiveTab } from "@/types";

/**
 * Props for the Sidebar component.
 */
type SidebarProps = {
  /** The currently active tab, which determines which link is highlighted. */
  activeTab: ActiveTab;
  /** Callback function to change the active tab in the parent component. */
  setActiveTab: (tab: ActiveTab) => void;
  /** Whether the sidebar is currently expanded. */
  isExpanded: boolean;
  /** Callback function to set the state to expanded. */
  onExpand: () => void; // <-- MODIFIED
  /** Callback function to set the state to collapsed. */
  onCollapse: () => void; // <-- MODIFIED
};

/**
 * A responsive sidebar navigation component for the buyer dashboard.
 * It displays navigation links and a logo, expanding on hover.
 */
export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  isExpanded,
  onExpand, // <-- MODIFIED
  onCollapse, // <-- MODIFIED
}) => (
  <aside
    className={`w-16 ${
      isExpanded ? "md:w-64" : "md:w-16"
    } flex-shrink-0 bg-white border-r border-gray-200 flex flex-col
       transition-all duration-300 relative`}
       
    // --- ADDED HOVER EVENTS ---
    onMouseEnter={onExpand}
    onMouseLeave={onCollapse}
    // --- END HOVER EVENTS ---
  >
    {/* --- Floating Toggle Button REMOVED --- */}

    {/* --- Logo (not a button) --- */}
    <div
      className={`h-16 w-full flex items-center border-b border-gray-200
                 px-2 md:px-4 transition-all duration-300
                 justify-center ${isExpanded ? "md:justify-start" : "md:justify-center"}`}
    >
      <CarIcon className="h-8 w-8 text-blue-600 flex-shrink-0" />
      <span
        className={`hidden ${
          isExpanded ? "md:inline" : "hidden"
        } ml-2 text-xl font-bold whitespace-nowrap`}
      >
        EV-Shop
      </span>
    </div>
    {/* --- END OF LOGO --- */}

    {/* Main navigation links */}
    <nav className="flex-1 px-2 md:px-4 py-6 space-y-2">
      <SidebarLink
        text="Dashboard"
        icon={<CarIcon className="h-5 w-5" />}
        active={activeTab === "dashboard"}
        onClick={() => setActiveTab("dashboard")}
        isExpanded={isExpanded}
      />
      <SidebarLink
        text="My Orders"
        icon={<ShoppingCartIcon className="h-5 w-5" />}
        active={activeTab === "orders"}
        onClick={() => setActiveTab("orders")}
        isExpanded={isExpanded}
      />
      <SidebarLink
        text="My Profile"
        icon={<UserIcon className="h-5 w-5" />}
        active={activeTab === "profile"}
        onClick={() => setActiveTab("profile")}
        isExpanded={isExpanded}
      />
      <SidebarLink
        text="Saved Vehicles"
        icon={<HeartIcon className="h-5 w-5" />}
        active={activeTab === "saved"}
        onClick={() => setActiveTab("saved")}
        isExpanded={isExpanded}
      />
      <SidebarLink
        text="Services"
        icon={<SettingsIcon className="h-5 w-5" />}
        active={activeTab === "services"}
        onClick={() => setActiveTab("services")}
        isExpanded={isExpanded}
      />
      <SidebarLink
        text="Notification"
        icon={<BellIcon className="h-5 w-5" />}
        active={activeTab === "notification"}
        onClick={() => setActiveTab("notification")}
        isExpanded={isExpanded}
      />
    </nav>

    {/* Sidebar Footer section */}
    <div className="px-2 md:px-4 py-4 border-t border-gray-200">
      <SidebarLink
        text="Logout"
        icon={<LogoutIcon className="h-5 w-5" />}
        onClick={() => alert("Logged out!")}
        isExpanded={isExpanded}
      />
    </div>
  </aside>
);
/**
 * Props for the SidebarLink component.
 */
type SidebarLinkProps = {
  /** The text label for the link, visible on medium screens and up. */
  text: string;
  /** The icon to display for the link. */
  icon: React.ReactNode;
  /** A boolean to indicate if the link is currently active, used for styling. */
  active?: boolean;
  /** The function to execute when the link is clicked. */
  onClick: () => void; // <-- THIS WAS THE TYPO, NOW FIXED
  /** Whether the parent sidebar is expanded. */
  isExpanded: boolean;
};

/**
 * A reusable link component for the sidebar.
 */
const SidebarLink: React.FC<SidebarLinkProps> = ({
  text,
  icon,
  active,
  onClick,
  isExpanded,
}) => (
  <a
    href="#"
    onClick={(e) => {
      e.preventDefault();
      onClick();
    }}
    aria-label={text}
    className={`group relative flex items-center justify-center ${
      isExpanded ? "md:justify-start" : "md:justify-center"
    } px-2 md:px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
      active
        ? "bg-blue-50 text-blue-600"
        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
    }`}
  >
    <div className="flex-shrink-0" aria-hidden="true">
      {icon}
    </div>

    {/* This is the text label that shows when expanded */}
    <span
      className={`hidden ${
        isExpanded ? "md:inline" : "hidden"
      } ml-3 whitespace-nowrap`}
    >
      {text}
    </span>

    {/* --- This is the Tooltip --- */}
    {/* This entire `<span>` is only rendered if `!isExpanded` (isExpanded is false).
        This is why tooltips correctly show ONLY when the sidebar is collapsed.
    */}
    {!isExpanded && (
      <span
        className="
          hidden md:block 
          absolute left-full top-1/2 -translate-y-1/2 ml-4 px-2 py-1 
          bg-gray-800 text-white text-xs font-medium rounded-md 
          opacity-0 invisible group-hover:opacity-100 group-hover:visible
          transition-all duration-200 
          z-50 whitespace-nowrap
        "
      >
        {text}
        {/* Optional: Add a small triangle for styling */}
        <span className="absolute -left-1 top-1/2 -translate-y-1/2 w-0 h-0 border-t-4 border-t-transparent border-b-4 border-b-transparent border-r-4 border-r-gray-800"></span>
      </span>
    )}
  </a>
);
