import axios from 'axios';

// Direct Live Render Cloud Backend URL
const LIVE_BACKEND_URL = 'https://it-helpdesk-system-2aj3.onrender.com/api/v1';

let rawBaseURL = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || LIVE_BACKEND_URL;

if (!rawBaseURL.endsWith('/api/v1')) {
  rawBaseURL = rawBaseURL.replace(/\/+$/, '') + '/api/v1';
}

const api = axios.create({
  baseURL: rawBaseURL,
  timeout: 20000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach JWT Bearer Token if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('it_helpdesk_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Global Error & 401 Unauthorized handling
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response && error.response.status === 401) {
      if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/register')) {
        localStorage.removeItem('it_helpdesk_token');
        localStorage.removeItem('it_helpdesk_user');
      }
    }
    let errorMessage = 'Network error: The backend server is waking up or unreachable.';
    if (error.response && error.response.data) {
      errorMessage = error.response.data.detail || error.response.data.message || JSON.stringify(error.response.data);
    } else if (error.message) {
      errorMessage = error.message;
    }
    return Promise.reject(new Error(errorMessage));
  }
);

export default api;