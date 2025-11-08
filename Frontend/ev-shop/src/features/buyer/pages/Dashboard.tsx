import React, { useState, useEffect, lazy, Suspense, useCallback } from "react";
import "../style/buyer.css";
import { useNavigate } from "react-router-dom";
import { CloseIcon, ChatBubbleIcon } from "@/assets/icons/icons";
import { Chatbot } from "../components/ChatBot";
import { Sidebar } from "../components/SideBar";
import { Header } from "../components/Header";
import { VehicleList } from "../components/VehicalList";
import type { User_Profile, Vehicle } from "@/types";

const OrderHistory = lazy(() => import("./OrderHistoryPage"));
const UserProfile = lazy(() => import("./UserProfilePage"));
const Services = lazy(() => import("./ServicePage"));
const SavedVehicles = lazy(() => import("./SavedVehicalsPage"));
const NotificationPage = lazy(() => import("./NotificationPage"));
const CartPage = lazy(() => import("./CartPage"));
const MyReviewsPage = lazy(() => import("./MyReviewsPage"));
const TestDrivesPage = lazy(() => import("./TestDrivePage"));
const FinancingPage = lazy(() => import("./FinancingPage"));
const BecomeSellerPage = lazy(() => import("./becomeaSellerPage"));
const RegisterFinancialInstitutionPage = lazy(
  () => import("./becomeaFinancingPage")
);
const CommunityPage = lazy(() => import("./ComunityPage"));

import { PageLoader } from "@/components/Loader";
import { buyerService } from "../buyerService";

import type { UserRole, Notification, ActiveTab } from "@/types";
import { useAuth } from "@/context/AuthContext";

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
    const handlePageLoad = () => setLoading(false);

    if (document.readyState === "complete") {
      setLoading(false);
    } else {
      window.addEventListener("load", handlePageLoad);
    }

    return () => window.removeEventListener("load", handlePageLoad);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const roles = getRoles();
        const userID = getUserID()!;
        console.log(roles);
        if (userID) {
          const [user, notifications, vehicles] = await Promise.all([
            buyerService.getUserProfile(userID),
            buyerService.getUserNotifications(userID),
            buyerService.getEVList(),
          ]);
          setUser(user);
          setNotifications(notifications);
          setVehicles(vehicles);
        }

        if (roles && Array.isArray(roles)) {
          setUserRole(roles);
        }
      } catch (error) {
        console.error("Failed to load user or roles:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredVehicles = React.useMemo(() => {
    return vehicles.filter((vehicle) =>
      vehicle.model_id.model_name
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
  }, [vehicles, searchTerm]);

  const toggleChat = useCallback(() => {
    setIsChatOpen((prev) => !prev);
  }, []);

  const becomeSelleClick = useCallback(() => {
    setIsBecomeSellerModalOpen(true);
  }, []);

  const becomeFinancerClick = useCallback(() => {
    setIsBecomeFinancer(true);
  }, []);
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
              <Suspense fallback={<PageLoader />}>{renderContent()}</Suspense>
            </div>
          </main>
        </div>
      </div>

      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={toggleChat}
          className="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-all transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-900"
        >
          {isChatOpen ? (
            <CloseIcon className="h-6 w-6" />
          ) : (
            <ChatBubbleIcon className="h-6 w-6" />
          )}
        </button>
      </div>

      {isChatOpen && <Chatbot onClose={toggleChat} />}

      {/* --- NEW: Become a Seller Modal --- */}
      {isBecomeSellerModalOpen && (
        <BecomeSellerPage onClose={becomeSelleClick} />
      )}

      {isBecomFinancer && (
        <RegisterFinancialInstitutionPage onClose={becomeFinancerClick} />
      )}
    </>
  );
};

export default App;
