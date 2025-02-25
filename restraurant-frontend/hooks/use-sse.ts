import { useEffect, useState } from "react";

const useSSE = (url: string, updateFor: string) => {
  const [data, setData] = useState({});
  const [orderData, setOrderData] = useState({});

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
        }
      } catch (error) {
        console.error("Error parsing SSE event:", error);
      }
    };

    return () => {
      eventSource.close();
    };
  }, []);

  return { data, orderData };
};

export default useSSE;
