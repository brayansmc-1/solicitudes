import { BadRequestException, Injectable } from '@nestjs/common';
import { EstadoSolicitud } from '../enums/estado-solicitud.enum';

const TRANSICIONES_PERMITIDAS: Record<EstadoSolicitud, EstadoSolicitud[]> = {
  [EstadoSolicitud.BORRADOR]: [EstadoSolicitud.ENVIADA],
  [EstadoSolicitud.ENVIADA]: [EstadoSolicitud.EN_REVISION, EstadoSolicitud.VENCIDA],
  [EstadoSolicitud.EN_REVISION]: [
    EstadoSolicitud.APROBADA,
    EstadoSolicitud.RECHAZADA,
    EstadoSolicitud.VENCIDA,
  ],
  [EstadoSolicitud.APROBADA]: [],
  [EstadoSolicitud.RECHAZADA]: [],
  [EstadoSolicitud.VENCIDA]: [],
};

@Injectable()
export class SolicitudStateMachine {
  validarTransicion(estadoActual: EstadoSolicitud, estadoNuevo: EstadoSolicitud): void {
    const permitidos = TRANSICIONES_PERMITIDAS[estadoActual] ?? [];

    if (estadoActual === estadoNuevo) {
      throw new BadRequestException(
        `La solicitud ya se encuentra en estado "${estadoActual}"`,
      );
    }

    if (!permitidos.includes(estadoNuevo)) {
      throw new BadRequestException(
        `Transición no permitida: "${estadoActual}" -> "${estadoNuevo}". ` +
          `Transiciones válidas desde "${estadoActual}": ${
            permitidos.length ? permitidos.join(', ') : 'ninguna (estado final)'
          }`,
      );
    }
  }

  esEstadoFinal(estado: EstadoSolicitud): boolean {
    return TRANSICIONES_PERMITIDAS[estado].length === 0;
  }
}
