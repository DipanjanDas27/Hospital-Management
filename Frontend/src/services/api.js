// src/services/patientApi.js
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://hms-backend-m5m4.onrender.com/api/v1/patient",
  withCredentials: true, // important to send cookies
});

// queue helpers
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(token);
  });
  failedQueue = [];
};

// helper to check cookie presence safely
const hasRefreshCookie = () => {
  try {
    // look for cookie name refreshToken (exact substring)
    return document.cookie.split(";").some((c) => c.trim().startsWith("refreshToken="));
  } catch (e) {
    return false;
  }
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // if no response or not 401, forward
    if (!error.response || error.response.status !== 401) {
      return Promise.reject(error);
    }

    // If no refresh cookie => user is not logged in, do not attempt refresh
    if (!hasRefreshCookie()) {
      return Promise.reject(error);
    }

    // protect from retry loops
    if (originalRequest._retry) {
      return Promise.reject(error);
    }

    // if a refresh is already happening, queue this request
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({
          resolve: (token) => {
            if (!originalRequest.headers) originalRequest.headers = {};
            originalRequest.headers["Authorization"] = `Bearer ${token}`;
            resolve(api(originalRequest));
          },
          reject: (err) => reject(err),
        });
      });
    }

    // start refresh
    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const refreshRes = await axios.post(
        // use full URL to avoid using this instance's interceptors
        `${import.meta.env.VITE_API_URL?.replace(/\/api\/v1\/patient\/?$/, "") || "https://hms-backend-m5m4.onrender.com"}/api/v1/patient/renew-access-token`,
        {},
        { withCredentials: true }
      );

      // backend should return { success: true, data: { accesstoken: "..." } }
      const newAccessToken = refreshRes?.data?.data?.accesstoken;
      if (!newAccessToken) {
        throw new Error("No access token in refresh response");
      }

      // set default header for future requests
      api.defaults.headers.common["Authorization"] = `Bearer ${newAccessToken}`;

      // resolve queued requests
      processQueue(null, newAccessToken);
      isRefreshing = false;

      // set header on original and retry
      originalRequest.headers = originalRequest.headers || {};
      originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
      return api(originalRequest);
    } catch (refreshError) {
      // fail queue
      processQueue(refreshError, null);
      isRefreshing = false;

      // optional: if refresh returns 401, you might want to dispatch logout here
      // e.g., store.dispatch(logoutAction());
      return Promise.reject(refreshError);
    }
  }
);

export default api;
