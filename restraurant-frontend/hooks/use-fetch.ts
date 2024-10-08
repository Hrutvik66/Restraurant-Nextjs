"use client";
import axios from "axios";
import { useEffect, useState } from "react";

const useFetch = (url: string) => {
  const [isLoading, setIsLoading] = useState(false);
  const [apiData, setApiData] = useState(null);
  const [serverError, setServerError] = useState<string | null>(null);
  // Track refresh
  const [refreshKey, setRefreshKey] = useState<number>(0);

  useEffect(() => {
    setIsLoading(true);

    const fetchData = async () => {
      const URL = process.env.NEXT_PUBLIC_URL + url;
      try {
        const resp = await axios.get(URL);
        console.log(resp);

        setApiData(resp.data);
      } catch (error: any) {
        setServerError(error.message || "Something went wrong");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [refreshKey, url]);

  return { isLoading, apiData, serverError, setRefreshKey, setIsLoading };
};

export default useFetch;
