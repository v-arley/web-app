# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is enabled on this template. See [this documentation](https://react.dev/learn/react-compiler) for more information.

Note: This will impact Vite dev & build performances.

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

## Requisitos previos

- Node.js
- npm
- Backend del proyecto ejecutándose correctamente
- Variables de entorno configuradas


Para levantar el frontend en modo desarrollo:
npm run dev

Por defecto, la aplicación se ejecuta en:
http://localhost:5173


Para generar el build de producción:
npm run build


# Módulos principales
La aplicación contiene diferentes vistas según el rol del usuario autenticado

Expedition Leader:
Módulo encargado de la gestión de exploraciones.

Resource Manager:
Módulo relacionado con inventario, recursos, solicitudes y gestión logística.

Worker:
Módulo de trabajador, donde se visualiza información personal, producción diaria, logros, puntos y asignaciones.

Camp Administrator:
Módulo administrativo para gestionar información del campamento, personas, roles, reglas y solicitudes.


# Pruebas E2E con Playwright
El proyecto incluye pruebas automáticas de extremo a extremo con Playwright.

Antes de ejecutar las pruebas, se debe tener corriendo:
Backend:
npm run start

Frontend:
npm run dev

Luego, en otra terminal dentro del frontend:
npx playwright test

Ejecutar pruebas E2E visibles en navegador:
npx playwright test --headed

También se puede ejecutar una prueba específica:
npx playwright test tests/explorations.spec.ts --project=chromium --headed --workers=1

Después de ejecutar Playwright, se puede abrir el reporte con:
npx playwright show-report