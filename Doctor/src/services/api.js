import axios from "axios";

const api = axios.create({
  baseURL: "https://backend-silk-phi-66.vercel.app/api/v1/doctor",
  withCredentials: true, 
  timeout: 10000,
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve();
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      !error.response ||
      error.response.status !== 401 ||
      originalRequest.url.includes("renew-access-token")
    ) {
      return Promise.reject(error);
    }

    if (originalRequest._retry) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({
          resolve: () => resolve(api(originalRequest)),
          reject,
        });
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      await api.post("/renew-access-token");

      processQueue(null);
      isRefreshing = false;

      return api(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError);
      isRefreshing = false;

      return Promise.reject(refreshError);
    }
  }
);
export default api;
