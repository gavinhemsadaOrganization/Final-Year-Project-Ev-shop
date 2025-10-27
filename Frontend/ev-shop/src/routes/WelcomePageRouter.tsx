import { Route, Routes } from "react-router-dom";
import HomePage from "../pages/HoamePage";
import ModelsPage from "../pages/ModelPage";
import ServicesPage from "../pages/ServicePage";
import AboutPage from "../pages/AboutPage";
import ContactPage from "../pages/ContactPage";
import Header from "@/pages/Header";
import TermsPage from "@/pages/TermsPage";

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
