// src/context/ThemeContext.tsx
import React, { createContext, useContext, useState, useEffect } from "react";

type Theme = "light" | "dark";
type ThemeContextType = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [theme, setTheme] = useState<Theme>(() => {
    const storedTheme = localStorage.getItem("theme");
    return (storedTheme as Theme) || "light";
  });

  // --- THIS IS THE MOST IMPORTANT PART ---
  // This effect runs when the 'theme' state changes.
  // It physically adds/removes the "dark" class from the <html> tag.
  useEffect(() => {
    const root = window.document.documentElement; // This is the <html> tag
    const oldTheme = theme === "light" ? "dark" : "light";

    root.classList.remove(oldTheme);
    root.classList.add(theme);

    localStorage.setItem("theme", theme);
  }, [theme]); // The effect depends on the 'theme' state

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use the theme context
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};