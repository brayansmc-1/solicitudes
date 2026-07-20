# Módulo de Gestión de Solicitudes

Prueba técnica — Backend NestJS + Frontend Angular + Automatización.

## Cómo levantar el proyecto

```bash
# Backend
cd backend
npm install
npm run start:dev   # http://localhost:3000

# Frontend
cd frontend
npm install
npm start            # http://localhost:4200
```

## Cómo levantarlo con Docker

```bash
docker compose up --build
# Backend:  http://localhost:3000
# Frontend: http://localhost:4200 
```

## Endpoints principales

| Método | Ruta                       | Descripción                              |
|--------|----------------------------|-------------------------------------------|
| GET    | /solicitudes?estado=&tipo= | Listado con filtros                       |
| GET    | /solicitudes/:id           | Detalle                                   |
| POST   | /solicitudes                | Crear (nace en estado "borrador")        |
| PATCH  | /solicitudes/:id            | Editar contenido (solo si está en borrador) |
| PATCH  | /solicitudes/:id/estado      | Transición de estado (enviar/aprobar/rechazar) |

## Decisiones técnicas y justificación

- **Persistencia**: repositorio **en memoria** (`solicitudes.repository.ts`), para
  que el proyecto se levante sin depender de una base de datos externa. La
  interfaz (`findAll/findOne/create/update`) está pensada para migrar a
  TypeORM/Prisma sin tocar el service ni el controller.
- **Autenticación**: **no implementada**. `solicitanteId` se recibe en el body
  como si viniera de un usuario ya autenticado.
- **Máquina de estados**: mapa de transiciones permitidas.
- **Automatización**: `@nestjs/schedule` (cron in-process). Se implementaron
  dos tareas: marcar solicitudes vencidas (cada hora) y un resumen diario
  (7am). Se prefirió esto sobre N8N/RPA o Python para no requerir infraestructura
  adicional en la prueba.
- **Frontend / manejo de estado**: **Angular Signals** en vez de un store
  RxJS/NgRx, porque el estado del módulo es simple (lista + filtro +
  loading/error) y signals dan reactividad fina sin la sobrecarga de NgRx.
- **Reto de lógica**: enfoque *sweep line* O(n log n) agrupando por recurso y
  ordenando por fechaInicio, en vez de comparar cada par (O(n²)). Ver
  `logic-challenge/overlap-detector.ts` para el detalle y el porqué es correcto.

## Supuestos asumidos

- Una solicitud "vencida" es un estado fina, si el
  negocio quisiera reabrirla, habría que agregar esa transición explícitamente.
- El límite para considerar una solicitud vencida es 24h sin gestionar
- Dos solicitudes cuyo rango se toca en el límite **no** se consideran solapadas.
- Solo se puede editar el contenido de una solicitud mientras está en
  borrador; una vez enviada, los cambios de estado son responsabilidad del
  aprobador vía `/solicitudes/:id/estado`.

## Qué haría con más tiempo

- Persistencia real (Postgres + TypeORM) con migraciones, y tests de
  integración contra una base de datos de prueba.
- Autenticación JWT real con roles y ocultar/mostrar
  acciones del frontend según rol.
- Tests unitarios del `SolicitudStateMachine` y del `SolicitudesService`
  de los endpoints.
- Componente de edición de solicitud reutilizando `SolicitudFormComponent`
  y un endpoint que exponga las transiciones
  válidas desde el estado actual para deshabilitar botones en el frontend.
- Paginación en el listado si el volumen crece.
- Dockerfile + docker-compose (backend + frontend + Postgres) y un pipeline
  de CI.

## Reto de lógica

`logic-challenge/overlap-detector.ts` (función aislada, sin dependencias
de Nest/Angular)

```bash
cd logic-challenge
npx ts-node overlap-detector.spec.ts
```
