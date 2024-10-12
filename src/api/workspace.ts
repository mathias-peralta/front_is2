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
