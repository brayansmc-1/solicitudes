import { PartialType, OmitType } from '@nestjs/mapped-types';
import { CreateSolicitudDto } from './create-solicitud.dto';

export class UpdateSolicitudDto extends PartialType(
  OmitType(CreateSolicitudDto, ['solicitanteId'] as const),
) {}
