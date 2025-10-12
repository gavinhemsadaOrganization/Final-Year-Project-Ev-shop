import { Route, Routes } from "react-router-dom";
import HomePage from "../pages/HoamePage";
import ModelsPage from "../pages/Model";
import ServicesPage from "../pages/Service";
import AboutPage from "../pages/About";
import ContactPage from "../pages/Contact";
import Header from "@/pages/Header";
import TermsPage from "@/pages/Terms";

const WelcomePageRouter = () => {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/models" element={<ModelsPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/terms" element={<TermsPage />} />
      </Routes>
    </>
  );
};

export default WelcomePageRouter;
