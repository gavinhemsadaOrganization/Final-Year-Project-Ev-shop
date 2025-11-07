import React, { useEffect, useState } from "react";
import type { SellerActiveTab, UserRole, Notification } from "@/types";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Sidebar } from "../components/Sidebar";
import { Header } from "../components/Header";
import { NotificationPage } from "./NotificationPage";
import { TestDrivesPage } from "./TestDrivePage";
import { MyReviewsPage } from "./MyReviewsPage";
import { CommunityPage } from "./ComunityPage";
import { SavedVehicles } from "./SavedVehicalsPage";
import { OrderHistory } from "./OrderHistoryPage";
import { ListingsTable } from "../components/EvListingTable";
import { AnalyticsChart } from "../components/AnalyticsChart";
import {
  CarIcon,
  UserIcon,
  ShoppingCartIcon,
  DollarSignIcon,
} from "@/assets/icons/icons";
import EvListingStepper from "./EvNewList";
import { StatCard } from "../components/StatsCards";
import { sellerService } from "../sellerService";
import type { Listing } from "@/types/ev";

const notifications: Notification[] = [
  { id: 1, message: "Aura EV", time: "Sedan" },
  { id: 2, message: "Pulse XR", time: "SUV" },
];

// --- Main Seller Dashboard Component ---
const SellerDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<SellerActiveTab>("dashboard");
  const [seller, setSeller] = useState<any>({});
  const [userRole, setUserRole] = useState<UserRole[]>([]);
  const [listings, setListings] = useState<Listing[]>([]);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const { getUserID, logout, getRoles, setSellerId, getActiveRoleId } =
    useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const roles = getRoles();
    if (roles) setUserRole(roles);
    const userID = getUserID();
    const fetchSellerData = async (userID: string) => {
      try {
        const result = await sellerService.getSellerProfile(userID!);
        setSellerId(result._id);
        const evList = await sellerService.getSellerEvList(result._id);
        console.log(evList);
        setListings(evList);
        setSeller(result);
        console.log("Seller Data:", getActiveRoleId());
      } catch (error) {
        console.error("Error fetching seller data:", error);
      }
    };
    if (userID) {
      fetchSellerData(userID);
    }
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <SellerDashboardPage listing={listings} setActiveTab={setActiveTab} />
        );
      case "orders":
        return <OrderHistory />;
      case "evList":
        return <EvListingStepper />;
      case "saved":
        return <SavedVehicles />;
      case "notification":
        return <NotificationPage notifications={notifications} />;
      case "test-drives":
        return <TestDrivesPage />;
      case "reviews":
        return <MyReviewsPage />;
      case "community":
        return <CommunityPage />;
      default:
        return (
          <SellerDashboardPage listing={listings} setActiveTab={setActiveTab} />
        );
    }
  };

  const handleLogout = () => {
    if (logout) logout();
    navigate("/auth/login");
  };

  return (
    <>
      <style>{`
        body { font-family: 'Inter', sans-serif; background-color: #f9fafb; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeIn { animation: fadeIn 0.5s ease-out forwards; }
      `}</style>

      <div className="flex h-screen bg-gray-50 text-gray-800">
        {/* Sidebar */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isExpanded={isSidebarExpanded}
          onExpand={() => setIsSidebarExpanded(true)}
          onCollapse={() => setIsSidebarExpanded(false)}
        />

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header
            seller={seller}
            notifications={notifications}
            onLogout={handleLogout}
            setActiveTab={setActiveTab}
          />

          <main className="flex-1 overflow-y-auto p-8 animate-fadeIn">
            {activeTab !== "dashboard" && userRole?.includes("seller") && (
              <nav
                className="mb-4 text-sm font-medium text-gray-500 animate-fadeIn"
                aria-label="Breadcrumb"
              >
                <ol className="list-none p-0 inline-flex">
                  <li className="flex items-center">
                    <button
                      onClick={() => setActiveTab("dashboard")}
                      className="hover:text-blue-600 hover:underline"
                    >
                      Dashboard
                    </button>
                  </li>
                  <li className="flex items-center">
                    <span className="mx-2">/</span>
                    <span className="text-gray-700 font-semibold">
                      {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
                    </span>
                  </li>
                </ol>
              </nav>
            )}
            <div key={activeTab} className="animate-fadeIn">
              {renderContent()}
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

// --- Sub Components ---
const SellerDashboardPage: React.FC<{
  listing: Listing[];
  setActiveTab: (tab: SellerActiveTab) => void;
}> = ({ setActiveTab, listing }) => (
  <>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard
        title="Total Revenue"
        value="LKR 9,800,000"
        icon={<DollarSignIcon className="h-6 w-6 text-green-600" />}
        bgColor="bg-green-100"
      />
      <StatCard
        title="Vehicles Sold"
        value="1"
        icon={<ShoppingCartIcon className="h-6 w-6 text-blue-600" />}
        bgColor="bg-blue-100"
      />
      <StatCard
        title="Active Listings"
        value="2"
        icon={<CarIcon className="h-6 w-6 text-indigo-600" />}
        bgColor="bg-indigo-100"
      />
      <StatCard
        title="Total Views"
        value="4,050"
        icon={<UserIcon className="h-6 w-6 text-yellow-600" />}
        bgColor="bg-yellow-100"
      />
    </div>
    <div className="mt-10 bg-white p-6 rounded-xl shadow-md">
      <ListingsTable listings={listing} setActiveTab={setActiveTab} />
    </div>
    <div className="mt-10 bg-white p-6 rounded-xl shadow-md">
      <AnalyticsChart />
    </div>
  </>
);

export default SellerDashboard;
