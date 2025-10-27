import {
  ShoppingCartIcon,
  SearchIcon,
  SwitchIcon,
} from "@/assets/icons/icons";
import { NotificationDropdown } from "./NotificationDropdown";
import type {UserRole,ActiveTab } from "@/types";
type HeaderProps = {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  userRole: UserRole;
  onRoleSwitch: () => void;
  user: any,
  notifications: any,
  setActiveTab: (tab: ActiveTab) => void;
};

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
    <div className="flex items-center space-x-3 md:space-x-5">
      <button
        onClick={onRoleSwitch}
        className="hidden sm:flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-blue-600 p-2 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <SwitchIcon className="h-5 w-5" />
        <span className="whitespace-nowrap">
          Switch to {userRole === "user" ? "Seller" : "Buyer"} View
        </span>
      </button>
      <button className="relative text-gray-500 hover:text-gray-800 transition-colors">
        <ShoppingCartIcon className="h-6 w-6" />
        <span className="absolute -top-2 -right-2 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center border-2 border-white">
          2
        </span>
      </button>
      <NotificationDropdown notifications={notifications} setActiveTab={setActiveTab} />
      <div className="flex items-center space-x-3">
        <img
          src={user.avatar}
          alt="User Avatar"
          className="h-10 w-10 rounded-full object-cover"
        />
        <div className="hidden lg:block">
          <p className="font-semibold text-sm">{user.name}</p>
          <p className="text-xs text-gray-500">{user.email}</p>
        </div>
      </div>
    </div>
  </header>
);