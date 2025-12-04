// src/services/patientApi.js
import axios from "axios";

// ----------------------------
// BASE API INSTANCE
// ----------------------------
const api = axios.create({
  baseURL: "https://hms-backend-m5m4.onrender.com/api/v1/patient",
  withCredentials: true, // needed for refreshToken cookie
});

// ----------------------------
// REQUEST INTERCEPTOR
// ----------------------------
// This ensures EVERY request includes Authorization header if token exists
api.interceptors.request.use((config) => {
  const token = api.defaults.headers.common["Authorization"];
  if (token) {
    config.headers["Authorization"] = token;
  }
  return config;
});

// ----------------------------
// REFRESH TOKEN LOGIC
// ----------------------------
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(token);
  });
  failedQueue = [];
};

const hasRefreshCookie = () => {
  try {
    return document.cookie.split(";").some((c) => c.trim().startsWith("refreshToken="));
  } catch {
    return false;
  }
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is not 401 → return normally
    if (!error.response || error.response.status !== 401) {
      return Promise.reject(error);
    }

    // If no refresh cookie exists → do not try refresh
    if (!hasRefreshCookie()) {
      return Promise.reject(error);
    }

    // Prevent infinite loops
    if (originalRequest._retry) {
      return Promise.reject(error);
    }

    // If refresh already in progress → queue this request
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({
          resolve: (token) => {
            originalRequest.headers = originalRequest.headers || {};
            originalRequest.headers["Authorization"] = `Bearer ${token}`;
            resolve(api(originalRequest)); // retry original request
          },
          reject,
        });
      });
    }

    // Mark for retry
    originalRequest._retry = true;
    isRefreshing = true;

    try {
      // Call refresh endpoint WITHOUT using `api` instance
      const refreshRes = await axios.post(
        "https://hms-backend-m5m4.onrender.com/api/v1/patient/renew-access-token",
        {},
        { withCredentials: true }
      );

      const newAccessToken = refreshRes?.data?.data?.accesstoken;
      if (!newAccessToken) throw new Error("No access token returned on refresh");

      // Set header for all future requests
      api.defaults.headers.common["Authorization"] = `Bearer ${newAccessToken}`;

      // Process queued requests
      processQueue(null, newAccessToken);
      isRefreshing = false;

      // Retry original request
      originalRequest.headers = originalRequest.headers || {};
      originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
      return api(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError, null);
      isRefreshing = false;

      return Promise.reject(refreshError);
    }
  }
);

export default api;
