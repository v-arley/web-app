# Módulo: Raciones Diarias (Daily Rations)

## Descripción
Módulo para la gestión de raciones diarias distribuidas a personas activas en los campamentos. Incluye generación automática de raciones, marcado de entrega y consulta de historial.

## Estructura del Módulo

```
daily-rations/
├── schemas/
│   ├── ration.schema.ts                 # Validación para tabla rations
│   ├── ration-resource.schema.ts        # Validación para tabla ration_resources
│   └── ration-execution.schema.ts       # Validación para generación de raciones
│
├── services/
│   ├── RationService.ts                 # CRUD de raciones
│   ├── RationResourceService.ts         # Gestión de recursos en raciones
│   └── RationExecutionService.ts        # Generación automática de raciones
│
├── hooks/
│   ├── useRationsQuery.ts               # Consulta de raciones
│   ├── useRationMutation.ts             # Mutaciones (actualizar estado)
│   ├── useRationResourcesQuery.ts       # Consulta de recursos por ración
│   └── useExecuteDailyRations.ts        # Ejecutar generación de raciones
│
├── components/
│   ├── RationGenerationPanel.tsx        # Panel para generar raciones del día
│   ├── RationsTable.tsx                 # Tabla para marcar entregas
│   ├── RationHistoryTable.tsx           # Tabla de historial con filtros
│   └── RationResourcesDetail.tsx        # Detalle de recursos de una ración
│
├── pages/
│   ├── GenerateRationsPage.tsx          # Página: Generar Raciones
│   ├── DeliverRationsPage.tsx           # Página: Entregar Raciones
│   └── RationHistoryPage.tsx            # Página: Historial
│
└── index.ts                              # Exports públicos
```

## Funcionalidades Implementadas

### 1. Generar Raciones Diarias (3.3.8)
**Ubicación:** `GenerateRationsPage`

**Proceso:**
1. ✅ Verificar si ya existen raciones para la fecha seleccionada
2. ✅ Vista previa de personas activas y recursos necesarios
3. ✅ Generar raciones para cada persona activa del campamento
4. ✅ Asignar recursos según configuración (5L agua + 1 ración combate)
5. ✅ Descontar del inventario automáticamente
6. ✅ Verificar alertas de inventario insuficiente
7. ✅ Bloquear generación si no hay recursos suficientes

**Endpoint:** `POST /rations/execute`

**Payload:**
```typescript
{
  camp_id: number;
  ration_date: string;
  resource_config: Array<{ resource_id: number; amount: number }>;
}
```

### 2. Marcar Ración como Entregada (3.3.9)
**Ubicación:** `DeliverRationsPage`

**Funcionalidad:**
- ✅ Listar raciones del día seleccionado
- ✅ Filtrar por estado (Entregada/Pendiente)
- ✅ Marcar como entregada (`completed = 'Y'`)
- ✅ Marcar como no entregada (`completed = 'N'`)
- ✅ Agregar notas explicativas opcionales
- ✅ Ver detalle de recursos asignados expandiendo la fila

**Endpoint:** `PUT /rations/:id`

**Payload:**
```typescript
{
  completed: 'Y' | 'N';
  notes?: string;
}
```

### 3. Ver Historial de Raciones (3.3.10)
**Ubicación:** `RationHistoryPage`

**Funcionalidad:**
- ✅ Filtrar por rango de fechas (inicio/fin)
- ✅ Filtrar por estado de entrega
- ✅ Agrupar por fecha
- ✅ Mostrar estadísticas:
  - Total de raciones
  - Raciones entregadas
  - Raciones pendientes
  - Tasa de entrega (porcentaje)
- ✅ Exportar (botón preparado para implementación futura)

**Endpoint:** `GET /rations?camp_id={id}&start_date={date}&end_date={date}&completed={Y|N}`

## Configuración de Recursos

**Configuración por defecto** (hardcoded en `DEFAULT_RATION_CONFIG`):
```typescript
[
  { resource_id: 1, amount: 5 },  // Agua Potable (5L)
  { resource_id: 2, amount: 1 }   // Raciones de Combate (1 unidad)
]
```

**Ajustable:** La configuración se puede modificar en el frontend antes de ejecutar la generación, permitiendo ajustar cantidades según necesidades del campamento.

## Tablas de Base de Datos

### `rations`
```sql
CREATE TABLE db_project1.rations (
  id SERIAL PRIMARY KEY,
  person_id INTEGER NOT NULL,
  camp_id INTEGER NOT NULL,
  completed CHAR(1) DEFAULT 'N' CHECK (completed IN ('Y', 'N')),
  ration_date DATE DEFAULT CURRENT_DATE,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### `ration_resources`
```sql
CREATE TABLE db_project1.ration_resources (
  ration_id INTEGER NOT NULL,
  resource_id INTEGER NOT NULL,
  amount INTEGER NOT NULL CHECK (amount > 0),
  PRIMARY KEY (ration_id, resource_id)
);
```

## Búsquedas y Filtros

**Implementación:**
- ✅ Filtros realizados en el **backend** vía query params
- ✅ Uso de `useDebounce` (300ms) para optimizar solicitudes
- ✅ Filtros disponibles:
  - Rango de fechas (start_date, end_date)
  - Estado de entrega (completed: Y/N)
  - Campamento (camp_id)

## Componentes Compartidos Utilizados

- ✅ `Button` de `/src/components/ui/button`
- ✅ `useDebounce` de `/src/hooks/useDebounce`
- ✅ React Query (`useQuery`, `useMutation`, `QueryClient`)
- ✅ `getAuthContextFromToken` para obtener campamento actual

## Hooks Compartidos

- ✅ `useDebounce`: Debounce para campos de búsqueda (300ms)
- ✅ React Query hooks para gestión de estado del servidor

## Servicios Compartidos Utilizados

- `PersonService`: Para obtener lista de personas
- `ResourceService`: Para obtener lista de recursos
- `AxiosBaseService`: Clase base para servicios HTTP

## Patrón de Desarrollo

Basado en el módulo `production-daily`:
- ✅ Un archivo por tabla (services/schemas)
- ✅ Servicios que extienden `AxiosBaseService`
- ✅ Normalización de datos con schemas de Zod
- ✅ Hooks separados por responsabilidad
- ✅ Componentes reutilizables y composables
- ✅ Páginas independientes para cada funcionalidad
- ✅ QueryClient por página (no global)

## Validaciones

**En Frontend:**
- Validaciones con Zod en schemas
- Verificación de inventario antes de generar
- Bloqueo de generación duplicada (misma fecha)

**En Backend (triggers):**
- Las validaciones de negocio complejas se manejan en la base de datos
- Triggers para descuento automático de inventario
- Triggers para generación de alertas

## Notas de Implementación

- ❌ **NO se implementó** el campo `delivered_by` (no existe en BD)
- ✅ Solo se usa el campo `notes` para agregar información adicional
- ✅ Toast omitido (implementación futura)
- ✅ Endpoints preparados con `CONTRACT_ERROR_MESSAGE` para cuando no existan
- ✅ Configuración mixta: default ajustable en frontend

## Próximas Mejoras

- [ ] Implementar sistema de toasts para feedback
- [ ] Exportación de reportes (CSV/PDF)
- [ ] Gráficos de estadísticas
- [ ] Notificaciones automáticas de inventario bajo
- [ ] Configuración persistente de recursos por campamento
- [ ] Historial de cambios de estado

## Endpoints

POST   /rations/execute          // Generar raciones del día
GET    /rations/check             // Verificar raciones existentes
GET    /rations/preview           // Vista previa de generación
GET    /rations                   // Listar raciones (con filtros)
PUT    /rations/:id               // Actualizar ración
GET    /ration-resources          // Recursos de una ración