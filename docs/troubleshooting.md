# Troubleshooting

> 🚧 Pendiente de redactar en forma completa — los primeros 3 casos ya son reales
> (extraídos de bugs encontrados y corregidos durante la auditoría de este
> proyecto), no hipotéticos. Seguir agregando casos reales a medida que aparezcan,
> nunca casos inventados "por si acaso".

## "Cambié un campo por defecto a `true` pero el nodo se comporta como si fuera `false`"

Causa casi segura: el prop es un `boolean` declarado solo por tipo
(`miProp?: boolean`) sin `withDefaults()`. Vue coacciona un prop booleano omitido
a `false`, no a `undefined`, cuando no tiene default explícito — así que
cualquier chequeo `props.miProp !== false` sigue evaluando `false` cuando el
prop simplemente no se pasó. Solución: `withDefaults(defineProps<...>(), {
miProp: true })`. Casos reales ya encontrados en este proyecto:
`ContainerNode.vue` (`centered`), `ModalNode.vue` (`showTrigger`,
`closeOnOverlay`, `closeOnEscape`, `showCloseButton`, `preventScroll`).

## "Configuré un campo en el Inspector pero no tiene ningún efecto visual"

Verificar, en este orden:
1. ¿El nombre del campo en `fields` coincide **exactamente** con el nombre que
   lee `toHtml()`/el componente Vue? (bug real encontrado: un nodo `icon` con
   campo `name`/`size` en un template, cuando el nodo en realidad lee
   `icon`/`iconSize`).
2. ¿El componente Vue realmente usa ese prop en su `<template>`, o solo lo
   declara/calcula en un `computed` que nunca se renderiza? (bug real
   encontrado: `triggerIcon` del nodo `modal` — el `computed` existía, el
   `<template>` nunca lo mostraba).
3. ¿El valor por defecto del campo coincide con lo que el componente asume
   cuando el prop es `undefined`? (relacionado con el caso de arriba sobre
   booleans, pero aplica a cualquier tipo).

## "El editor no refleja el comportamiento real de una funcionalidad (autoplay, auto-open, etc.)"

Revisar si esa funcionalidad está deliberadamente deshabilitada en modo editor
(`inject(KIV_EDITOR_MODE_KEY)`) — es un patrón intencional de Kiv (no interrumpir
la edición con comportamiento en vivo), pero si no hay ninguna señal visual de
que está deshabilitada, es una falla de UX, no un bug funcional. Ver el patrón de
placeholder agregado al nodo `modal` (auto-open + trigger oculto) como referencia
de cómo comunicar esto dentro del propio canvas en vez de dejar el nodo
silenciosamente invisible/inerte.

## (Sección en construcción)

Agregar aquí cualquier caso nuevo con: síntoma exacto que ve el usuario, causa
raíz confirmada (no una hipótesis), solución o workaround.
