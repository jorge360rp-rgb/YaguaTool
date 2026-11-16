# YaguaTool 3.1.6 · Texto existente y comprobación en AE

Esta actualización añade un modo **experimental y limitado** para aplicar Motion Lab a una capa de texto de punto existente. Usa animadores nativos y selectores por índice: no crea capas, precomposiciones ni una capa por letra. Conserva Texto de origen, tipografía, transformaciones, efectos y animadores del usuario. Reaplicar reemplaza solo los animadores de este modo; «Quitar Motion Lab directo» elimina solo esos animadores.

El muestreo del motor de referencia se conserva a 60 fps. Las distancias se adaptan al tamaño de fuente de la capa. Se admite traslación, opacidad, tracking, fill y desenfoque cuando los datos no incluyen transformaciones o pases incompatibles. Ejemplos de datos predeterminados compatibles: Slide, Slide Delay, Blur Rise, Bounce Drop y Scale Tracking. No implica equivalencia de píxeles entre Chromium y AE: la distribución tipográfica y el desenfoque utilizan motores diferentes.

**Bounce Rotation Reveal no está validado visualmente ni soportado en el modo directo inicial.** Combina rebote, rotación, escala, Ghost y glow. Se rechaza antes de modificar la capa y mantiene disponible el compositor completo con todos sus controles. No se sustituye silenciosamente por otro efecto. Su diferencia visual denunciada sigue pendiente de comprobar con un render real de AE.

Como medida conservadora se restaura en el compositor completo la jerarquía original de rotación/escala y la duración completa de las capas. Se retiran la combinación de transformaciones y el recorte de intervalos introducidos en 3.1.5. Se conserva la eliminación de claves estáticas, compactación no espacial, reutilización de precomposiciones idénticas y omisión de blur siempre cero. Esta reversión no demuestra por sí sola que esté solucionada la diferencia visual.

## Uso del modo directo

1. Selecciona una sola capa de texto de punto, de una línea, sin animación/expresión en Texto de origen y con tamaño uniforme. Sitúa el cabezal donde debe empezar la animación y deja suficiente duración en la capa.
2. Abre Texto → Motion Lab. Selecciona un preset compatible y ajusta sus parámetros. Pulsa «Aplicar a texto seleccionado · experimental». Se lee el texto real de la capa, se muestrea y se comprueba la compatibilidad antes de modificarla.
3. Si se rechaza el ajuste, usa «Crear con compositor completo». El modo directo no desactiva Ghost, Echo, giro, escala, glow ni otros modificadores para forzar la compatibilidad.
4. Tras cambiar el texto o los parámetros, vuelve a aplicar el modo directo. No tiene la sincronización automática de la composición editable del compositor completo.

Se rechaza texto de párrafo, varias líneas, fuente de tamaño mixto cuando AE expone sus rangos, escritura compleja/emojis, remapeo temporal o estiramiento distinto de 100 %. También se rechaza una selección, fuente, texto o cabezal que cambien durante el muestreo. No se amplía la capa ni se modifica la duración del proyecto automáticamente. Los animadores existentes permanecen activos y pueden modificar el resultado combinado.

## Preview de After Effects

La preview superior está identificada como referencia web. El nuevo botón «Renderizar preview de AE · composición activa» guarda 32 fotogramas PNG de la composición activa desde el cabezal, a un cuarto de resolución, y los reproduce con el tiempo correspondiente. Incluye todo lo visible en la composición. El render solo se ejecuta al pulsar ese botón; puede tardar según la composición.

Se restauran el tiempo, la resolución y el estado de suspensión de render al finalizar o ante un error. Los fotogramas temporales se borran al regenerar la preview o abandonar Motion Lab. No se crean elementos en el proyecto para esta preview. Si AE o el panel se cierran abruptamente, puede quedar la carpeta temporal `YaguaTool_LabPreview_*`.

Para revisar Bounce Rotation Reveal: genera una composición nueva con el compositor completo, ábrela, sitúa el cabezal al principio y renderiza esta preview. Instalar la actualización no reescribe las animaciones ya generadas. Conserva la versión anterior del proyecto para comparar.

## Validación y límites

Las pruebas locales comprueban estructura, conservación de la capa, índices, tiempos, escalado por fuente, sustitución, rollback, rechazo de cambios obsoletos y rechazo de presets complejos. También se ejecutan comprobaciones de sintaxis ES3 del host y de la interfaz en Chromium. No hay After Effects en este entorno: no se ha medido velocidad de render ni verificado igualdad visual en AE. Esta versión no presenta la incidencia de Bounce Rotation Reveal como resuelta.

Los paquetes limpio y completo contienen el mismo runtime e instaladores. El completo añade `Documentacion`; el limpio incluye únicamente la extensión, instaladores y las dos guías. Cierra AE antes de instalar.
