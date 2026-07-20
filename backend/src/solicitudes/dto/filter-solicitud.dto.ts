import { IsEnum, IsOptional, IsString } from 'class-validator';
import { EstadoSolicitud } from '../enums/estado-solicitud.enum';
import { TipoSolicitud } from '../enums/tipo-solicitud.enum';

export class FilterSolicitudDto {
  @IsOptional()
  @IsEnum(EstadoSolicitud)
  estado?: EstadoSolicitud;

  @IsOptional()
  @IsEnum(TipoSolicitud)
  tipo?: TipoSolicitud;

  @IsOptional()
  @IsString()
  solicitanteId?: string;
}
