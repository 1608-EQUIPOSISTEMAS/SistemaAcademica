import axios from 'axios';
import { authService } from './authService';

const API_URL = 'https://sistemabackendacademica.onrender.com/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use(
  (config) => {
    const token = authService.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const plantillaService = {
  getAll: async () => {
    const response = await api.get('/plantillas');
    return response.data;
  },
  
  create: async (data) => {
    const response = await api.post('/plantillas', data);
    return response.data;
  },
  
  delete: async (id) => {
    const response = await api.delete(`/plantillas/${id}`);
    return response.data;
  },
  
  downloadTemplate: async () => {
    const response = await api.get('/plantillas/template', {
      responseType: 'arraybuffer'
    });
    return response.data;
  },
  
  uploadExcel: async (formData) => {
    const response = await api.post('/plantillas/upload-excel', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },
  
  procesarCSV: async () => {
    const response = await api.post('/plantillas/procesar');
    return response.data;
  }
};