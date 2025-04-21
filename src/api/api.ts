import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL, // Configura tu URL base desde variables de entorno
  timeout: 10000, // Opcional: Límite de tiempo para las solicitudes
});

// Interceptor para adjuntar el token de acceso automáticamente
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token"); // O usa un contexto si manejas tokens en memoria
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Interceptor para manejar errores globalmente
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      console.log("api.interceptors.response");
      // Intentar refrescar el token si está expirado
      const originalRequest = error.config;
      const refreshToken = localStorage.getItem("refresh_token");

      if (refreshToken && !originalRequest._retry) {
        originalRequest._retry = true;
        try {
          const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/oauth/token`, {
            grant_type: "refresh_token",
            refresh_token: refreshToken,
            client_id: process.env.NEXT_PUBLIC_API_CLIENT_ID,
            client_secret: process.env.NEXT_PUBLIC_API_CLIENT_SECRET,
            scope: "",
          });

          // Guardar el nuevo token y reintentar la solicitud original
          localStorage.setItem("access_token", data.access_token);
          localStorage.setItem("refresh_token", data.refresh_token);
          originalRequest.headers.Authorization = `Bearer ${data.access_token}`;
          console.log("originalRequest", originalRequest);
          return axios(originalRequest);
        } catch (refreshError) {
          // Si falló el refresh token, redirige al login
          console.error("Refresh token failed", refreshError);
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");

          window.location.href = "/";
        }
      }
    }

    return Promise.reject(error);
  },
);

export default api;
