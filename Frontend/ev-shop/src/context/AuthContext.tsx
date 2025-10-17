import { createContext, useState, useContext, useEffect } from "react";
import type { ReactNode } from "react";

export type UserRole = "user" | "seller" | "finance" | "admin";

interface User {
  userid: string;
  roles: UserRole[]; // only 2 roles max
  activeRole: UserRole;
  ids: {
    userid?: string;
    sellerid?: string;
    financeid?: string;
    adminid?: string;
  };
}

interface AuthContextType {
  user: User | null;
  setUserData: (
    userid: string,
    roles: UserRole[],
    ids: {
      userid?: string;
      sellerid?: string;
      financeid?: string;
      adminid?: string;
    }
  ) => void;
  getUserID: () => string | null;
  setActiveRole: (role: UserRole) => void;
  getActiveRoleId: () => string | null;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const storedUser = localStorage.getItem("user");
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      console.error("Failed to parse user from localStorage on initial load");
      return null;
    }
  });

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(user));
  }, [user]);

  // called after successful login
  const setUserData = (
    userid: string,
    roles: UserRole[],
    ids: {
      userid?: string;
      sellerid?: string;
      financeid?: string;
      adminid?: string;
    }
  ) => {
    // The user object from localStorage might be structured differently.
    // We create a new object that matches the `User` interface.
    const userData: User = {
      userid: userid, // The main user ID
      roles: roles,
      activeRole: roles[0], // Default to the first role
      ids: ids,
    };
    setUser(userData);
  };

  // switch between user types
  const setActiveRole = (role: UserRole) => {
    if (user && user.roles.includes(role)) {
      setUser({ ...user, activeRole: role });
    }
  };
  const getUserID = (): string | null => {
    if (!user) return null;
    return user.userid;
  };
  // get ID of the currently active role
  const getActiveRoleId = (): string | null => {
    if (!user) return null;

    switch (user.activeRole) {
      case "seller":
        return user.ids.sellerid ?? null;
      case "finance":
        return user.ids.financeid ?? null;
      case "admin":
        return user.ids.adminid ?? null;
      case "user":
      default:
        return user.ids.userid ?? null;
    }
  };
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUserData,
        setActiveRole,
        getUserID,
        getActiveRoleId,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// custom hook
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
