import { Module } from '@nestjs/common';
import { SolicitudesModule } from './solicitudes/solicitudes.module';
import { SchedulerModule } from './scheduler/scheduler.module';

@Module({
  imports: [SolicitudesModule, SchedulerModule],
})
export class AppModule {}
