import axios from 'axios';

// Dynamically resolve Backend Base URL from environment variables
let rawBaseURL = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

// Ensure URL ends with /api/v1
if (!rawBaseURL.endsWith('/api/v1')) {
  rawBaseURL = rawBaseURL.replace(/\/+$/, '') + '/api/v1';
}

const api = axios.create({
  baseURL: rawBaseURL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach Bearer Token from localStorage
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

// Response Interceptor: Handle 401 Unauthorized globally
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response && error.response.status === 401) {
      if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/register')) {
        localStorage.removeItem('it_helpdesk_token');
        localStorage.removeItem('it_helpdesk_user');
      }
    }
    let errorMessage = 'Network error: The IT Helpdesk server is waking up or unreachable.';
    if (error.response && error.response.data) {
      errorMessage = error.response.data.detail || error.response.data.message || JSON.stringify(error.response.data);
    } else if (error.message) {
      errorMessage = error.message;
    }
    return Promise.reject(new Error(errorMessage));
  }
);

export default api;