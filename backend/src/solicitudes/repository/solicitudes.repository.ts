import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Solicitud } from '../entities/solicitud.entity';
import { FilterSolicitudDto } from '../dto/filter-solicitud.dto';

@Injectable()
export class SolicitudesRepository {
  private readonly solicitudes = new Map<string, Solicitud>();

  findAll(filtro: FilterSolicitudDto): Solicitud[] {
    return Array.from(this.solicitudes.values()).filter((s) => {
      if (filtro.estado && s.estado !== filtro.estado) return false;
      if (filtro.tipo && s.tipo !== filtro.tipo) return false;
      if (filtro.solicitanteId && s.solicitanteId !== filtro.solicitanteId) return false;
      return true;
    });
  }

  findOne(id: string): Solicitud | undefined {
    return this.solicitudes.get(id);
  }

  create(data: Omit<Solicitud, 'id' | 'createdAt' | 'updatedAt'>): Solicitud {
    const now = new Date();
    const solicitud: Solicitud = {
      ...data,
      id: randomUUID(),
      createdAt: now,
      updatedAt: now,
    };
    this.solicitudes.set(solicitud.id, solicitud);
    return solicitud;
  }

  update(id: string, data: Partial<Solicitud>): Solicitud | undefined {
    const actual = this.solicitudes.get(id);
    if (!actual) return undefined;
    const actualizada: Solicitud = { ...actual, ...data, updatedAt: new Date() };
    this.solicitudes.set(id, actualizada);
    return actualizada;
  }
}
