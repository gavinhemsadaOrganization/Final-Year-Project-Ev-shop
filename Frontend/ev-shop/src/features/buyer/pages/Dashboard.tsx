import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// This component assumes Tailwind CSS is configured in your project.

// --- Type Definitions ---

type IconProps = { className?: string };

type User = {
  name: string;
  email: string;
  avatar: string;
};

type Vehicle = {
  id: number;
  name: string;
  model: string;
  price: string;
  range: string;
  image: string;
  topSpeed: string;
};

type Service = {
  name: string;
  desc: string;
};

type Order = {
  id: string;
  date: string;
  vehicle: string;
  status: "Delivered" | "Processing" | "Cancelled";
  total: string;
};

type Notification = {
  id: number;
  message: string;
  time: string;
};

type ChatMessage = {
  id: number;
  text: string;
  sender: "user" | "bot";
};

type UserRole = "user" | "seller";
type ActiveTab = "dashboard" | "orders" | "profile" | "saved" | "services";

// --- Helper Components & Icons ---

const SearchIcon: React.FC<IconProps> = ({ className }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);

const BellIcon: React.FC<IconProps> = ({ className }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
    <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
  </svg>
);

const ShoppingCartIcon: React.FC<IconProps> = ({ className }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="9" cy="21" r="1"></circle>
    <circle cx="20" cy="21" r="1"></circle>
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
  </svg>
);

const UserIcon: React.FC<IconProps> = ({ className }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

const CarIcon: React.FC<IconProps> = ({ className }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M14 16.5V14a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2.5"></path>
    <path d="M20 10h-2V7.5a2.5 2.5 0 0 0-5 0V10H4V7.5a2.5 2.5 0 0 1 5 0V10h6V7.5a2.5 2.5 0 0 0-5 0V10"></path>
    <path d="M3 16.5h18"></path>
    <path d="M5 19a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm14 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"></path>
  </svg>
);

const HeartIcon: React.FC<IconProps> = ({ className }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
  </svg>
);

const SettingsIcon: React.FC<IconProps> = ({ className }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 0 2l-.15.08a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1 0-2l.15-.08a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
    <circle cx="12" cy="12" r="3"></circle>
  </svg>
);

const LogoutIcon: React.FC<IconProps> = ({ className }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
    <polyline points="16 17 21 12 16 7"></polyline>
    <line x1="21" y1="12" x2="9" y2="12"></line>
  </svg>
);

const ChatBubbleIcon: React.FC<IconProps> = ({ className }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
  </svg>
);

const CloseIcon: React.FC<IconProps> = ({ className }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

const SendIcon: React.FC<IconProps> = ({ className }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="22" y1="2" x2="11" y2="13"></line>
    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
  </svg>
);

const SwitchIcon: React.FC<IconProps> = ({ className }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="15 3 21 3 21 9"></polyline>
    <polyline points="9 21 3 21 3 15"></polyline>
    <line x1="21" y1="3" x2="14" y2="10"></line>
    <line x1="3" y1="21" x2="10" y2="14"></line>
  </svg>
);

// --- Mock Data ---
const user: User = {
  name: "Kasun Sampath",
  email: "kasun@example.com",
  avatar: "https://placehold.co/100x100/E2E8F0/4A5568?text=KS",
};

const vehicles: Vehicle[] = [
  {
    id: 1,
    name: "Aura EV",
    model: "Sedan",
    price: "LKR 12,500,000",
    range: "450 km",
    image: "https://placehold.co/600x400/3498db/ffffff?text=Aura+EV",
    topSpeed: "180 km/h",
  },
  {
    id: 2,
    name: "Pulse XR",
    model: "SUV",
    price: "LKR 18,000,000",
    range: "550 km",
    image: "https://placehold.co/600x400/2ecc71/ffffff?text=Pulse+XR",
    topSpeed: "200 km/h",
  },
  {
    id: 3,
    name: "City Spark",
    model: "Hatchback",
    price: "LKR 9,800,000",
    range: "350 km",
    image: "https://placehold.co/600x400/e74c3c/ffffff?text=City+Spark",
    topSpeed: "160 km/h",
  },
  {
    id: 4,
    name: "Terra Rover",
    model: "Off-road",
    price: "LKR 22,000,000",
    range: "600 km",
    image: "https://placehold.co/600x400/f39c12/ffffff?text=Terra+Rover",
    topSpeed: "190 km/h",
  },
  {
    id: 5,
    name: "Eco Wagon",
    model: "Van",
    price: "LKR 15,200,000",
    range: "480 km",
    image: "https://placehold.co/600x400/9b59b6/ffffff?text=Eco+Wagon",
    topSpeed: "170 km/h",
  },
  {
    id: 6,
    name: "Velocity S",
    model: "Sports",
    price: "LKR 28,500,000",
    range: "520 km",
    image: "https://placehold.co/600x400/1abc9c/ffffff?text=Velocity+S",
    topSpeed: "250 km/h",
  },
];

const services: Service[] = [
  {
    name: "Standard Maintenance",
    desc: "Comprehensive check-up and battery health report.",
  },
  { name: "Tire Service", desc: "Rotation, alignment, and replacement." },
  {
    name: "Software Update",
    desc: "Get the latest features and performance improvements.",
  },
];

const orders: Order[] = [
  {
    id: "ORD-2025-007",
    date: "2025-10-05",
    vehicle: "Pulse XR",
    status: "Delivered",
    total: "LKR 18,000,000",
  },
  {
    id: "ORD-2025-008",
    date: "2025-10-11",
    vehicle: "Charging Cable",
    status: "Processing",
    total: "LKR 25,000",
  },
  {
    id: "ORD-2025-009",
    date: "2025-09-20",
    vehicle: "Aura EV",
    status: "Cancelled",
    total: "LKR 12,500,000",
  },
];

const notifications: Notification[] = [
  {
    id: 1,
    message: "Your test drive for Aura EV is confirmed for Oct 15.",
    time: "2 hours ago",
  },
  {
    id: 2,
    message: "New accessory added: All-weather floor mats.",
    time: "1 day ago",
  },
];

// --- Main Dashboard Component ---

const App: React.FC = () => {
  const [userRole, setUserRole] = useState<UserRole>("user");
  const [activeTab, setActiveTab] = useState<ActiveTab>("dashboard");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      text: "Hello! I'm the EV-Shop assistant. How can I help you today?",
      sender: "bot",
    },
  ]);
 useEffect(() => {
  // Disable back button by pushing state and listening to popstate
  const state = { page: "dashboard" };
  window.history.pushState(state, "", window.location.href);

  const handleBackButton = (event: PopStateEvent) => {
    // When back is clicked, push the state again to prevent going back
    window.history.pushState(state, "", window.location.href);
  };

  window.addEventListener("popstate", handleBackButton);

  // Cleanup
  return () => {
    window.removeEventListener("popstate", handleBackButton);
  };
}, []);
  const filteredVehicles = vehicles.filter(
    (vehicle) =>
      vehicle.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.model.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRoleSwitch = () => {
    const newRole = userRole === "user" ? "seller" : "user";
    setUserRole(newRole);
    // If switching back to user, ensure a valid tab is active
    if (newRole === "user") {
      setActiveTab("dashboard");
    }
  };

  const handleSendMessage = (text: string) => {
    const newUserMessage: ChatMessage = {
      id: Date.now(),
      text,
      sender: "user",
    };
    setMessages((prev) => [...prev, newUserMessage]);

    setTimeout(() => {
      const botResponse: ChatMessage = {
        id: Date.now() + 1,
        text: "Thanks for your message! A specialist will get back to you shortly.",
        sender: "bot",
      };
      setMessages((prev) => [...prev, botResponse]);
    }, 1500);
  };

  const renderContent = () => {
    if (userRole === "seller") {
      return <SellerComingSoon onSwitchBack={handleRoleSwitch} />;
    }

    switch (activeTab) {
      case "dashboard":
        return <VehicleList vehicles={filteredVehicles} />;
      case "orders":
        return <OrderHistory />;
      case "profile":
        return <UserProfile />;
      case "services":
        return <Services />;
      case "saved":
        return <SavedVehicles />;
      default:
        return <VehicleList vehicles={filteredVehicles} />;
    }
  };

  return (
    <>
      <style>{`
                body { font-family: 'Inter', sans-serif; background-color: #f3f4f6; }
                @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
                .animate-fadeIn { animation: fadeIn 0.4s ease-out forwards; }
                
                @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
                .animate-fadeInUp { animation: fadeInUp 0.5s ease-out forwards; }

                @keyframes slideInUp { from { transform: translateY(100%); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
                .animate-slideInUp { animation: slideInUp 0.3s ease-out forwards; }

                @keyframes popIn { from { transform: scale(0.5); opacity: 0; } to { transform: scale(1); opacity: 1; } }
                .animate-popIn { animation: popIn 0.3s ease-out forwards; }
            `}</style>
      <div className="flex h-screen bg-gray-100 text-gray-800">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        <div className="flex-1 flex flex-col overflow-hidden">
          <Header
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            userRole={userRole}
            onRoleSwitch={handleRoleSwitch}
          />

          <main className="flex-1 overflow-y-auto p-6 md:p-8">
            <div key={activeTab + userRole} className="animate-fadeIn">
              {renderContent()}
            </div>
          </main>
        </div>
      </div>

      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsChatOpen(!isChatOpen)}
          className="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-all transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          {isChatOpen ? (
            <CloseIcon className="h-6 w-6" />
          ) : (
            <ChatBubbleIcon className="h-6 w-6" />
          )}
        </button>
      </div>

      {isChatOpen && (
        <Chatbot
          onClose={() => setIsChatOpen(false)}
          messages={messages}
          onSendMessage={handleSendMessage}
        />
      )}
    </>
  );
};

// --- Sub Components ---

type SidebarProps = {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
};

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => (
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

type HeaderProps = {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  userRole: UserRole;
  onRoleSwitch: () => void;
};

const Header: React.FC<HeaderProps> = ({
  searchTerm,
  setSearchTerm,
  userRole,
  onRoleSwitch,
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
      <button className="relative text-gray-500 hover:text-gray-800 transition-colors">
        <BellIcon className="h-6 w-6" />
        <span className="absolute -top-2 -right-2 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center border-2 border-white">
          {notifications.length}
        </span>
      </button>
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

const VehicleList: React.FC<{ vehicles: Vehicle[] }> = ({ vehicles }) => (
  <div>
    <h1 className="text-3xl font-bold mb-8">Explore Our Vehicles</h1>
    {vehicles.length > 0 ? (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {vehicles.map((v, index) => (
          <VehicleCard
            key={v.id}
            vehicle={v}
            style={{ animationDelay: `${index * 80}ms` }}
            className="opacity-0 animate-fadeInUp"
          />
        ))}
      </div>
    ) : (
      <div className="text-center py-16 bg-white rounded-lg shadow-sm">
        <h2 className="text-2xl font-semibold text-gray-700">
          No Vehicles Found
        </h2>
        <p className="text-gray-500 mt-2">Try adjusting your search term.</p>
      </div>
    )}
  </div>
);

const VehicleCard: React.FC<{
  vehicle: Vehicle;
  className?: string;
  style?: React.CSSProperties;
}> = ({ vehicle, className, style }) => (
  <div
    className={`bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${className}`}
    style={style}
  >
    <img
      className="h-56 w-full object-cover"
      src={vehicle.image}
      alt={vehicle.name}
    />
    <div className="p-6">
      <div className="flex justify-between items-start">
        <div>
          <div className="uppercase tracking-wide text-sm text-blue-600 font-bold">
            {vehicle.model}
          </div>
          <a
            href="#"
            className="block mt-1 text-xl leading-tight font-semibold text-gray-900 hover:underline"
          >
            {vehicle.name}
          </a>
        </div>
        <button className="text-gray-400 hover:text-red-500 p-2 -mr-2 -mt-2 transition-colors">
          <HeartIcon className="h-6 w-6" />
        </button>
      </div>
      <p className="mt-2 text-2xl font-light text-gray-800">{vehicle.price}</p>
      <div className="mt-4 flex justify-between text-sm text-gray-600">
        <span>
          <strong>Range:</strong> {vehicle.range}
        </span>
        <span>
          <strong>Top Speed:</strong> {vehicle.topSpeed}
        </span>
      </div>
      <div className="mt-6">
        <button className="w-full bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
          Book a Test Drive
        </button>
      </div>
    </div>
  </div>
);

const getStatusChip = (status: Order["status"]) => {
  switch (status) {
    case "Delivered":
      return "bg-green-100 text-green-800";
    case "Processing":
      return "bg-yellow-100 text-yellow-800";
    case "Cancelled":
      return "bg-red-100 text-red-800";
  }
};

const OrderHistory: React.FC = () => (
  <div className="bg-white p-8 rounded-xl shadow-md">
    <h1 className="text-3xl font-bold mb-6">My Orders</h1>
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Order ID
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Item
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Total
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {orders.map((order) => (
            <tr key={order.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {order.id}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {order.date}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {order.vehicle}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                <span
                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusChip(
                    order.status
                  )}`}
                >
                  {order.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-600">
                {order.total}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const UserProfile: React.FC = () => (
  <div className="bg-white p-8 rounded-xl shadow-md max-w-2xl mx-auto">
    <h1 className="text-3xl font-bold mb-6">My Profile</h1>
    <div className="flex items-center space-x-6">
      <img
        src={user.avatar}
        alt="User Avatar"
        className="h-24 w-24 rounded-full object-cover"
      />
      <div>
        <h2 className="text-2xl font-semibold">{user.name}</h2>
        <p className="text-gray-500">{user.email}</p>
      </div>
    </div>
    <div className="mt-8 space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Full Name
        </label>
        <input
          type="text"
          defaultValue={user.name}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Email Address
        </label>
        <input
          type="email"
          defaultValue={user.email}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Change Password
        </label>
        <input
          type="password"
          placeholder="New Password"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
      </div>
      <div className="pt-4">
        <button className="w-full bg-blue-600 text-white font-semibold py-2.5 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-300 transform hover:scale-105">
          Update Profile
        </button>
      </div>
    </div>
  </div>
);

const Services: React.FC = () => (
  <div className="bg-white p-8 rounded-xl shadow-md">
    <h1 className="text-3xl font-bold mb-6">Our Services</h1>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {services.map((service) => (
        <div
          key={service.name}
          className="border border-gray-200 p-6 rounded-lg hover:shadow-lg hover:border-blue-300 transition-all duration-300"
        >
          <h3 className="text-xl font-semibold">{service.name}</h3>
          <p className="text-gray-600 mt-2">{service.desc}</p>
          <button className="mt-4 text-blue-600 font-semibold hover:underline">
            Learn More
          </button>
        </div>
      ))}
      <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg md:col-span-2 hover:shadow-lg transition-shadow duration-300">
        <h3 className="text-xl font-semibold text-blue-800">
          Charging Station Locator
        </h3>
        <p className="text-blue-700 mt-2">
          Find charging stations near you or along your route. Our network is
          always growing.
        </p>
        <button className="mt-4 bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-300 transform hover:scale-105">
          Find a Charger
        </button>
      </div>
    </div>
  </div>
);

const SavedVehicles: React.FC = () => (
  <div className="bg-white p-8 rounded-xl shadow-md">
    <h1 className="text-3xl font-bold mb-6">Saved Vehicles</h1>
    <div className="text-center py-16">
      <HeartIcon className="mx-auto h-12 w-12 text-gray-400" />
      <h2 className="mt-4 text-2xl font-semibold text-gray-700">
        No Saved Vehicles
      </h2>
      <p className="text-gray-500 mt-2">
        Click the heart icon on a vehicle to save it here.
      </p>
    </div>
  </div>
);
// --- Seller View Placeholder ---
const SellerComingSoon: React.FC<{ onSwitchBack: () => void }> = ({
  onSwitchBack,
}) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white p-8 rounded-xl shadow-md text-center flex flex-col items-center justify-center h-full">
      <h1 className="text-3xl font-bold mb-4">Seller Dashboard</h1>
      <p className="text-gray-600 mb-6 max-w-md">
        You are currently in the buyer view. Click below to go to your seller
        dashboard.
      </p>
      <button
        onClick={() => navigate("/seller/dashboard")}
        className="bg-indigo-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-indigo-700 transition-colors duration-300 flex items-center gap-2"
      >
        <SwitchIcon className="h-5 w-5" />
        Go to Seller Dashboard
      </button>
    </div>
  );
};

// --- Chatbot Component ---

type ChatbotProps = {
  onClose: () => void;
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
};

const Chatbot: React.FC<ChatbotProps> = ({
  onClose,
  messages,
  onSendMessage,
}) => {
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onSendMessage(inputValue.trim());
      setInputValue("");
    }
  };

  return (
    <div className="fixed bottom-24 right-6 w-80 h-[28rem] bg-white rounded-xl shadow-2xl flex flex-col z-40 animate-slideInUp">
      <header className="bg-blue-600 text-white p-4 flex justify-between items-center rounded-t-xl">
        <h3 className="font-bold text-lg">EV-Shop Assistant</h3>
        <button
          onClick={onClose}
          className="hover:bg-blue-700 p-1 rounded-full"
        >
          <CloseIcon className="h-5 w-5" />
        </button>
      </header>
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-end gap-2 ${
                msg.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {msg.sender === "bot" && (
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold flex-shrink-0">
                  E
                </div>
              )}
              <div
                className={`max-w-[80%] p-3 rounded-2xl animate-popIn ${
                  msg.sender === "user"
                    ? "bg-blue-500 text-white rounded-br-none"
                    : "bg-gray-200 text-gray-800 rounded-bl-none"
                }`}
              >
                <p className="text-sm">{msg.text}</p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>
      <footer className="p-2 border-t border-gray-200">
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 w-full px-4 py-2 bg-gray-100 border border-transparent rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white p-2.5 rounded-full hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <SendIcon className="h-5 w-5" />
          </button>
        </form>
      </footer>
    </div>
  );
};

export default App;
