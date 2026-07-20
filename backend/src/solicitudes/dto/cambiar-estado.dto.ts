import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { EstadoSolicitud } from '../enums/estado-solicitud.enum';

export class CambiarEstadoDto {
  @IsEnum(EstadoSolicitud)
  nuevoEstado: EstadoSolicitud;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  comentario?: string;
}
