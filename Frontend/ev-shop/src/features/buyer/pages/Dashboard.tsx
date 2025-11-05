import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CloseIcon, ChatBubbleIcon } from "@/assets/icons/icons";
import { Chatbot } from "../components/ChatBot";
import { Sidebar } from "../components/SideBar";
import { Header } from "../components/Header";
import { VehicleList } from "../components/VehicalList";
import type { User_Profile, Vehicle } from "@/types";
import { OrderHistory } from "./OrderHistoryPage";
import { UserProfile } from "./UserProfilePage";
import { Services } from "./ServicePage";
import { SavedVehicles } from "./SavedVehicalsPage";
import { NotificationPage } from "./NotificationPage";
import { CartPage } from "./CartPage";
import { MyReviewsPage } from "./MyReviewsPage";
import { TestDrivesPage } from "./TestDrivePage";
import { FinancingPage } from "./FinancingPage";
import { CommunityPage } from "./ComunityPage";
import { PageLoader } from "@/components/Loader";
import {
  getUserProfile,
  getUserNotifications,
  getEVList,
} from "../buyerService";

import type { UserRole, Notification, ActiveTab } from "@/types";
import { useAuth } from "@/context/AuthContext";
import BecomeSellerPage from "./becomeaSellerPage";
import RegisterFinancialInstitutionPage from "./becomeaFinancingPage";


const App: React.FC = () => {

  const [userRole, setUserRole] = useState<UserRole[]>([]);
  const [user, setUser] = useState<User_Profile | null>();
  const [activeTab, setActiveTab] = useState<ActiveTab>("dashboard");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [isBecomeSellerModalOpen, setIsBecomeSellerModalOpen] = useState(false);
  const [isBecomFinancer, setIsBecomeFinancer] = useState(false);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const { getUserID, logout, getRoles } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const roles = getRoles();
        const userID = getUserID()!;
        console.log(roles)
        if (userID) {
          const user = await getUserProfile(userID);
          setUser(user);
        }

        if (roles && Array.isArray(roles)) {
          setUserRole(roles);
        }

        await getNotification(userID);
        await getVehicals();
      } catch (error) {
        console.error("Failed to load user or roles:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [getRoles, getUserID]);

  const getNotification = async (userID: string) => {
    try {
      const response = await getUserNotifications(userID);
      if (!response.ok) {
        throw new Error("Failed to load notifications");
      }
      const data = await response.json();
      setNotifications(data.notifications);
    } catch (error) {
      console.error("Failed to load notifications:", error);
    }
  };

  const getVehicals = async () => {
    try {
      const result = await getEVList();
      if (!result.ok) {
        throw new Error("Failed to load vehicles");
      }
      const data = await result.json();
      setVehicles(data.vehicles);
    } catch (error) {
      console.error("Failed to load vehicles:", error);
    }
  };

  const filteredVehicles = vehicles.filter(
    (vehicle) =>
      vehicle.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.model.toLowerCase().includes(searchTerm.toLowerCase())
  );
  if (loading) {
    return <PageLoader />;
  }
  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <VehicleList vehicles={filteredVehicles} />;
      case "orders":
        return <OrderHistory />;
      case "profile":
        return <UserProfile user={user!} />;
      case "services":
        return <Services />;
      case "financing":
        return <FinancingPage />;
      case "saved":
        return <SavedVehicles />;
      case "notification":
        return <NotificationPage notifications={notifications} />;
      case "cart":
        return <CartPage />;
      case "test-drives":
        return <TestDrivesPage />;
      case "reviews":
        return <MyReviewsPage />;
      case "community":
        return <CommunityPage />;
      default:
        return <VehicleList vehicles={filteredVehicles} />;
    }
  };

  // 1. Helper function to capitalize tab names for breadcrumbs
  const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

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
      logout();
    }
    navigate("/auth/login"); // Redirect to login or home page
  };

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
            onBecomeSellerClick={() => setIsBecomeSellerModalOpen(true)}
            onBecomeFinancerClick={() => setIsBecomeFinancer(true)}
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

      {/* --- NEW: Become a Seller Modal --- */}
      {isBecomeSellerModalOpen && (
        <BecomeSellerPage
          onClose={() => setIsBecomeSellerModalOpen(false)}
        />
      )}

      {isBecomFinancer && (
        <RegisterFinancialInstitutionPage
          onClose={() => setIsBecomeFinancer(false)}
        />
      )}
    </>
  );
};

export default App;
