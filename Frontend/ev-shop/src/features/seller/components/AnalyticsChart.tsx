import { BarChartIcon } from "@/assets/icons/icons";

export const AnalyticsChart: React.FC = () => (
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
