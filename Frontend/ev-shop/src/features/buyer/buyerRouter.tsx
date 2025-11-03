import { Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard";

const BuyerRouter = () => {
  return (
    <Routes>
      <Route path="dashboard" element={<Dashboard />} />
    </Routes>
  );
};

export default BuyerRouter;
