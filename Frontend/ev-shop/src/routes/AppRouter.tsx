import AuthRoutes from "../features/auth/authRouter";
import { Route, Routes } from "react-router-dom";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/auth/*" element={<AuthRoutes />} />
    </Routes>
  );
};

export default AppRoutes;