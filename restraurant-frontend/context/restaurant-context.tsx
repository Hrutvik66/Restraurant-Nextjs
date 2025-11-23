// React
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
} from "react";
// next
import { useParams } from "next/navigation";
// axios
import axios from "axios";
// hooks
import useSSE from "@/hooks/use-sse";
import { toast } from "@/hooks/use-toast";

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
  allowService: boolean;
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

  // SSE for restaurant status updates
  const { restaurantStatusData } = useSSE(
    `${
      process.env.NEXT_PUBLIC_URL || "http://localhost:3001"
    }/api/user/restaurant-status/events`,
    "RestaurantStatus"
  );
  const lastProcessedStatusEventRef = useRef<{
    slug: string;
    isOpen: boolean;
    timestamp: number;
  } | null>(null);

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
    }
  }, [slug, restaurantRefreshKey]);

  // Handle restaurant status SSE events
  const handleRestaurantStatusSSE = useCallback(
    (sseData: any) => {
      // Ignore initial connection message
      if (sseData.message === "Connected to SSE") {
        return;
      }

      // Check if we have restaurant data in the event
      if (!sseData.restaurant) {
        return;
      }

      // Prevent duplicate processing of the same event
      const timestamp = Date.now();
      const lastEvent = lastProcessedStatusEventRef.current;

      // Skip if we've processed the same event recently (within 500ms)
      if (
        lastEvent &&
        lastEvent.slug === sseData.restaurant.slug &&
        lastEvent.isOpen === sseData.restaurant.isOpen &&
        timestamp - lastEvent.timestamp < 500
      ) {
        return;
      }

      // Mark this event as processed
      lastProcessedStatusEventRef.current = {
        slug: sseData.restaurant.slug,
        isOpen: sseData.restaurant.isOpen,
        timestamp,
      };

      // Only update if the slug matches the current restaurant
      if (sseData.restaurant.slug === slug) {
        // Update restaurant data with new status
        setRestaurantData((prevData) => {
          if (prevData) {
            const wasOpen = prevData.isOpen;
            const isNowOpen = sseData.restaurant.isOpen;
            const wasServiceAllowed = prevData.allowService;
            const isServiceAllowed = sseData.restaurant.allowService;

            // Show toast notification if status actually changed
            if (wasServiceAllowed !== isServiceAllowed) {
              setTimeout(() => {
                toast({
                  title: "Service Status Updated",
                  description:
                    sseData.message ||
                    `Service has been ${
                      isServiceAllowed ? "allowed" : "disallowed"
                    }`,
                  variant: isServiceAllowed ? "default" : "destructive",
                });
              }, 100);
            } else if (wasOpen !== isNowOpen) {
              setTimeout(() => {
                toast({
                  title: "Restaurant Status Updated",
                  description:
                    sseData.message ||
                    `Restaurant is now ${isNowOpen ? "open" : "closed"}`,
                });
              }, 100);
            }

            return {
              ...prevData,
              isOpen: sseData.restaurant.isOpen,
              allowService: sseData.restaurant.allowService,
            };
          }
          return prevData;
        });

        // Optionally refresh restaurant data to ensure consistency
        setRestaurantRefreshKey((prev) => prev + 1);
      }
    },
    [slug]
  );

  useEffect(() => {
    if (restaurantStatusData && Object.keys(restaurantStatusData).length > 0) {
      handleRestaurantStatusSSE(restaurantStatusData);
    }
  }, [restaurantStatusData, handleRestaurantStatusSSE]);

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
