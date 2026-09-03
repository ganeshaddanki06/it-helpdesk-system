import axios from 'axios';

// Localhost లో ఉంటే Local Backend ని, Vercel లో ఉంటే Cloud Backend ని ఆటోమేటిక్ గా వాడుతుంది
const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

const baseURL = isLocal 
  ? 'http://127.0.0.1:8000/api/v1' 
  : 'https://it-helpdesk-system-2aj3.onrender.com/api/v1';

const api = axios.create({
  baseURL: baseURL,
  timeout: 45000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach JWT Token
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

// Response Interceptor: Safe error handling
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    let errorMessage = 'Network error: Server is starting or unreachable.';
    if (error.response && error.response.data) {
      errorMessage = error.response.data.detail || error.response.data.message || JSON.stringify(error.response.data);
    } else if (error.message) {
      errorMessage = error.message;
    }
    return Promise.reject(new Error(errorMessage));
  }
);

export default api;