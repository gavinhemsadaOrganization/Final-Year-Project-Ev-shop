import { Route, Routes } from "react-router-dom";
import LoginPage from "../auth/pages/Login";
import RegisterPage from "../auth/pages/Register";
import ForgotPasswordPage from "../auth/pages/ForgetPassword";


const AuthRoutes = () => {
  return (
    <Routes>
      <Route path="login" element={<LoginPage />} />
      <Route path="register" element={<RegisterPage />} />
      <Route path="forgot-password" element={<ForgotPasswordPage />} />"
    </Routes>
  );
};

export default AuthRoutes;