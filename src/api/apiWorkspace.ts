import API from "@/config/API";
import {
  AddWorkspaceDto,
  UpdateWorkspaceDto,
  WorkspaceDto,
} from "@/models/dto/workspace.dto";
import {
  Workspace,
  WorkspaceResponse,
} from "@/models/response/workspaceResponse";

export const createWorksPace = async (data: WorkspaceDto) => {
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

export const getAllWorkspacesById = async (id: number) => {
  try {
    const workspace = await API.get<Workspace[]>("/api/workspaces_all/" + id);

    if (workspace.status !== 200) return null;

    return workspace.data;
  } catch {
    return null;
  }
};

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

export const addWorkspace = async (data: AddWorkspaceDto) => {
  try {
    const workspace = await API.post<WorkspaceResponse[]>(
      "/api/workspaces/miembros/",
      data
    );

    if (workspace.status !== 200) return null;

    return workspace.data;
  } catch {
    return null;
  }
};
