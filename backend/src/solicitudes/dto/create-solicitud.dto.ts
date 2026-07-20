import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { TipoSolicitud } from '../enums/tipo-solicitud.enum';

export class CreateSolicitudDto {
  @IsEnum(TipoSolicitud, { message: 'tipo debe ser transporte, permiso o insumo' })
  tipo: TipoSolicitud;

  @IsString()
  @MinLength(5, { message: 'La descripción debe tener al menos 5 caracteres' })
  @MaxLength(500)
  descripcion: string;

  @IsString()
  @IsNotEmpty()
  solicitanteId: string;

  @IsDateString({}, { message: 'fechaInicio debe ser una fecha ISO válida' })
  fechaInicio: string;

  @IsDateString({}, { message: 'fechaFin debe ser una fecha ISO válida' })
  fechaFin: string;

  @IsOptional()
  @IsString()
  recursoId?: string;
}
