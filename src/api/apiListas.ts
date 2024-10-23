import API from "@/config/API";

export const getListById = async (idLista: number) => {
  try {
    const listResponse = await API.get("/api/listas/" + idLista);
  } catch {
    return null;
  }
};

interface CrearListaDto {
  id_tablero: number;
  nombre_lista: string;
  orden: number;
  max_tareas: number;
  estado: string;
}
export const crearLista = async (data: CrearListaDto) => {
  try {
    const listResponse = await API.post("/api/listas/", data);

    if (listResponse.status !== 201) return null;

    return listResponse.data;
  } catch {
    return null;
  }
};
