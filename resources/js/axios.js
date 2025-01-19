import axios from "axios";

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_APP_URL || "http://localhost", // Default base URL
    headers: {
        "X-Requested-With": "XMLHttpRequest", // Required for Laravel
    },
    withCredentials: true, // Enable cookies for cross-origin requests
});

// Optional: Add interceptors for request/response handling
axiosInstance.interceptors.request.use(
    (config) => {
        // You can modify request config here if needed
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    (response) => {
        // Handle successful response
        return response;
    },
    (error) => {
        // Handle error response (e.g., log out users if 401 Unauthorized)
        if (error.response && error.response.status === 401) {
            console.error("Unauthorized! Redirecting to login.");
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
