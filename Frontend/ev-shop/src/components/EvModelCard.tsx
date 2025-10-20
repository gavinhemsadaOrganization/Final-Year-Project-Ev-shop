import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { itemVariants, cardHover } from "./animations/variants"; // Adjust path as needed

// --- Updated Props Interface ---
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
const EvModelCard = ({
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

export default EvModelCard;