import axios from "axios";

const axiosInstance = axios.create({
  baseURL:
    import.meta.env.VITE_API_BASE_URL ||
    "https://tech-hub-eleaning.onrender.com/api/v1",
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

axiosInstance.interceptors.request.use(
  async (config) => {
    try {
      let token: string | null = null;

      if (typeof window !== "undefined" && (window as any).Clerk) {
        token = await (window as any).Clerk.session?.getToken();
      }

      if (!token) {
        token =
          localStorage.getItem("__clerk_db_jwt") ||
          sessionStorage.getItem("__clerk_db_jwt") ||
          localStorage.getItem("authToken");
      }

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
    } catch (error) {
      console.error("Failed to attach token", error);
      return config;
    }
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      console.error("No response from server");
    } else {
      console.error("API Error:", error.response.status, error.response.data);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
