import axios from 'axios';
const API_URL = 'http://10.117.10.26:5000/api';
const api = axios.create({ baseURL: API_URL });
export default api;