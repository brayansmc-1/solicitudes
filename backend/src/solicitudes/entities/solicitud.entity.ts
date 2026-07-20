import { EstadoSolicitud } from '../enums/estado-solicitud.enum';
import { TipoSolicitud } from '../enums/tipo-solicitud.enum';

export interface Solicitud {
  id: string;
  tipo: TipoSolicitud;
  descripcion: string;
  solicitanteId: string;
  fechaInicio: Date;
  fechaFin: Date;
  recursoId?: string;
  estado: EstadoSolicitud;
  comentarioAprobador?: string;
  createdAt: Date;
  updatedAt: Date;
}
