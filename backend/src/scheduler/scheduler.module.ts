import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { SolicitudesModule } from '../solicitudes/solicitudes.module';
import { SchedulerService } from './scheduler.service';

@Module({
  imports: [ScheduleModule.forRoot(), SolicitudesModule],
  providers: [SchedulerService],
})
export class SchedulerModule {}
