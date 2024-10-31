export interface WorkspaceDto {
  propietario: number;
  descripcion_espacio: string;
  nombre_espacio: string;
  fecha_creacion: Date;
  estado_trabajo: string;
}

export interface UpdateWorkspaceDto {
  id: number;
  estado_espacio: "activo" | "inactivo";
}

export interface AddWorkspaceDto {
  id_usuario: number;
  id_espacio: number;
}
