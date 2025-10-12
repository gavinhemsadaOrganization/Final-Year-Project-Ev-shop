import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import type { Variants } from 'framer-motion';
// --- Mock Data for Car Models ---
const carModels = [
  {
    name: 'Aura-X',
    image: 'https://images.unsplash.com/photo-1617986014354-1358a89694c0?q=80&w=2070&auto=format&fit=crop',
    price: 'Starting at $79,990',
    range: '610 km',
    acceleration: '3.2s 0-100 km/h',
  },
  {
    name: 'Photon GT',
    image: 'https://images.unsplash.com/photo-1621292898738-166199104328?q=80&w=1974&auto=format&fit=crop',
    price: 'Starting at $105,000',
    range: '550 km',
    acceleration: '3.8s 0-100 km/h',
  },
  {
    name: 'Volt Urban',
    image: 'https://images.unsplash.com/photo-1603487002163-95273130d939?q=80&w=2070&auto=format&fit=crop',
    price: 'Starting at $45,500',
    range: '420 km',
    acceleration: '6.1s 0-100 km/h',
  },
  {
    name: 'E-Nova SUV',
    image: 'https://images.unsplash.com/photo-1631392682973-317242a3afa4?q=80&w=2070&auto=format&fit=crop',
    price: 'Starting at $88,000',
    range: '580 km',
    acceleration: '4.5s 0-100 km/h',
  },
  {
    name: 'Ion Compact',
    image: 'https://images.unsplash.com/photo-1582269209588-e81a34d4def6?q=80&w=2071&auto=format&fit=crop',
    price: 'Starting at $39,900',
    range: '380 km',
    acceleration: '7.2s 0-100 km/h',
  },
  {
    name: 'Bolt Truck',
    image: 'https://images.unsplash.com/photo-1631557983226-9f8728a55d6a?q=80&w=2070&auto=format&fit=crop',
    price: 'Starting at $95,000',
    range: '650 km',
    acceleration: '4.1s 0-100 km/h',
  },
];

// --- Animation Variants ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const cardVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } },
};

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
            <p className="text-lg text-gray-400 mt-2">Find the perfect vehicle to power your journey.</p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {carModels.map((model) => (
              <motion.div
                key={model.name}
                className="bg-slate-800 rounded-lg overflow-hidden shadow-lg group"
                variants={cardVariants}
              >
                <div className="relative">
                  <img src={model.image} alt={model.name} className="w-full h-64 object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <h2 className="absolute bottom-4 left-4 text-3xl font-bold">{model.name}</h2>
                </div>
                <div className="p-6">
                  <p className="text-lg text-blue-400 font-semibold mb-4">{model.price}</p>
                  <div className="flex justify-between text-gray-300 mb-6">
                    <div className="text-center">
                      <p className="font-bold text-xl">{model.range}</p>
                      <p className="text-sm text-gray-500">Range</p>
                    </div>
                    <div className="text-center">
                      <p className="font-bold text-xl">{model.acceleration}</p>
                      <p className="text-sm text-gray-500">0-100 km/h</p>
                    </div>
                  </div>
                  <Link
                    to={`/models/${model.name.toLowerCase().replace(' ', '-')}`}
                    className="block w-full text-center bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition duration-300 transform group-hover:scale-105"
                  >
                    Learn More
                  </Link>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default ModelsPage;
