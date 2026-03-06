import axios from 'axios';

const API = axios.create({
  // 1. Ensure this variable name matches what you typed in Vercel Settings
  // 2. Added /api to the fallback URL to match your backend routes
  baseURL: import.meta.env.VITE_API_URL || 'https://study-material-19vf.onrender.com/api',
  
  // 3. Crucial for Cross-Origin requests between Vercel and Render
  withCredentials: true 
});

// Request interceptor: Token automatically har request mein chala jayega
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;
