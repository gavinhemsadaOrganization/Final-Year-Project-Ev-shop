import {
  CarIcon,
  ShoppingCartIcon,
  UserIcon,
  HeartIcon,
  SettingsIcon,
  LogoutIcon,
  BellIcon
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
};

/**
 * A responsive sidebar navigation component for the buyer dashboard.
 * It displays navigation links and a logo, collapsing to an icon-only view on smaller screens.
 */
export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => (
  // Main container for the sidebar. It's responsive, starting narrow and expanding on medium screens.
  <aside className="w-16 md:w-64 flex-shrink-0 bg-white border-r border-gray-200 flex flex-col transition-all duration-300">
    {/* Sidebar Header/Logo */}
    <div className="h-16 flex items-center justify-center border-b border-gray-200">
      <CarIcon className="h-8 w-8 text-blue-600" />
      {/* The brand name is hidden on small screens and appears on medium screens and up. */}
      <span className="hidden md:inline ml-2 text-xl font-bold">EV-Shop</span>
    </div>
    {/* Main navigation links */}
    <nav className="flex-1 px-2 md:px-4 py-6 space-y-2">
      {/* Each SidebarLink is a navigation item. The 'active' prop highlights the current tab. */}
      <SidebarLink
        text="Dashboard"
        icon={<CarIcon className="h-5 w-5" />}
        active={activeTab === "dashboard"}
        onClick={() => setActiveTab("dashboard")}
      />
      <SidebarLink
        text="My Orders"
        icon={<ShoppingCartIcon className="h-5 w-5" />}
        active={activeTab === "orders"}
        onClick={() => setActiveTab("orders")}
      />
      <SidebarLink
        text="My Profile"
        icon={<UserIcon className="h-5 w-5" />}
        active={activeTab === "profile"}
        onClick={() => setActiveTab("profile")}
      />
      <SidebarLink
        text="Saved Vehicles"
        icon={<HeartIcon className="h-5 w-5" />}
        active={activeTab === "saved"}
        onClick={() => setActiveTab("saved")}
      />
      <SidebarLink
        text="Services"
        icon={<SettingsIcon className="h-5 w-5" />}
        active={activeTab === "services"}
        onClick={() => setActiveTab("services")}
      />
      <SidebarLink
        text="Notification"
        icon={<BellIcon className="h-5 w-5" />}
        active={activeTab === "notification"}
        onClick={() => setActiveTab("notification")}
      />
    </nav>
    {/* Sidebar Footer section, containing the logout button. */}
    <div className="px-2 md:px-4 py-4 border-t border-gray-200">
      <SidebarLink
        text="Logout"
        icon={<LogoutIcon className="h-5 w-5" />}
        // The onClick for logout currently shows an alert. This should be replaced with actual logout logic.
        onClick={() => alert("Logged out!")}
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
  onClick: () => void;
};

/**
 * A reusable link component for the sidebar.
 * It handles its own active state styling and click events.
 */
const SidebarLink: React.FC<SidebarLinkProps> = ({
  text,
  icon,
  active,
  onClick,
}) => (
  // Using an anchor tag for semantic correctness, but preventing default navigation.
  <a
    href="#"
    onClick={(e) => {
      // Prevent the browser from following the href, as navigation is handled by React state.
      e.preventDefault();
      onClick();
    }}
    // Dynamically applies classes for active vs. inactive states and hover effects.
    className={`flex items-center justify-center md:justify-start px-2 md:px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group ${
      active
        ? "bg-blue-50 text-blue-600"
        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
    }`}
  >
    {icon}
    {/* The text label is hidden by default and becomes visible on medium screens and up. */}
    <span className="hidden md:inline ml-3 whitespace-nowrap">{text}</span>
  </a>
);