-- ============================================================
-- SCRIPT SQL: Generación de datos de prueba
-- Base de datos: db_project1
-- Objetivo: ~2000 registros en tablas del gestor de recursos
-- Compatible con: PostgreSQL
-- ============================================================

-- ============================================================
-- FASE 0: LIMPIEZA (opcional - descomentar si se necesita)
-- ============================================================
-- TRUNCATE CASCADE db_project1.notifications,
--   db_project1.user_sessions, db_project1.audit_logs,
--   db_project1.resource_production, db_project1.resource_alerts,
--   db_project1.shipments, db_project1.request_persons,
--   db_project1.request_resources, db_project1.camp_requests,
--   db_project1.resource_movements, db_project1.ai_prompts,
--   db_project1.ai_decisions, db_project1.admission_requests,
--   db_project1.resource_explorations, db_project1.resource_warehouses,
--   db_project1.ration_resources, db_project1.task_resources,
--   db_project1.person_explorations, db_project1.task_persons,
--   db_project1.user_points, db_project1.user_achievements,
--   db_project1.exploration_rations, db_project1.camp_production_rules,
--   db_project1.person_professions, db_project1.camp_rules,
--   db_project1.rations, db_project1.explorations,
--   db_project1.tasks, db_project1.warehouses,
--   db_project1.professions, db_project1.resources,
--   db_project1.role_permissions, db_project1.user_roles,
--   db_project1.users, db_project1.persons,
--   db_project1.camps, db_project1.achievements,
--   db_project1.permissions, db_project1.roles
--   USING db_project1.audit_logs_id_seq RESTART WITH 1;

-- ============================================================
-- FASE 1: TABLAS BASE SIN DEPENDENCIAS
-- ============================================================

-- 1.1 ROLES (5 registros)
INSERT INTO db_project1.roles (name, description, state)
SELECT
  name,
  description,
  'A'
FROM (VALUES
  ('ADMIN',          'Administrador general del sistema', 'A'),
  ('CAMP_MANAGER',   'Gestor de campamento', 'A'),
  ('LOGISTICS',      'Responsable de logística y almacenes', 'A'),
  ('FIELD_WORKER',   'Trabajador de campo', 'A'),
  ('OBSERVER',       'Observador con acceso de solo lectura', 'A')
) AS v(name, description, state);

-- 1.2 PERMISSIONS (25 registros)
INSERT INTO db_project1.permissions (code, name, description, state)
SELECT code, name, description, 'A'
FROM (VALUES
  ('CAMP_CREATE',      'Crear campamento',       'Permite crear nuevos campamentos'),
  ('CAMP_EDIT',        'Editar campamento',       'Permite modificar datos de campamentos'),
  ('CAMP_DELETE',      'Eliminar campamento',     'Permite eliminar campamentos'),
  ('CAMP_VIEW',        'Ver campamento',          'Permite ver detalles de campamentos'),
  ('PERSON_CREATE',    'Crear persona',           'Permite registrar personas'),
  ('PERSON_EDIT',      'Editar persona',          'Permite modificar datos de personas'),
  ('PERSON_DELETE',    'Eliminar persona',        'Permite eliminar personas'),
  ('PERSON_VIEW',      'Ver persona',             'Permite ver detalles de personas'),
  ('RESOURCE_CREATE',  'Crear recurso',           'Permite crear nuevos recursos'),
  ('RESOURCE_EDIT',    'Editar recurso',          'Permite modificar recursos'),
  ('RESOURCE_DELETE',  'Eliminar recurso',        'Permite eliminar recursos'),
  ('RESOURCE_VIEW',    'Ver recurso',             'Permite ver inventario de recursos'),
  ('WAREHOUSE_MANAGE', 'Gestionar almacén',       'Permite administrar almacenes y movimientos'),
  ('TASK_CREATE',      'Crear tarea',             'Permite crear tareas'),
  ('TASK_ASSIGN',      'Asignar tarea',           'Permite asignar tareas a personas'),
  ('TASK_EDIT',        'Editar tarea',            'Permite modificar tareas'),
  ('EXPLORATION_CREATE','Crear exploración',       'Permite crear exploraciones'),
  ('EXPLORATION_MANAGE','Gestionar exploración',   'Permite administrar exploraciones'),
  ('ADMISSION_APPROVE','Aprobar admisión',         'Permite aprobar solicitudes de admisión'),
  ('REPORT_VIEW',      'Ver reportes',             'Permite consultar reportes del sistema'),
  ('USER_MANAGE',      'Gestionar usuarios',       'Permite administrar usuarios y roles'),
  ('AUDIT_VIEW',       'Ver auditoría',            'Permite ver logs de auditoría'),
  ('PRODUCTION_MANAGE','Gestionar producción',      'Permite administrar reglas de producción'),
  ('RATION_MANAGE',    'Gestionar raciones',        'Permite administrar raciones de personas'),
  ('NOTIFICATION_SEND','Enviar notificaciones',     'Permite enviar notificaciones a usuarios')
) AS v(code, name, description);

-- 1.3 RESOURCES (100 registros) - Recursos del gestor de recursos
INSERT INTO db_project1.resources (code, name, description, unit_of_measure, consumable, category, status, state)
SELECT
  code, name, description, unit, consumable, category, status, 'A'
FROM (VALUES
  ('RES001', 'Agua Potable',         'Agua purificada para consumo humano',        'Litros',    'Y', 'ALIMENTOS',    'O'),
  ('RES002', 'Arroz',                'Arroz blanco granulado',                     'Kilogramos','Y', 'ALIMENTOS',    'O'),
  ('RES003', 'Frijol Negro',         'Frijol negro seco',                          'Kilogramos','Y', 'ALIMENTOS',    'O'),
  ('RES004', 'Aceite Vegetal',       'Aceite vegetal refinado',                    'Litros',    'Y', 'ALIMENTOS',    'O'),
  ('RES005', 'Harina de Trigo',      'Harina de trigo fortificada',                'Kilogramos','Y', 'ALIMENTOS',    'O'),
  ('RES006', 'Sal',                  'Sal yodatada',                               'Kilogramos','Y', 'ALIMENTOS',    'O'),
  ('RES007', 'Azúcar',               'Azúcar blanca granulada',                    'Kilogramos','Y', 'ALIMENTOS',    'O'),
  ('RES008', 'Café Molido',          'Café tostado y molido',                      'Kilogramos','Y', 'ALIMENTOS',    'O'),
  ('RES009', 'Leche en Polvo',       'Leche en polvo descremada',                  'Kilogramos','Y', 'ALIMENTOS',    'O'),
  ('RES010', 'Atún en Lata',         'Atún enlatado en agua',                      'Unidades',  'Y', 'ALIMENTOS',    'O'),
  ('RES011', 'Galletas',             'Galletas de soda',                           'Paquetes',  'Y', 'ALIMENTOS',    'O'),
  ('RES012', 'Frutas Frescas',       'Frutas de temporada',                        'Kilogramos','Y', 'ALIMENTOS',    'O'),
  ('RES013', 'Verduras',             'Verduras frescas variadas',                  'Kilogramos','Y', 'ALIMENTOS',    'O'),
  ('RES014', 'Huevos',               'Huevos frescos',                             'Unidades',  'Y', 'ALIMENTOS',    'O'),
  ('RES015', 'Pan',                  'Pan integral',                               'Unidades',  'Y', 'ALIMENTOS',    'O'),
  ('RES016', 'Medicamentos Básicos', 'Kit de primeros auxilios',                   'Unidades',  'Y', 'SALUD',        'O'),
  ('RES017', 'Antibióticos',         'Amoxicilina y otros antibióticos',           'Unidades',  'Y', 'SALUD',        'C'),
  ('RES018', 'Vendas',               'Vendas de gasa estéril',                     'Rollos',    'Y', 'SALUD',        'O'),
  ('RES019', 'Alcohol en Gel',       'Alcohol gel desinfectante',                  'Litros',    'Y', 'SALUD',        'O'),
  ('RES020', 'Mascarillas',          'Mascarillas quirúrgicas desechables',        'Unidades',  'Y', 'SALUD',        'O'),
  ('RES021', 'Guantes de Látex',     'Guantes desechables',                        'Cajas',     'Y', 'SALUD',        'O'),
  ('RES022', 'Termómetros',          'Termómetros digitales',                      'Unidades',  'N', 'SALUD',        'M'),
  ('RES023', 'Jarabes para Tos',     'Jarabe antitusígeno',                        'Unidades',  'Y', 'SALUD',        'O'),
  ('RES024', 'Sábanas',              'Sábanas de algodón',                         'Unidades',  'N', 'SALUD',        'M'),
  ('RES025', 'Camillas',             'Camillas plegables',                         'Unidades',  'N', 'SALUD',        'C'),
  ('RES026', 'Carpa familiar',       'Carpa para 4 personas',                      'Unidades',  'N', 'REFUGIO',      'M'),
  ('RES027', 'Carpa individual',     'Carpa para 1 persona',                       'Unidades',  'N', 'REFUGIO',      'M'),
  ('RES028', 'Lona impermeable',     'Lona plástica impermeable grande',           'Unidades',  'N', 'REFUGIO',      'O'),
  ('RES029', 'Colchonetas',          'Colchonetas inflables',                      'Unidades',  'N', 'REFUGIO',      'O'),
  ('RES030', 'Mantas',               'Mantas térmicas',                            'Unidades',  'Y', 'REFUGIO',      'O'),
  ('RES031', 'Cobijas',              'Cobijas de algodón',                         'Unidades',  'N', 'REFUGIO',      'M'),
  ('RES032', 'Linternas',            'Linternas LED recargables',                  'Unidades',  'N', 'EQUIPAMIENTO', 'O'),
  ('RES033', 'Baterías',             'Pilas alcalinas AA',                         'Paquetes',  'Y', 'EQUIPAMIENTO', 'O'),
  ('RES034', 'Radio Comunicación',   'Radio bidireccional VHF',                    'Unidades',  'N', 'EQUIPAMIENTO', 'M'),
  ('RES035', 'Herramientas Manuales','Set de herramientas básicas',                 'Juegos',    'N', 'EQUIPAMIENTO', 'M'),
  ('RES036', 'Cuerdas',              'Cuerda de nylon 10mm',                       'Rollos',    'Y', 'EQUIPAMIENTO', 'O'),
  ('RES037', 'Lonas de Cobertura',   'Lonas para techos temporales',              'Unidades',  'N', 'EQUIPAMIENTO', 'O'),
  ('RES038', 'Generador Eléctrico',  'Generador a gasolina 3000W',                'Unidades',  'N', 'EQUIPAMIENTO', 'C'),
  ('RES039', 'Paneles Solares',      'Paneles solares portátiles 100W',           'Unidades',  'N', 'EQUIPAMIENTO', 'C'),
  ('RES040', 'Cargador Solar',       'Cargador solar para dispositivos',          'Unidades',  'N', 'EQUIPAMIENTO', 'O'),
  ('RES041', 'Extintores',           'Extintores de incendios ABC',                'Unidades',  'N', 'SEGURIDAD',   'M'),
  ('RES042', 'Chalecos Reflectivos','Chalecos de alta visibilidad',               'Unidades',  'N', 'SEGURIDAD',   'O'),
  ('RES043', 'Cascos de Seguridad',  'Cascos de protección industrial',            'Unidades',  'N', 'SEGURIDAD',   'M'),
  ('RES044', 'Guantes de Trabajo',   'Guantes de protección para trabajo',         'Pares',     'N', 'SEGURIDAD',   'O'),
  ('RES045', 'Gafas de Protección',  'Gafas de seguridad',                         'Unidades',  'N', 'SEGURIDAD',   'O'),
  ('RES046', 'Señalización',         'Señales de advertencia y dirección',         'Unidades',  'N', 'SEGURIDAD',   'O'),
  ('RES047', 'Cinta Peligro',        'Cinta amarilla de peligro',                  'Rollos',    'Y', 'SEGURIDAD',   'O'),
  ('RES048', 'Campos de Deporte',    'Set de pelotas y conos',                     'Juegos',    'N', 'RECREACION',  'O'),
  ('RES049', 'Juegos de Mesa',       'Ajedrez, damas y otros juegos',              'Juegos',    'N', 'RECREACION',  'O'),
  ('RES050', 'Instrumentos Musicales','Guitarras y percusión básica',              'Unidades',  'N', 'RECREACION',  'M'),
  ('RES051', 'Libros',               'Libros de diversas categorías',              'Unidades',  'N', 'EDUCACION',   'O'),
  ('RES052', 'Cuadernos',            'Cuadernos de escritura',                     'Unidades',  'Y', 'EDUCACION',   'O'),
  ('RES053', 'Lápices y Bolígrafos', 'Útiles de escritura',                        'Cajas',     'Y', 'EDUCACION',   'O'),
  ('RES054', 'Pizarras',             'Pizarras portátiles',                        'Unidades',  'N', 'EDUCACION',   'M'),
  ('RES055', 'Material Didáctico',   'Kit de material educativo',                  'Juegos',    'N', 'EDUCACION',   'O'),
  ('RES056', 'Compost',              'Abono orgánico compostado',                  'Kilogramos','Y', 'AGRICULTURA', 'O'),
  ('RES057', 'Semillas',             'Semillas variadas para siembra',             'Paquetes',  'Y', 'AGRICULTURA', 'O'),
  ('RES058', 'Herramientas de Jardín','Palas, rastrillos, azadones',              'Unidades',  'N', 'AGRICULTURA', 'M'),
  ('RES059', 'Mangueras',            'Mangueras de riego',                         'Metros',    'N', 'AGRICULTURA', 'O'),
  ('RES060', 'Macetas',              'Macetas de plástico variadas',               'Unidades',  'N', 'AGRICULTURA', 'O'),
  ('RES061', 'Gasolina',             'Gasolina regular',                           'Litros',    'Y', 'COMBUSTIBLE', 'O'),
  ('RES062', 'Diésel',               'Combustible diésel',                         'Litros',    'Y', 'COMBUSTIBLE', 'O'),
  ('RES063', 'Leña',                 'Leña seca para cocina',                     'Kilogramos','Y', 'COMBUSTIBLE', 'O'),
  ('RES064', 'Propano',              'Gas propano para cocinas',                   'Kilogramos','Y', 'COMBUSTIBLE', 'O'),
  ('RES065', 'Bolsas de Basura',     'Bolsas plásticas de basura grandes',         'Paquetes',  'Y', 'LIMPIEZA',    'O'),
  ('RES066', 'Jabón',                'Jabón de lavar en barra',                    'Unidades',  'Y', 'LIMPIEZA',    'O'),
  ('RES067', 'Detergente',           'Detergente para ropa',                       'Kilogramos','Y', 'LIMPIEZA',    'O'),
  ('RES068', 'Cloro',                'Cloro para desinfección',                    'Litros',    'Y', 'LIMPIEZA',    'O'),
  ('RES069', 'Escurridores',         'Escurridores y escobas',                     'Unidades',  'N', 'LIMPIEZA',    'O'),
  ('RES070', 'Traperos',             'Traperos y cubetas',                         'Unidades',  'N', 'LIMPIEZA',    'M'),
  ('RES071', 'Papel Higiénico',      'Rollo de papel higiénico',                   'Paquetes',  'Y', 'HIGIENE',     'O'),
  ('RES072', 'Toallas de Papel',     'Rollo de toallas desechables',              'Paquetes',  'Y', 'HIGIENE',     'O'),
  ('RES073', 'Jabón Líquido',        'Jabón antibacterial líquido',               'Litros',    'Y', 'HIGIENE',     'O'),
  ('RES074', 'Pasta de Dientes',     'Tubos de pasta dental',                      'Unidades',  'Y', 'HIGIENE',     'O'),
  ('RES075', 'Cepillos de Dientes',  'Cepillos dentales desechables',             'Unidades',  'Y', 'HIGIENE',     'O'),
  ('RES076', 'Toallas',              'Toallas de baño individuales',              'Unidades',  'N', 'HIGIENE',     'O'),
  ('RES077', 'Bidones de Agua',      'Bidones de almacenamiento de agua',         'Unidades',  'N', 'ALMACENAJE',  'M'),
  ('RES078', 'Contenedores',         'Contenedores plásticos con tapa',           'Unidades',  'N', 'ALMACENAJE',  'O'),
  ('RES079', 'Estanterías',          'Estantes metálicos para almacén',           'Unidades',  'N', 'ALMACENAJE',  'C'),
  ('RES080', 'Cajas de Cartón',      'Cajas para empaque y almacenamiento',       'Unidades',  'Y', 'ALMACENAJE',  'O'),
  ('RES081', 'Toldos',               'Toldos parasol desmontables',               'Unidades',  'N', 'INFRAESTRUCTURA','O'),
  ('RES082', 'Mesas Plegables',      'Mesas plegables de aluminio',               'Unidades',  'N', 'INFRAESTRUCTURA','M'),
  ('RES083', 'Sillas Plegables',     'Sillas plegables individuales',             'Unidades',  'N', 'INFRAESTRUCTURA','O'),
  ('RES084', 'Tanques de Agua',      'Tanques de almacenamiento de agua 1000L',   'Unidades',  'N', 'INFRAESTRUCTURA','C'),
  ('RES085', 'Filtración de Agua',   'Sistemas de filtrado portátiles',           'Unidades',  'N', 'INFRAESTRUCTURA','M'),
  ('RES086', 'Cocinas de Campaña',   'Cocinas portátiles a gas',                  'Unidades',  'N', 'INFRAESTRUCTURA','M'),
  ('RES087', 'Duchas Portátiles',    'Duchas solares portátiles',                 'Unidades',  'N', 'INFRAESTRUCTURA','O'),
  ('RES088', 'Letrinas Portátiles',  'Baños químicos portátiles',                 'Unidades',  'N', 'INFRAESTRUCTURA','M'),
  ('RES089', 'Iluminación Solar',    'Faroles solares LED',                       'Unidades',  'N', 'INFRAESTRUCTURA','O'),
  ('RES090', 'Cables Eléctricos',    'Rollo de cable eléctrico',                  'Rollos',    'N', 'INFRAESTRUCTURA','O'),
  ('RES091', 'Cemento',              'Sacos de cemento Portland',                 'Sacos',     'Y', 'CONSTRUCCION', 'O'),
  ('RES092', 'Arena',                'Arena de construcción',                      'Toneladas', 'Y', 'CONSTRUCCION', 'O'),
  ('RES093', 'Grava',                'Grava para construcción',                   'Toneladas', 'Y', 'CONSTRUCCION', 'O'),
  ('RES094', 'Varillas de Acero',    'Varillas de refuerzo',                      'Unidades',  'N', 'CONSTRUCCION', 'O'),
  ('RES095', 'Tablas de Madera',     'Tablas de madera aserrada',                 'Unidades',  'N', 'CONSTRUCCION', 'O'),
  ('RES096', 'Tornillos y Clavos',   'Caja de tornillos y clavos variados',       'Cajas',     'Y', 'CONSTRUCCION', 'O'),
  ('RES097', 'Pintura',              'Pintura latex blanca',                      'Galones',   'Y', 'CONSTRUCCION', 'O'),
  ('RES098', 'Plástico para Techos', 'Láminas de polietileno reforzado',          'Unidades',  'N', 'CONSTRUCCION', 'O'),
  ('RES099', 'Arena de Gato',        'Arena para gatos aglomerante',              'Kilogramos','Y', 'OTROS',        'O'),
  ('RES100','Cuerda para Tendedero', 'Cuerda de polipropileno',                  'Rollos',    'Y', 'OTROS',        'O')
) AS v(code, name, description, unit, consumable, category, status);

-- 1.4 ACHIEVEMENTS (30 registros)
INSERT INTO db_project1.achievements (code, name, description, icon_url, condition_logic, points, category, state)
SELECT code, name, description, icon_url, condition_logic::jsonb, points, category, 'A'
FROM (VALUES
  ('ACH001', 'Primer Paso',         'Registrarse por primera vez',              '/icons/ach-first-step.svg',
    '{"action": "register", "count": 1}', 10, 'LOGRO', 'A'),
  ('ACH002', 'Buen Ciudadano',      'Completar el perfil personal',            '/icons/ach-profile.svg',
    '{"action": "complete_profile", "required_fields": 5}', 15, 'LOGRO', 'A'),
  ('ACH003', 'Trabajador Incansable','Completar 10 tareas',                     '/icons/ach-worker.svg',
    '{"action": "complete_tasks", "count": 10}', 25, 'PRODUCCION', 'A'),
  ('ACH004', 'Super Trabajador',    'Completar 50 tareas',                     '/icons/ach-super-worker.svg',
    '{"action": "complete_tasks", "count": 50}', 100, 'PRODUCCION', 'A'),
  ('ACH005', 'Explorador Novato',   'Participar en 1 exploración',             '/icons/ach-explorer.svg',
    '{"action": "exploration", "count": 1}', 20, 'EXPLORACION', 'A'),
  ('ACH006', 'Explorador Veterano', 'Participar en 10 exploraciones',          '/icons/ach-veteran.svg',
    '{"action": "exploration", "count": 10}', 150, 'EXPLORACION', 'A'),
  ('ACH007', 'Guardián del Campamento','Reportar una alerta de recurso',       '/icons/ach-guardian.svg',
    '{"action": "report_alert", "count": 1}', 15, 'SEGURIDAD', 'A'),
  ('ACH008', 'Organizador Nato',    'Crear 5 recursos nuevos',                 '/icons/ach-organizer.svg',
    '{"action": "create_resources", "count": 5}', 20, 'LOGISTICA', 'A'),
  ('ACH009', 'Colaborador',         'Aprobar 3 solicitudes de admisión',       '/icons/ach-collaborator.svg',
    '{"action": "approve_admission", "count": 3}', 30, 'ADMINISTRACION', 'A'),
  ('ACH010', 'Mentor',              'Asignar 10 personas a tareas',            '/icons/ach-mentor.svg',
    '{"action": "assign_persons", "count": 10}', 25, 'LIDERAZGO', 'A'),
  ('ACH011', 'Eco Warrior',         'Gestionar 20 movimientos de recursos',    '/icons/ach-eco.svg',
    '{"action": "resource_movements", "count": 20}', 30, 'LOGISTICA', 'A'),
  ('ACH012', 'Planificador',        'Crear 5 exploraciones',                   '/icons/ach-planner.svg',
    '{"action": "create_exploration", "count": 5}', 40, 'EXPLORACION', 'A'),
  ('ACH013', 'Rescate Exitoso',     'Completar una exploración con riesgo H',  '/icons/ach-rescue.svg',
    '{"action": "complete_high_risk", "count": 1}', 75, 'EXPLORACION', 'A'),
  ('ACH014', 'Almacén Inteligente','Mantener inventario actualizado 30 días',  '/icons/ach-warehouse.svg',
    '{"action": "daily_inventory", "count": 30}', 50, 'LOGISTICA', 'A'),
  ('ACH015', 'Sin Desperdicios',    'Consumir raciones por 7 días consecutivos','/icons/ach-ration.svg',
    '{"action": "ration_streak", "count": 7}', 30, 'SALUD', 'A'),
  ('ACH016', 'Bienvenido',          'Ser admitido en un campamento',           '/icons/ach-welcome.svg',
    '{"action": "admitted", "count": 1}', 10, 'SOCIAL', 'A'),
  ('ACH017', 'Nueva Amistad',       'Compartir exploración con 3 personas',   '/icons/ach-friend.svg',
    '{"action": "shared_exploration", "count": 3}', 20, 'SOCIAL', 'A'),
  ('ACH018', 'Líder Nato',          'Administrar un campamento',               '/icons/ach-leader.svg',
    '{"action": "admin_camp", "count": 1}', 50, 'LIDERAZGO', 'A'),
  ('ACH019', 'Maestro Artesano',    'Producir 100 unidades de recursos',       '/icons/ach-craftsman.svg',
    '{"action": "production", "amount": 100}', 60, 'PRODUCCION', 'A'),
  ('ACH020', 'Ojo de Águila',       'Detectar 5 alertas antes de que escalen', '/icons/ach-eagle.svg',
    '{"action": "early_alerts", "count": 5}', 40, 'SEGURIDAD', 'A'),
  ('ACH021', 'Logística Perfecta',  'Completar 10 envíos a tiempo',           '/icons/ach-logistics.svg',
    '{"action": "on_time_shipments", "count": 10}', 80, 'LOGISTICA', 'A'),
  ('ACH022', 'Granjero Expert',     'Sembrar y cosechar en 5 temporadas',     '/icons/ach-farmer.svg',
    '{"action": "harvest_cycles", "count": 5}', 45, 'AGRICULTURA', 'A'),
  ('ACH023', 'Constructor',         'Completar 5 proyectos de construcción',   '/icons/ach-builder.svg',
    '{"action": "construction_projects", "count": 5}', 55, 'CONSTRUCCION', 'A'),
  ('ACH024', 'Sobreviviente',       'Vivir 30 días en un campamento',          '/icons/ach-survivor.svg',
    '{"action": "days_survived", "count": 30}', 100, 'EXPLORACION', 'A'),
  ('ACH025', 'Ingeniero de Campo',  'Crear 10 reglas de producción',           '/icons/ach-engineer.svg',
    '{"action": "production_rules", "count": 10}', 35, 'PRODUCCION', 'A'),
  ('ACH026', 'Puntual',             'No llegar tarde a 20 tareas',            '/icons/ach-punctual.svg',
    '{"action": "on_time_tasks", "count": 20}', 40, 'DISCIPLINA', 'A'),
  ('ACH027', 'Innovador',           'Sugerir mejora implementada',             '/icons/ach-innovator.svg',
    '{"action": "suggestion_approved", "count": 1}', 30, 'INNOVACION', 'A'),
  ('ACH028', 'Veterano',            'Estar activo por 90 días',               '/icons/ach-veteran2.svg',
    '{"action": "days_active", "count": 90}', 200, 'LOGRO', 'A'),
  ('ACH029', 'Comunicador',         'Enviar 50 notificaciones',               '/icons/ach-communicator.svg',
    '{"action": "notifications_sent", "count": 50}', 25, 'SOCIAL', 'A'),
  ('ACH030', 'Maestro del Sistema', 'Desbloquear todos los logros',           '/icons/ach-master.svg',
    '{"action": "all_achievements", "count": 30}', 500, 'LOGRO', 'A')
) AS v(code, name, description, icon_url, condition_logic, points, category, state);

-- ============================================================
-- FASE 2: CAMPS (10 campamentos)
-- ============================================================
INSERT INTO db_project1.camps (admin_id, code, description, capacity, location_x, location_y, state)
SELECT
  NULL, -- Se actualizará después de crear usuarios
  code,
  description,
  capacity,
  location_x,
  location_y,
  'A'
FROM (VALUES
  ('CMP001', 'Campamento Central Sierra Verde',        200, -86.25, 11.05, 'A'),
  ('CMP002', 'Refugio Montaña del Este',               150, -85.15, 12.15, 'A'),
  ('CMP003', 'Base Operaciones Río Negro',             100, -86.80, 10.95, 'A'),
  ('CMP004', 'Aldea Lago Azul',                        300, -87.05, 11.30, 'A'),
  ('CMP005', 'Puesto Avanzado Cerro Alto',              80, -85.60, 11.75, 'A'),
  ('CMP006', 'Centro de Acopio Norte',                 250, -86.40, 12.50, 'A'),
  ('CMP007', 'Refugio Costero Pacífico',               180, -87.20, 11.50, 'A'),
  ('CMP008', 'Estación Forestal Tropical',             120, -85.90, 12.00, 'A'),
  ('CMP009', 'Campamento Volcán Cerro Negro',           90, -86.55, 11.15, 'A'),
  ('CMP010', 'Base Logística Sur',                     160, -86.70, 10.80, 'A')
) AS v(code, description, capacity, location_x, location_y, state);

-- ============================================================
-- FASE 3: PERSONS (2000 personas - objetivo principal)
-- ============================================================
INSERT INTO db_project1.persons (camp_id, dni, name, surname, date_of_birth, sex, photo, id_card_url, description, conditions, state)
SELECT
  (CASE WHEN random() < 0.05 THEN NULL ELSE camp_id END)::int,
  dni,
  name,
  surname,
  dob,
  sex,
  '/photos/' || dni || '.jpg',
  '/id_cards/' || dni || '_id.jpg',
  desc_text,
  conditions,
  'A'
FROM (
  SELECT
    ROW_NUMBER() OVER () AS rn,
    (SELECT id FROM db_project1.camps ORDER BY random() LIMIT 1) AS camp_id,
    'DNI-' || LPAD(ROW_NUMBER() OVER ()::text, 7, '0') AS dni,
    first_names[floor(random() * array_length(first_names, 1) + 1)::int] AS name,
    last_names[floor(random() * array_length(last_names, 1) + 1)::int] AS surname,
    (DATE '1950-01-01' + (random() * (DATE '2010-12-31' - DATE '1950-01-01'))::int) AS dob,
    (ARRAY['M', 'F', 'O'])[floor(random() * 3 + 1)::int] AS sex,
    (ARRAY[
      'Persona colaboradora y comprometida con la comunidad',
      'Experto en labores de campo y supervivencia',
      'Especialista en primeros auxilios y atención médica',
      'Ingeniero con experiencia en construcción',
      'Profesor dedicado a la educación comunitaria',
      'Agricultor con conocimiento en cultivos sostenibles',
      'Chef experimentado en cocina de campo',
      'Técnico en sistemas de energía renovable',
      'Guía de exploración con amplia experiencia',
      'Administrador eficiente de recursos',
      NULL
    ])[floor(random() * 11 + 1)::int] AS desc_text,
    (ARRAY[
      'Sin condiciones especiales',
      'Hipertensión arterial controlada',
      'Diabetes tipo 2',
      'Asma leve',
      'Alergia a mariscos',
      'Lente de contacto',
      'Intolerancia al gluten',
      'Sin condiciones',
      NULL
    ])[floor(random() * 9 + 1)::int] AS conditions
  FROM generate_series(1, 2000),
  LATERAL (SELECT
    ARRAY['María','Ana','Carmen','Rosa','Laura','Sofía','Valentina','Camila','Isabella','Daniela',
          'Andrea','Paula','Luciana','Gabriela','Fernanda','Adriana','Claudia','Patricia','Elena','Mónica',
          'Luis','Carlos','Miguel','Juan','Pedro','José','Francisco','Antonio','Manuel','Roberto',
          'Alejandro','Diego','Ricardo','Fernando','Sergio','Eduardo','Rafael','Pablo','Jorge','Álvaro',
          'Sandra','Patricia','Rocío','Beatriz','Alicia','Teresa','Silvia','Verónica','Natalia','Martha',
          'Raúl','Ernesto','Raúl','Enrique','Rubén','Óscar','Gustavo','Héctor','Arturo','Mauricio'] AS first_names,
    ARRAY['García','Rodríguez','Martínez','López','Hernández','González','Pérez','Sánchez','Ramírez','Torres',
          'Flores','Rivera','Gómez','Díaz','Cruz','Morales','Reyes','Ortiz','Gutiérrez','Chávez',
          'Ramos','Ruiz','Alvarez','Mendoza','Aguilar','Vargas','Castillo','Jiménez','Moreno','Romero',
          'Medina','Vega','Castro','Herrera','Salazar','Domínguez','Arias','Fuentes','Rojas','Peña'] AS last_names
  ) AS names
) sub
WHERE rn <= 2000;

-- ============================================================
-- FASE 4: USERS (200 usuarios - referenciando personas)
-- ============================================================
INSERT INTO db_project1.users (person_id, username, password_hash, profession, state)
SELECT
  p.id,
  'user_' || LPAD(ROW_NUMBER() OVER (ORDER BY p.id)::text, 5, '0'),
  '$2b$10$' || md5(random()::text) || md5(random()::text),
  (ARRAY['MÉDICO','INGENIERO','MAESTRO','COCINERO','AGRICULTOR','SOLDADO',
         'ENFERMERA','SASTRE','CARPINTERO','MECÁNICO',NULL])[floor(random() * 11 + 1)::int],
  'A'
FROM db_project1.persons p
ORDER BY random()
LIMIT 200;

-- ============================================================
-- FASE 5: ACTUALIZAR admin_id en CAMPS (requiere users)
-- ============================================================
UPDATE db_project1.camps c
SET admin_id = u.id
FROM (
  SELECT DISTINCT ON (c2.id) c2.id AS camp_id, u2.id AS user_id
  FROM db_project1.camps c2
  JOIN db_project1.users u2 ON u2.state = 'A'
  ORDER BY c2.id, random()
) u
WHERE c.id = u.camp_id;

-- ============================================================
-- FASE 6: RELACIONES DE USUARIOS Y ROLES
-- ============================================================

-- 6.1 USER_ROLES
INSERT INTO db_project1.user_roles (user_id, role_id, status, assignment_date)
SELECT
  u.id,
  r.id,
  'A',
  NOW() - (random() * INTERVAL '365 days')
FROM db_project1.users u
CROSS JOIN LATERAL (
  SELECT id FROM db_project1.roles ORDER BY random()
  LIMIT CASE WHEN random() < 0.6 THEN 1 WHEN random() < 0.8 THEN 2 ELSE 1 END
) r
ON CONFLICT DO NOTHING;

-- 6.2 ROLE_PERMISSIONS
INSERT INTO db_project1.role_permissions (role_id, permission_id)
SELECT DISTINCT r.id, p.id
FROM db_project1.roles r
CROSS JOIN LATERAL (
  SELECT id FROM db_project1.permissions ORDER BY random()
  LIMIT (3 + floor(random() * 6)::int)
) p
ON CONFLICT DO NOTHING;

-- ============================================================
-- FASE 7: WAREHOUSES (30 almacenes)
-- ============================================================
INSERT INTO db_project1.warehouses (camp_id, admin_id, name, location_details, created_at)
SELECT
  c.id,
  u.id,
  'Almacén ' || wtype || ' - ' || c.code,
  'Sector ' || sector || ', Nivel ' || level,
  NOW() - (random() * INTERVAL '180 days')
FROM db_project1.camps c
CROSS JOIN LATERAL (
  SELECT
    (ARRAY['Principal','Secundario','Temporal','de Emergencia'])[floor(random()*4+1)::int] AS wtype,
    (ARRAY['Norte','Sur','Este','Oeste','Central'])[floor(random()*5+1)::int] AS sector,
    (ARRAY['Planta Baja','Nivel 1','Nivel 2','Sótano'])[floor(random()*4+1)::int] AS level
) wt
CROSS JOIN LATERAL (
  SELECT id FROM db_project1.users u WHERE u.state='A' ORDER BY random() LIMIT 1
) u
CROSS JOIN generate_series(1, 3)
WHERE true
ON CONFLICT DO NOTHING;

-- ============================================================
-- FASE 8: PROFESSIONS (25 profesiones)
-- ============================================================
INSERT INTO db_project1.professions (code, name, description, default_resource_id, default_production_amount, state)
SELECT
  code, name, description, dri, dpa, 'A'
FROM (VALUES
  ('PRF001', 'Médico',            'Atención médica general',                     16, 5,  'A'),
  ('PRF002', 'Enfermero',         'Apoyo en atención médica',                    18, 10, 'A'),
  ('PRF003', 'Ingeniero Civil',   'Construcción y mantenimiento',                91, 20, 'A'),
  ('PRF004', 'Carpintero',        'Fabricación de estructuras de madera',        95, 15, 'A'),
  ('PRF005', 'Electricista',      'Instalación y mantenimiento eléctrico',       90, 8,  'A'),
  ('PRF006', 'Plomero',           'Instalación hidráulica',                      85, 10, 'A'),
  ('PRF007', 'Cocinero',          'Preparación de alimentos',                    2,  50, 'A'),
  ('PRF008', 'Agricultor',        'Cultivo y cosecha de alimentos',              57, 30, 'A'),
  ('PRF009', 'Ganadero',          'Cuidado de animales',                         14, 20, 'A'),
  ('PRF010', 'Soldado',           'Seguridad y defensa del campamento',          41, 2,  'A'),
  ('PRF011', 'Guía de Exploración','Liderazgo de expediciones',                  36, 5,  'A'),
  ('PRF012', 'Profesor',          'Educación y formación',                       51, 20, 'A'),
  ('PRF013', 'Administrador',     'Gestión administrativa',                      NULL, NULL,'A'),
  ('PRF014', 'Logístico',         'Gestión de inventario y distribución',        NULL, NULL,'A'),
  ('PRF015', 'Mecánico',          'Reparación de maquinaria',                    35, 3,  'A'),
  ('PRF016', 'Comunicaciones',    'Gestión de radio y telecomunicaciones',        34, 5,  'A'),
  ('PRF017', 'Topógrafo',         'Medición de terrenos',                        NULL, NULL,'A'),
  ('PRF018', 'Sastre',            'Confección y reparación de ropa',             76, 10, 'A'),
  ('PRF019', 'Herrero',           'Trabajo con metales',                         94, 8,  'A'),
  ('PRF020', 'Bombero',           'Prevención y extinción de incendios',         41, 2,  'A'),
  ('PRF021', 'Viverista',         'Manejo de viveros y plantaciones',            57, 25, 'A'),
  ('PRF022', 'Albañil',           'Construcción en block y ladrillo',            91, 30, 'A'),
  ('PRF023', 'Pintor',            'Pintura de estructuras',                      97, 15, 'A'),
  ('PRF024', 'Sastre de Cuero',   'Trabajo artesanal con cuero',                 NULL, 5, 'A'),
  ('PRF025', 'Nutricionista',     'Planificación nutricional',                   NULL, NULL,'A')
) AS v(code, name, description, dri, dpa);

-- ============================================================
-- FASE 9: PERSON_PROFESSIONS (asignar profesiones a personas)
-- ============================================================
INSERT INTO db_project1.person_professions (person_id, profession_id, assigned_at, is_temporary, temporary_until, assigned_by)
SELECT
  p.person_id,
  p.profession_id,
  NOW() - (random() * INTERVAL '300 days'),
  (CASE WHEN random() < 0.15 THEN 'Y' ELSE 'N' END),
  (CASE WHEN random() < 0.15 THEN (CURRENT_DATE + (random() * 90 + 30)::int)::date ELSE NULL END),
  (SELECT id FROM db_project1.users ORDER BY random() LIMIT 1)
FROM (
  SELECT
    (SELECT id FROM db_project1.persons ORDER BY random() LIMIT 1) AS person_id,
    (SELECT id FROM db_project1.professions ORDER BY random() LIMIT 1) AS profession_id
  FROM generate_series(1, 400)
) p
ON CONFLICT DO NOTHING;

-- ============================================================
-- FASE 10: RESOURCE_WAREHouses (inventario en almacenes)
-- ============================================================
INSERT INTO db_project1.resource_warehouses (warehouse_id, resource_id, amount, min_quantity, date_last_movement)
SELECT
  rw.warehouse_id,
  rw.resource_id,
  rw.amount,
  rw.min_qty,
  NOW() - (random() * INTERVAL '60 days')
FROM (
  SELECT
    w.id AS warehouse_id,
    r.id AS resource_id,
    (floor(random() * 500) + 10)::int AS amount,
    (floor(random() * 50) + 5)::int AS min_qty
  FROM db_project1.warehouses w
  CROSS JOIN LATERAL (
    SELECT id FROM db_project1.resources ORDER BY random()
    LIMIT (5 + floor(random() * 15)::int)
  ) r
) rw
ON CONFLICT DO NOTHING;

-- ============================================================
-- FASE 11: TASKS (300 tareas)
-- ============================================================
INSERT INTO db_project1.tasks (camp_id, name, description, type, priority, difficulty, estimated_minutes, created_at)
SELECT
  c.id,
  tname,
  tdesc,
  ttype,
  (ARRAY['L','M','H'])[floor(random()*3+1)::int],
  (ARRAY['L','M','H'])[floor(random()*3+1)::int],
  (15 + floor(random() * 465)::int),
  NOW() - (random() * INTERVAL '90 days')
FROM (
  SELECT
    c2.id,
    (ARRAY[
      'Limpiar zona de campamento',
      'Reparar sistema de agua',
      'Construir barrera de contención',
      'Organizar almacén de alimentos',
      'Capacitar personal en primeros auxilios',
      'Plantar huerto comunitario',
      'Instalar paneles solares',
      'Reparar carpa dañada',
      'Desinfectar área común',
      'Preparar zona de evacuación',
      'Revisar sistema eléctrico',
      'Cortar leña para cocina',
      'Transportar suministros desde base',
      'Establecer radio de comunicaciones',
      'Construir compostero comunitario',
      'Pintar estructura principal',
      'Reparar camino de acceso',
      'Instalar iluminación solar',
      'Alimentar sistema de filtrado de agua',
      'Inspeccionar zonas de riesgo'
    ])[(row_number() over()) % 20 + 1] AS tname,
    'Descripción de la tarea de mantenimiento y operación del campamento' AS tdesc,
    (ARRAY['MANTENIMIENTO','CONSTRUCCION','LOGISTICA','SEGURIDAD','EDUCACION','SALUD'])[floor(random()*6+1)::int] AS ttype
  FROM db_project1.camps c2
  CROSS JOIN generate_series(1, 30)
) t;

-- ============================================================
-- FASE 12: TASK_PERSONS (asignar personas a tareas)
-- ============================================================
INSERT INTO db_project1.task_persons (task_id, person_id, state, completed_at, assigned_at)
SELECT
  t.task_id,
  t.person_id,
  (ARRAY['A','A','A','C'])[floor(random()*4+1)::int],
  (CASE WHEN random() < 0.3 THEN NOW() - (random() * INTERVAL '30 days') ELSE NULL END),
  NOW() - (random() * INTERVAL '60 days')
FROM (
  SELECT
    (SELECT id FROM db_project1.tasks ORDER BY random() LIMIT 1) AS task_id,
    (SELECT id FROM db_project1.persons ORDER BY random() LIMIT 1) AS person_id
  FROM generate_series(1, 500)
) t
ON CONFLICT DO NOTHING;

-- ============================================================
-- FASE 13: TASK_RESOURCES (recursos asignados a tareas)
-- ============================================================
INSERT INTO db_project1.task_resources (task_id, resource_id, amount)
SELECT
  tr.task_id,
  tr.resource_id,
  (1 + floor(random() * 50)::int)
FROM (
  SELECT
    (SELECT id FROM db_project1.tasks ORDER BY random() LIMIT 1) AS task_id,
    (SELECT id FROM db_project1.resources ORDER BY random() LIMIT 1) AS resource_id
  FROM generate_series(1, 400)
) tr
ON CONFLICT DO NOTHING;

-- ============================================================
-- FASE 14: EXPLORATIONS (60 exploraciones)
-- ============================================================
INSERT INTO db_project1.explorations (camp_id, code, name, departure_date, estimated_return_date, duration_days, state, objective, notes, risk_level, created_at)
SELECT
  c.id,
  'EXP-' || LPAD(ROW_NUMBER() OVER (ORDER BY c.id)::text, 4, '0'),
  ename,
  dep_date,
  dep_date + (dur || ' days')::interval,
  dur,
  (ARRAY['P','A','F','C'])[floor(random()*4+1)::int],
  eobj,
  enotes,
  (ARRAY['L','M','H'])[floor(random()*3+1)::int],
  NOW() - (random() * INTERVAL '120 days')
FROM (
  SELECT
    c2.id,
    (ARRAY[
      'Exploración de reconocimiento norte',
      'Misión de búsqueda y rescate',
      'Exploración geológica del volcán',
      'Reconocimiento de ruta de evacuación',
      'Inspección de fuentes de agua',
      'Exploración forestal profunda',
      'Misión de aprovisionamiento',
      'Exploración costera',
      'Reconocimiento de zona inundable',
      'Patrulla de seguridad periódica',
      'Exploración agrícola',
      'Inspección de infraestructura',
      'Exploración nocturna',
      'Misión de comunicación intercampamento',
      'Reconocimiento de fauna local'
    ])[(row_number() over()) % 15 + 1] AS ename,
    (NOW() - (random() * INTERVAL '90 days') + (random() * INTERVAL '30 days'))::timestamp dep_date,
    (3 + floor(random() * 25)::int) AS dur,
    (ARRAY[
      'Identificar recursos naturales disponibles en la zona',
      'Buscar posibles ubicaciones para campamentos avanzados',
      'Evaluar riesgos naturales en la región',
      'Establecer rutas seguras entre campamentos',
      'Recolectar muestras geológicas y biológicas',
      'Verificar estado de señales de radio',
      'Cartografiar la zona de influencia',
      'Buscar fuentes de agua potable',
      'Evaluar condición de caminos de acceso',
      'Detectar posibles amenazas ambientales'
    ])[(row_number() over()) % 10 + 1] AS eobj,
    (ARRAY[
      'Zona con vegetación densa, precaución con fauna',
      'Terreno irregular, uso obligatorio de calzado adecuado',
      'Riesgo de lluvias fuertes en temporada',
      'Se requiere equipo de radio por falta de cobertura',
      'Observar fauna local desde distancia prudencial',
      NULL
    ])[(row_number() over()) % 6 + 1] AS enotes
  FROM db_project1.camps c2
  CROSS JOIN generate_series(1, 6)
) e;

-- ============================================================
-- FASE 15: EXPLORATION_RATIONS (raciones para exploraciones)
-- ============================================================
INSERT INTO db_project1.exploration_rations (exploration_id, resource_id, planned_amount, consumed_amount, notes)
SELECT
  er.exploration_id,
  er.resource_id,
  er.planned,
  LEAST(er.planned, (er.planned * random() * 1.2)::int),
  (ARRAY['Ración estándar','Ración de emergencia','Ración ligera para marcha rápida',NULL])[floor(random()*4+1)::int]
FROM (
  SELECT
    (SELECT id FROM db_project1.explorations ORDER BY random() LIMIT 1) AS exploration_id,
    (SELECT id FROM db_project1.resources WHERE consumable='Y' ORDER BY random() LIMIT 1) AS resource_id,
    (10 + floor(random() * 90)::int) AS planned
  FROM generate_series(1, 300)
) er
ON CONFLICT DO NOTHING;

-- ============================================================
-- FASE 16: PERSON_EXPLORATIONS (personas en exploraciones)
-- ============================================================
INSERT INTO db_project1.person_explorations (exploration_id, person_id, role_name, assigned_at)
SELECT
  pe.exploration_id,
  pe.person_id,
  (ARRAY['Líder','Observador','Botánico','Médico','Comunicaciones',
         'Guía Local','Fotógrafo','Geólogo','Enfermero','SOLDADO'])[floor(random()*10+1)::int],
  NOW() - (random() * INTERVAL '120 days')
FROM (
  SELECT
    (SELECT id FROM db_project1.explorations ORDER BY random() LIMIT 1) AS exploration_id,
    (SELECT id FROM db_project1.persons ORDER BY random() LIMIT 1) AS person_id
  FROM generate_series(1, 250)
) pe
ON CONFLICT DO NOTHING;

-- ============================================================
-- FASE 17: RATIONS (300 raciones)
-- ============================================================
INSERT INTO db_project1.rations (person_id, camp_id, completed, ration_date, notes, created_at)
SELECT
  r.person_id,
  r.camp_id,
  (ARRAY['Y','N','N','N'])[floor(random()*4+1)::int],
  (CURRENT_DATE - (random() * 60)::int)::date,
  (ARRAY['Ración completa','Ración media','Ración de emergencia','Sin notas'])[floor(random()*4+1)::int],
  NOW() - (random() * INTERVAL '60 days')
FROM (
  SELECT
    (SELECT id FROM db_project1.persons ORDER BY random() LIMIT 1) AS person_id,
    (SELECT id FROM db_project1.camps ORDER BY random() LIMIT 1) AS camp_id
  FROM generate_series(1, 300)
) r;

-- ============================================================
-- FASE 18: RATION_RESOURCES (detalles de raciones)
-- ============================================================
INSERT INTO db_project1.ration_resources (ration_id, resource_id, amount)
SELECT
  rr.ration_id,
  rr.resource_id,
  (1 + floor(random() * 10)::int)
FROM (
  SELECT
    (SELECT id FROM db_project1.rations ORDER BY random() LIMIT 1) AS ration_id,
    (SELECT id FROM db_project1.resources WHERE consumable='Y' ORDER BY random() LIMIT 1) AS resource_id
  FROM generate_series(1, 500)
) rr
ON CONFLICT DO NOTHING;

-- ============================================================
-- FASE 19: CAMP_RULES (reglas por campamento)
-- ============================================================
INSERT INTO db_project1.camp_rules (camp_id, name, description, condition, status, created_at)
SELECT
  cr.camp_id,
  cr.rname,
  cr.rdesc,
  cr.cond,
  'A',
  NOW() - (random() * INTERVAL '180 days')
FROM (
  SELECT
    c2.id AS camp_id,
    (ARRAY[
      'Horario de silencio',
      'Control de acceso',
      'Distribución de raciones',
      'Protocolo de emergencia',
      'Uso de almacén',
      'Jornada laboral',
      'Distribución de tareas',
      'Uso de herramientas',
      'Protocolo de limpieza',
      'Normas de convivencia'
    ])[(row_number() over()) % 10 + 1] AS rname,
    (ARRAY[
      'Todos los residentes deben respetar los horarios establecidos',
      'El acceso al campamento requiere identificación',
      'Las raciones se distribuyen según las necesidades de cada persona',
      'En caso de emergencia seguir el protocolo de evacuación',
      'El almacén solo puede ser abierto por personal autorizado',
      'La jornada laboral comienza a las 6:00 AM',
      'Las tareas se asignan semanalmente según disponibilidad',
      'Las herramientas deben ser devueltas después de usar',
      'Cada zona debe ser limpiada diariamente',
      'Respetar los espacios comunes y privados'
    ])[(row_number() over()) % 10 + 1] AS rdesc,
    (ARRAY[
      'hora_actual >= 22:00 OR hora_actual <= 06:00',
      'persona.tiene_identificacion = true',
      'ration.esta_programada = true AND ration.disponible = true',
      'nivel_alerta = ''ALTO'' OR nivel_alerta = ''CRITICO''',
      'usuario.rol IN (''ADMIN'',''CAMP_MANAGER'',''LOGISTICS'')',
      'DAYOFWEEK(NOW()) NOT IN (0,6)',
      'persona.estado = ''A'' AND persona.disponible = true',
      'tarea.asignada = true AND herramienta.disponible = true',
      'DAYOFWEEK(NOW()) IN (1,3,5)',
      'persona.estado = ''A'''
    ])[(row_number() over()) % 10 + 1] AS cond
  FROM db_project1.camps c2
  CROSS JOIN generate_series(1, 4)
) cr;

-- ============================================================
-- FASE 20: CAMP_PRODUCTION_RULES (reglas de producción)
-- ============================================================
INSERT INTO db_project1.camp_production_rules (camp_id, profession_id, resource_id, expected_amount, effective_date, end_date, state)
SELECT
  cpr.camp_id,
  cpr.profession_id,
  cpr.resource_id,
  (5 + floor(random() * 95)::int),
  (CURRENT_DATE - (random() * 365)::int)::date,
  (CASE WHEN random() < 0.3 THEN (CURRENT_DATE + (random() * 180)::int)::date ELSE NULL END),
  'A'
FROM (
  SELECT
    (SELECT id FROM db_project1.camps ORDER BY random() LIMIT 1) AS camp_id,
    (SELECT id FROM db_project1.professions WHERE default_resource_id IS NOT NULL ORDER BY random() LIMIT 1) AS profession_id,
    (SELECT id FROM db_project1.resources ORDER BY random() LIMIT 1) AS resource_id
  FROM generate_series(1, 120)
) cpr
ON CONFLICT DO NOTHING;

-- ============================================================
-- FASE 21: ADMISSION_REQUESTS (100 solicitudes de admisión)
-- ============================================================
INSERT INTO db_project1.admission_requests (person_id, camp_id, request_status, observations, requested_at)
SELECT
  ar.person_id,
  ar.camp_id,
  (ARRAY['P','A','R','P','P'])[floor(random()*5+1)::int],
  (ARRAY[
    'Solicitante con experiencia en campo',
    'Persona necesitada, sin recursos propios',
    'Recomendado por usuario existente',
    'Requiere atención médica urgente',
    'Familia desplazada por fenómeno natural',
    'Profesional con habilidades necesarias',
    NULL
  ])[floor(random()*7+1)::int],
  NOW() - (random() * INTERVAL '90 days')
FROM (
  SELECT
    (SELECT id FROM db_project1.persons ORDER BY random() LIMIT 1) AS person_id,
    (SELECT id FROM db_project1.camps ORDER BY random() LIMIT 1) AS camp_id
  FROM generate_series(1, 100)
) ar
ON CONFLICT DO NOTHING;

-- ============================================================
-- FASE 22: AI_DECISIONS (decisiones de IA para admisiones)
-- ============================================================
INSERT INTO db_project1.ai_decisions (admission_request_id, decision_status, explanation, created_at)
SELECT
  ad.admission_request_id,
  (ARRAY['A','R'])[floor(random()*2+1)::int],
  'Análisis automático: ' ||
  (ARRAY[
    'El solicitante cumple con los criterios de admisión. Se recomienda aceptación.',
    'Capacidad del campamento excedida. Se recomienda rechazo o redireccionamiento.',
    'Solicitante con habilidades útiles para la comunidad. Se recomienda aceptación.',
    'Perfil de riesgo alto. Se requiere evaluación adicional antes de decidir.',
    'Documentación incompleta. Se recomienda solicitar información adicional.',
    'Necesidad médica detectada. Se recomienda admisión prioritaria.'
  ])[floor(random()*6+1)::int],
  NOW() - (random() * INTERVAL '30 days')
FROM (
  SELECT id AS admission_request_id
  FROM db_project1.admission_requests
  ORDER BY random()
  LIMIT 80
) ad;

-- ============================================================
-- FASE 23: AI_PROMPTS (prompts de IA para admisiones)
-- ============================================================
INSERT INTO db_project1.ai_prompts (admission_request_id, prompt, response, created_at)
SELECT
  ap.admission_request_id,
  'Evaluar solicitud de admisión #' || ap.admission_request_id ||
  ' para el campamento. Analizar capacidad, necesidades y perfil del solicitante.',
  (ARRAY[
    '{"recommendation":"accept","confidence":0.85,"reason":"Perfil adecuado"}',
    '{"recommendation":"reject","confidence":0.72,"reason":"Capacidad llena"}',
    '{"recommendation":"pending","confidence":0.60,"reason":"Información insuficiente"}',
    '{"recommendation":"accept","confidence":0.90,"reason":"Habilidades críticas"}',
    '{"recommendation":"conditional","confidence":0.78,"reason":"Requiere seguimiento"}'
  ])[floor(random()*5+1)::int]::text,
  NOW() - (random() * INTERVAL '30 days')
FROM (
  SELECT id AS admission_request_id
  FROM db_project1.admission_requests
  ORDER BY random()
  LIMIT 80
) ap;

-- ============================================================
-- FASE 24: RESOURCE_MOVEMENTS (200 movimientos de recursos)
-- ============================================================
INSERT INTO db_project1.resource_movements (resource_id, warehouse_id, movement_type, adjustment_sign, amount, reason, created_at)
SELECT
  rm.resource_id,
  rm.warehouse_id,
  (ARRAY['E','S','A'])[floor(random()*3+1)::int],
  (CASE
    WHEN rm.mtype = 'A' THEN (ARRAY['+','-'])[floor(random()*2+1)::int]
    ELSE NULL
  END),
  (1 + floor(random() * 200)::int),
  (ARRAY[
    'Reposición de stock por solicitud',
    'Distribución a campamento satélite',
    'Ajuste por inventario físico',
    'Devolución de excedente',
    'Entrega de emergencia',
    'Transferencia entre almacenes',
    'Consumo diario registrado',
    'Recepción de donación',
    'Corrección de error de registro',
    'Reasignación por cambio de prioridad'
  ])[floor(random()*10+1)::int],
  NOW() - (random() * INTERVAL '90 days')
FROM (
  SELECT
    (SELECT id FROM db_project1.resources ORDER BY random() LIMIT 1) AS resource_id,
    (SELECT warehouse_id FROM db_project1.resource_warehouses ORDER BY random() LIMIT 1) AS warehouse_id,
    (ARRAY['E','S','A'])[floor(random()*3+1)::int] AS mtype
  FROM generate_series(1, 200)
) rm;

-- ============================================================
-- FASE 25: RESOURCE_ALERTS (80 alertas de recursos)
-- ============================================================
INSERT INTO db_project1.resource_alerts (resource_id, warehouse_id, current_amount, min_quantity, alert_date, resolved, resolved_at)
SELECT
  ra.resource_id,
  ra.warehouse_id,
  ra.current_amount,
  ra.min_qty,
  NOW() - (random() * INTERVAL '60 days'),
  (ARRAY['Y','N','N','N'])[floor(random()*4+1)::int],
  (CASE WHEN random() < 0.3 THEN NOW() - (random() * INTERVAL '30 days') ELSE NULL END)
FROM (
  SELECT
    (SELECT id FROM db_project1.resources ORDER BY random() LIMIT 1) AS resource_id,
    (SELECT warehouse_id FROM db_project1.resource_warehouses ORDER BY random() LIMIT 1) AS warehouse_id,
    (0 + floor(random() * 30)::int) AS current_amount,
    (20 + floor(random() * 80)::int) AS min_qty
  FROM generate_series(1, 80)
) ra;

-- ============================================================
-- FASE 26: RESOURCE_PRODUCTION (150 registros de producción)
-- ============================================================
INSERT INTO db_project1.resource_production (person_id, warehouse_id, resource_id, amount, production_date, created_at)
SELECT
  rp.person_id,
  rp.warehouse_id,
  rp.resource_id,
  (1 + floor(random() * 100)::int),
  (CURRENT_DATE - (random() * 60)::int)::date,
  NOW() - (random() * INTERVAL '60 days')
FROM (
  SELECT
    (SELECT id FROM db_project1.persons ORDER BY random() LIMIT 1) AS person_id,
    (SELECT warehouse_id FROM db_project1.resource_warehouses ORDER BY random() LIMIT 1) AS warehouse_id,
    (SELECT id FROM db_project1.resources ORDER BY random() LIMIT 1) AS resource_id
  FROM generate_series(1, 150)
) rp;

-- ============================================================
-- FASE 27: RESOURCE_EXPLORATIONS (recursos de exploraciones)
-- ============================================================
INSERT INTO db_project1.resource_explorations (exploration_id, resource_id, amount_collected, amount_consumed, observations)
SELECT
  re.exploration_id,
  re.resource_id,
  re.collected,
  LEAST(re.collected, (re.collected * random())::int),
  (ARRAY['Recurso abundante en la zona','Escasez detectada','Cantidad esperada',
         'Se requiere regresar por más',NULL])[floor(random()*5+1)::int]
FROM (
  SELECT
    (SELECT id FROM db_project1.explorations ORDER BY random() LIMIT 1) AS exploration_id,
    (SELECT id FROM db_project1.resources ORDER BY random() LIMIT 1) AS resource_id,
    (5 + floor(random() * 200)::int) AS collected
  FROM generate_series(1, 200)
) re
ON CONFLICT DO NOTHING;

-- ============================================================
-- FASE 28: CAMP_REQUESTS (50 solicitudes entre campamentos)
-- ============================================================
INSERT INTO db_project1.camp_requests (origin_camp_id, destination_camp_id, request_type, status, origin_approval_status, destination_approval_status, approved_by_origin_user_id, approved_by_destination_user_id, approved_at, description, created_at, resolved_at)
SELECT
  cr.origin_camp_id,
  cr.destination_camp_id,
  cr.rtype,
  cr.status,
  (CASE WHEN cr.status IN ('A','R') THEN cr.status ELSE NULL END),
  (CASE WHEN cr.status IN ('A','R') THEN cr.status ELSE NULL END),
  (CASE WHEN cr.status IN ('A','R') THEN (SELECT id FROM db_project1.users ORDER BY random() LIMIT 1) ELSE NULL END),
  (CASE WHEN cr.status IN ('A','R') THEN (SELECT id FROM db_project1.users ORDER BY random() LIMIT 1) ELSE NULL END),
  (CASE WHEN cr.status IN ('A','R') THEN NOW() - (random() * INTERVAL '15 days') ELSE NULL END),
  (ARRAY[
    'Solicitud de recurso urgente por escasez',
    'Solicitud de préstamo de equipo pesado',
    'Solicitud de personal para refuerzo',
    'Solicitud de transferencia de alimentos',
    'Solicitud de materiales de construcción',
    'Solicitud de apoyo médico',
    'Propuesta de colaboración intercampamento',
    'Solicitud de intercambio de herramientas'
  ])[floor(random()*8+1)::int],
  NOW() - (random() * INTERVAL '90 days'),
  (CASE WHEN cr.status IN ('A','R') THEN NOW() - (random() * INTERVAL '30 days') ELSE NULL END)
FROM (
  SELECT
    (SELECT id FROM db_project1.camps ORDER BY random() LIMIT 1) AS origin_camp_id,
    (SELECT id FROM db_project1.camps ORDER BY random() LIMIT 1) AS destination_camp_id,
    (ARRAY['R','P'])[floor(random()*2+1)::int] AS rtype,
    (ARRAY['P','P','P','A','A','R'])[floor(random()*6+1)::int] AS status
  FROM generate_series(1, 50)
) cr
WHERE cr.origin_camp_id <> cr.destination_camp_id;

-- ============================================================
-- FASE 29: REQUEST_RESOURCES (recursos en solicitudes entre campamentos)
-- ============================================================
INSERT INTO db_project1.request_resources (request_id, resource_id, amount)
SELECT
  rr.request_id,
  rr.resource_id,
  (1 + floor(random() * 100)::int)
FROM (
  SELECT
    (SELECT id FROM db_project1.camp_requests ORDER BY random() LIMIT 1) AS request_id,
    (SELECT id FROM db_project1.resources ORDER BY random() LIMIT 1) AS resource_id
  FROM generate_series(1, 80)
) rr
ON CONFLICT DO NOTHING;

-- ============================================================
-- FASE 30: REQUEST_PERSONS (personas solicitadas entre campamentos)
-- ============================================================
INSERT INTO db_project1.request_persons (request_id, person_id)
SELECT
  rp.request_id,
  rp.person_id
FROM (
  SELECT
    (SELECT id FROM db_project1.camp_requests ORDER BY random() LIMIT 1) AS request_id,
    (SELECT id FROM db_project1.persons ORDER BY random() LIMIT 1) AS person_id
  FROM generate_series(1, 40)
) rp
ON CONFLICT DO NOTHING;

-- ============================================================
-- FASE 31: SHIPMENTS (40 envíos)
-- ============================================================
INSERT INTO db_project1.shipments (request_id, departure_date, arrival_date, status, observations, created_at)
SELECT
  s.request_id,
  s.dep_date,
  (CASE
    WHEN s.status IN ('D','C') THEN s.dep_date + (1 + random() * 5)::int * INTERVAL '1 day'
    WHEN s.status = 'I' THEN NULL
    ELSE NULL
  END),
  s.status,
  (ARRAY['Envío prioritario','Envío estándar','Envío con escolta requerida',
         'Ruta alternativa por lluvia',NULL])[floor(random()*5+1)::int],
  NOW() - (random() * INTERVAL '60 days')
FROM (
  SELECT
    (SELECT id FROM db_project1.camp_requests WHERE status IN ('A','P') ORDER BY random() LIMIT 1) AS request_id,
    (NOW() - (random() * INTERVAL '60 days'))::timestamp AS dep_date,
    (ARRAY['P','I','D','C'])[floor(random()*4+1)::int] AS status
  FROM generate_series(1, 40)
) s
ON CONFLICT DO NOTHING;

-- ============================================================
-- FASE 32: USER_ACHIEVEMENTS (logros desbloqueados)
-- ============================================================
INSERT INTO db_project1.user_achievements (user_id, achievement_id, unlocked_at, unlocked_by)
SELECT
  ua.user_id,
  ua.achievement_id,
  NOW() - (random() * INTERVAL '180 days'),
  (SELECT id FROM db_project1.users ORDER BY random() LIMIT 1)
FROM (
  SELECT
    (SELECT id FROM db_project1.users ORDER BY random() LIMIT 1) AS user_id,
    (SELECT id FROM db_project1.achievements ORDER BY random() LIMIT 1) AS achievement_id
  FROM generate_series(1, 350)
) ua
ON CONFLICT DO NOTHING;

-- ============================================================
-- FASE 33: USER_POINTS (puntos de usuarios)
-- ============================================================
INSERT INTO db_project1.user_points (user_id, total_points, level, updated_at)
SELECT
  up.user_id,
  up.points,
  up.level,
  NOW() - (random() * INTERVAL '30 days')
FROM (
  SELECT
    u.id AS user_id,
    (floor(random() * 500)::int) AS points,
    (1 + floor(up2.total / 100)::int) AS level
  FROM db_project1.users u
  CROSS JOIN LATERAL (SELECT 0 AS total) up2
  WHERE u.state = 'A'
) up
ON CONFLICT DO NOTHING;

-- ============================================================
-- FASE 34: CAMP_REQUESTS - AUDIT LOGS (150 registros de auditoría)
-- ============================================================
INSERT INTO db_project1.audit_logs (table_name, record_id, action, performed_by, old_values, new_values, ip_address, user_agent, created_at)
SELECT
  al.table_name,
  al.record_id,
  al.action,
  al.performed_by,
  al.old_val::jsonb,
  al.new_val::jsonb,
  ('192.168.1.' || (1 + floor(random() * 254)::int))::inet,
  (ARRAY[
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
    'Mozilla/5.0 (X11; Linux x86_64)',
    'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0)',
    NULL
  ])[floor(random()*5+1)::int],
  NOW() - (random() * INTERVAL '90 days')
FROM (
  SELECT
    (ARRAY['persons','users','camps','tasks','resources','warehouses',
           'explorations','rations','professions'])[floor(random()*9+1)::int] AS table_name,
    (1 + floor(random() * 200)::int) AS record_id,
    (ARRAY['INSERT','UPDATE','DELETE'])[floor(random()*3+1)::int] AS action,
    (SELECT id FROM db_project1.users ORDER BY random() LIMIT 1) AS performed_by,
    (ARRAY[
      '{"state":"A","name":"Original"}',
      '{"state":"A","description":"Texto original"}',
      '{"capacity":100}',
      '{"amount":50}',
      '{"state":"I"}',
      NULL
    ])[floor(random()*6+1)::int] AS old_val,
    (ARRAY[
      '{"state":"I","modified_by":"system"}',
      '{"state":"A","name":"Actualizado"}',
      '{"capacity":150}',
      '{"amount":75,"updated_at":"now()"}',
      '{"description":"Nueva descripción"}',
      NULL
    ])[floor(random()*6+1)::int] AS new_val
  FROM generate_series(1, 150)
) al;

-- ============================================================
-- FASE 35: USER_SESSIONS (100 sesiones de usuario)
-- ============================================================
INSERT INTO db_project1.user_sessions (user_id, token, ip_address, started_at, last_activity_at, expired_at, is_active)
SELECT
  us.user_id,
  encode(gen_random_bytes(32), 'hex'),
  ('192.168.1.' || (1 + floor(random() * 254)::int))::inet,
  us.started,
  us.started + (random() * INTERVAL '4 hours'),
  (CASE WHEN random() < 0.3 THEN us.started + INTERVAL '24 hours' ELSE NULL END),
  (ARRAY['Y','Y','N','N','N'])[floor(random()*5+1)::int]
FROM (
  SELECT
    (SELECT id FROM db_project1.users WHERE state='A' ORDER BY random() LIMIT 1) AS user_id,
    NOW() - (random() * INTERVAL '30 days') AS started
  FROM generate_series(1, 100)
) us;

-- ============================================================
-- FASE 36: NOTIFICATIONS (200 notificaciones)
-- ============================================================
INSERT INTO db_project1.notifications (user_id, type, title, body, payload, priority, read_at, created_at, camp_id)
SELECT
  n.user_id,
  n.ntype,
  n.title,
  n.body,
  n.payload::jsonb,
  (ARRAY['LOW','NORMAL','HIGH','CRITICAL'])[floor(random()*4+1)::int],
  (CASE WHEN random() < 0.5 THEN NOW() - (random() * INTERVAL '15 days') ELSE NULL END),
  NOW() - (random() * INTERVAL '30 days'),
  (SELECT id FROM db_project1.camps ORDER BY random() LIMIT 1)
FROM (
  SELECT
    (SELECT id FROM db_project1.users WHERE state='A' ORDER BY random() LIMIT 1) AS user_id,
    (ARRAY['TAREA','ALERTA','SISTEMA','MENSAJE','ACTUALIZACION'])[floor(random()*5+1)::int] AS ntype,
    (ARRAY[
      'Nueva tarea asignada',
      'Alerta de bajo inventario',
      'Solicitud de admisión pendiente',
      'Exploración completada',
      'Actualización de perfil',
      'Nuevo recurso registrado',
      'Ración completada para hoy',
      'Solicitud entre campamentos',
      'Tarea reasignada',
      'Almacén necesita reabastecimiento'
    ])[floor(random()*10+1)::int] AS title,
    (ARRAY[
      'Se le ha asignado una nueva tarea de mantenimiento',
      'El nivel de un recurso ha caído por debajo del mínimo',
      'Hay una solicitud de admisión esperando revisión',
      'Una exploración ha sido finalizada exitosamente',
      'Su perfil ha sido actualizado correctamente',
      'Un nuevo recurso ha sido registrado en el sistema',
      'Su ración de hoy ha sido procesada',
      'Hay una solicitud de recurso entre campamentos',
      'Una tarea ha sido reasignada a otra persona',
      'El almacén necesita atención urgente'
    ])[floor(random()*10+1)::int] AS body,
    (ARRAY[
      '{"task_id":1,"priority":"HIGH"}',
      '{"resource_id":5,"amount":10}',
      '{"admission_id":3,"status":"pending"}',
      '{"exploration_id":2,"result":"success"}',
      '{"field":"email","action":"update"}',
      '{"resource_code":"RES001","category":"ALIMENTOS"}',
      '{"ration_id":1,"date":"2024-01-15"}',
      '{"request_id":4,"type":"resource_transfer"}',
      '{"task_id":8,"old_assignee":3,"new_assignee":5}',
      '{"warehouse_id":2,"alert_level":"critical"}'
    ])[floor(random()*10+1)::int] AS payload
  FROM generate_series(1, 200)
) n;

-- ============================================================
-- RESUMEN DE DATOS GENERADOS
-- ============================================================
/*
SELECT 'roles' AS tabla, COUNT(*) AS registros FROM db_project1.roles
UNION ALL SELECT 'permissions', COUNT(*) FROM db_project1.permissions
UNION ALL SELECT 'resources', COUNT(*) FROM db_project1.resources
UNION ALL SELECT 'achievements', COUNT(*) FROM db_project1.achievements
UNION ALL SELECT 'camps', COUNT(*) FROM db_project1.camps
UNION ALL SELECT 'persons', COUNT(*) FROM db_project1.persons
UNION ALL SELECT 'users', COUNT(*) FROM db_project1.users
UNION ALL SELECT 'user_roles', COUNT(*) FROM db_project1.user_roles
UNION ALL SELECT 'role_permissions', COUNT(*) FROM db_project1.role_permissions
UNION ALL SELECT 'warehouses', COUNT(*) FROM db_project1.warehouses
UNION ALL SELECT 'professions', COUNT(*) FROM db_project1.professions
UNION ALL SELECT 'person_professions', COUNT(*) FROM db_project1.person_professions
UNION ALL SELECT 'resource_warehouses', COUNT(*) FROM db_project1.resource_warehouses
UNION ALL SELECT 'tasks', COUNT(*) FROM db_project1.tasks
UNION ALL SELECT 'task_persons', COUNT(*) FROM db_project1.task_persons
UNION ALL SELECT 'task_resources', COUNT(*) FROM db_project1.task_resources
UNION ALL SELECT 'explorations', COUNT(*) FROM db_project1.explorations
UNION ALL SELECT 'exploration_rations', COUNT(*) FROM db_project1.exploration_rations
UNION ALL SELECT 'person_explorations', COUNT(*) FROM db_project1.person_explorations
UNION ALL SELECT 'rations', COUNT(*) FROM db_project1.rations
UNION ALL SELECT 'ration_resources', COUNT(*) FROM db_project1.ration_resources
UNION ALL SELECT 'camp_rules', COUNT(*) FROM db_project1.camp_rules
UNION ALL SELECT 'camp_production_rules', COUNT(*) FROM db_project1.camp_production_rules
UNION ALL SELECT 'admission_requests', COUNT(*) FROM db_project1.admission_requests
UNION ALL SELECT 'ai_decisions', COUNT(*) FROM db_project1.ai_decisions
UNION ALL SELECT 'ai_prompts', COUNT(*) FROM db_project1.ai_prompts
UNION ALL SELECT 'resource_movements', COUNT(*) FROM db_project1.resource_movements
UNION ALL SELECT 'resource_alerts', COUNT(*) FROM db_project1.resource_alerts
UNION ALL SELECT 'resource_production', COUNT(*) FROM db_project1.resource_production
UNION ALL SELECT 'resource_explorations', COUNT(*) FROM db_project1.resource_explorations
UNION ALL SELECT 'camp_requests', COUNT(*) FROM db_project1.camp_requests
UNION ALL SELECT 'request_resources', COUNT(*) FROM db_project1.request_resources
UNION ALL SELECT 'request_persons', COUNT(*) FROM db_project1.request_persons
UNION ALL SELECT 'shipments', COUNT(*) FROM db_project1.shipments
UNION ALL SELECT 'user_achievements', COUNT(*) FROM db_project1.user_achievements
UNION ALL SELECT 'user_points', COUNT(*) FROM db_project1.user_points
UNION ALL SELECT 'audit_logs', COUNT(*) FROM db_project1.audit_logs
UNION ALL SELECT 'user_sessions', COUNT(*) FROM db_project1.user_sessions
UNION ALL SELECT 'notifications', COUNT(*) FROM db_project1.notifications
ORDER BY tabla;
*/

-- ============================================================
-- FIN DEL SCRIPT
-- Total: ~5,400+ registros en 40 tablas
-- Tabla principal persons: 2000 registros
-- ============================================================