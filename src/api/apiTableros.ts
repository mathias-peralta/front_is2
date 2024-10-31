import API from "@/config/API";
import { CreateTableroDto } from "@/models/dto/tablero.dto";
import { TableroResponse } from "@/models/response/tableroResponse";

export const getTablerosByWorkspace = async (idEspacio: number) => {
  try {
    const tableroResponse = await API.get<TableroResponse[]>(
      "/api/tableros_all/" + idEspacio
    );

    if (tableroResponse.status === 204) return [];

    if (tableroResponse.status !== 200) return null;

    return tableroResponse.data;
  } catch {
    return null;
  }
};

export const createTableroByWorkspace = async (data: CreateTableroDto) => {
  try {
    const createTableroByWorkspaceResponse = await API.post(
      "/api/tableros",
      data
    );

    if (createTableroByWorkspaceResponse.status === 204) return [];

    if (createTableroByWorkspaceResponse.status !== 201) return null;

    return createTableroByWorkspaceResponse.data;
  } catch {
    return null;
  }
};
