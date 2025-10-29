import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRouter";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";

const App = () => {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
};

export default App;
