# Revisión de la propuesta: Motion Lab completo y navegación

Solo propuesta visual. Extensión, JSX, recursos AE y presets de producto sin cambios.

## Cambios solicitados

- Rail desplegable y contraíble en cualquier anchura; mantiene la decisión del usuario al seleccionar otra sección, sin cierre automático. Menú, Escape y fondo siguen disponibles.
- Cuadro de selección único que se desplaza por el rail en 320 ms con ease-out. Se mide la fila real, incluyendo scroll, resize y carga de fuentes. Reduced motion lo coloca al instante. El contenido de cada sección no se desliza.
- Marca exacta solicitada: **YagutaTool** junto al logo; debajo **Motion Lab**, Inter peso 300. Los nombres de presets y datos no se renombran.
- Herramientas: icono de tres reguladores, coherente con ajustes/utilidades. Complex: T y estrella separadas; eliminada la línea decorativa de jerarquía.
- Grid Pro es la última sección de Crear: Texto → Complex → Biblioteca → Carrousel → Grid Pro.
- Botones de familias TEXT con 8 px adicionales arriba y abajo y separación vertical entre filas.

## Motion Lab recuperado

La maqueta resumida se ha sustituido por el módulo completo de la versión anterior de Motion Lab v0.9. Se conserva el renderizador, catálogo, escenas y definiciones de controles originales. Se añade únicamente adaptación al contenedor de propuesta, estética y acciones de AE desactivadas/retiradas.

Previews reales: escenario principal, preview pequeño y tarjetas de los cuatro packs. Reproducción, pausa, seek, loop y pasos de un fotograma. Se detienen y destruyen las escenas al salir de Lab.

**33 presets auditados: ningún parámetro guardado sin editor accesible.** El selector Todos comienza activado. Se mantienen:

- Movimiento: duración, delay, distancias, blur, opacidad, escala/ejes, altura, rotación, swing, frecuencia, decay, stagger, skew, tracking/origen/focus, compresión, stretch y amplitud, según parámetros disponibles.
- Fill: modos With Reveal / Sweep / Per Piece; unidad y dirección; longitud, velocidad, hold, glow, tamaño, estilo y motor; cinco pases, con color, delay, dirección y encadenamiento donde corresponde.
- Echo/Ghost: cantidad, duración, blur, estilo, posición; retardo de Ghost en fotogramas, distancia, blur, glow, radio, motor y color.
- Editor Bézier y curvas guardadas; rejilla de anclaje y coordenadas X/Y; entrada/salida, unidades, orden y semilla/índice; opciones avanzadas; original de referencia, secuencia Demo Reel; restauración; exportaciones de ajustes y poses a 60 fps.

Algunos parámetros expuestos por el plugin no tienen efecto visual en el motor web público original; se mantienen igual que en la versión previa. No se inventan fórmulas nuevas ni se presenta la maqueta como ejecución en AE.

## Comprobaciones

- 450 casos responsive: pasan. Las piezas de texto animadas se excluyen de las comprobaciones de clipping de etiquetas de UI: sus transformaciones son parte del efecto; se siguen midiendo sus contenedores.
- 33 presets: cobertura de todos sus parámetros por editores o controles estructurales, sin ausencias. Pruebas funcionales de Distance, Echo y cinco pases de Fill.
- Reloj de previews avanza y los glifos se renderizan. Disposal al salir de Lab.
- Renderizador, escenas y catálogo idénticos byte a byte a la versión de referencia de producto. Las definiciones de etiquetas, grupos, rangos y pickers tampoco cambian.
- Cuadro de selección: comprobado fotograma intermedio y posición final. Rail permanece abierto al elegir otra sección. Orden Crear y marca verificados por DOM.
- Axe: cero infracciones automáticas en las 12 secciones más Motion Lab. No es una certificación de accesibilidad completa.
- Chrome 99: tres advertencias de soporte parcial de máscaras CSS; se mantiene el prefijo WebKit. Pruebas con Chromium instalado, no con CEF de AE.

Consultar CONTROLES.json, INTEGRIDAD.json, INTERACCIONES.json, ORDEN_Y_MARCA.json, RESPONSIVE_450.json y ACCESIBILIDAD.json. Las capturas anteriores de revision-referencia son históricas; esta carpeta corresponde a los últimos ajustes.

Abrir mock/index.html del ZIP y entrar en Texto → Motion Lab v0.9. Las opciones avanzadas están en su pestaña y los cinco pases de color se gestionan desde Fill. No se necesita After Effects para revisar esta propuesta.
