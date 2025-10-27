import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { itemVariants, cardHover } from "./animations/variants"; // Adjust path as needed
import { HeartIcon } from "@/assets/icons/icons";

export type Vehicle = {
  id: number;
  name: string;
  model: string;
  price: string;
  range: string;
  image: string;
  topSpeed: string;
};

interface EvModelCardProps {
  // Required props
  name: string;
  image: string;
  
  // Optional props
  logo?: string;
  price?: string;
  specs?: string; 
  range?: string;
  acceleration?: string;
  showLink?: boolean; 
  linkTo?: string; // <-- New optional prop for the link
}

/**
 * EvModelCard Component
 * A flexible card for an EV model. Only `name` and `image` are required.
 * All other details are optional and will only be rendered if provided.
 * The link destination can be customized via the `linkTo` prop,
 * otherwise it defaults to a slug generated from the `name`.
 *
 * @param {EvModelCardProps} props - The properties for the model card.
 */
export const EvModelCard = ({
  name,
  image,
  logo,
  price,
  specs,
  range,
  acceleration,
  showLink = true,
  linkTo, // <-- Destructured linkTo prop
}: EvModelCardProps) => {
  
  // Generate a fallback URL slug if no `linkTo` prop is provided
  const modelSlug = name.toLowerCase().replace(/ /g, '-');
  
  // Use the provided `linkTo` prop if it exists, otherwise use the generated slug
  const destination = linkTo ? linkTo : `/models/${modelSlug}`;

  return (
    <motion.div
      className="bg-slate-800 rounded-lg overflow-hidden shadow-lg group"
      variants={itemVariants} // Assumes itemVariants is imported
      whileHover={cardHover}   // Assumes cardHover is imported
    >
      {/* --- Image Section (Required) --- */}
      <div className="relative">
        <img src={image} alt={name} className="w-full h-64 object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        
        {logo && (
          <img 
            src={logo} 
            alt={`${name} logo`} 
            className="absolute top-4 right-4 h-12 w-auto" 
          />
        )}

        <h2 className="absolute bottom-4 left-4 text-3xl font-bold">{name}</h2>
      </div>

      {/* --- Content & Specs Section (All Optional) --- */}
      <div className="p-6">
        
        {price && (
          <p className="text-lg text-blue-400 font-semibold mb-4">{price}</p>
        )}

        {specs && (
          <p className="text-gray-400 mb-4">{specs}</p>
        )}

        {(range || acceleration) && (
          <div className="flex justify-between text-gray-300 mb-6">
            
            {range && (
              <div className="text-center">
                <p className="font-bold text-xl">{range}</p>
                <p className="text-sm text-gray-500">Range</p>
              </div>
            )}
            
            {acceleration && (
              <div className="text-center">
                <p className="font-bold text-xl">{acceleration}</p>
                <p className="text-sm text-gray-500">0-100 km/h</p>
              </div>
            )}
          </div>
        )}

        {/* --- Conditionally Rendered Link Button --- */}
        {showLink && (
          <Link
            to={destination} // <-- Uses the dynamic destination URL
            className="block w-full text-center bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition duration-300 transform group-hover:scale-105"
          >
            Learn More
          </Link>
        )}
      </div>
    </motion.div>
  );
};

export const VehicleCard: React.FC<{
  vehicle: Vehicle;
  className?: string;
  style?: React.CSSProperties;
}> = ({ vehicle, className, style }) => (
  <div
    className={`bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${className}`}
    style={style}
  >
    <img
      className="h-56 w-full object-cover"
      src={vehicle.image}
      alt={vehicle.name}
    />
    <div className="p-6">
      <div className="flex justify-between items-start">
        <div>
          <div className="uppercase tracking-wide text-sm text-blue-600 font-bold">
            {vehicle.model}
          </div>
          <a
            href="#"
            className="block mt-1 text-xl leading-tight font-semibold text-gray-900 hover:underline"
          >
            {vehicle.name}
          </a>
        </div>
        <button className="text-gray-400 hover:text-red-500 p-2 -mr-2 -mt-2 transition-colors">
          <HeartIcon className="h-6 w-6" />
        </button>
      </div>
      <p className="mt-2 text-2xl font-light text-gray-800">{vehicle.price}</p>
      <div className="mt-4 flex justify-between text-sm text-gray-600">
        <span>
          <strong>Range:</strong> {vehicle.range}
        </span>
        <span>
          <strong>Top Speed:</strong> {vehicle.topSpeed}
        </span>
      </div>
      <div className="mt-6">
        <button className="w-full bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
          Book a Test Drive
        </button>
      </div>
    </div>
  </div>
);
