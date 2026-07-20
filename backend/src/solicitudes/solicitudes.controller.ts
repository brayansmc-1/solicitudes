import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { SolicitudesService } from './solicitudes.service';
import { CreateSolicitudDto } from './dto/create-solicitud.dto';
import { UpdateSolicitudDto } from './dto/update-solicitud.dto';
import { FilterSolicitudDto } from './dto/filter-solicitud.dto';
import { CambiarEstadoDto } from './dto/cambiar-estado.dto';

@Controller('solicitudes')
export class SolicitudesController {
  constructor(private readonly solicitudesService: SolicitudesService) {}

  @Get()
  findAll(@Query() filtro: FilterSolicitudDto) {
    return this.solicitudesService.findAll(filtro);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.solicitudesService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateSolicitudDto) {
    return this.solicitudesService.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateSolicitudDto) {
    return this.solicitudesService.update(id, dto);
  }

  @Patch(':id/estado')
  cambiarEstado(@Param('id') id: string, @Body() dto: CambiarEstadoDto) {
    return this.solicitudesService.cambiarEstado(id, dto);
  }
}
