import axios from 'axios';

// Ek central instance banao
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://study-material-19vf.onrender.com',
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
