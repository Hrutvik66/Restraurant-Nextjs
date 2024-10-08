import { useState } from "react";
import axios from "axios";

const useApiCall = () => {
  const [isLoadingRequest, setIsLoadingRequest] = useState(false);
  const [error, setError] = useState(null);

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
      setIsLoadingRequest(false);
    } catch (err) {
      setError(err);
      setIsLoadingRequest(false);
    }
  };

  return { isLoadingRequest, error, apiCall };
};

export default useApiCall;
