# Resumen Académico de la Aplicación

## 1. Descripción General

La aplicación es un **sistema de gestión de campamentos de supervivencia** en un escenario ficticio de apocalypse zombie. Está compuesta por dos proyectos independientes que se comunican mediante HTTP/JSON y WebSockets:

| Proyecto | Rol | Stack principal |
|---|---|---|
| **web-app** | Frontend (SPA) | React 18 + TypeScript + Vite + Tailwind CSS |
| **api-node** | Backend (API REST) | Node.js + Express 5 + TypeORM + PostgreSQL |

El sistema permite administrar campamentos, personas, recursos, exploraciones, tareas, raciones, almacenes, solicitudes de admisión evaluadas con inteligencia artificial, notificaciones en tiempo real, auditoría de acciones y un sistema de logros y puntos para los trabajadores. La aplicación está diseñada para múltiples roles con distintos niveles de acceso y responsabilidades.

---

## 2. ¿Qué Realiza?

### 2.1 Funcionalidades Principales

La aplicación ofrece un conjunto de módulos organizados en dos grandes categorías:

#### Gestión de Sistema (Administración Global)

- **Dashboard Global**: Vista consolidada del estado de todos los campamentos, métricas y KPIs globales.
- **Gestión de Campamentos**: Creación, edición y administración de campamentos con ubicación geográfica (coordenadas), capacidad, y reglas específicas.
- **Catálogos**: Administración centralizada de recursos, profesiones y logros.
- **Gestión de Usuarios**: Creación y administración de usuarios con asociación a personas, roles y campamentos.
- **Solicitudes de Admisión**: Recepción y gestión de solicitudes de personas que desean unirse a un campamento.
- **Evaluación con IA**: Integración con la API de **Groq** (LLM) para evaluar automáticamente solicitudes de admisión, determinando si el candidato es apto, el nivel de riesgo y la profesión recomendada dentro del campamento.
- **Inventario Global**: Vista consolidada de recursos disponibles en todos los campamentos.
- **Configuración del Sistema**: Ajustes generales de la aplicación.

#### Gestión de Recursos (ResourceManager)

- **Dashboard de Recursos**: Métricas de inventario, producción y alertas por campamento.
- **Inventario por Campamento**: Gestión de stocks de recursos en almacenes, con seguimiento de movimientos (entradas, salidas, ajustes).
- **Alertas de Stock**: Sistema de notificaciones automáticas cuando un recurso cae por debajo de la cantidad mínima configurada.
- **Producción Diaria**: Registro de producción de recursos por trabajadores según su profesión.
- **Raciones**: Asignación y seguimiento de raciones de alimentos a las personas del campamento.
- **Inter-Campamento**: Sistema de solicitudes de recursos y personas entre campamentos, con seguimiento de envíos.

#### Módulos del Trabajador (Worker)

- **Perfil Personal**: Información del trabajador, su profesión asignada y campamento.
- **Logros y Puntos**: Sistema de gamificación con logros desbloqueables y acumulación de puntos.
- **Mis Tareas**: Visualización y gestión de tareas asignadas.
- **Producción Diaria**: Registro de producción de recursos por el trabajador.
- **Mis Raciones**: Consulta de raciones asignadas.
- **Exploraciones Personales**: Visualización de exploraciones en las que participa.

#### Exploraciones

- **Gestión de Exploraciones**: Creación y administración de misiones de exploración fuera del campamento.
- **Asignación de Personal**: Asociación de personas a exploraciones con roles específicos.
- **Recursos de Exploración**: Seguimiento de recursos consumidos y recolectados durante las exploraciones.
- **Raciones de Exploración**: Planificación y consumo de raciones durante misiones.

### 2.2 Arquitectura de Comunicación

```
┌─────────────────────────────────────────────────┐
│                    Frontend                      │
│  React SPA + React Query + Socket.IO Client     │
│                                                  │
│  Componente → Hook → Service → Axios → Backend   │
└──────────────┬──────────────┬────────────────────┘
               │ HTTP/JSON    │ WebSocket
               ▼              ▼
┌─────────────────────────────────────────────────┐
│                    Backend                       │
│  Express + TypeORM + Socket.IO Server           │
│                                                  │
│  Routes → Middlewares → Controllers → Services   │
│                → Repositories → PostgreSQL       │
└─────────────────────────────────────────────────┘
```

### 2.3 Roles del Sistema

| Rol | Descripción | Acceso Principal |
|---|---|---|
| **SYSTEM_ADMIN / GLOBAL_ADMIN** | Administrador global del sistema | Todos los módulos, catálogos, dashboard global, configuración |
| **CAMP_ADMIN** | Administrador de un campamento específico | Gestión de usuarios, dashboard, solicitudes de su campamento |
| **RESOURCE_MANAGER** | Gestor de recursos del campamento | Inventario, alertas, producción, raciones, inter-campamento |
| **WORKER** | Trabajador del campamento | Perfil, tareas, producción, raciones, logros |
| **EXPEDITION_LEADER** | Líder de exploraciones | Exploraciones, asignación de personal y recursos |

---

## 3. Limitaciones

### 3.1 Limitaciones Técnicas

1. **Ausencia de migraciones formalizadas**: El backend utiliza TypeORM con `synchronize: false`, pero no se observa un directorio de migraciones ni una herramienta de migración configurada. El esquema de base de datos se gestiona de forma ad-hoc, lo que dificulta el control de versiones del esquema y la reproducibilidad del entorno.

2. **Tests limitados**: Los tests están únicamente a nivel E2E (end-to-end) con Playwright, enfocados en flujos de navegación por rol. No existen tests unitarios ni de integración para el backend (servicios, controladores, repositorios) ni para los componentes individuales del frontend.

3. **Dependency Injection no implementada**: El patrón DI está contemplado (existe `src/di/container.ts`) pero se encuentra comentado/desactivado. Los servicios se instancian directamente, lo que genera acoplamiento fuerte y dificulta el testing y la sustitución de dependencias.

4. **Ausencia de código backend**: No se observan tests automatizados en el backend. Los scripts de seed (`seedGlobalAdmin.ts`, `resetAndSeedDemoData.ts`, `seedFullData.ts`) son manuales y no forman parte de una suite de tests.

5. **State management descentralizado**: El estado de la aplicación se maneja a través de Context API, React Query y hooks locales. No existe un store global centralizado (como Redux o Zustand), lo que puede generar inconsistencias en estados compartidos complejos.

6. **Limitación de un solo navegador en tests E2E**: La configuración de Playwright solo ejecuta tests en Chromium, sin validar compatibilidad cross-browser.

7. **Dependencia de servicios externos**: La funcionalidad de evaluación de admisiones con IA depende de la API de Groq. Si el servicio está caído o la API key no está configurada, la funcionalidad queda completamente inoperativa sin alternativa de fallback.

8. **Archivo `.env.example` incompleto**: No incluye todas las variables necesarias (por ejemplo, `VITE_API_URL` del frontend).

### 3.2 Limitaciones Funcionales

1. **Gestión de sesiones limitada**: Si bien existen refresh tokens y blacklist por JTI, no hay un panel de administración para gestionar sesiones activas de usuarios, ni funcionalidad de cerrar sesión remota.

2. **Sin paginación server-side visible**: Muchos hooks del frontend (como `usePermissions`) cargan la totalidad de registros sin paginación, lo que puede causar problemas de rendimiento con grandes volúmenes de datos.

3. **Sin internacionalización (i18n)**: La aplicación no soporta múltiples idiomas. Los textos están en su mayoría en inglés (prompts de IA, nombres de módulos) con algunos textos en español (mensajes de error del backend), lo que genera inconsistencia lingüística.

4. **Sin soporte PWA**: La aplicación no está configurada como Progressive Web App, por lo que no funciona offline ni se puede instalar en dispositivos móviles.

5. **Sin exportación de reportes**: Aunque existen módulos de PDFKit y QRCode en el backend, no se observa una funcionalidad consolidada de exportación de reportes desde el frontend.

---

## 4. Aspectos de Mejora

### 4.1 Arquitectura y Diseño

| Área | Mejora Propuesta | Impacto |
|---|---|---|
| **Testing** | Implementar tests unitarios con Vitest/Jest en backend y frontend; tests de integración para servicios y controladores | Alta confiabilidad, detección temprana de regresiones |
| **Migraciones** | Configurar TypeORM Migrations para versionado controlado del esquema de BD | Reproducibilidad, control de cambios en producción |
| **DI Container** | Activar e implementar el contenedor de inyección de dependencias | Desacoplamiento, testabilidad, sustitución de servicios |
| **Monitoreo** | Integrar métricas de rendimiento (APM), logging estructurado (Winston/Pino) y health checks | Observabilidad en producción |
| **CI/CD** | Configurar pipelines de integración continua con linting, testing y despliegue automático | Calidad de código, despliegues seguros |

### 4.2 Funcionalidad

| Área | Mejora Propuesta | Impacto |
|---|---|---|
| **Paginación** | Implementar paginación server-side en todos los endpoints de consulta | Rendimiento con grandes volúmenes |
| **i18n** | Implementar internacionalización con react-i18next | Soporte multilingüe |
| **Búsqueda y filtros** | Agregar búsqueda full-text y filtros avanzados en listados | Experiencia de usuario |
| **Exportación** | Implementar exportación a PDF/Excel de reportes e inventarios | Utilidad operativa |
| **PWA** | Configurar Service Worker y manifest para modo offline | Accesibilidad sin conexión |
| **Notificaciones push** | Extender notificaciones al navegador (Web Push) | Alcance de alertas en tiempo real |

### 4.3 Seguridad

| Área | Mejora Propuesta | Impacto |
|---|---|---|
| **Rate limiting** | Implementar rate limiting en endpoints de autenticación y consulta | Protección contra brute force |
| **Helmet** | Agregar middleware Helmet para headers de seguridad HTTP | Protección contra ataques comunes |
| **CSRF protection** | Implementar tokens CSRF para formularios state-changing | Protección contra Cross-Site Request Forgery |
| **Input sanitization** | Reforzar sanitización de inputs contra XSS y SQL injection | Seguridad de datos |
| **Revoke por IP** | Registrar y permitir revocación de sesiones por dirección IP | Control de acceso granular |

---

## 5. Aspectos y Requerimientos No Funcionales

### 5.1 Autenticación y Seguridad

**Implementación:**
- **JWT con doble token**: Access token (TTL: 25 minutos) y refresh token (TTL: 7 días) almacenados como cookies HTTP-only.
- **Refresh token compuesto**: El refresh token se compone de un JWT firmado + un token raw hasheado con bcrypt (cost factor 10). El JWT proporciona identidad; el hash permite revocación en base de datos.
- **Blacklist por JTI**: Cada access token tiene un identificador único (JTI) que puede ser revocado. El middleware verifica la blacklist en cada petición autenticada.
- **Detección de token reuse**: Si se detecta que un refresh token ya fue utilizado, se invalidan todas las sesiones activas del usuario (protección contra ataques de replay).
- **Aislamiento por pestaña**: Se utiliza `sessionStorage` para marcar si una pestaña tiene sesión activa. Una pestaña nueva no hereda la sesión aunque las cookies estén presentes.
- **Aislamiento por roles**: El middleware `authorizeRole` valida que el usuario autenticado tenga al menos uno de los roles permitidos para acceder a cada endpoint.
- **Control de acceso por campamento**: Los administradores de campamento solo pueden acceder a los recursos de su propio campamento, validado en cada servicio mediante `scope.campId`.

**Problemas encontrados:**
- La blacklist de tokens JTI parece implementarse en memoria (`tokenBlacklist.ts`), lo que significa que se pierde al reiniciar el servidor. En producción se requeriría Redis u otro store persistente.
- El timeout de inactividad del frontend (2 minutos) es igual al TTL del access token (25 minutos), lo que genera un desajuste conceptual: el frontend cierra la sesión antes de que el token expire realmente.
- No existe mecanismo de revocación de refresh tokens por parte del usuario (cerrar sesión en todos los dispositivos).

### 5.2 Comunicación en Tiempo Real

**Implementación:**
- **Socket.IO**: Se utiliza Socket.IO con middleware de autenticación JWT para validar conexiones entrantes.
- **Canales por usuario y campamento**: Cada usuario se une a un canal privado (`user:{userId}`) y a un canal de campamento (`camp:{campId}`).
- **Subscribers de TypeORM**: Se utilizan suscriptores de eventos del ORM (afterInsert) para emitir notificaciones automáticamente cuando ocurren eventos de dominio (alertas de stock, solicitudes de campamento, logros desbloqueados).
- **Sistema de notificaciones**: Las notificaciones se almacenan en base de datos con tipo, prioridad y payload, y se emiten en tiempo real vía Socket.IO.
- **Heartbeat configurado**: `pingTimeout: 60s`, `pingInterval: 25s` para mantener conexiones vivas.

**Problemas encontrados:**
- La reconexión automática de Socket.IO no tiene manejo explícito de reintentos con backoff exponencial.
- No se observa un mecanismo de cola de mensajes para notificaciones perdidas durante desconexiones temporales.
- Los logs de conexión/desconexión usan `console.log` sin estructura, lo que dificulta el monitoreo en producción.

### 5.3 Gestión de Estado y Cache

**Implementación:**
- **TanStack React Query**: Se utiliza para el manejo de estado asíncrono (fetching, caching, invalidación de datos del servidor).
- **Context API**: Para estado global de autenticación, toasts y modales compartidos.
- **Hooks personalizados**: ~35 hooks que encapsulan la lógica de negocio por vista (useUsersView, useCamps, usePermissions, etc.).
- **Interceptor de refresco silencioso**: El interceptor de axios detecta respuestas 401, intenta renovar el token y reintenta la petición original de forma transparente.

**Problemas encontrados:**
- Algunos hooks (como `usePermissions`) no utilizan React Query y manejan estado manualmente con `useState`/`useEffect`, lo que duplica la lógica de cache y loading.
- No existe una estrategia uniforme de invalidación de cache entre los distintos hooks.
- El interceptor de refresco puede causar condiciones de carrera si múltiples peticiones fallan simultáneamente (aunque existe bandera `_retry`, el manejo es básico).

### 5.4 Validación de Datos

**Implementación:**
- **Backend**: `class-validator` + `class-transformer` con decorators en DTOs (~38 DTOs). El middleware `validateBody` transforma y valida el request body antes de llegar al controlador.
- **Frontend**: `React Hook Form` + `Zod` para validación de schemas en formularios.
- **Middlewares de validación**: `validateId` para parámetros de ruta, Content-Type validation para rechazar requests no-JSON.

**Problemas encontrados:**
- La validación frontend y backend no está sincronizada: los esquemas Zod del frontend y los DTOs del backend pueden divergir.
- No existe validación de parámetros de query string (solo body y params).
- El manejo de errores de validación no es uniforme entre endpoints.

### 5.5 Documentación

**Implementación:**
- **Swagger/OpenAPI**: Documentación automática de la API con `swagger-jsdoc` y `swagger-ui-express`, accesible en `/api/docs`.
- **Schemas documentados**: ~30+ schemas OpenAPI definidos para request/response bodies.
- **Endpoints documentados**: Las rutas incluyen anotaciones JSDoc/Swagger con descripciones, parámetros y respuestas.

**Problemas encontrados:**
- La documentación Swagger está parcialmente desactualizada respecto a la implementación real de algunos endpoints.
- No existen ejemplos de uso (code snippets) para los clientes que consumirán la API.
- La documentación del frontend es prácticamente inexistente (solo README básico).

### 5.6 Rendimiento

**Implementación:**
- **Lazy loading**: Las rutas del frontend se cargan de forma diferida (code splitting) con React.lazy.
- **React Compiler**: Configurado en modo experimental para optimización automática de renders.
- **Cookies HTTP-only**: Evitan acceso XSS a tokens de autenticación.
- **Límite de payload**: Express configurado con `limit: "10mb"` para bodies JSON.

**Problemas encontrados:**
- No se observa uso de índices de base de datos (configurados vía TypeORM, pero no visibles en el código).
- Las consultas `findAll()` sin paginación pueden causar problemas de rendimiento con datos crecientes.
- No existe compresión gzip configurada en Express para responses.
- No hay CDN configurado para assets estáticos del frontend.

### 5.7 Despliegue

**Implementación:**
- **Frontend**: Configurado para despliegue en Vercel (`vercel.json` presente).
- **Backend**: Configurado para despliegue en Railway (`railway.json` presente).
- **Variable de entorno `CORS_ORIGIN`**: Permite configurar el origen permitido según el entorno.

**Problemas encontrados:**
- No existe configuración de Docker ni docker-compose para desarrollo local reproducible.
- No hay scripts de despliegue automatizado (solo configuración básica de plataformas).
- Los secrets (JWT_SECRET, DATABASE_URL, etc.) se manejan manualmente sin vault de secrets.

### 5.8 Accesibilidad (a11y)

**Implementación:**
- Se utiliza **shadcn/ui + Radix UI** como base de componentes, lo que proporciona soporte nativo de accesibilidad (ARIA labels, keyboard navigation, focus management).
- Iconos de **Lucide React** con propiedades semánticas.

**Problemas encontrados:**
- No se observa un plan formal de accesibilidad (WCAG 2.1 AA).
- No existen tests automatizados de accesibilidad (axe-core, Lighthouse).
- El contraste de colores y los patrones de navegación por teclado no están validados sistemáticamente.

---

## 6. Conclusión

La aplicación representa un sistema full-stack completo y funcional que demuestra competencias en arquitectura de software moderna, patrones de diseño (MVC, repository pattern, DTOs, event-driven) y tecnologías actuales del ecosistema JavaScript/TypeScript. Los aspectos más sólidos incluyen la autenticación robusta con doble token y detección de reuse, la integración de IA para evaluación de admisiones, el sistema de notificaciones en tiempo real y la arquitectura de componentes reutilizable con shadcn/ui.

Las áreas principales de mejora se centran en la ausencia de tests unitarios e integración, la falta de migraciones formalizadas de base de datos, la necesidad de paginación server-side, y la consistencia en el manejo de estado del frontend. Estas mejoras elevarían significativamente la calidad del software y su mantenibilidad a largo plazo.