import { detectarSolapamientos, SolicitudRango } from './overlap-detector';

function d(iso: string): Date {
  return new Date(iso);
}

function assert(condition: boolean, mensaje: string) {
  if (!condition) throw new Error(`FALLÓ: ${mensaje}`);
  console.log(`OK: ${mensaje}`);
}

const casoBase: SolicitudRango[] = [
  { id: 'A', recursoId: 'vehiculo-1', fechaInicio: d('2026-07-20T08:00:00'), fechaFin: d('2026-07-20T10:00:00') },
  { id: 'B', recursoId: 'vehiculo-1', fechaInicio: d('2026-07-20T09:00:00'), fechaFin: d('2026-07-20T11:00:00') },
  { id: 'C', recursoId: 'vehiculo-1', fechaInicio: d('2026-07-20T11:00:00'), fechaFin: d('2026-07-20T12:00:00') },
  { id: 'D', recursoId: 'vehiculo-2', fechaInicio: d('2026-07-20T08:00:00'), fechaFin: d('2026-07-20T10:00:00') },
];

const resultado = detectarSolapamientos(casoBase);
assert(resultado.length === 1, 'debe encontrar exactamente 1 conflicto');
assert(
  resultado[0].solicitudA === 'A' && resultado[0].solicitudB === 'B',
  'el conflicto debe ser entre A y B',
);

const sinConflictos = detectarSolapamientos([
  { id: 'X', recursoId: 'sala-1', fechaInicio: d('2026-07-20T08:00:00'), fechaFin: d('2026-07-20T09:00:00') },
  { id: 'Y', recursoId: 'sala-1', fechaInicio: d('2026-07-20T09:00:00'), fechaFin: d('2026-07-20T10:00:00') },
]);
assert(sinConflictos.length === 0, 'límites que se tocan no cuentan como solapamiento');

console.log('Todos los tests pasaron.');
