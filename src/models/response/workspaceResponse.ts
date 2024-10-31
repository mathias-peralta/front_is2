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
