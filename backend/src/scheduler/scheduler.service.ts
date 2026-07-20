import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { SolicitudesService } from '../solicitudes/solicitudes.service';
import { EstadoSolicitud } from '../solicitudes/enums/estado-solicitud.enum';

@Injectable()
export class SchedulerService {
  private readonly logger = new Logger(SchedulerService.name);

  private readonly MINUTOS_LIMITE = 1;

  constructor(private readonly solicitudesService: SolicitudesService) {}

  @Cron(CronExpression.EVERY_10_SECONDS)
  marcarSolicitudesVencidas() {
    const vencidas = this.solicitudesService.marcarVencidas(this.MINUTOS_LIMITE);
    if (vencidas.length > 0) {
      this.logger.log(`${vencidas.length} solicitud(es) marcada(s) como vencidas`);
    }
  }

  @Cron(CronExpression.EVERY_DAY_AT_7AM)
  generarResumenDiario() {
    const pendientes = this.solicitudesService.findAll({ estado: EstadoSolicitud.EN_REVISION });
    const enviadas = this.solicitudesService.findAll({ estado: EstadoSolicitud.ENVIADA });

    this.logger.log(
      `Resumen diario: ${enviadas.length} enviada(s) esperando revisión, ` +
        `${pendientes.length} en_revision pendiente(s) de aprobar/rechazar`,
    );
  }
}
