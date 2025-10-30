import axios from 'axios';
import { authService } from './authService';

const API_URL = 'https://sistemabackendacademica.onrender.com/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// INTERCEPTOR: Agrega token automáticamente
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

// INTERCEPTOR: Maneja token expirado
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      authService.logout();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const alumnosService = {
  getAll: async () => {
    const response = await api.get('/alumnos');
    return response.data;
  },
  
  getById: async (id) => {
    const response = await api.get(`/alumnos/${id}`);
    return response.data;
  },
  
  create: async (data) => {
    const response = await api.post('/alumnos', data);
    return response.data;
  },
  
  update: async (id, data) => {
    const response = await api.put(`/alumnos/${id}`, data);
    return response.data;
  },
  
  delete: async (id) => {
    const response = await api.delete(`/alumnos/${id}`);
    return response.data;
  }
};