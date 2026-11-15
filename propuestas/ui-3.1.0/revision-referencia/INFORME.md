# Propuesta visual · referencia exacta y rail desplegable

Revisión del 15 de noviembre de 2026. **Solo propuesta visual; no es una extensión instalable ni una integración en AE.**

## Cambios

- Tokens, anillo cónico y máscara CSS propios, sin librerías de producto. Halos en reposo pausados y transparentes; hover/foco/pulsar .75. Principal blanco ambiental .4 y .8 al hover.
- Botones y tarjetas con radios, fondos y selección de referencia. Segmented gris activo, texto pleno y anillo fino.
- Switch azul/blanco: pastilla visible 38×22, pomo blanco 18, viaje 16. El botón real mide 38×38 para mantener un objetivo cómodo; su halo sigue el borde de la pastilla.
- Slider 4/16 px, relleno vinculado a valor, thumb 1.12 al arrastrar.
- Pulsación y liberación separadas, cancelación y teclado; reducción de movimiento. Tarjetas/opciones conservan el DOM de selección para que pueda fundirse el borde/fondo.
- Chevron de familias, aviso Yaguano · nombre y cambio de sección estático. Las acciones siguen siendo simuladas y lo indican en el aviso.
- Rail de 216 px abierto y 48 compacto, columnas alineadas y Complex text animation sin sangría ni recorte. Menú superior, overlay en estrecho, cierre con Escape/fondo/selección y memoria separada para ancho/estrecho. No desplaza ni anima el contenido al cambiar de sección.

## Verificación

- **450/450 casos responsive pasan**, 15 estados × 10 anchos × 3 alturas. Se mide tras dos frames para permitir que el evento de cambio de media query se resuelva antes de leer geometría.
- Rail abierto comprobado en 220, 240, 280, 320, 360, 420, 520 y 720 px. Persistencia de apertura, Escape, selección y controles de estado verificados.
- **0 infracciones automáticas axe** en 12 secciones para reglas WCAG 2 A/AA y 2.1 AA. No es una certificación completa de accesibilidad.
- doiuse con objetivo Chrome 99: tres avisos de soporte parcial de CSS Masks. Se conserva la variante prefijada WebKit, borde y foco visibles. Se prueba con Chromium instalado; CEF99 real sigue pendiente de la fase AE.
- Comprobados halos, cancelación de press, un solo principal, switch y aviso, reduced motion y ausencia de animación del contenido.
- 60 capturas por pantalla a 240/320/420/1000, componentes, rail y vídeo de interacción en esta carpeta. Los pósteres/motores reales del brief de producto no se han implementado en esta revisión visual.
- `review/YaguaTool`, JSX, datos/presets y paquetes de la extensión: sin cambios.

## Autocrítica visual

Puntuaciones orientativas de diseño, no resultados automáticos. Se revisa la jerarquía y anatomía de las capturas; la animación de efectos de AE no forma parte de estas notas.

| Pantalla | Atractivo | Jerarquía | Coherencia | Pulido |
|---|---:|---:|---:|---:|
| Texto | 8 | 9 | 9 | 8 |
| Motion Lab | 8 | 9 | 9 | 8 |
| Complex | 8 | 9 | 9 | 8 |
| Biblioteca | 8 | 8 | 9 | 8 |
| Carrousel | 8 | 9 | 9 | 8 |
| Movimiento | 8 | 9 | 9 | 8 |
| Fondos | 8 | 8 | 9 | 8 |
| Curvas | 8 | 9 | 9 | 8 |
| Herramientas / 3 tabs | 8 | 8 | 9 | 8 |
| Guardado | 8 | 8 | 9 | 8 |
| Retícula | 8 | 8 | 9 | 8 |
| Grid Pro | 8 | 8 | 9 | 8 |
| Ajustes | 8 | 8 | 9 | 8 |

Por mejorar en la futura fase de producto: previews animadas reales y pósteres, calibración en CEF de AE y prueba manual con escalado del sistema. Los marcadores y valores de la maqueta siguen siendo los de la propuesta anterior; no se presentan como ejecución real.

## Revisar

Descomprime el paquete y abre `mock/index.html`. La galería `revision-referencia/index.html` permite comparar secciones y anchos. En móvil pulsa el botón de menú de la cabecera. Prueba Space en switches, Tab y Enter, abrir/cerrar familias y cambiar una selección. Para movimiento reducido, activa la preferencia del sistema.
