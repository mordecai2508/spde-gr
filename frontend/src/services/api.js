import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001/api', // Ajusta la URL según tu backend
});

export default api;