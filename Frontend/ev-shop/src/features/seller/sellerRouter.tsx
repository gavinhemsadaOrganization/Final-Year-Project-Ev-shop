import { Route, Routes } from "react-router-dom";
import SellerDashboard from "./pages/SellerDashbord";
const SellerRouter = () => {
    return (
    <Routes>
      <Route path="dashboard" element={<SellerDashboard />} />
    </Routes>
  );
}

export default SellerRouter;