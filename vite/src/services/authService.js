import axios from 'axios';

const API_URL = 'http://localhost:3005/api/auth';

export const authService = {
  // Login y guardar token
  login: async (email, password) => {
    const response = await axios.post(`${API_URL}/login`, { email, password });
    
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
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