import axios from "axios";
import type { InternalAxiosRequestConfig } from "axios";
import type { AxiosInstance } from "axios";
import { useAuth } from "@clerk/clerk-react";
import { useMemo } from "react";

// Create base axios instance
const createAxiosInstance = (): AxiosInstance => {
  return axios.create({
    baseURL:
      process.env.API_BASE_URL ||
      "https://tech-hub-eleaning.onrender.com/api/v1",
    timeout: 10000,
    headers: {
      "Content-Type": "application/json",
    },
  });
};

// Base axios instance (without auth)
export const axiosInstance = createAxiosInstance();

/**
 * Custom hook to create an authenticated axios instance
 * This hook uses Clerk's getToken method to automatically add auth headers
 */
export const useAuthenticatedAxios = (): AxiosInstance => {
  const { getToken, isLoaded, isSignedIn } = useAuth();

  const authenticatedAxios = useMemo(() => {
    const instance = createAxiosInstance();

    // Request interceptor to add Clerk token
    instance.interceptors.request.use(
      async (config: InternalAxiosRequestConfig) => {
        if (isLoaded && isSignedIn) {
          try {
            // Get Clerk session token
            const token = await getToken();
            if (token) {
              config.headers.Authorization = `Bearer ${token}`;
            }
          } catch (error) {
            console.error("Error getting Clerk token:", error);
          }
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor for error handling
    instance.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response) {
          switch (error.response.status) {
            case 401:
              console.error("Unauthorized - Authentication required");
              // Optionally trigger sign-in
              break;
            case 403:
              console.error("Forbidden - Insufficient permissions");
              break;
            case 404:
              console.error("Resource not found");
              break;
            case 500:
              console.error("Server error");
              break;
            default:
              console.error("API Error:", error.response.data);
          }
        } else if (error.request) {
          console.error("No response from server");
        } else {
          console.error("Request error:", error.message);
        }
        return Promise.reject(error);
      }
    );

    return instance;
  }, [getToken, isLoaded, isSignedIn]);

  return authenticatedAxios;
};

/**
 * Function to get authenticated axios instance outside of React components
 * This requires passing the getToken function from Clerk
 */
export const createAuthenticatedAxios = (
  getToken: () => Promise<string | null>
): AxiosInstance => {
  const instance = createAxiosInstance();

  instance.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
      try {
        const token = await getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (error) {
        console.error("Error getting Clerk token:", error);
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response) {
        switch (error.response.status) {
          case 401:
            console.error("Unauthorized - Authentication required");
            break;
          case 403:
            console.error("Forbidden - Insufficient permissions");
            break;
          case 404:
            console.error("Resource not found");
            break;
          case 500:
            console.error("Server error");
            break;
          default:
            console.error("API Error:", error.response.data);
        }
      }
      return Promise.reject(error);
    }
  );

  return instance;
};

export default axiosInstance;
