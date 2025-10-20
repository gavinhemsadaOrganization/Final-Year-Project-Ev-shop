import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FaLeaf, FaBolt, FaDollarSign, FaTachometerAlt } from "react-icons/fa";
import {
  containerVariants,
  itemVariants,
} from "../components/animations/variants";
import EvModelCard from "@/components/EvModelCard";
// --- Mock Data (replace with your actual data from an API) ---
const featuredModels = [
  {
    name: "Aura-X",
    image:
      "https://images.unsplash.com/photo-1617986014354-1358a89694c0?q=80&w=2070&auto=format&fit=crop", // Replace with your image URL
    specs: "0-100 km/h in 3.2s",
    range: "610 km Range",
  },
  {
    name: "Photon GT",
    image:
      "https://images.unsplash.com/photo-1621292898738-166199104328?q=80&w=1974&auto=format&fit=crop", // Replace with your image URL
    specs: "Luxury & Performance",
    range: "550 km Range",
  },
  {
    name: "Volt Urban",
    image:
      "https://images.unsplash.com/photo-1603487002163-95273130d939?q=80&w=2070&auto=format&fit=crop", // Replace with your image URL
    specs: "Compact & Efficient",
    range: "420 km Range",
  },
];

// --- Mock Data for Benefits ---
// This array holds data for the "Why Choose Us" section, detailing the advantages of electric vehicles.
const benefits = [
  {
    icon: <FaLeaf />,
    title: "Zero Emissions",
    description:
      "Drive clean and reduce your carbon footprint with every trip.",
  },
  {
    icon: <FaDollarSign />,
    title: "Lower Running Costs",
    description:
      "Save on fuel and maintenance. Electricity is cheaper than petrol.",
  },
  {
    icon: <FaBolt />,
    title: "Instant Torque",
    description:
      "Experience exhilarating acceleration the moment you press the pedal.",
  },
  {
    icon: <FaTachometerAlt />,
    title: "Cutting-Edge Tech",
    description: "Enjoy the latest in-car technology and autonomous features.",
  },
];

/**
 * HeroSection Component
 * This component renders the main hero section at the top of the homepage,
 * featuring a background video, an overlay, and animated text content with a call-to-action button.
 */
const HeroSection = () => (
  <motion.section
    className="relative h-screen flex items-center justify-center text-center"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 1.5 }}
  >
    <div className="absolute inset-0 bg-black opacity-50 z-10"></div>
    <video
      autoPlay
      loop
      muted
      className="absolute inset-0 w-full h-full object-cover"
      src="https://cdn.pixabay.com/video/2022/09/20/129759-756184519_large.mp4"
    />
    <motion.div
      className="relative z-20 p-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Animated main heading */}
      <motion.h1
        variants={itemVariants}
        className="text-5xl md:text-7xl font-bold tracking-tight mb-4"
      >
        The Future is Electric.
      </motion.h1>
      <motion.p
        // Animated paragraph describing the vision.
        variants={itemVariants}
        className="text-lg md:text-xl max-w-2xl mx-auto mb-8 text-gray-300"
      >
        Discover a new era of driving. Unmatched performance, sustainable
        energy, and breathtaking design.
      </motion.p>
      <motion.div variants={itemVariants}>
        {/* Call-to-action button linking to the models page. */}
        <Link
          to="/models"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full text-lg transition duration-300 transform hover:scale-105"
        >
          Explore Models
        </Link>
      </motion.div>
    </motion.div>
  </motion.section>
);

/**
 * FeaturedModelsSection Component
 * This component displays a grid of featured car models.
 * It uses `whileInView` to trigger animations as the user scrolls down.
 */
const FeaturedModelsSection = () => (
  <section className="py-20 bg-slate-800">
    <div className="container mx-auto px-6">
      <motion.h2
        className="text-4xl font-bold text-center mb-12"
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        Our Signature Collection
      </motion.h2>
      {/* Grid container for the model cards with staggered animations. */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        {/* Map through the `featuredModels` data to render each model card. */}
        {featuredModels.map((model, index) => (
          <EvModelCard
          key={index}
          name={model.name}
          image={model.image}
          specs={model.specs}
          range={model.range}
          />
        ))}
      </motion.div>
    </div>
  </section>
);

/**
 * WhyChooseUsSection Component
 * This component highlights the key benefits of owning an electric vehicle.
 * It displays a grid of benefit cards with icons, titles, and descriptions.
 */
const WhyChooseUsSection = () => (
  <section className="py-20">
    <div className="container mx-auto px-6">
      <motion.h2
        className="text-4xl font-bold text-center mb-12"
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        The EV Advantage
      </motion.h2>
      {/* Grid container for the benefit cards with staggered animations. */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-center"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        {/* Map through the `benefits` data to render each benefit card. */}
        {benefits.map((benefit) => (
          <motion.div
            key={benefit.title}
            className="bg-slate-800 p-8 rounded-lg"
            variants={itemVariants}
          >
            <div className="text-blue-500 text-5xl mb-4 inline-block">
              {/* Benefit icon */}
              {benefit.icon}
            </div>
            <h3 className="text-xl font-bold mb-2">{benefit.title}</h3>
            <p className="text-gray-400">{benefit.description}</p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  </section>
);

/**
 * EVHomePage Component
 * This is the main component for the homepage. It assembles the Hero,
 * Featured Models, and Why Choose Us sections into a single page layout.
 */
const EVHomePage = () => {
  return (
    <div className="bg-slate-900 text-white font-sans">
      {/* ===== Hero Section ===== */}
      <HeroSection />

      {/* ===== Featured Models Section ===== */}
      <FeaturedModelsSection />

      {/* ===== Why Choose Electric Section ===== */}
      <WhyChooseUsSection />
    </div>
  );
};

export default EVHomePage;