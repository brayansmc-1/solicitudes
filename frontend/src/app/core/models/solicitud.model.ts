export type TipoSolicitud = 'transporte' | 'permiso' | 'insumo';

export type EstadoSolicitud =
  | 'borrador'
  | 'enviada'
  | 'en_revision'
  | 'aprobada'
  | 'rechazada'
  | 'vencida';

export interface Solicitud {
  id: string;
  tipo: TipoSolicitud;
  descripcion: string;
  solicitanteId: string;
  fechaInicio: string;
  fechaFin: string;
  recursoId?: string;
  estado: EstadoSolicitud;
  comentarioAprobador?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSolicitud {
  tipo: TipoSolicitud;
  descripcion: string;
  solicitanteId: string;
  fechaInicio: string;
  fechaFin: string;
  recursoId?: string;
}

export interface FiltroSolicitud {
  estado?: EstadoSolicitud | '';
  tipo?: TipoSolicitud | '';
}
