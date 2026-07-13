# Crear un control de Inspector

> 🚧 Pendiente de redactar. Alcance a continuación.

## Alcance de este documento

1. **Cuándo un control custom es la respuesta correcta** — vs. cuándo el control
   genérico ya cubre el caso. El Inspector de Kiv es deliberadamente **único y
   genérico** (`KivInspector.vue` + `FieldControl.vue`) — no existen ni deben
   existir inspectores dedicados por tipo de nodo. Si un campo necesita una UI
   distinta a los controles base (texto, número, color, select, boolean), la
   respuesta es un `pluginControl` nuevo, no un inspector paralelo.
2. **`pluginControl` en un `FieldDescriptor`** — cómo declarar que un campo usa un
   control custom en vez de uno de los básicos.
3. **Registrar el control** — `extensions.addFieldControl(name, Component)` en
   `KivEditor.vue` (o desde un plugin externo). Ejemplo real: `icon-picker`,
   `color-gradient`, `spacing-box`, `size-slider`, `media-picker`,
   `table-editor`, `pricing-editor`, `social-links-editor` — todos siguen el
   mismo patrón, revisar uno como plantilla (`packages/vue-editor/src/inspector/controls/`).
4. **Props/eventos que el control debe implementar** — `modelValue`/
   `update:modelValue` como mínimo; qué más recibe (`descriptor`, contexto del
   store) y cuándo.
5. **Controles de arrastre continuo (sliders, color pickers)** — usar
   `useContinuousEdit` para que un gesto completo de arrastre sea un solo paso de
   undo, no uno por cada evento `input`. Este es un patrón encontrado y corregido
   en la auditoría de este proyecto — documentarlo aquí evita que se reintroduzca
   el mismo bug en un control nuevo.
6. **Ejemplo completo de principio a fin** — construir un control nuevo simple
   (proponer: un slider de opacidad 0-1) mostrando los 4 pasos anteriores en
   código real.

## Referencias mientras se redacta

Código fuente: `packages/vue-editor/src/inspector/FieldControl.vue` (el
dispatcher), `packages/vue-editor/src/inspector/controls/*.vue` (los controles
existentes), `packages/vue-editor/src/composables/useContinuousEdit.ts`.
