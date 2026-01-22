import axios from 'axios';
import { auth } from '../firebaseConfig'; // Import the auth we just created

const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Point to your backend
});

// Request Interceptor: Auto-attach Token
api.interceptors.request.use(async (config) => {
  const user = auth.currentUser;
  if (user) {
    // 1. Get the latest token from Firebase
    const token = await user.getIdToken();
    // 2. Attach it to the header
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;