import API from "@/config/API";

export interface RegisterUser {
  correo_usuario: string;
  password_usuario: string;
  nombre_usuario: string;
  apellido_usuario: string;
}
export const registerUser = async (userData: RegisterUser) => {
  try {
    const response = await API.post("/api/auth/register", userData);

    if (response.status !== 201) return null;

    return response.data;
  } catch {
    return null;
  }
};

export interface LoginUser {
  correo_usuario: string;
  password_usuario: string;
}
export interface LoginResponse {
  token: string;
  message: string;
}

export const loginUser = async (userData: LoginUser) => {
  try {
    const response = await API.post<LoginResponse>("/api/auth/login", userData);

    if (response.status !== 201) return null;

    return response.data;
  } catch {
    return null;
  }
};
