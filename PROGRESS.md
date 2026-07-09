# Phase 1 Progress Log

Tracks what has actually been implemented against the plan in `PLAN.md` / `CLAUDE.md`.
English per project convention (see CLAUDE.md → "English ONLY ... documentation").

## Status: Phase 1 (Hardening, v0.1.0) — complete, plus early Phase 2 items

| Step | What | Status |
|---|---|---|
| 1 | `EditorEngine` — framework-agnostic editor core | ✅ |
| 2 | `PluginContext` enrichment (editor/media/services shape) | ✅ |
| 3 | `CompiledNode` / `FieldDescriptor` enrichment | ✅ |
| 4 | `MediaProvider` interface + `createEngine({ media })` | ✅ |
| 5 | Services container + `createEngine({ services })` | ✅ |
| 6 | `renderToHtml()` (SSR/export) | ✅ |
| 7 | English-only sweep (comments, errors) | ✅ |
| 8 | Test coverage (engine/nodes/vue/editor) | ✅ |
| — | Connect everything to the demo app | ✅ |
| 2.x | `locked` / `visible` wired into renderer + editor UI (pulled in early from Phase 2) | ✅ |

Deferred on purpose: `PluginContext.editor` UI hooks (`addToolbarButton`, `addPaletteItem`,
`onNodeSelect`, etc.) — needs real registries inside `@kiv/editor` to back them; scoped as
its own follow-up, not started.

---

## Step 1 — EditorEngine

**New:** `packages/engine/src/editor/{selection,history,document-ops,editor-engine,types,index}.ts`
- `SelectionState` (multi-select), `HistoryManager<T>` (undo/redo, depth limit, `goto`),
  `EditorEngine` (document + selection + history, emits `node.*`/`selection.changed`/`history.changed`
  on an `EventBus`).

**Changed:** `types/node.ts` (`locked?`, `visible?` added to `KivNode`), top-level `index.ts` exports.

**Editor package:** `editor-store.ts` rewritten to wrap `EditorEngine` instead of owning state
directly — public `EditorStore` API unchanged, so no Vue component needed to change.
Removed the now-duplicate `packages/editor/src/utils/document-ops.ts` (re-exported from `@kiv/engine` instead).

Tests: +33 (engine).

## Step 2 — PluginContext enrichment

**New:** `plugin/types-editor.ts`, `plugin/types-media.ts`, `plugin/types-services.ts`
(`EditorExtensionPoints`, `MediaProvider`-shaped context, `ServicesContainer`).

**Changed:** `PluginContext` now has `editor?`, `media?`, `services` (required, all-optional fields).
`create-engine.ts` passes `services: {}` by default so the type still compiles until Steps 4/5 wire real values.

## Step 3 — CompiledNode / FieldDescriptor enrichment

**Changed:** `schema/define-node.ts` (`label`, `icon`, `description`, `slotConstraints` on
`NodeDefinition`/`CompiledNode`), `schema/field.ts` (`placeholder`, `hint`, `required`, `hidden`
on `FieldDescriptor`), `schema/fields.ts` (`f.*` helpers accept the new options).

## Step 4 — MediaProvider

**New:** `media/types.ts` (canonical `MediaProvider`, `MediaAsset`, `UploadOptions`, `ImageTransform`), `media/index.ts`.
`plugin/types-media.ts` turned into a re-export of `../media` (removes the Step 2 duplication).

**Changed:** `create-engine.ts` — `createEngine({ media: { provider } })`; exposed on `engine.media` and `ctx.media`.

## Step 5 — Services container

**New:** `services/types.ts` (canonical `ApiClient`, `AuthProvider`, `RouterProvider`, `StorageProvider`,
`ServicesContainer`), `services/index.ts`. `plugin/types-services.ts` → re-export of `../services`.

**Changed:** `create-engine.ts` — `createEngine({ services })`; exposed on `engine.services` and `ctx.services`.

## Step 6 — renderToHtml()

**New:** `render/{types,render-to-html,index}.ts`. Walks a `KivDocument`, resolves props per
locale/breakpoint, calls each node's `toHtml(props, children, ctx)` if present, else falls back
to a bare `<div data-kiv-type data-kiv-node-id>`.

**Changed:** `schema/define-node.ts` — added `toHtml?` to `NodeDefinition`/`CompiledNode`, plus
`ToHtmlContext`/`ToHtml` types (kept minimal — no `Registry` — to avoid a schema↔registry import cycle).

Tests: +6.

## Step 7 — English-only sweep

Ran 4 parallel agents (one per package). Real Spanish content was concentrated in `@kiv/engine`
(18 files: JSDoc + `[kiv]` error messages + test assertions kept in sync) and one message in
`@kiv/vue`'s `registry.ts`. `@kiv/nodes` and `@kiv/editor` were already fully English.
One intentional exception left as-is: `"Título"`/`"Hola"` values inside i18n test *fixtures*
(data demonstrating the localization feature, not comments/errors).

## Step 8 — Test coverage

**Infra:** added `@vue/test-utils` + `happy-dom` to `@kiv/vue`/`@kiv/editor`; `vite.config.ts` in
both switched to `defineConfig` from `vitest/config` so build and test share the Vue plugin.

**Coverage added:**
- `@kiv/nodes`: systematic "every node's defaults satisfy its own schema" check.
- `@kiv/vue`: all 10 node components + `KivRenderer`/`KivNodeRenderer` (52 tests, was 0).
- `@kiv/editor`: `KivCanvas` interactions (select/delete/duplicate/undo/redo/escape, input-focus guard) + `KivNodePalette` (25 tests, was 10).

**Bug found and fixed while writing tests:** `ContainerNode.vue`'s `centered` prop never
centered by default. Vue coerces an omitted `boolean`-typed prop to `false` (not `undefined`)
when there's no explicit `default`, so `centered !== false` was always false when the prop was
omitted. Fixed with `withDefaults(defineProps<...>(), { centered: true })`.

## Connecting it to the demo (`apps/demos/vue`)

- **`locked`/`visible`:** new `EditorEngine.setNodeFlags()` mutation (+ `node.flagsChanged` event),
  `store.setLocked()`/`store.setVisible()`. `KivNodeRenderer.vue` hides invisible-at-breakpoint
  nodes in production, dims them (`opacity: 0.35`, `data-kiv-hidden`) in editor mode. `KivCanvas.vue`
  blocks select/delete/duplicate on locked nodes; `KivTreeNode.vue` blocks drag/move/delete;
  `KivInspector.vue` got lock/visibility toggle buttons.
- **Shared bus:** `useEditorStore()` and `<KivEditor bus="...">` now accept an external `EventBus`,
  so a plugin installed via `createEngine({ plugins })` can observe live editor mutations
  (`node.propsChanged`, etc.) through `ctx.bus` — previously the editor ran on its own private bus.
- **`toHtml()` on all 10 `@kiv/nodes`:** each mirrors its Vue component's exact style logic
  (`packages/nodes/src/html-utils.ts` has the shared `styleToString`/`escapeHtml` helpers).
  Verified the exported HTML matches the live-rendered look pixel-for-pixel (padding, colors, layout).
- **`services`/`media` example:** `apps/demos/vue/src/services.ts` — a localStorage-backed
  `StorageProvider` and a mock `MediaProvider`, passed to `createEngine`. A third demo plugin
  (`storage-log`, inline in `App.vue`) uses `ctx.services.storage` + `ctx.bus` to prove the whole
  chain reacts to real edits.
- **"Export HTML" button** in the demo toolbar calls `renderToHtml()` and opens the result in a new tab.

## Post-connection bug fixes (found via manual walkthrough)

- **Responsive field seeding bug (heading/any field with no schema default):** `KivInspector.vue`'s
  `updateFieldValue` seeded a new `Responsive<T>` object as `{ base: existing ?? schemaDefault }`.
  For fields with no explicit schema default (e.g. `heading.size`), `schemaDefault` is `undefined`,
  so `base` stayed permanently `undefined` no matter how many times a higher breakpoint was edited —
  the component's own hardcoded fallback kept winning below that breakpoint. Fixed by seeding `base`
  with the same value being written, only when `base` is still unset.
- **`ContainerNode.vue` centering bug** (see Step 8 above) was the same session; noted here for
  completeness of the "found while polishing the demo" list.
- **Export breakpoint was disconnected from intent.** `exportHtml()` reused `previewBreakpoint`
  (driven by the live Preview panel's *current pixel width*), so the exported snapshot silently
  changed based on how wide the browser happened to be, not what the user meant to export. Added an
  explicit breakpoint `<select>` next to the "Export HTML" button (`apps/demos/vue/src/App.vue`) —
  defaults to `base` (safest for email/PDF, which can't run media queries).
- **Button icon size didn't match between live preview and HTML export.** `ButtonNode.vue` forces
  a pasted SVG icon to a consistent `1em` box via scoped CSS (`.kiv-btn-icon :deep(svg)`), but that
  rule never traveled into `renderToHtml()`'s static output — a raw `width="16"` vs `width="24"`
  baked into two different pasted icons rendered at their own literal sizes in the export, even
  though both buttons had the identical `size` prop. Fixed with `normalizeSvgIconSize()`
  (`packages/nodes/src/html-utils.ts`), which inlines the same `width:1em;height:1em` directly onto
  the `<svg>` tag during `toHtml()`, so the export no longer depends on an external stylesheet rule.
- **`Failed to resolve component: RouterLink` console warning fired unconditionally.**
  `ButtonNode.vue` called `resolveComponent("RouterLink")` at setup time for every button instance,
  regardless of `linkType` — Vue warns as soon as that lookup fails, even if the result is never
  used. Fixed by replacing it with a silent lookup in `getCurrentInstance().appContext.components`,
  gated on `linkType === "internal"`, so the warning is gone when no router is installed and
  `RouterLink` still resolves correctly when a consumer app does install vue-router.

## Verification (last full run)

```
pnpm biome check --write .   # clean
pnpm -r typecheck            # 6/6 packages clean (demo app has no typecheck script)
pnpm -r test                 # 223 tests, 6/6 packages passing
pnpm -r build                # 6/6 packages + demo app build clean
```

Test count by package: engine 110, nodes 24, plugin-analytics 9, vue 55, editor 25.

## Not done yet

- `PluginContext.editor` hooks (`addToolbarButton`, `addPaletteItem`, `onNodeSelect`,
  `onNodeCreate`, `onDocumentChange`) — deferred, needs real UI-extension registries in `@kiv/editor`.
- Everything in `PLAN.md` Phases 2 (rest of it) through 6 — `locked`/`visible` was the only
  Phase 2 item pulled forward.
