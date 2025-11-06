export const StatCard: React.FC<{
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