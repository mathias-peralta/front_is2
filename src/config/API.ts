import axios, { AxiosError, AxiosResponse } from "axios";
import { AppConfig } from "../config/config";

const API = axios.create({
  baseURL: AppConfig.baseUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

API.interceptors.request.use((config) => {
  return config;
});

API.interceptors.response.use(
  (response: AxiosResponse<any>) => {
    // configurar intercepcion(decrypt) de respuesta

    return response;
  },
  (error: AxiosError<any>) => {
    return error.response;
  }
);

export default API;
