import { useState, useCallback } from "react";
import axios from "axios";

/**
 * useApiRequest - Custom hook for making API requests with Axios.
 * @param {string} baseURL - Optional base URL for the API.
 * @returns {object} - Contains `loading`, `error`, and `makeRequest`.
 */
const useApiCall = () => {
  const [loading, setLoading] = useState(false);
  const baseURL = process.env.NEXT_PUBLIC_URL;
  /**
   * makeRequest - Function to make an API request.
   * @param {object} config - Axios request config object.
   * @param {string} config.url - Endpoint URL (required).
   * @param {string} [config.method='GET'] - HTTP method (e.g., 'GET', 'POST', etc.).
   * @param {object} [config.data=null] - Request payload for POST/PUT requests.
   * @param {object} [config.params=null] - Query parameters for GET requests.
   * @param {string} [config.token=null] - Optional token for Authorization header.
   * @returns {object} - Contains response data from API or error (if any).
   */
  const makeRequest = useCallback(
    async ({
      url,
      method = "GET",
      data,
      params,
      headers,
    }: {
      url: string;
      method?: string;
      data?: object;
      params?: object;
      headers?: object;
    }) => {
      setLoading(true);

      try {
        const response = await axios({
          baseURL,
          url,
          method,
          data,
          params,
          headers: headers,
        });

        return response;
      } catch (err) {
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [baseURL]
  );

  return { loading, makeRequest };
};

export default useApiCall;
