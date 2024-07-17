import axios from 'axios';

const wstApi = axios.create({
    baseURL: import.meta.env.VITE_WST_API_URL,
});

// Interceptors
wstApi.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

export { wstApi };
