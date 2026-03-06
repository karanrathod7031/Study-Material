import axios from 'axios';

const API = axios.create({
  // FIX: Added /api to the end of the Render URL
  baseURL: import.meta.env.VITE_API_URL || 'https://study-material-19vf.onrender.com/api',
  withCredentials: true 
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

export default API;
