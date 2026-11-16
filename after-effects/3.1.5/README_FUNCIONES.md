# YaguaTool 3.1.5 · Guía de funciones

YaguaTool reúne creación, animación y utilidades de edición en un panel CEP para After Effects 2024/2025. La cabecera identifica el producto como **YaguaTool · Motion Lab**.

## Navegación e interfaz

- Barra lateral desplegable con Dashboard y acceso a todas las secciones; grupos Crear, Animar y Tu espacio.
- Botones Glass, halo en el borde y selección con relieve; estados adaptados a paneles estrechos.
- Temas oscuro, claro y Midnight, acento personalizable y ayudas con hover o foco.
- Búsqueda de presets nativos, Motion Lab y barridos; elegir un resultado lo carga en el panel, sin aplicarlo automáticamente a AE.
- Sliders con campo numérico, controles accesibles por teclado y movimiento de interfaz normal, reducido o según el sistema.
- Ajustes persistentes y exportación/importación de una copia de datos del panel.

## Optimización de Motion Lab en 3.1.5

La generación nativa conserva el muestreo a 60 fps y los controles editables. Las propiedades constantes dejan de tener keyframes; los tramos lineales no espaciales redundantes se compactan; las transformaciones simples necesitan menos capas auxiliares; las precomposiciones de glifos idénticas se reutilizan. Las transformaciones con skew conservan su jerarquía cuando es necesaria. También se omiten desenfoques que son cero durante toda la animación y se limita cada copia a su intervalo visible. La vista de AE se suspende durante la construcción y se restaura al finalizar.

En los 33 datos de referencia se generan un 76,8 % menos de keyframes y un 38,6 % menos de capas. Son mediciones de estructura, no una medición del tiempo real de render en AE. Las animaciones creadas con versiones anteriores conservan su estructura hasta regenerarlas.

## Crear

### Texto · Presets de texto

- Familias de presets nativos con búsqueda, selección y preview. Incluye revelados con máscara, gestos editoriales, propuestas kinetic y utilidades de texto.
- Fases IN y OUT independientes. Controles por preset para duración, distancia, blur, cadencia, dirección y organización por caracteres, palabras o líneas, según el efecto.
- Aplicar, quitar y restablecer la fase seleccionada. Inicio desde la capa o desde el indicador de tiempo, según Ajustes.
- Preview rápida en el panel y opciones de preview real para los presets nativos que la ofrecen. La simulación web es orientativa.
- **Zoom tipográfico opcional**: activar/desactivar, Zoom In/Out, momento IN/OUT, intensidad, duración y desfase; aplicar, quitar y restablecer.
- **Cinco barridos de color**: Color Sweep Glow, Iridescent Silk, Chrome Glint, Prism Split y Signal Scan. Incluyen blur compartido y opciones específicas de paletas, colores, ancho, suavidad, intensidad, brillo, orientación, duración y retraso. El barrido clásico añade separación de colores, tratamiento por líneas, pausa y seguimiento de la aparición existente.
- Importación de presets propios `.ffx`, con aplicación y eliminación de la lista del panel.

### Texto · Motion Lab

- **33 presets**, organizados en Echo Pack, Apple Style Pack, Demo Reel Pack y Ghost Pack.
- Texto editable con soporte de dos líneas, previews principal y miniatura, galería animada, replay, pausa, loop y transporte.
- Inspector de curva Bézier y Anchor Point. Parámetros específicos de movimiento y temporización; Fill, pases de color, Echo y Ghost cuando corresponden al preset.
- Restablecer valores, exportar configuración y muestras de animación.
- Creación de animación nativa a **60 fps** en una composición nueva o inserción como precomposición en la composición activa.
- Controlador de texto y controles de efectos editables en AE. Sincronización de la instancia seleccionada desde el panel, con pausa y actualización manual disponibles.
- Acceso al original predeterminado del AE Lab como alternativa; esa opción usa los datos originales y no los cambios actuales del inspector.

### Complex Text

- Imagen estática de referencia del efecto fluido original.
- Abrir el proyecto original importado, crear una copia editable o insertarla en la composición activa.
- Personalización opcional de los dos textos de la copia, conservando sus precomposiciones, mapas, efectos y keyframes. Requiere la fuente Impact disponible en el sistema.
- Esta sección no incluye el antiguo reproductor ni el botón de render de preview.

### Biblioteca

- **51 composiciones originales**, agrupadas en Text Animation Pack 1, Text Animation Pack 2 y Dynamic Text Animation.
- Catálogo por familias y búsqueda; selección, consulta del original en AE y aplicación de una copia desde la biblioteca.
- Recursos `.aep` incluidos; la copia conserva la estructura original. El panel no aporta un vídeo prerenderizado para cada elemento.

### Carrousel

- Dos modos: Línea editorial y Órbita suave.
- Preview interactiva con tres puntos de trayectoria, editables mediante arrastre o coordenadas.
- Carga de capas/composiciones de AE e importación de imágenes como fuentes.
- Cantidad de elementos, separación, tamaños base y central, anchura central, suavidad, velocidad, radios, esquinas y duración.
- Inversión del sentido y orientación de las tarjetas a la trayectoria. Creación de una composición nativa con controles editables.

### Grid Pro

- **Grid**: seis layouts rápidos, divisores arrastrables, filas y columnas, simetría, modos de dibujo, marcadores, gap, esquinas, líneas, opacidad, bordes y colores. Crear/reconstruir, aplicar disposición o estilo, leer el grid de AE y eliminarlo.
- **Animate**: once presets de movimiento con previews, Move/Hold, easing, stagger, orden y loop. Guardar, actualizar y quitar layouts personalizados; animar presets o layouts, extender al cabezal y quitar la animación.
- **Backdrop**: fondo sólido, gradiente, capa o archivo; colores, dirección y opacidad; crear/actualizar o quitar.
- **Attach**: revelar un fondo fijo mediante máscara, mover imagen y máscara con la celda sin reescalar, o centrar/anclar la imagen. Selección de celdas, líneas o intersecciones mediante clic, multiclic o bloque; distribución por área o por capa; alineación, cubrir/contener y recorte cuando corresponden. Desvincular/quitar máscara, reparar y diagnosticar vínculos en AE.

## Animar

### Movimiento

- Seis presets de expresiones: Wiggle, Jump, Pop Up, Spin, Blur y Bounce, con parámetros y aplicación a la selección de AE.
- Previews del panel con tonos azules.
- **CTA Ping**: color, tamaño de anillo y duración del pulso.
- **Lo-Fi Steps**: control de FPS para movimiento a pasos.
- Editor de expresiones propias: guardar, volver a cargar, aplicar a propiedades seleccionadas y eliminar de la biblioteca del panel.

### Fondos

- Cuatro estilos: Pearl Bloom, Cobalt Horizon, Aurora Silk y Nocturne Flux.
- Preview, tres colores editables, velocidad e intensidad.
- Crear, actualizar/sincronizar y quitar el fondo. Los colores quedan vinculados al controlador nativo de AE.

### Curvas

- Editor Bézier en modos Value Graph y Speed Graph, con selección diferenciada.
- Arrastre de controles, lectura de coordenadas/valores, curvas predefinidas y curvas guardadas.
- Lectura y aplicación a la selección de AE; utilidades de rebote con preview y controles específicos.

### Herramientas

- **Keys y curvas**: editor de velocidad/valor, curvas predefinidas y propias, aplicar/leer curvas, copiar/pegar keyframes, desplazamiento, retiming, escala temporal e influencias IN/OUT.
- **Shapes y comps**: distribución horizontal/vertical, duplicación con o sin dependencias, separar/combinar grupos de formas, nulos siguiendo vértices y recortar la composición a la selección con margen. Loop IN/OUT, ping-pong y elasticidad con amplitud, frecuencia y decay. Separar/combinar conserva los originales desactivados; combinar requiere Transform estático y el recorte se limita a capas 2D sin padre y posiciones estáticas.
- **Scripts y expresiones**: editor, tipo de código, ejecución/aplicación explícita, guardar herramientas, añadir archivos y biblioteca de accesos. Arrastrar un archivo lo añade; no lo ejecuta.
- **Anchor Point**: nueve posiciones en una rejilla 3×3.
- Crear Adjustment, Null, Camera y Solid; Parent Null y selector de color del sólido.
- Un-Precomp, Cam + Nulls, Paste Image, duplicar composición con opción de precomps anidadas, Create Orb y Fill.
- Dividir texto por letras, palabras o líneas; alinear capas a la composición.
- Timeline: escalonar capas, alinear inicios, recortar IN/OUT y crear marcadores IN/OUT.
- Easy Ease sobre keyframes seleccionados, renombrado por lotes y accesos propios desde efectos o `.ffx`.

## Tu espacio

### Guardado

- **Colors**: paletas, muestras, importación desde imagen, armonías y utilidades de lectura/aplicación de color.
- **Refs**: carpetas de referencias, añadir imágenes, arrastrar/pegar, vista ampliada y eliminación individual.
- **Comps**: guardar la composición activa con miniatura y datos, abrirla, duplicarla, quitarla de la lista e importar un proyecto `.aep`/`.aepx`. Los accesos dependen del proyecto abierto.
- **Fonts**: cargar/buscar fuentes del sistema mediante AE, verlas con un texto de muestra, guardarlas como favoritas y aplicarlas a la selección.

### Retícula

- Diez formatos de composición para redes sociales, con FPS y duración configurables.
- Overlays de TikTok, Instagram Reels y YouTube Shorts como capas guía no renderizables; mostrar/quitar y ajustar opacidad.

### Ajustes y conexión

- Apariencia, acento, ayudas, movimiento reducido, punto de inicio de animación y easing.
- Exportar/importar datos del panel y restablecerlos mediante confirmación.
- Estado de conexión con AE y reconexión cuando el host lo requiere. La sincronización del Lab puede pausarse y reintentarse.

## Uso y comprobación

Las funciones que modifican capas, composiciones, archivos o keyframes requieren abrir el panel dentro de AE y seleccionar los elementos apropiados. Fuentes, permisos de escritura y disponibilidad de efectos influyen en el resultado. Las capturas de la presentación muestran la interfaz en modo demo; las pruebas en navegador no certifican el render final en AE. Consulta `README_INSTALACION.md` para comenzar.
