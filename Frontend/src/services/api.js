import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8000/api/v1/patient', 
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})
// --- Flag to prevent multiple renewals at once ---
let isRefreshing = false;
let failedQueue = [];

// --- Helper: re-attempt requests after token refresh ---
const processQueue = (error, token = null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(token);
    }
  });
  failedQueue = [];
};

// --- Response Interceptor ---
api.interceptors.response.use(
  (response) => response, // success: just return response
  async (error) => {
    const originalRequest = error.config;

    // If unauthorized (401) and not already retried
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Queue requests while refresh is in progress
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then(() => api(originalRequest))
          .catch(Promise.reject);
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // --- Attempt to renew access token ---
        const res = await axios.post(
          "http://localhost:8000/api/v1/patient/renew-access-token",
          {},
          { withCredentials: true }
        );

        isRefreshing = false;
        processQueue(null, res.data);

        // --- Retry the failed request automatically ---
        return api(originalRequest);
      } catch (refreshError) {
        isRefreshing = false;
        processQueue(refreshError, null);

        // Optional: clear cookies or redirect to login
        console.warn("Token refresh failed — forcing logout");
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;

