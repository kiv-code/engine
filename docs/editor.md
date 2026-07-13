# Editor

> 🚧 Pendiente de redactar. Alcance definido a continuación.

## Alcance de este documento

- Cómo montar `<KivEditor>` desde cero (props mínimas: `document`, `registry`,
  `vueRegistry`; props opcionales: `bus`, `engine`, `theme`).
- `useEditorStore`/`EditorStore` — API completa (todo lo que expone: `document`,
  `selected`, `selectedNodes`, `history`, `undo`/`redo`, `startBatch`/`endBatch`,
  `addNode`/`removeNode`/`moveNode`/`updateProps`, `registry`).
- `EditorExtensions` — cómo registrar:
  - un control de campo custom (`addFieldControl`) — cross-link a
    [Crear un control de Inspector](./creating-an-inspector-control.md).
  - un botón de toolbar (`addToolbarButton`).
  - un item de paleta (`addPaletteItem`).
  - (a completar según lo que exponga `EditorExtensions` — verificar contra
    `packages/vue-editor/src/extensions/`).
- El composable `useContinuousEdit` — cuándo y cómo usarlo al escribir un control
  de campo que dispara cambios continuos (sliders, color pickers), para que un
  gesto completo sea un solo paso de undo.
- Cómo insertar contenido programáticamente: `insertNodeNearSelection`,
  `cloneNodeTree` (para insertar templates/bloques sin colisión de ids).
- Breakpoints/locale: cómo el editor decide qué breakpoint/locale se está
  editando y cómo un consumidor puede controlarlo desde afuera.
- Theming del propio chrome del editor (`theme: "dark" | "light"`) vs. theming
  del contenido renderizado (dos cosas distintas — no confundir).

## Referencias mientras se redacta

Código fuente: `packages/vue-editor/src/components/KivEditor.vue` (punto de
entrada), `packages/vue-editor/src/store/editor-store.ts`,
`packages/vue-editor/src/extensions/`.
