import axios from 'axios';

const API = axios.create({
  baseURL: 'YOUR_API_BASE_URL',
});

export default API;
