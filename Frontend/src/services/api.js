import axios from 'axios'

const api = axios.create({
  baseURL: 'https://hms-backend-m5m4.onrender.com/api/v1/patient', 
  withCredentials: true,
})


let isRefreshing = false;
let failedQueue = [];

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
api.interceptors.response.use(
  (response) => response, 
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        console.log("🔄 Token refresh already in progress, queueing request...")
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
             console.log("✅ Queued request resumed with new token");
            originalRequest.headers['Authorization'] = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch(Promise.reject);
      }

      originalRequest._retry = true;
      isRefreshing = true;
      console.log("🔐 Access token expired, attempting renewal...");
      try {
       
        const res = await axios.post(
          "http://localhost:8000/api/v1/patient/renew-access-token",
          {},
          { withCredentials: true }
        );

        const newAccessToken = res.data.data.accesstoken; 
        console.log("✅ Access token renewed successfully!");
        console.log(`📊 Queued requests: ${failedQueue.length}`);


        api.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
  
        isRefreshing = false;
        processQueue(null, newAccessToken);
         console.log("🚀 Retrying original request...");

        return api(originalRequest);
      } catch (refreshError) {
         console.error("❌ Token refresh failed:", refreshError.response?.data || refreshError.message);
         
        isRefreshing = false;
        processQueue(refreshError, null);

        console.warn("Token refresh failed — forcing logout");
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;

