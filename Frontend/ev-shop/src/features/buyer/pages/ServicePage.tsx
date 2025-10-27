import type { Service } from "@/types";

/**
 * Props for the Services component.
 */
type ServicesProps = {
  /** An array of service objects to be displayed. */
  services: Service[];
};

/**
 * A page component that displays a list of available services.
 * It renders a grid of service cards based on the provided `services` prop,
 * and also includes a static card for a "Charging Station Locator".
 */
export const Services: React.FC<ServicesProps> = ({ services }) => (
  // Main container for the services page with padding, rounded corners, and a shadow.
  <div className="bg-white p-8 rounded-xl shadow-md">
    <h1 className="text-3xl font-bold mb-6">Our Services</h1>
    {/* A responsive grid to display the service cards. It's 1 column on small screens and 2 on medium screens and up. */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Map over the services array to dynamically create a card for each service. */}
      {services.map((service) => (
        <div
          key={service.name}
          // Styling for individual service cards, including borders, padding, and hover effects.
          className="border border-gray-200 p-6 rounded-lg hover:shadow-lg hover:border-blue-300 transition-all duration-300"
        >
          <h3 className="text-xl font-semibold">{service.name}</h3>
          <p className="text-gray-600 mt-2">{service.desc}</p>
          {/* A "Learn More" button, which currently has no functionality. */}
          <button className="mt-4 text-blue-600 font-semibold hover:underline">
            Learn More
          </button>
        </div>
      ))}
      {/* A special, static card for the Charging Station Locator feature. */}
      {/* It spans two columns on medium screens and up. */}
      <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg md:col-span-2 hover:shadow-lg transition-shadow duration-300">
        <h3 className="text-xl font-semibold text-blue-800">
          Charging Station Locator
        </h3>
        <p className="text-blue-700 mt-2">
          Find charging stations near you or along your route. Our network is
          always growing.
        </p>
        {/* A call-to-action button for the locator feature. */}
        <button className="mt-4 bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-300 transform hover:scale-105">
          Find a Charger
        </button>
      </div>
    </div>
  </div>
);
