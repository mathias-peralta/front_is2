import API from "@/config/API";

export interface UsuariosResponse {
  id_usuario: number;
  correo_usuario: string;
  nombre_usuario: string;
  apellido_usuario: string;
}
export const getAllUsers = async () => {
  try {
    const response = await API.get<UsuariosResponse[]>("/api/auth/usuarios");

    if (response.status !== 200) return null;

    return response.data;
  } catch {
    return null;
  }
};

export const getUserById = async (id: string) => {
  try {
    const response = await API.get<UsuariosResponse>(`/api/user/${id}`);

    if (response.status !== 200) return null;

    return response.data;
  } catch {
    return null;
  }
};
