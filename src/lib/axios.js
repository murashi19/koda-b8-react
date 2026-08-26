import { store } from "@/app/store";
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
});

const publicAuthEndpoints = ["/auth/login", "/auth/register"];

api.interceptors.request.use(
  (config) => {
    const accessToken = store.getState().auth.token;
    const isPublicAuthRequest = publicAuthEndpoints.some((endpoint) =>
      config.url?.startsWith(endpoint),
    );

    if (accessToken && !isPublicAuthRequest) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const requestConfig = error.config;
    const hasAuthHeader = Boolean(requestConfig?.headers?.Authorization);
    const isPublicAuthRequest = publicAuthEndpoints.some((endpoint) =>
      requestConfig?.url?.startsWith(endpoint),
    );

    // Backend may invalidate old JWTs after a token_version change.
    if (
      error.response?.status === 401 &&
      hasAuthHeader &&
      !isPublicAuthRequest &&
      store.getState().auth.token
    ) {
      store.dispatch({ type: "auth/logout" });

      if (window.location.pathname !== "/auth/login") {
        window.location.assign("/auth/login?reason=session-expired");
      }
    }

    return Promise.reject(error);
  },
);

export default api;
