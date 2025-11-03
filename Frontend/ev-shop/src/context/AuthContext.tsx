import { createContext, useState, useContext, useEffect } from "react";
import type { ReactNode } from "react";
import { logOut } from "@/features/auth/authService";
import type { UserRole } from "@/types";

// Define the structure for optional, additional user data.
// Using Record<string, any> for maximum flexibility.
type UserProfile = Record<string, any>;

// Define the structure of the User object.
interface User {
  userid: string; // The primary, unique identifier for the user.
  roles: UserRole[]; // An array of roles assigned to the user.
  activeRole: UserRole; // The currently selected role the user is acting as.
  ids: { // A map of role-specific IDs.
    userid?: string;
    sellerid?: string;
    financeid?: string;
    adminid?: string;
  };
  profile?: UserProfile; // Optional additional user profile data.
}

// Define the shape of the context that will be provided to consuming components.
interface AuthContextType {
  user: User | null; // The current user object, or null if not logged in.
  // Function to set user data after a successful login or session restoration.
  setUserData: (
    userid: string,
    roles: UserRole[],
    ids: {
      userid?: string;
      sellerid?: string;
      financeid?: string;
      adminid?: string;
    },
    profile?: UserProfile

  ) => void;
  getUserID: () => string | null; // Function to get the primary user ID.
  setActiveRole: (role: UserRole) => void; // Function to switch the user's active role.
  getActiveRoleId: () => string | null; // Function to get the ID associated with the current active role.
  getProfile: () => UserProfile | undefined; // Function to get the user's profile data.
  logout: () => void; // Function to log the user out and clear their session.
  getRoles: () => UserRole[] | undefined; // Function to get the user's roles.
}

// Create the React Context for authentication. It's initialized as undefined.
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * AuthProvider Component
 * This component wraps parts of the application that need access to authentication state.
 * It manages the user's session, including login, logout, and role switching.
 * @param {ReactNode} children - The child components that will have access to this context.
 */
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // State to hold the current user object.
  // It initializes its state by trying to read and parse user data from localStorage.
  const [user, setUser] = useState<User | null>(() => {
    try {
      const storedUser = localStorage.getItem("user");
      // If a user object is found in localStorage, parse and return it.
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      console.error("Failed to parse user from localStorage on initial load");
      return null;
    }
  });

  // This effect runs whenever the `user` state changes.
  // It persists the current user object to localStorage, ensuring session continuity.
  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(user));
  }, [user]);

  // This function is called after a successful login to populate the user state.
  const setUserData = (
    userid: string,
    roles: UserRole[],
    ids: {
      userid?: string;
      sellerid?: string;
      financeid?: string;
      adminid?: string;
    },
    profile?: UserProfile
  ) => {
    const userData: User = {
      userid: userid, // The main user ID
      roles: roles,
      activeRole: roles[0], // Default to the first role
      ids: ids,
      profile: profile? { ...profile } : undefined,
    };
    setUser(userData);
  };

  // Allows the user to switch between their assigned roles.
  const setActiveRole = (role: UserRole) => {
    // Only update the active role if the user object exists and the requested role is in their assigned roles.
    if (user && user.roles.includes(role)) {
      setUser({ ...user, activeRole: role });
    }
  };
  // A simple getter function to retrieve the primary user ID.
  const getUserID = (): string | null => {
    if (!user) return null;
    return user.userid;
  };
  // Retrieves the specific ID associated with the user's currently active role.
  const getActiveRoleId = (): string | null => {
    // Return null if no user is logged in.
    if (!user) return null;

    switch (user.activeRole) {
      case "seller":
        return user.ids.sellerid ?? null;
      case "finance":
        return user.ids.financeid ?? null;
      case "admin":
        return user.ids.adminid ?? null;
      case "user":
      // Fallback to the primary user ID if the active role is 'user' or not found.
      default:
        return user.ids.userid ?? null;
    }
  };

  // You can also just access it via `user.profile`
  const getProfile = (): UserProfile | undefined => {
    if (!user) return undefined;
    return user.profile;
  };
  const getRoles = (): UserRole[] | undefined => {
    if (!user) return undefined;
    return user.roles;
  };
  // Clears the user state and removes the user data from localStorage to end the session.
  const logout = async() => {
    await logOut();
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    // Provide the authentication state and functions to all child components.
    <AuthContext.Provider
      value={{
        user,
        setUserData,
        setActiveRole,
        getUserID,
        getActiveRoleId,
        getProfile,
        getRoles,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

/**
 * useAuth Custom Hook
 * A convenience hook for consuming components to easily access the authentication context.
 * It also includes an error check to ensure it's used within an AuthProvider.
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  // If the hook is used outside of an AuthProvider, throw an error to alert the developer.
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
