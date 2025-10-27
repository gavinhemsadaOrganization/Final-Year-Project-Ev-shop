import { VehicleCard, type Vehicle } from "@/components/EvModelCard";

/**
 * Props for the VehicleList component.
 */
type VehicleListProps = {
  /** An array of vehicle objects to be displayed. */
  vehicles: Vehicle[];
};

/**
 * A component that displays a list of vehicles in a responsive grid.
 * It shows a message if no vehicles are available.
 */
export const VehicleList: React.FC<VehicleListProps> = ({ vehicles }) => (
  <div>
    {/* Main title for the vehicle list section. */}
    <h1 className="text-3xl font-bold mb-8">Explore Our Vehicles</h1>
    {/* Conditional rendering: Check if the vehicles array is not empty. */}
    {vehicles.length > 0 ? (
      // If there are vehicles, render them in a responsive grid.
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {/* Map over the vehicles array to render a VehicleCard for each one. */}
        {vehicles.map((v, index) => (
          <VehicleCard
            key={v.id}
            vehicle={v}
            // Stagger the animation delay for each card for a nice visual effect.
            style={{ animationDelay: `${index * 80}ms` }}
            className="opacity-0 animate-fadeInUp"
          />
        ))}
      </div>
    ) : (
      // If there are no vehicles, display a "not found" message.
      <div className="text-center py-16 bg-white rounded-lg shadow-sm">
        <h2 className="text-2xl font-semibold text-gray-700">
          No Vehicles Found
        </h2>
        <p className="text-gray-500 mt-2">Try adjusting your search term.</p>
      </div>
    )}
  </div>
);
