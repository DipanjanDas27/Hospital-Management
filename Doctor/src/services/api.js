import axios from "axios";

const api = axios.create({
  baseURL: "https://backend-rose-six-eyc7qvg7ik.vercel.app/api/v1/doctor",
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = api.defaults.headers.common["Authorization"];
  if (token) {
    config.headers["Authorization"] = token;
  }
  return config;
});


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
    return document.cookie.split(";").some((c) =>
      c.trim().startsWith("refreshToken=")
    );
  } catch {
    return false;
  }
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    
    if (!error.response || error.response.status !== 401) {
      return Promise.reject(error);
    }

    
    if (!hasRefreshCookie()) {
      return Promise.reject(error);
    }

   
    if (originalRequest._retry) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({
          resolve: (token) => {
            originalRequest.headers = originalRequest.headers || {};
            originalRequest.headers["Authorization"] = `Bearer ${token}`;
            resolve(api(originalRequest));
          },
          reject,
        });
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const refreshRes = await axios.post(
        "https://backend-rose-six-eyc7qvg7ik.vercel.app/api/v1/doctor/renew-access-token",
        {},
        { withCredentials: true }
      );

      const newAccessToken = refreshRes?.data?.data?.accesstoken;
      if (!newAccessToken) throw new Error("No access token returned");

      api.defaults.headers.common["Authorization"] = `Bearer ${newAccessToken}`;

      processQueue(null, newAccessToken);
      isRefreshing = false;

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
