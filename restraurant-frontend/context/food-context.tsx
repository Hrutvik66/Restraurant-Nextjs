import {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useContext,
} from "react";
import axios from "axios";

interface FoodItem {
  id: string;
  name: string;
  description: string;
  price: string;
  isListed: boolean;
  isDeleted: boolean;
  OrderItem: object[];
}

export interface FoodContextType {
  foodItems: FoodItem[];
  loading: boolean;
  error: string | null;
  setRefreshKey: React.Dispatch<React.SetStateAction<number>>;
}

const FoodContext = createContext<FoodContextType>({
  foodItems: [],
  loading: false,
  error: null,
  setRefreshKey: () => {},
});

export const FoodProvider = ({ children }: { children: ReactNode }) => {
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  // Track refresh
  const [refreshKey, setRefreshKey] = useState<number>(0);

  useEffect(() => {
    const fetchFoodItems = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_URL}/api/food`
        );
        console.log("hi");

        setFoodItems(response.data);
      } catch (error) {
        setError("Failed to fetch food items");
      } finally {
        setLoading(false);
      }
    };

    fetchFoodItems();
  }, [refreshKey]);

  return (
    <FoodContext.Provider value={{ foodItems, loading, error, setRefreshKey }}>
      {children}
    </FoodContext.Provider>
  );
};

export const useFood = () => {
  const context = useContext(FoodContext);
  return context;
};
