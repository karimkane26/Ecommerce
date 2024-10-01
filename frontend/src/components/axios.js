import axios from "axios";

// Crée une instance Axios
const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

// Intercepteur pour inclure automatiquement le token dans les en-têtes des requêtes
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Ajoute le token JWT dans l'en-tête
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
