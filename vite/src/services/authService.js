import axios from 'axios';

const API_URL = 'http://localhost:3005/api/auth';

export const authService = {
  // Login y guardar token
  login: async (email, password) => {
    const response = await axios.post(`${API_URL}/login`, { email, password });
    
    console.log('Respuesta completa del backend:', response.data); // DEBUG
    
    // IMPORTANTE: Tu backend devuelve el token en data.data.accessToken
    const token = response.data.data?.accessToken;
    const user = response.data.data?.usuario;
    
    if (token) {
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      console.log('Token guardado exitosamente:', token); // DEBUG
    } else {
      console.error('No se encontró token en la respuesta'); // DEBUG
      throw new Error('No se recibió el token del servidor');
    }
    
    return response.data;
  },

  // Logout y limpiar token
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Obtener token actual
  getToken: () => {
    return localStorage.getItem('token');
  },

  // Obtener usuario actual
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // Verificar si está autenticado
  isAuthenticated: () => {
    const token = localStorage.getItem('token');
    if (!token) return false;
    
    // Verificar si el token no ha expirado
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 > Date.now();
    } catch (e) {
      return false;
    }
  }
};