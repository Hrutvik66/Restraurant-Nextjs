import { useEffect, useState } from "react";

const useSSE = (url: string, updateFor: string) => {
  const [data, setData] = useState({});
  const [orderData, setOrderData] = useState({});
  const [restaurantStatusData, setRestaurantStatusData] = useState({});

  useEffect(() => {
    const eventSource = new EventSource(url);

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("Received SSE:", data);
        if (updateFor === "Menu") {
          setData(data);
        } else if (updateFor === "Order") {
          setOrderData(data);
        } else if (updateFor === "RestaurantStatus") {
          setRestaurantStatusData(data);
        }
      } catch (error) {
        console.error("Error parsing SSE event:", error);
      }
    };

    return () => {
      eventSource.close();
    };
  }, [url, updateFor]);

  return { data, orderData, restaurantStatusData };
};

export default useSSE;
