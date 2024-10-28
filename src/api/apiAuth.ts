import API from "@/config/API";
import { LoginUser, RegisterUser } from "@/models/dto/auth.dto";
import { LoginResponse } from "@/pages/api/login";

export const registerUser = async (userData: RegisterUser) => {
  try {
    const response = await API.post("/api/auth/register", userData);

    if (response.status !== 201) return null;

    return response.data;
  } catch {
    return null;
  }
};

export const loginUser = async (userData: LoginUser) => {
  try {
    const response = await API.post<LoginResponse>("/api/auth/login", userData);

    if (response.status !== 201) return null;

    return response.data;
  } catch {
    return null;
  }
};
