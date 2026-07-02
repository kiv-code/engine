# @kiv/engine — Visual Experience Engine para Vue 3

## Qué es
Motor visual headless, JSON-driven, para construir landing/marketing pages.
Monorepo pnpm + Turborepo. Marca: Kivcode. Licencia MIT.

## Reglas de arquitectura (no violar)
- `@kiv/engine` es el core headless. Su ÚNICA dependencia de Vue es `@vue/reactivity`.
  Nunca importar componentes de Vue ni tocar el DOM aquí.
- Fronteras: engine ← vue ← editor. La dependencia siempre va hacia el core.
- El contrato público estable es el JSON del documento (schemaVersion), no la API de TS.
- `exports` map cerrado: nada de deep imports.
- Estilos token-constrained: los nodos referencian tokens del theme, no valores crudos.
- Responsive y localización son ejes SEPARADOS, no una matriz.
- "Solo lo necesario": no añadir controles, tokens ni nodos que ningún consumidor use aún.

## Stack
- TypeScript strict + noUncheckedIndexedAccess
- Zod 4 (usar `ZodType`, no `ZodTypeAny` deprecado)
- Biome (tabs, comillas dobles) — NO ESLint/Prettier
- Vitest
- unbuild (engine), Vite library mode (vue/nodes/editor)

## Verificación (correr siempre antes de dar algo por hecho)
pnpm biome check --write . && pnpm typecheck && pnpm test

## Estado actual (core @kiv/engine)
Completado:
- 1.1 Tipos base: KivNode, KivDocument, Responsive<T>, Localizable<T>, Breakpoint
- 1.2 Field descriptor sobre Zod: defineNode, f.*, InferProps
- 1.3 Registry de nodos
- 1.4 Resolver (ejes responsive + locale, mobile-first)
- 1.5 Theme engine (tokens → CSS variables, --kiv-*)
- 1.6 Event Bus (tipado, wildcard por namespace)
- 1.7 i18n config: validateI18nConfig + buildLocaleFallbackChain (src/i18n/)
- 1.8 Migraciones scaffold: migrateDocument + CURRENT_SCHEMA_VERSION + registry vacío (src/migrations/)

Core cerrado. Siguiente:
- Fase 2: @kiv/vue (renderer runtime, <KivRenderer>)
- Fase 3: @kiv/nodes (10 nodos base)
- Fase 4: @kiv/editor (canvas, inspector, tree, DnD)