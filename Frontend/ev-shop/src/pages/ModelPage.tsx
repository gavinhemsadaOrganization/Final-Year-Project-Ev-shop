import { motion } from "framer-motion";
import { containerVariants } from "@/components/animations/variants";
import { EvModelCard } from "@/components/EvModelCard";

// --- Mock Data for Car Models ---
const carModels = [
  {
    name: "Aura-X",
    image:
      "https://images.unsplash.com/photo-1617986014354-1358a89694c0?q=80&w=2070&auto=format&fit=crop",
    price: "Starting at $79,990",
    range: "610 km",
    acceleration: "3.2s 0-100 km/h",
  },
  {
    name: "Photon GT",
    image:
      "https://images.unsplash.com/photo-1621292898738-166199104328?q=80&w=1974&auto=format&fit=crop",
    price: "Starting at $105,000",
    range: "550 km",
    acceleration: "3.8s 0-100 km/h",
  },
  {
    name: "Volt Urban",
    image:
      "https://images.unsplash.com/photo-1603487002163-95273130d939?q=80&w=2070&auto=format&fit=crop",
    price: "Starting at $45,500",
    range: "420 km",
    acceleration: "6.1s 0-100 km/h",
  },
  {
    name: "E-Nova SUV",
    image:
      "https://images.unsplash.com/photo-1631392682973-317242a3afa4?q=80&w=2070&auto=format&fit=crop",
    price: "Starting at $88,000",
    range: "580 km",
    acceleration: "4.5s 0-100 km/h",
  },
  {
    name: "Ion Compact",
    image:
      "https://images.unsplash.com/photo-1582269209588-e81a34d4def6?q=80&w=2071&auto=format&fit=crop",
    price: "Starting at $39,900",
    range: "380 km",
    acceleration: "7.2s 0-100 km/h",
  },
  {
    name: "Bolt Truck",
    image:
      "https://images.unsplash.com/photo-1631557983226-9f8728a55d6a?q=80&w=2070&auto=format&fit=crop",
    price: "Starting at $95,000",
    range: "650 km",
    acceleration: "4.1s 0-100 km/h",
  },
];

const ModelsPage = () => {
  return (
    <div className="bg-slate-900 min-h-screen text-white">
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h1 className="text-5xl font-bold">Our Electric Fleet</h1>
            <p className="text-lg text-gray-400 mt-2">
              Find the perfect vehicle to power your journey.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {carModels.map((model) => (
              <EvModelCard
                key={model.name}
                name={model.name}
                image={model.image}
                price={model.price}
                range={model.range}
                acceleration={model.acceleration}
                showLink={true}
                linkTo={`${model.name.toLowerCase().replace(/ /g, "-")}`}
              />
            ))}
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default ModelsPage;
