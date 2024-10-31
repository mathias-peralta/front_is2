import API from "@/config/API";
import { CrearNuevaTarjetaDto } from "@/models/dto/actividades.dto";

export const createNewActivity = async (actividad: CrearNuevaTarjetaDto) => {
  try {
    const tarjetas = await API.post<any>("/api/tarjetas", actividad);

    if (tarjetas.status !== 201) return null;

    return tarjetas.data;
  } catch {
    return null;
  }
};
