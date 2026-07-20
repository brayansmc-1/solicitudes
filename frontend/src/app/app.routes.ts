import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'solicitudes', pathMatch: 'full' },
  {
    path: 'solicitudes',
    loadComponent: () =>
      import('./features/solicitudes/solicitudes-list/solicitudes-list.component').then(
        (m) => m.SolicitudesListComponent,
      ),
  },
  {
    path: 'solicitudes/nueva',
    loadComponent: () =>
      import('./features/solicitudes/solicitud-form/solicitud-form.component').then(
        (m) => m.SolicitudFormComponent,
      ),
  },
];
