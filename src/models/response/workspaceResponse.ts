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

export interface UsersByWorkspaceIDResponse {
  id_usuario: number;
  nombre_usuario: string;
  apellido_usuario: string;
  correo_usuario: string;
}
