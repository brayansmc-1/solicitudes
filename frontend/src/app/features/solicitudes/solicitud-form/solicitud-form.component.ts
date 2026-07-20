import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SolicitudesService } from '../../../core/services/solicitudes.service';

@Component({
  selector: 'app-solicitud-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './solicitud-form.component.html',
})
export class SolicitudFormComponent {
  readonly enviando = signal(false);
  readonly errorEnvio = signal<string | null>(null);

  readonly form = this.fb.group({
    tipo: ['transporte', Validators.required],
    descripcion: ['', [Validators.required, Validators.minLength(5)]],
    solicitanteId: ['', Validators.required],
    recursoId: [''],
    fechaInicio: ['', Validators.required],
    fechaFin: ['', Validators.required],
  });

  constructor(
    private fb: FormBuilder,
    private solicitudesService: SolicitudesService,
    private router: Router,
  ) {}

  get f() {
    return this.form.controls;
  }

  async onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { fechaInicio, fechaFin } = this.form.getRawValue();
    if (fechaInicio && fechaFin && new Date(fechaFin) <= new Date(fechaInicio)) {
      this.errorEnvio.set('La fecha de fin debe ser posterior a la fecha de inicio');
      return;
    }

    this.enviando.set(true);
    this.errorEnvio.set(null);
    try {
      await this.solicitudesService.crear(this.form.getRawValue() as any);
      this.router.navigate(['/solicitudes']);
    } catch (e) {
      this.errorEnvio.set('No se pudo crear la solicitud. Revisa los datos e intenta de nuevo.');
    } finally {
      this.enviando.set(false);
    }
  }
}
