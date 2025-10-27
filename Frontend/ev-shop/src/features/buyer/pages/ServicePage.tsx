import type { Service } from "@/types";

export const Services: React.FC<{services: Service[]}> = ({ services }) => (
  <div className="bg-white p-8 rounded-xl shadow-md">
    <h1 className="text-3xl font-bold mb-6">Our Services</h1>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {services.map((service) => (
        <div
          key={service.name}
          className="border border-gray-200 p-6 rounded-lg hover:shadow-lg hover:border-blue-300 transition-all duration-300"
        >
          <h3 className="text-xl font-semibold">{service.name}</h3>
          <p className="text-gray-600 mt-2">{service.desc}</p>
          <button className="mt-4 text-blue-600 font-semibold hover:underline">
            Learn More
          </button>
        </div>
      ))}
      <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg md:col-span-2 hover:shadow-lg transition-shadow duration-300">
        <h3 className="text-xl font-semibold text-blue-800">
          Charging Station Locator
        </h3>
        <p className="text-blue-700 mt-2">
          Find charging stations near you or along your route. Our network is
          always growing.
        </p>
        <button className="mt-4 bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-300 transform hover:scale-105">
          Find a Charger
        </button>
      </div>
    </div>
  </div>
);