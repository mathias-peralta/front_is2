import API from "@/config/API";

interface WorkspaceData {
  propietario: number;
  descripcion_espacio: string;
  nombre_espacio: string;
  fecha_creacion: Date;
  estado_trabajo: string;
}
export interface WorkspaceResponse {
  message: string;
  workspace: Workspace;
}

export interface Workspace {
  id_espacio: number;
  propietario: number;
  descripcion_espacio: string;
  nombre_espacio: string;
  fecha_creacion: Date;
  estado_espacio: null;
}

export const createWorksPace = async (data: WorkspaceData) => {
  try {
    const workspace = await API.post<WorkspaceResponse>(
      "/api/workspaces",
      data
    );

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

interface UpdateWorkspaceDto {
  id: number;
  estado_espacio: "activo" | "inactivo";
}
export const updateWorkspace = async ({
  id,
  estado_espacio,
}: UpdateWorkspaceDto) => {
  try {
    const workspace = await API.put<WorkspaceResponse[]>(
      "/api/workspaces/" + id,
      {
        estado_espacio: estado_espacio,
      }
    );

    if (workspace.status !== 200) return null;

    return workspace.data;
  } catch {
    return null;
  }
};
