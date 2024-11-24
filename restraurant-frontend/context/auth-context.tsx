// react
import { createContext, useState, useEffect, useContext } from "react";
// js-cookie
import Cookies from "js-cookie";
// toast
import { toast } from "@/hooks/use-toast";
// Custom Error Interface
import CustomErrorInterface from "../lib/CustomErrorInterface";
import { useParams } from "next/navigation";
import useApiCall from "@/hooks/use-apicall";

interface UserType {
  email: string;
  restaurant: {
    name: string;
    slug: string;
    location: string;
    description: string;
    isOpen: boolean;
  };
  allowService: boolean;
  createdAt: string;
  updatedAt: string;
}

interface AuthContext {
  user: UserType | null;
  setUser: React.Dispatch<React.SetStateAction<UserType | null>>;
  isAuthenticated: boolean;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  login: (user: UserType) => void;
  logout: () => void;
  isAuthLoading: boolean;
}

const AuthContext = createContext<AuthContext>({
  user: null,
  setUser: () => {},
  isAuthenticated: false,
  setIsAuthenticated: () => {},
  login: () => {},
  logout: () => {},
  isAuthLoading: false,
});

export const useAuthContext = () => useContext(AuthContext);

/**
 * Provides authentication context to its children components.
 * Manages user authentication state, including login and logout functionalities.
 * Fetches and sets the user data if a valid token is present, and updates authentication status.
 * Displays a toast notification upon successful login or error during login attempt.
 *
 * @param {Object} props - The component props.
 * @param {React.ReactNode} props.children - The child components to render within the provider.
 * @returns {JSX.Element} The AuthContext provider component wrapping its children.
 */
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserType | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  const { slug } = useParams();
  const { makeRequest } = useApiCall();

  useEffect(() => {
    /**
     * Fetch user data from server with given role and set it to context if request is successful.
     * Show a toast message according to the response status.
     * @param {string} role - The role of the user that is being fetched.
     * @returns {Promise<void>}
     */

    const fetchUser = async (role: string): Promise<void> => {
      try {
        setIsAuthLoading(true);
        const token = Cookies.get("token");
        const response = await makeRequest({
          url: `/api/${role}/id`,
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            slug,
          },
        });
        if (response && response.status === 200) {
          setUser(response.data);
          setIsAuthenticated(true);

          toast({
            variant: "default",
            title: "Welcome back!",
          });
        }
      } catch (err) {
        const error = err as CustomErrorInterface;
        // logout();
        toast({
          variant: "destructive",
          title: error.response.data.message,
          description: "Please login again.",
        });
      } finally {
        setIsAuthLoading(false);
      }
    };
    fetchUser("owner");
  }, [makeRequest, slug]);

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    Cookies.remove("token");
  };

  const login = (user: UserType) => {
    setIsAuthLoading(true);
    setUser(user);
    setIsAuthenticated(true);
    setIsAuthLoading(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        isAuthenticated,
        setIsAuthenticated,
        login,
        logout,
        isAuthLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
