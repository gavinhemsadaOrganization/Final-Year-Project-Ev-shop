import React from 'react';

// This component assumes Tailwind CSS is configured in your project.

// --- Type Definitions ---
type IconProps = { className?: string };

type Listing = {
    id: number;
    name: string;
    model: string;
    price: string;
    status: 'Active' | 'Sold' | 'Draft';
    views: number;
    dateListed: string;
    image: string;
};

// --- Helper Components & Icons ---

const CarIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 16.5V14a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2.5"></path>
        <path d="M20 10h-2V7.5a2.5 2.5 0 0 0-5 0V10H4V7.5a2.5 2.5 0 0 1 5 0V10h6V7.5a2.5 2.5 0 0 0-5 0V10"></path>
        <path d="M3 16.5h18"></path>
        <path d="M5 19a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm14 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"></path>
    </svg>
);

const UserIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
        <circle cx="12" cy="7" r="4"></circle>
    </svg>
);

const ShoppingCartIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9" cy="21" r="1"></circle>
        <circle cx="20" cy="21" r="1"></circle>
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
    </svg>
);

const BarChartIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="20" x2="12" y2="10"></line><line x1="18" y1="20" x2="18" y2="4"></line>
        <line x1="6" y1="20" x2="6" y2="16"></line>
    </svg>
);

const DollarSignIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="1" x2="12" y2="23"></line>
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
    </svg>
);

const PlusCircleIcon: React.FC<IconProps> = ({ className }) => (
     <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="8" x2="12" y2="16"></line>
        <line x1="8" y1="12" x2="16" y2="12"></line>
    </svg>
);

const EditIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
    </svg>
);

const TrashIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="3 6 5 6 21 6"></polyline>
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
    </svg>
);

// --- Mock Data ---
const seller = {
    name: 'Kasun Sampath',
    avatar: 'https://placehold.co/100x100/E2E8F0/4A5568?text=KS'
};

const listings: Listing[] = [
    { id: 1, name: 'Aura EV', model: 'Sedan', price: 'LKR 12,500,000', status: 'Active', views: 1250, dateListed: '2025-10-01', image: 'https://placehold.co/600x400/3498db/ffffff?text=Aura+EV' },
    { id: 2, name: 'Pulse XR', model: 'SUV', price: 'LKR 18,000,000', status: 'Active', views: 2800, dateListed: '2025-09-15', image: 'https://placehold.co/600x400/2ecc71/ffffff?text=Pulse+XR' },
    { id: 3, name: 'City Spark', model: 'Hatchback', price: 'LKR 9,800,000', status: 'Sold', views: 850, dateListed: '2025-09-05', image: 'https://placehold.co/600x400/e74c3c/ffffff?text=City+Spark' },
    { id: 4, name: 'Terra Rover', model: 'Off-road', price: 'LKR 22,000,000', status: 'Draft', views: 150, dateListed: '2025-10-10', image: 'https://placehold.co/600x400/f39c12/ffffff?text=Terra+Rover' },
];

// --- Main Seller Dashboard Component ---

const SellerDashboard: React.FC = () => {
    return (
        <>
            <style>{`
                body { font-family: 'Inter', sans-serif; background-color: #f9fafb; }
                @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
                .animate-fadeIn { animation: fadeIn 0.5s ease-out forwards; }
            `}</style>
            <div className="flex h-screen bg-gray-50 text-gray-800">
                {/* Sidebar */}
                <aside className="w-64 flex-shrink-0 bg-white border-r border-gray-200 flex flex-col">
                    <div className="h-16 flex items-center justify-center border-b">
                        <CarIcon className="h-8 w-8 text-indigo-600" />
                        <span className="ml-2 text-xl font-bold">EV-Seller</span>
                    </div>
                    <nav className="flex-1 px-4 py-6 space-y-2">
                         <a href="#" className="flex items-center px-4 py-2.5 bg-indigo-50 text-indigo-600 rounded-lg text-sm font-medium"><BarChartIcon className="h-5 w-5 mr-3"/>Dashboard</a>
                         <a href="#" className="flex items-center px-4 py-2.5 text-gray-600 hover:bg-gray-100 rounded-lg text-sm font-medium"><CarIcon className="h-5 w-5 mr-3"/>My Listings</a>
                         <a href="#" className="flex items-center px-4 py-2.5 text-gray-600 hover:bg-gray-100 rounded-lg text-sm font-medium"><ShoppingCartIcon className="h-5 w-5 mr-3"/>Orders</a>
                         <a href="#" className="flex items-center px-4 py-2.5 text-gray-600 hover:bg-gray-100 rounded-lg text-sm font-medium"><UserIcon className="h-5 w-5 mr-3"/>Profile</a>
                    </nav>
                </aside>

                {/* Main Content */}
                <div className="flex-1 flex flex-col overflow-hidden">
                    <header className="h-16 bg-white border-b flex items-center justify-end px-6">
                        <div className="flex items-center space-x-3">
                                <img src={seller.avatar} alt="Seller Avatar" className="h-10 w-10 rounded-full object-cover" />
                                <div>
                                    <p className="font-semibold text-sm">{seller.name}</p>
                                    <p className="text-xs text-gray-500">Seller Account</p>
                                </div>
                            </div>
                    </header>
                    <main className="flex-1 overflow-y-auto p-8 animate-fadeIn">
                        <h1 className="text-3xl font-bold mb-8">Seller Dashboard</h1>
                        
                        {/* Stats Cards */}
                        <StatsCards />

                        {/* Listings Table */}
                        <div className="mt-10 bg-white p-6 rounded-xl shadow-md">
                            <ListingsTable />
                        </div>
                        
                        {/* Analytics Placeholder */}
                         <div className="mt-10 bg-white p-6 rounded-xl shadow-md">
                            <AnalyticsChart />
                        </div>
                    </main>
                </div>
            </div>
        </>
    );
};

// --- Sub Components ---

const StatsCards: React.FC = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
            title="Total Revenue" 
            value="LKR 9,800,000" 
            icon={<DollarSignIcon className="h-6 w-6 text-green-600"/>}
            bgColor="bg-green-100"
        />
        <StatCard 
            title="Vehicles Sold" 
            value="1" 
            icon={<ShoppingCartIcon className="h-6 w-6 text-blue-600"/>}
            bgColor="bg-blue-100"
        />
        <StatCard 
            title="Active Listings" 
            value="2" 
            icon={<CarIcon className="h-6 w-6 text-indigo-600"/>}
            bgColor="bg-indigo-100"
        />
        <StatCard 
            title="Total Views" 
            value="4,050" 
            icon={<UserIcon className="h-6 w-6 text-yellow-600"/>}
            bgColor="bg-yellow-100"
        />
    </div>
);

type StatCardProps = { title: string; value: string; icon: React.ReactNode; bgColor: string };

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, bgColor }) => (
    <div className="bg-white p-5 rounded-xl shadow-sm flex items-center gap-5 transition-transform transform hover:-translate-y-1">
        <div className={`p-3 rounded-full ${bgColor}`}>
            {icon}
        </div>
        <div>
            <p className="text-sm text-gray-500">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
        </div>
    </div>
);

const getStatusChip = (status: Listing['status']) => {
    switch(status) {
        case 'Active': return 'bg-green-100 text-green-800';
        case 'Sold': return 'bg-red-100 text-red-800';
        case 'Draft': return 'bg-yellow-100 text-yellow-800';
    }
};

const ListingsTable: React.FC = () => (
    <>
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">My Vehicle Listings</h2>
            <button className="flex items-center gap-2 bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors">
                <PlusCircleIcon className="h-5 w-5"/>
                Add New Listing
            </button>
        </div>
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Views</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {listings.map(listing => (
                        <tr key={listing.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 h-10 w-10">
                                        <img className="h-10 w-10 rounded-full object-cover" src={listing.image} alt={listing.name} />
                                    </div>
                                    <div className="ml-4">
                                        <div className="text-sm font-medium text-gray-900">{listing.name}</div>
                                        <div className="text-sm text-gray-500">{listing.model}</div>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusChip(listing.status)}`}>
                                    {listing.status}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{listing.price}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{listing.views.toLocaleString()}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                                <button className="text-indigo-600 hover:text-indigo-900 p-1"><EditIcon className="h-5 w-5"/></button>
                                <button className="text-red-600 hover:text-red-900 p-1"><TrashIcon className="h-5 w-5"/></button>
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
            <p className="mt-4 text-gray-600">Sales analytics chart will be displayed here.</p>
             <p className="text-sm text-gray-400 mt-2">Data visualization is coming soon.</p>
        </div>
    </div>
);


export default SellerDashboard;

