import API from '../utils/api'; // Adjusted path

// Obtener todos los tableros asociados a un espacio de trabajo
export const getTablerosByWorkspace = async (id_espacio: number) => {
    try {
      const response = await API.get<TableroResponse[]>(`/api/tableros_all/${id_espacio}`);
      return response.status === 200 ? response.data : null;
    } catch {
      return null;
    }
  };
  
  // Crear un nuevo tablero
  export const createTablero = async (data: { id_espacio: number; nombre_tablero: string }) => {
    try {
      const response = await API.post("/api/tableros", data);
      return response.status === 201 ? response.data : null;
    } catch {
      return null;
    }
  };
  
  export interface TableroResponse {
    id_tablero: number;
    id_espacio: number;
    nombre_tablero: string;
  }
