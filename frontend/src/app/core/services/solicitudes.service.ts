import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, computed, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import {
  CreateSolicitud,
  FiltroSolicitud,
  Solicitud,
} from '../models/solicitud.model';

@Injectable({ providedIn: 'root' })
export class SolicitudesService {
  private readonly apiUrl = '/api/solicitudes';

  private readonly _solicitudes = signal<Solicitud[]>([]);
  private readonly _loading = signal(false);
  private readonly _error = signal<string | null>(null);
  private readonly _filtro = signal<FiltroSolicitud>({ estado: '', tipo: '' });

  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();
  readonly filtro = this._filtro.asReadonly();

  readonly solicitudesFiltradas = computed(() => {
    const filtro = this._filtro();
    return this._solicitudes().filter((s) => {
      if (filtro.estado && s.estado !== filtro.estado) return false;
      if (filtro.tipo && s.tipo !== filtro.tipo) return false;
      return true;
    });
  });

  constructor(private http: HttpClient) {}

  actualizarFiltro(filtro: Partial<FiltroSolicitud>) {
    this._filtro.update((actual) => ({ ...actual, ...filtro }));
  }

  async cargar(): Promise<void> {
    this._loading.set(true);
    this._error.set(null);
    try {
      let params = new HttpParams();
      const filtro = this._filtro();
      if (filtro.estado) params = params.set('estado', filtro.estado);
      if (filtro.tipo) params = params.set('tipo', filtro.tipo);

      const data = await firstValueFrom(
        this.http.get<Solicitud[]>(this.apiUrl, { params }),
      );
      this._solicitudes.set(data);
    } catch (e) {
      this._error.set(this.mensajeError(e));
    } finally {
      this._loading.set(false);
    }
  }

  async crear(dto: CreateSolicitud): Promise<Solicitud> {
    const nueva = await firstValueFrom(this.http.post<Solicitud>(this.apiUrl, dto));
    this._solicitudes.update((lista) => [nueva, ...lista]);
    return nueva;
  }

  async cambiarEstado(id: string, nuevoEstado: string, comentario?: string): Promise<void> {
    const actualizada = await firstValueFrom(
      this.http.patch<Solicitud>(`${this.apiUrl}/${id}/estado`, { nuevoEstado, comentario }),
    );
    this._solicitudes.update((lista) =>
      lista.map((s) => (s.id === id ? actualizada : s)),
    );
  }

  private mensajeError(e: unknown): string {
    const err = e as { error?: { message?: string | string[] } };
    const msg = err?.error?.message;
    if (Array.isArray(msg)) return msg.join(', ');
    return msg ?? 'Ocurrió un error inesperado. Intenta de nuevo.';
  }
}
