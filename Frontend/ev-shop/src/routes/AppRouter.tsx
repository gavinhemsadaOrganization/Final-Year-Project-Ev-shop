import { Route, Routes } from "react-router-dom";
import AuthRoutes from "../features/auth/authRouter";
import NotFound from "../pages/NotFound";
import ProtectedRoute from "../routes/ProtectedRouter";
import UnauthorizedPage from "@/pages/Unauthorized";
import PageRouter from "./WelcomePageRouter";


const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/*" element={<PageRouter />} />
      <Route path="/auth/*" element={<AuthRoutes />} />
      <Route path="*" element={<NotFound />} />
      <Route path="/unauthorized" element={<UnauthorizedPage/>} />
    </Routes>
  );
};

export default AppRoutes;