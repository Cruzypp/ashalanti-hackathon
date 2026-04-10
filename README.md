# Friction Map - Prototipo Hackathon

Aplicacion web construida con Next.js (App Router) para detectar fricciones financieras a partir de transacciones simuladas, visualizar impacto y presentar oportunidades de ahorro.

## Objetivo del proyecto

El prototipo busca mostrar, de forma clara y accionable:

- fricciones financieras (suscripciones zombie, pagos duplicados, gasto hormiga, etc.)
- impacto mensual estimado y ahorro potencial
- vistas por rol/seccion: dashboard general, fricciones, compras recurrentes y resumen ejecutivo

## Stack tecnico

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS 4
- lucide-react (iconografia)

## Arquitectura (resumen)

La app sigue una arquitectura por modulos dentro de `app/`:

- `app/layout.tsx`: layout global con sidebar fija en toda la app.
- `app/page.tsx`: redireccion al dashboard.
- `app/dashboard/`: vista principal con KPIs y componentes de resumen.
- `app/fricciones/`: listado y detalle visual de fricciones detectadas.
- `app/compras/`: panel de suscripciones/cargos recurrentes.
- `app/ejecutivo/`: resumen ejecutivo con health score y top fricciones.
- `app/ejecutivos/`: alias de `/ejecutivo` — re-exporta la misma pagina como ruta alternativa.
- `app/data/user.json`: fuente mock principal de datos (usuario, cuentas, transacciones, fricciones). Transacciones distribuidas entre enero y marzo 2025.
- `app/lib/mapFrictions.ts`: transforma datos crudos a objetos de dominio para UI.
- `app/lib/data.ts`: re-exporta cuentas y transacciones tipadas desde el JSON mock.
- `app/utils/healthScore.ts`: calcula el health score financiero (0-100) en 5 dimensiones.
- `app/components-cruz/` y `app/components-cisne/`: componentes reutilizables por modulo.
- `app/utils/`: utilidades de negocio/exportacion (por ejemplo PDF).

## Flujo de datos

1. Se carga data mock desde `app/data/user.json`.
2. Se transforma con funciones de mapeo (ej. `mapFrictions`, view-models de compras).
3. Cada pagina consume ese view model para renderizar tarjetas, tablas y graficas.

## Como correr en local

### 1) Requisitos

- Node.js 20+ recomendado
- npm 10+ recomendado

### 2) Instalar dependencias

```bash
npm install
```

### 3) Dependencias para exportacion PDF

Si al compilar aparece el error `Can't resolve 'jspdf'`, instala:

```bash
npm install jspdf jspdf-autotable
```

### 4) Levantar el proyecto

```bash
npm run dev
```

Abrir en navegador:

`http://localhost:3000`

## Scripts utiles

```bash
npm run dev      # desarrollo
npm run build    # build de produccion
npm run start    # correr build en modo produccion
npm run lint     # linting
```

## Consideraciones de rutas

- ruta inicial: `/` redirige a `/dashboard`
- compatibilidad: `/transacciones` redirige a `/compras`
- `/ejecutivos` es alias de `/ejecutivo` (misma vista, dos rutas validas)

## Uso de IA (transparencia)

Para este proyecto, la IA se utilizo como apoyo de productividad, especialmente por la restriccion de tiempo del hackathon.

Uso principal:

- acelerar implementacion de componentes y estructura base
- apoyo en refactors y correccion de errores de integracion
- soporte para ajustes visuales rapidos y pulido de UX

Uso secundario:

- apoyo en ideacion de mockups
- consulta puntual en investigacion tecnica

Limites y criterio del equipo:

- las decisiones funcionales y de producto se tomaron por el equipo
- la data mock, flujos y alcance del prototipo fueron definidos por el equipo
- todo output generado con IA fue revisado, editado y validado manualmente antes de integrarlo

## Correcciones recientes

- **Bug export PDF**: el dropdown de exportacion mostraba el mes equivocado (ej. "febrero" en lugar de "marzo") por un problema de timezone al parsear fechas ISO con `new Date("YYYY-MM-DD")` (se interpreta como UTC). Corregido usando `new Date(year, month - 1, 1)` (tiempo local).
- **Datos mock multi-mes**: las transacciones en `user.json` se redistribuyeron entre enero (28), febrero (21) y marzo (16) para simular un historial real de 3 meses.
- **Bug import data.ts**: `app/lib/data.ts` tenia un string de import sin cerrar que bloqueaba el build de TypeScript. Corregido.
- **Ruta /ejecutivos**: agrega alias funcional que re-exporta la pagina de `/ejecutivo`.

## Estado actual

El repositorio representa un prototipo funcional para demo local, enfocado en validacion de concepto y narrativa de producto.
