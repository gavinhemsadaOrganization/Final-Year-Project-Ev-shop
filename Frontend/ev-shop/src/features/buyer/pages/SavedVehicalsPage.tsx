import { HeartIcon } from "@/assets/icons/icons";

export const SavedVehicles: React.FC = () => (
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