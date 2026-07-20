import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { SolicitudesService } from '../../../core/services/solicitudes.service';
import { EstadoSolicitud, TipoSolicitud } from '../../../core/models/solicitud.model';

@Component({
  selector: 'app-solicitudes-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './solicitudes-list.component.html',
})
export class SolicitudesListComponent implements OnInit {
  readonly solicitudes = this.solicitudesService.solicitudesFiltradas;
  readonly loading = this.solicitudesService.loading;
  readonly error = this.solicitudesService.error;

  readonly estados: EstadoSolicitud[] = [
    'borrador',
    'enviada',
    'en_revision',
    'aprobada',
    'rechazada',
    'vencida',
  ];
  readonly tipos: TipoSolicitud[] = ['transporte', 'permiso', 'insumo'];

  constructor(private solicitudesService: SolicitudesService) {}

  ngOnInit() {
    this.solicitudesService.cargar();
  }

  onFiltroEstadoChange(estado: string) {
    this.solicitudesService.actualizarFiltro({ estado: estado as EstadoSolicitud | '' });
  }

  onFiltroTipoChange(tipo: string) {
    this.solicitudesService.actualizarFiltro({ tipo: tipo as TipoSolicitud | '' });
  }

  async aprobar(id: string) {
    await this.solicitudesService.cambiarEstado(id, 'aprobada');
  }

  async rechazar(id: string) {
    const comentario = window.prompt('Motivo del rechazo (opcional):') ?? undefined;
    await this.solicitudesService.cambiarEstado(id, 'rechazada', comentario);
  }

  claseEstado(estado: string): string {
    const clases: Record<string, string> = {
      borrador: 'badge badge-gray',
      enviada: 'badge badge-blue',
      en_revision: 'badge badge-yellow',
      aprobada: 'badge badge-green',
      rechazada: 'badge badge-red',
      vencida: 'badge badge-orange',
    };
    return clases[estado] ?? 'badge';
  }
}
