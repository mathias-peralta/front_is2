export interface ListaByIDResponse {
  id_lista: number;
  id_tablero: number;
  nombre_lista: string;
  orden: number;
  max_tareas: number;
  estado: string;
}

export interface ListasByIDTableroResponse {
  id_lista: number;
  id_tablero: number;
  nombre_lista: string;
  orden: number;
  max_tareas: number;
  estado: string;
}
