import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CloseIcon, ChatBubbleIcon } from "@/assets/icons/icons";
import { Chatbot } from "../components/ChatBot";
import { Sidebar } from "../components/SideBar";
import { Header } from "../components/Header";
import { VehicleList } from "../components/VehicalList";
import type { Vehicle } from "@/types";
import { OrderHistory } from "./OrderHistoryPage";
import { UserProfile } from "./UserProfilePage";
import { Services } from "./ServicePage";
import { SavedVehicles } from "./SavedVehicalsPage";
import { NotificationPage } from "./NotificationPage";
import { CartPage } from "./CartPage";
import { MyReviewsPage } from "./MyReviewsPage";
import { TestDrivesPage } from "./TestDrivePage";

import type {
  UserRole,
  Notification,
  Order,
  User,
  Service,
  ActiveTab,
} from "@/types";
import { useAuth } from "@/context/AuthContext";

// --- Mock Data ------------
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
  const [userRole, setUserRole] = useState<UserRole[]>([]);
  const [activeTab, setActiveTab] = useState<ActiveTab>("dashboard");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);

  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const navigate = useNavigate();
  const { getProfile, getUserID, logout, getRoles } = useAuth();
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
  console.log(userRole);
  useEffect(() => {
    setUserRole(getRoles()!);
  }, [getRoles]);

  const renderContent = () => {
    // if (userRole.includes("seller")) {
    //   return <SellerComingSoon onSwitchBack={handleRoleSwitch} />;
    // }

    switch (activeTab) {
      case "dashboard":
        return <VehicleList vehicles={filteredVehicles} />;
      case "orders":
        return <OrderHistory orders={orders} />;
      case "profile":
        return <UserProfile user={user} />;
      case "services":
        return <Services services={services} />;
      case "saved":
        return <SavedVehicles />;
      case "notification":
        return <NotificationPage notifications={notifications} />;
      case "cart":
        return <CartPage cart={[]} onRemove={() => {}} />;
      case "test-drives":
        return <TestDrivesPage />;
      case "reviews":
        return <MyReviewsPage />;
      default:
        return <VehicleList vehicles={filteredVehicles} />;
    }
  };

  // --- NEW ---
  // 1. Helper function to capitalize tab names for breadcrumbs
  const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

  // --- NEW ---
  // 2. Wrapper function to "disable" profile link from sidebar
  const handleSidebarTabClick = (tab: ActiveTab) => {
    if (tab === "profile") {
      // Do nothing if the sidebar tries to set the tab to "profile"
      return;
    }
    setActiveTab(tab);
  };

  const handleLogout = () => {
    if (logout) {
      logout(); // Call the logout function from your auth context
    }
    navigate("/login"); // Redirect to login or home page
  };

  useEffect(() => {
    // ... (keep your existing useEffect)
  }, []);
  console.log(getProfile());
  console.log(getUserID());
  return (
    <>
      {/* Removed the inline <style> block that was forcing a light background */}
      <style>{`
                  @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
                  .animate-fadeIn { animation: fadeIn 0.4s ease-out forwards; }
                  
                  @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
                  .animate-fadeInUp { animation: fadeInUp 0.5s ease-out forwards; }
                  @keyframes slideInUp { from { transform: translateY(100%); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
                  .animate-slideInUp { animation: slideInUp 0.3s ease-out forwards; }
                  @keyframes popIn { from { transform: scale(0.5); opacity: 0; } to { transform: scale(1); opacity: 1; } }
                  .animate-popIn { animation: popIn 0.3s ease-out forwards; }
                `}</style>
      <div className="flex h-screen bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200">
        <Sidebar
          activeTab={activeTab}
          setActiveTab={handleSidebarTabClick}
          isExpanded={isSidebarExpanded}
          onExpand={() => setIsSidebarExpanded(true)}
          onCollapse={() => setIsSidebarExpanded(false)}
        />

        <div className="flex-1 flex flex-col overflow-hidden">
          <Header
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            userRole={userRole}
            user={user}
            notifications={notifications}
            onLogout={handleLogout}
            setActiveTab={setActiveTab}
          />

          <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-gray-100 dark:bg-gray-900">
            {/* --- NEW --- */}
            {/* 3. Added Breadcrumb Navigation */}
            {activeTab !== "dashboard" && userRole.includes("user") && (
              <nav
                className="mb-4 text-sm font-medium text-gray-500 animate-fadeIn"
                aria-label="Breadcrumb"
              >
                <ol className="list-none p-0 inline-flex">
                  <li className="flex items-center">
                    <button
                      onClick={() => setActiveTab("dashboard")}
                      className="hover:text-blue-600 dark:hover:text-blue-400 hover:underline"
                    >
                      Dashboard
                    </button>
                  </li>
                  <li className="flex items-center">
                    <span className="mx-2 dark:text-gray-500">/</span>
                    <span className="text-gray-700 font-semibold">
                      {capitalize(activeTab)}
                    </span>
                  </li>
                </ol>
              </nav>
            )}
            {/* --- END NEW --- */}

            <div key={activeTab + userRole} className="animate-fadeIn">
              {renderContent()}
            </div>
          </main>
        </div>
      </div>

      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsChatOpen(!isChatOpen)}
          className="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-all transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-900"
        >
          {isChatOpen ? (
            <CloseIcon className="h-6 w-6" />
          ) : (
            <ChatBubbleIcon className="h-6 w-6" />
          )}
        </button>
      </div>

      {isChatOpen && <Chatbot onClose={() => setIsChatOpen(false)} />}
    </>
  );
};

export default App;
