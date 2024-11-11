import { useState } from "react";
import axios from "axios";

const useApiCall = () => {
  const [isLoadingRequest, setIsLoadingRequest] = useState(false);

  const apiCall = async (url: string, method: string, data: object = {}) => {
    setIsLoadingRequest(true);
    const URL = process.env.NEXT_PUBLIC_URL + url;
    try {
      const response = await axios({
        method,
        url: URL,
        data,
      });
      if (response.status === 200 || response.status === 201) {
        return response;
      }
      console.log("apiCall", response);

      setIsLoadingRequest(false);
    } catch (err) {
      console.log("apiCall", err);
      setIsLoadingRequest(false);
      throw err;
    }
  };

  return { isLoadingRequest, apiCall };
};

export default useApiCall;
