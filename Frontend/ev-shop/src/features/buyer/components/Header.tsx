import { ArrowUpCircle } from "lucide-react";
import { ShoppingCartIcon, SearchIcon, SwitchIcon } from "@/assets/icons/icons";
import { NotificationDropdown } from "./NotificationDropdown";
import type { UserRole, ActiveTab } from "@/types";
import { ProfileDropdown } from "./ProfileDropdown";

type HeaderProps = {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  userRole: UserRole[];
  user: any;
  notifications: any[];
  setActiveTab: (tab: ActiveTab) => void;
  onLogout: () => void;
  onBecomeSellerClick: () => void;
  onBecomeFinancerClick: () => void;
};

export const Header: React.FC<HeaderProps> = ({
  searchTerm,
  setSearchTerm,
  userRole,
  user,
  notifications,
  setActiveTab,
  onLogout,
  onBecomeSellerClick,
  onBecomeFinancerClick,
}) => {
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-6 dark:bg-gray-800 dark:border-gray-700">
      {/* Search Bar */}
      <div className="relative flex-1 min-w-0 lg:flex-none lg:w-full lg:max-w-xs xl:max-w-md">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search vehicles..."
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Right Actions */}
      <div className="flex items-center flex-shrink-0 space-x-3 ml-3">
        {/* Show "become" buttons only if user doesn't have that role */}
        {!userRole.includes("seller") ? (
          <button
            onClick={onBecomeSellerClick}
            className="flex items-center gap-2 px-4 py-2 
      bg-blue-600 text-white text-sm font-medium rounded-full 
      hover:bg-blue-700 active:scale-95 transition-all duration-200 shadow-sm
      dark:bg-blue-500 dark:hover:bg-blue-400"
            title="Become a Seller"
          >
            <ArrowUpCircle className="h-4 w-4 flex-shrink-0" />
            <span className="hidden md:inline whitespace-nowrap">
              Become a Seller
            </span>
          </button>
        ) : (
          <button
            onClick={() => {}}
            className="flex items-center gap-2 px-4 py-2 
      bg-gray-200 text-gray-900 text-sm font-medium rounded-full 
      hover:bg-gray-300 active:scale-95 transition-all duration-200 shadow-sm
      dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
            title="Switch to Seller"
          >
            <SwitchIcon className="h-4 w-4 flex-shrink-0" />
            <span className="hidden md:inline whitespace-nowrap">
              Switch to Seller
            </span>
          </button>
        )}

        {!userRole.includes("finance") ? (
          <button
            onClick={onBecomeFinancerClick}
            className="flex items-center gap-2 px-4 py-2 
      bg-blue-600 text-white text-sm font-medium rounded-full 
      hover:bg-blue-700 active:scale-95 transition-all duration-200 shadow-sm
      dark:bg-blue-500 dark:hover:bg-blue-400"
            title="Become a Financial Contributor"
          >
            <ArrowUpCircle className="h-4 w-4 flex-shrink-0" />
            <span className="hidden md:inline whitespace-nowrap">
              Become a Financial Contributor
            </span>
          </button>
        ) : (
          <button
            onClick={() => {}}
            className="flex items-center gap-2 px-4 py-2 
      bg-gray-200 text-gray-900 text-sm font-medium rounded-full 
      hover:bg-gray-300 active:scale-95 transition-all duration-200 shadow-sm
      dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
            title="Switch to Financial Contributor"
          >
            <SwitchIcon className="h-4 w-4 flex-shrink-0" />
            <span className="hidden md:inline whitespace-nowrap">
              Switch to Financial Contributor
            </span>
          </button>
        )}

        {/* Visual separator */}
        <div className="h-6 w-px bg-gray-300 hidden sm:block dark:bg-gray-600" />

        {/* Shopping Cart */}
        <button
          className="relative rounded-full text-gray-500 hover:bg-gray-200 hover:text-gray-700 focus:outline-none transition-colors p-2 dark:text-gray-400 dark:hover:bg-gray-500 dark:hover:text-gray-200"
          onClick={() => setActiveTab("cart")}
          title="Shopping Cart"
        >
          <ShoppingCartIcon className="h-5 w-5" />
          <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center border-2 border-white">
            2
          </span>
        </button>

        {/* Notifications */}
        <NotificationDropdown
          notifications={notifications}
          setActiveTab={setActiveTab}
        />

        {/* Profile */}
        <ProfileDropdown
          user={user}
          onLogout={onLogout}
          setActiveTab={setActiveTab}
        />
      </div>
    </header>
  );
};
