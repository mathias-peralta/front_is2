import API from "@/config/API";

interface WorkspaceData {
  propietario: number;
  descripcion_espacio: string;
  nombre_espacio: string;
  fecha_creacion: Date;
  estado_trabajo: string;
}
export const createWorksPace = async (data: WorkspaceData) => {
  try {
    const workspace = await API.post("/api/workspaces", data);

    if (workspace.status !== 201) return null;

    return workspace.data;
  } catch (e) {
    return null;
  }
};
export interface WorkspaceResponse {
  id_espacio: number;
  propietario: number;
  descripcion_espacio: string;
  nombre_espacio: string;
  fecha_creacion: Date;
  estado_espacio: string;
}

export const getAllWorkspaces = async () => {
  try {
    const workspace = await API.get<WorkspaceResponse[]>("/api/workspaces");

    if (workspace.status !== 200) return null;

    return workspace.data;
  } catch {
    return null;
  }
};


export const inactivarEspacio = async (id_espacio: number, propietario: number) => {
  try {
    const response = await API.put(`/api/workspaces/${id_espacio}`, {
      propietario,
      estado_espacio: "inactivo",
    });

    if (response.status !== 200) return null;

    return response.data;
  } catch (error) {
    console.error("Error al inactivar el espacio de trabajo:", error);
    return null;
  }
};
