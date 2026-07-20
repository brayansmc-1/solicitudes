import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { SolicitudesRepository } from './repository/solicitudes.repository';
import { CreateSolicitudDto } from './dto/create-solicitud.dto';
import { UpdateSolicitudDto } from './dto/update-solicitud.dto';
import { FilterSolicitudDto } from './dto/filter-solicitud.dto';
import { CambiarEstadoDto } from './dto/cambiar-estado.dto';
import { EstadoSolicitud } from './enums/estado-solicitud.enum';
import { Solicitud } from './entities/solicitud.entity';
import { SolicitudStateMachine } from './state-machine/solicitud-state-machine';

@Injectable()
export class SolicitudesService {
  constructor(
    private readonly repo: SolicitudesRepository,
    private readonly stateMachine: SolicitudStateMachine,
  ) {}

  findAll(filtro: FilterSolicitudDto): Solicitud[] {
    return this.repo.findAll(filtro);
  }

  findOne(id: string): Solicitud {
    const solicitud = this.repo.findOne(id);
    if (!solicitud) {
      throw new NotFoundException(`No existe la solicitud con id "${id}"`);
    }
    return solicitud;
  }

  create(dto: CreateSolicitudDto): Solicitud {
    const fechaInicio = new Date(dto.fechaInicio);
    const fechaFin = new Date(dto.fechaFin);

    if (fechaFin <= fechaInicio) {
      throw new BadRequestException('fechaFin debe ser posterior a fechaInicio');
    }

    return this.repo.create({
      tipo: dto.tipo,
      descripcion: dto.descripcion,
      solicitanteId: dto.solicitanteId,
      fechaInicio,
      fechaFin,
      recursoId: dto.recursoId,
      estado: EstadoSolicitud.BORRADOR,
    });
  }

  update(id: string, dto: UpdateSolicitudDto): Solicitud {
    const solicitud = this.findOne(id);

    if (solicitud.estado !== EstadoSolicitud.BORRADOR) {
      throw new ForbiddenException(
        'Solo se pueden editar solicitudes en estado "borrador"',
      );
    }

    if (dto.fechaInicio && dto.fechaFin) {
      const inicio = new Date(dto.fechaInicio);
      const fin = new Date(dto.fechaFin);
      if (fin <= inicio) {
        throw new BadRequestException('fechaFin debe ser posterior a fechaInicio');
      }
    }

    return this.repo.update(id, {
      ...dto,
      fechaInicio: dto.fechaInicio ? new Date(dto.fechaInicio) : undefined,
      fechaFin: dto.fechaFin ? new Date(dto.fechaFin) : undefined,
    } as Partial<Solicitud>)!;
  }

  cambiarEstado(id: string, dto: CambiarEstadoDto): Solicitud {
    const solicitud = this.findOne(id);

    this.stateMachine.validarTransicion(solicitud.estado, dto.nuevoEstado);

    return this.repo.update(id, {
      estado: dto.nuevoEstado,
      comentarioAprobador: dto.comentario ?? solicitud.comentarioAprobador,
    })!;
  }

  marcarVencidas(minutosLimite: number): Solicitud[] {
    const ahora = Date.now();
    const vencidas: Solicitud[] = [];

    for (const solicitud of this.repo.findAll({})) {
      const esGestionable =
        solicitud.estado === EstadoSolicitud.ENVIADA ||
        solicitud.estado === EstadoSolicitud.EN_REVISION;

      const minutosSinGestionar = (ahora - solicitud.updatedAt.getTime()) / 60000;

      if (esGestionable && minutosSinGestionar >= minutosLimite) {
        const actualizada = this.repo.update(solicitud.id, {
          estado: EstadoSolicitud.VENCIDA,
        })!;
        vencidas.push(actualizada);
      }
    }

    return vencidas;
  }
}
