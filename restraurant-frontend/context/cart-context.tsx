import { toast } from "@/hooks/use-toast";
import {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
  useCallback,
  useRef,
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
  getTotalPrice: () => number;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType>({
  cartItems: [],
  filteredCartItems: [],
  addItemToCart: async () => {},
  updateItemFromCart: async () => {},
  setCartRefreshKey: () => {},
  getTotalPrice: () => 0,
  clearCart: () => {},
});

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const { restaurantData } = useRestaurantContext();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [filteredCartItems, setFilteredCartItems] = useState<FilteredItem[]>(
    []
  );
  const [cartRefreshKey, setCartRefreshKey] = useState<number>(0);
  // Track previous restaurant status to detect changes
  const prevRestaurantStatusRef = useRef<{
    allowService: boolean | undefined;
    isOpen: boolean | undefined;
  } | null>(null);

  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      setCartItems(JSON.parse(storedCart));
    }
  }, []);

  // Clear cart when restaurant service is disallowed or restaurant is closed
  useEffect(() => {
    if (restaurantData) {
      const prevStatus = prevRestaurantStatusRef.current;
      const currentAllowService = restaurantData.allowService;
      const currentIsOpen = restaurantData.isOpen;

      // Check if status changed from valid to invalid
      const wasServiceAllowed = prevStatus?.allowService ?? true;
      const wasOpen = prevStatus?.isOpen ?? true;
      const isServiceAllowed = currentAllowService ?? false;
      const isOpen = currentIsOpen ?? false;

      // Clear cart if:
      // 1. Service was allowed but now disallowed, OR
      // 2. Restaurant was open but now closed
      // AND cart has items
      const shouldClearCart =
        ((wasServiceAllowed && !isServiceAllowed) || (wasOpen && !isOpen)) &&
        cartItems.length > 0;

      if (shouldClearCart) {
        setCartItems([]);
        localStorage.removeItem("cart");
        setFilteredCartItems([]);

        toast({
          title: "Cart Cleared",
          description: !isServiceAllowed
            ? "Service has been suspended. Your cart has been cleared."
            : "Restaurant is now closed. Your cart has been cleared.",
          variant: "destructive",
        });
      }

      // Update previous status (only if status actually changed to avoid unnecessary updates)
      if (
        prevStatus?.allowService !== currentAllowService ||
        prevStatus?.isOpen !== currentIsOpen
      ) {
        prevRestaurantStatusRef.current = {
          allowService: currentAllowService,
          isOpen: currentIsOpen,
        };
      }
    }
  }, [restaurantData?.allowService, restaurantData?.isOpen, cartItems.length]);

  // Filter food items based on what's in the cart
  useEffect(() => {
    if (restaurantData?.foodItems) {
      setFilteredCartItems((prevFiltered) => {
        if (cartItems.length === 0) {
          return [];
        }

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
                setCartItems((prevItems) => {
                  const updatedCart = prevItems.filter(
                    (item) => item.itemId !== cartItem.itemId
                  );
                  localStorage.setItem("cart", JSON.stringify(updatedCart));
                  return updatedCart;
                });
                return null;
              }
            }
            return null;
          })
          .filter((item) => item !== null); // Filter out null items (in case some IDs don't match)

        return filteredItems;
      });
    }
  }, [restaurantData, cartItems, cartRefreshKey]);

  const addItemToCart = useCallback(async (itemId: string) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.itemId === itemId);
      const quantity: number = 1;
      if (!existingItem) {
        const updatedCart = [...prevItems, { itemId, quantity }];
        localStorage.setItem("cart", JSON.stringify(updatedCart));
        return updatedCart;
      } else {
        toast({
          title: "Item already exists in cart",
          description: "You've already added this item to your cart.",
        });
        return prevItems;
      }
    });
  }, []);

  const updateItemFromCart = useCallback((id: string, change: number) => {
    setCartItems((prevItems) => {
      const updatedCart = prevItems
        .map((item) =>
          item.itemId === id
            ? { ...item, quantity: Math.max(0, item.quantity + change) }
            : item
        )
        .filter((item) => item.quantity > 0);
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      return updatedCart;
    });

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
  }, []);

  // clear cart
  const clearCart = useCallback(() => {
    setCartItems([]);
    localStorage.removeItem("cart");
    setFilteredCartItems([]);
  }, []);

  // get the total price of all items
  const getTotalPrice = useCallback(() => {
    const total = filteredCartItems.reduce(
      (sum, item) => sum + Number(item.price) * item.quantity,
      0
    );
    return total;
  }, [filteredCartItems]);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        filteredCartItems,
        addItemToCart,
        updateItemFromCart,
        setCartRefreshKey,
        getTotalPrice,
        clearCart,
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
