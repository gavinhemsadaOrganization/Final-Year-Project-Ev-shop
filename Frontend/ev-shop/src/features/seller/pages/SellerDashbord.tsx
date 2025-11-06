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
import {
  BarChartIcon,
  CarIcon,
  UserIcon,
  ShoppingCartIcon,
  DollarSignIcon,
  PlusCircleIcon,
  EditIcon,
  TrashIcon,
} from "@/assets/icons/icons";
import EvListingStepper from "./EvNewList";

// --- Type Definitions ---
type Listing = {
  id: number;
  name: string;
  model: string;
  price: string;
  status: "Active" | "Sold" | "Draft";
  views: number;
  dateListed: string;
  image: string;
};

// --- Mock Data ---
const seller = {
  name: "Kasun Sampath",
  avatar: "https://placehold.co/100x100/E2E8F0/4A5568?text=KS",
};

const listings: Listing[] = [
  {
    id: 1,
    name: "Aura EV",
    model: "Sedan",
    price: "LKR 12,500,000",
    status: "Active",
    views: 1250,
    dateListed: "2025-10-01",
    image: "https://placehold.co/600x400/3498db/ffffff?text=Aura+EV",
  },
  {
    id: 2,
    name: "Pulse XR",
    model: "SUV",
    price: "LKR 18,000,000",
    status: "Active",
    views: 2800,
    dateListed: "2025-09-15",
    image: "https://placehold.co/600x400/2ecc71/ffffff?text=Pulse+XR",
  },
  {
    id: 3,
    name: "City Spark",
    model: "Hatchback",
    price: "LKR 9,800,000",
    status: "Sold",
    views: 850,
    dateListed: "2025-09-05",
    image: "https://placehold.co/600x400/e74c3c/ffffff?text=City+Spark",
  },
  {
    id: 4,
    name: "Terra Rover",
    model: "Off-road",
    price: "LKR 22,000,000",
    status: "Draft",
    views: 150,
    dateListed: "2025-10-10",
    image: "https://placehold.co/600x400/f39c12/ffffff?text=Terra+Rover",
  },
];

const notifications: Notification[] = [
  { id: 1, message: "Aura EV", time: "Sedan" },
  { id: 2, message: "Pulse XR", time: "SUV" },
];

// --- Main Seller Dashboard Component ---
const SellerDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<SellerActiveTab>("dashboard");
  const [userRole, setUserRole] = useState<UserRole[]>([]);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const { getUserID, logout, getRoles } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const roles = getRoles();
    if (roles) setUserRole(roles);
    const userID = getUserID();
    console.log("User ID:", userID);
  }, [getRoles, getUserID]);

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <SellerDashboardPage setActiveTab={setActiveTab} />;
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
        return <SellerDashboardPage setActiveTab={setActiveTab} />;
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
const SellerDashboardPage: React.FC<{ setActiveTab: (tab: SellerActiveTab) => void }> = ({
  setActiveTab,
}) => (
  <>
    <StatsCards />
    <div className="mt-10 bg-white p-6 rounded-xl shadow-md">
      <ListingsTable setActiveTab={setActiveTab} />
    </div>
    <div className="mt-10 bg-white p-6 rounded-xl shadow-md">
      <AnalyticsChart />
    </div>
  </>
);

const StatsCards: React.FC = () => (
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
);

const StatCard: React.FC<{
  title: string;
  value: string;
  icon: React.ReactNode;
  bgColor: string;
}> = ({ title, value, icon, bgColor }) => (
  <div className="bg-white p-5 rounded-xl shadow-sm flex items-center gap-5 hover:-translate-y-1 transition-transform">
    <div className={`p-3 rounded-full ${bgColor}`}>{icon}</div>
    <div>
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  </div>
);

const getStatusChip = (status: Listing["status"]) => {
  switch (status) {
    case "Active":
      return "bg-green-100 text-green-800";
    case "Sold":
      return "bg-red-100 text-red-800";
    case "Draft":
      return "bg-yellow-100 text-yellow-800";
  }
};

const ListingsTable: React.FC<{ setActiveTab: (tab: SellerActiveTab) => void }> = ({
  setActiveTab,
}) => (
  <>
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-xl font-bold">My Vehicle Listings</h2>
      <button
        onClick={() => setActiveTab("evList")}
        className="flex items-center gap-2 bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors"
      >
        <PlusCircleIcon className="h-5 w-5" />
        Add New Listing
      </button>
    </div>

    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Vehicle
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Price
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Views
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>

        <tbody className="bg-white divide-y divide-gray-200">
          {listings.map((listing) => (
            <tr key={listing.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap flex items-center gap-3">
                <img
                  className="h-10 w-10 rounded-full object-cover"
                  src={listing.image}
                  alt={listing.name}
                />
                <div>
                  <div className="text-sm font-medium text-gray-900">
                    {listing.name}
                  </div>
                  <div className="text-sm text-gray-500">{listing.model}</div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusChip(
                    listing.status
                  )}`}
                >
                  {listing.status}
                </span>
              </td>
              <td className="px-6 py-4 text-sm text-gray-600">
                {listing.price}
              </td>
              <td className="px-6 py-4 text-sm text-gray-600">
                {listing.views.toLocaleString()}
              </td>
              <td className="px-6 py-4 text-right text-sm font-medium space-x-3">
                <button className="text-indigo-600 hover:text-indigo-900 p-1">
                  <EditIcon className="h-5 w-5" />
                </button>
                <button className="text-red-600 hover:text-red-900 p-1">
                  <TrashIcon className="h-5 w-5" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </>
);

const AnalyticsChart: React.FC = () => (
  <div>
    <h2 className="text-xl font-bold mb-4">Sales Performance</h2>
    <div className="bg-gray-100 p-8 rounded-lg text-center">
      <BarChartIcon className="mx-auto h-12 w-12 text-gray-400" />
      <p className="mt-4 text-gray-600">
        Sales analytics chart will be displayed here.
      </p>
      <p className="text-sm text-gray-400 mt-2">
        Data visualization is coming soon.
      </p>
    </div>
  </div>
);

export default SellerDashboard;
