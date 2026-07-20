import { Module } from '@nestjs/common';
import { SolicitudesController } from './solicitudes.controller';
import { SolicitudesService } from './solicitudes.service';
import { SolicitudesRepository } from './repository/solicitudes.repository';
import { SolicitudStateMachine } from './state-machine/solicitud-state-machine';

@Module({
  controllers: [SolicitudesController],
  providers: [SolicitudesService, SolicitudesRepository, SolicitudStateMachine],
  exports: [SolicitudesService],
})
export class SolicitudesModule {}
