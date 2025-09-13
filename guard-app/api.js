import axios from 'axios';
const API_URL = 'https://vms-api-wvct.onrender.com/api';
const api = axios.create({ baseURL: API_URL });
export default api;