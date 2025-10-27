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

type SidebarProps = {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
};

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => (
  <aside className="w-16 md:w-64 flex-shrink-0 bg-white border-r border-gray-200 flex flex-col transition-all duration-300">
    <div className="h-16 flex items-center justify-center border-b border-gray-200">
      <CarIcon className="h-8 w-8 text-blue-600" />
      <span className="hidden md:inline ml-2 text-xl font-bold">EV-Shop</span>
    </div>
    <nav className="flex-1 px-2 md:px-4 py-6 space-y-2">
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
    <div className="px-2 md:px-4 py-4 border-t border-gray-200">
      <SidebarLink
        text="Logout"
        icon={<LogoutIcon className="h-5 w-5" />}
        onClick={() => alert("Logged out!")}
      />
    </div>
  </aside>
);

type SidebarLinkProps = {
  text: string;
  icon: React.ReactNode;
  active?: boolean;
  onClick: () => void;
};

const SidebarLink: React.FC<SidebarLinkProps> = ({
  text,
  icon,
  active,
  onClick,
}) => (
  <a
    href="#"
    onClick={(e) => {
      e.preventDefault();
      onClick();
    }}
    className={`flex items-center justify-center md:justify-start px-2 md:px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group ${
      active
        ? "bg-blue-50 text-blue-600"
        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
    }`}
  >
    {icon}
    <span className="hidden md:inline ml-3 whitespace-nowrap">{text}</span>
  </a>
);