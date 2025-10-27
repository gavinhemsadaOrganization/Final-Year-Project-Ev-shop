import { VehicleCard, type Vehicle } from "@/components/EvModelCard";

export const VehicleList: React.FC<{ vehicles: Vehicle[] }> = ({
  vehicles,
}) => (
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