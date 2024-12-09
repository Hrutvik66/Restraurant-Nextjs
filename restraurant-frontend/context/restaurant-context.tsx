// React
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
// next
import { useParams } from "next/navigation";
// axios
import axios from "axios";

export interface FoodItem {
  id: string;
  name: string;
  description: string;
  price: string;
  isListed: boolean;
  isDeleted: boolean;
  restaurantId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Restaurant {
  id: string;
  name: string;
  location: string;
  description: string;
  slug: string;
  isOpen: boolean;
  foodItems: FoodItem[];
  createdAt: Date;
  updatedAt: Date;
}

interface RestaurantContextType {
  restaurantData: Restaurant | null;
  isRestaurantLoading: boolean;
  isRestaurantError: string | null;
  setRestaurantRefreshKey: React.Dispatch<React.SetStateAction<number>>;
  setRestaurantData: React.Dispatch<React.SetStateAction<Restaurant | null>>;
  setIsRestaurantLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const RestaurantContext = createContext<RestaurantContextType>({
  restaurantData: null,
  isRestaurantLoading: false,
  isRestaurantError: "",
  setRestaurantRefreshKey: () => {},
  setRestaurantData: () => {},
  setIsRestaurantLoading: () => {},
});

export const useRestaurantContext = () => useContext(RestaurantContext);

export const RestaurantProvider = ({ children }: { children: ReactNode }) => {
  const { slug } = useParams();
  const [restaurantData, setRestaurantData] = useState<Restaurant | null>(null);
  const [isRestaurantLoading, setIsRestaurantLoading] = useState(false);
  const [isRestaurantError, setIsRestaurantError] = useState("");
  // Track refresh
  const [restaurantRefreshKey, setRestaurantRefreshKey] = useState<number>(0);

  useEffect(() => {
    if (slug) {
      localStorage.setItem("restaurant", slug as string);
      const fetchRestaurantData = async () => {
        try {
          setIsRestaurantLoading(true);
          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_URL}/api/restaurant/${slug}`
          );
          setRestaurantData(response.data);
        } catch (error) {
          console.error("Failed to load restaurant data:", error);
          setIsRestaurantError("Failed to load restaurant data");
        } finally {
          setIsRestaurantLoading(false);
        }
      };
      fetchRestaurantData();

      // Optional: Set up real-time updates if needed
      // const socket = setupWebSocket(slug);
      // socket.on("restaurantUpdated", (data) => {
      //    setRestaurantData(data);
      // });

      return () => {
        // Cleanup socket or any other subscriptions if added
        // socket.disconnect();
      };
    }
  }, [slug, restaurantRefreshKey]);

  return (
    <RestaurantContext.Provider
      value={{
        restaurantData,
        isRestaurantLoading,
        isRestaurantError,
        setRestaurantRefreshKey,
        setRestaurantData,
        setIsRestaurantLoading,
      }}
    >
      {children}
    </RestaurantContext.Provider>
  );
};
