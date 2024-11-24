import { toast } from "@/hooks/use-toast";
import {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
} from "react";
// food-context
import { useRestaurantContext } from "./restaurant-context";

interface CartItem {
  itemId: string;
  quantity: number;
}

interface FilteredItem {
  id: string;
  name: string;
  description: string;
  price: string;
  quantity: number;
  isListed: boolean;
  isDeleted: boolean;
}

interface CartContextType {
  cartItems: CartItem[];
  filteredCartItems: FilteredItem[];
  addItemToCart: (itemId: string) => Promise<void>;
  updateItemFromCart: (itemId: string, change: number) => void;
  setCartRefreshKey: React.Dispatch<React.SetStateAction<number>>;
}

const CartContext = createContext<CartContextType>({
  cartItems: [],
  filteredCartItems: [],
  addItemToCart: async () => {},
  updateItemFromCart: async () => {},
  setCartRefreshKey: () => {},
});

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const { restaurantData } = useRestaurantContext();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [filteredCartItems, setFilteredCartItems] = useState<FilteredItem[]>(
    []
  );
  const [cartRefreshKey, setCartRefreshKey] = useState<number>(0);

  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      setCartItems(JSON.parse(storedCart));
    }
  }, []);

  // Filter food items based on what's in the cart
  useEffect(() => {
    if (restaurantData?.foodItems && cartItems.length > 0) {
      const filteredItems = cartItems
        .map((cartItem) => {
          const foodItem = restaurantData?.foodItems.find(
            (item) => item.id == cartItem.itemId
          );
          if (foodItem) {
            if (!foodItem.isDeleted && foodItem.isListed) {
              return {
                ...foodItem,
                quantity: cartItem.quantity, // Include the quantity from the cart
              };
            } else {
              // remove the item from the cart and local storage
              const updatedCart = cartItems.filter(
                (item) => item.itemId !== cartItem.itemId
              );
              localStorage.setItem("cart", JSON.stringify(updatedCart));
              return null;
            }
          }
          return null;
        })
        .filter((item) => item !== null); // Filter out null items (in case some IDs don't match)

      setFilteredCartItems(filteredItems);
    }
  }, [restaurantData, cartItems, cartRefreshKey]);

  const addItemToCart = async (itemId: string) => {
    const existingItem = cartItems.find((item) => item.itemId === itemId);
    const quantity: number = 1;
    if (!existingItem) {
      const updatedCart = [...cartItems, { itemId, quantity }];
      setCartItems(updatedCart);
      localStorage.setItem("cart", JSON.stringify(updatedCart));
    } else {
      toast({
        title: "Item already exists in cart",
        description: "You've already added this item to your cart.",
      });
    }
  };

  const updateItemFromCart = (id: string, change: number) => {
    const updatedCart = cartItems
      .map((item) =>
        item.itemId === id
          ? { ...item, quantity: Math.max(0, item.quantity + change) }
          : item
      )
      .filter((item) => item.quantity > 0);
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    setFilteredCartItems((items) =>
      items
        .map((item) =>
          item.id === id
            ? {
                ...item,
                quantity: Math.max(0, item.quantity + change),
              }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        filteredCartItems,
        addItemToCart,
        updateItemFromCart,
        setCartRefreshKey,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  return context;
};
