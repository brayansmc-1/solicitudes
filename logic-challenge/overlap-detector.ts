export interface SolicitudRango {
  id: string;
  recursoId: string;
  fechaInicio: Date;
  fechaFin: Date;
}

export interface ConflictoSolapamiento {
  recursoId: string;
  solicitudA: string;
  solicitudB: string;
  desde: Date;
  hasta: Date;
}

function haySolape(aInicio: Date, aFin: Date, bInicio: Date, bFin: Date): boolean {
  return aInicio < bFin && bInicio < aFin;
}

export function detectarSolapamientos(solicitudes: SolicitudRango[]): ConflictoSolapamiento[] {
  const conflictos: ConflictoSolapamiento[] = [];

  const porRecurso = new Map<string, SolicitudRango[]>();
  for (const s of solicitudes) {
    if (!s.recursoId) continue;
    if (!porRecurso.has(s.recursoId)) porRecurso.set(s.recursoId, []);
    porRecurso.get(s.recursoId)!.push(s);
  }

  for (const [recursoId, lista] of porRecurso) {
    const ordenadas = [...lista].sort(
      (a, b) => a.fechaInicio.getTime() - b.fechaInicio.getTime(),
    );

    const activos: SolicitudRango[] = [];

    for (const actual of ordenadas) {
      for (let i = activos.length - 1; i >= 0; i--) {
        if (activos[i].fechaFin <= actual.fechaInicio) {
          activos.splice(i, 1);
        }
      }

      for (const otra of activos) {
        if (haySolape(actual.fechaInicio, actual.fechaFin, otra.fechaInicio, otra.fechaFin)) {
          conflictos.push({
            recursoId,
            solicitudA: otra.id,
            solicitudB: actual.id,
            desde: actual.fechaInicio > otra.fechaInicio ? actual.fechaInicio : otra.fechaInicio,
            hasta: actual.fechaFin < otra.fechaFin ? actual.fechaFin : otra.fechaFin,
          });
        }
      }

      activos.push(actual);
    }
  }

  return conflictos;
}
