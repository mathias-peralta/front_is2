import API from "@/config/API";
import { CrearListaDto } from "@/models/dto/listas.dto";

export const getListById = async (idLista: number) => {
  try {
    const listResponse = await API.get("/api/listas/" + idLista);
  } catch {
    return null;
  }
};

export const crearLista = async (data: CrearListaDto) => {
  try {
    const listResponse = await API.post("/api/listas/", data);

    if (listResponse.status !== 201) return null;

    return listResponse.data;
  } catch {
    return null;
  }
};
