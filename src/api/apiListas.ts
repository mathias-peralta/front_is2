import API from "@/config/API";
import { CrearListaDto } from "@/models/dto/listas.dto";
import {
  ListaByIDResponse,
  ListasByIDTableroResponse,
} from "@/models/response/listaResponse";

export const getListById = async (idLista: number) => {
  try {
    const listResponse = await API.get<ListaByIDResponse>(
      "/api/listas/" + idLista
    );

    if (listResponse.status === 204) return [];

    if (listResponse.status !== 200) return null;

    return listResponse.data;
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

export const getListByIdTablero = async (idTablero: number) => {
  try {
    const listResponse = await API.get<ListasByIDTableroResponse[]>(
      "/api/listas_tablero/" + idTablero
    );

    if (listResponse.status === 204) return [];

    if (listResponse.status !== 200) return null;

    return listResponse.data;
  } catch {
    return null;
  }
};

export const deleteByIdLista = async (idLista: number) => {
  try {
    const listResponse = await API.delete<ListasByIDTableroResponse[]>(
      "/api/listas/" + idLista
    );

    if (listResponse.status !== 200) return null;

    return true;
  } catch {
    return null;
  }
};
