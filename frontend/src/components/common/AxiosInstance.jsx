import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000', // Existing base URL
});

export default axiosInstance;
