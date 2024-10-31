export interface CrearNuevaTarjetaDto {
  usuario_asignado: number;
  id_lista: number;
  titulo_tarjeta: string;
  descripcion_tarjeta: string;
  fecha_creacion: Date;
  fecha_vencimiento: Date;
}
