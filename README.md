# YaguaTool 3.1.4.1 · Motion Lab para After Effects

**[Presentación de la interfaz 3.1.4 en GitHub](https://github.com/jorge360rp-rgb/YaguaTool/issues/7)**

**Texto animado, layouts, curvas y utilidades de edición en un único panel para After Effects.** YaguaTool combina una interfaz Glass con herramientas de creación y ajustes editables, desde una animación de texto hasta una cuadrícula con capas vinculadas.

## Restauración 3.1.4.1 · base 3.1.4

Se recupera el motor y todos los controles de animación de **3.1.4**. Se eliminan las consultas periódicas a AE que pueden interrumpir la escritura de texto y se regeneran los **33 originales nativos con «Yaguano»**, manteniendo los parámetros predeterminados.

Después de editar TEXTO o los controles Preset/Curva en AE, pulsa **Sincronizar Motion Lab**. Los controles Global continúan funcionando directamente. Las composiciones ya creadas no se reescriben al instalar; crea una nueva para comprobar el motor restaurado. [Cambios, instalación y límites de verificación](after-effects/3.1.4.1/README.md).

Las capturas siguientes corresponden a la interfaz 3.1.4, restaurada en esta actualización.

## Dos descargas, la misma extensión

| Descarga | Contenido | Para quién |
| --- | --- | --- |
| **[Paquete limpio con instaladores](https://raw.githubusercontent.com/jorge360rp-rgb/YaguaTool/codex/yaguano-ui-reference-responsive/after-effects/3.1.4.1/YaguaTool_3.1.4.1_AfterEffects.zip)** | Extensión, instaladores Windows/macOS, guía breve de instalación y guía de funciones. | Instalación de la versión restaurada. |
| **[Paquete completo con historial y validación](https://raw.githubusercontent.com/jorge360rp-rgb/YaguaTool/codex/yaguano-ui-reference-responsive/after-effects/3.1.4.1/YaguaTool_3.1.4.1_Completo.zip)** | Todo lo anterior, más historial, notas técnicas, pruebas y capturas en `Documentacion`. | Revisión, desarrollo y consulta del proceso. |

Ambos contienen los mismos archivos del panel y los mismos instaladores. La documentación adicional queda fuera de `Extension/YaguaTool`, para mantener limpia la carpeta instalada en CEP.

## Crear y animar texto

**32 presets nativos** organizados por familias, con fases IN/OUT independientes, previews y ajustes específicos de movimiento. El espacio de texto también incluye zoom tipográfico opcional, cinco barridos de color personalizables e importación de `.ffx`.

**Motion Lab reúne 33 presets** en Echo Pack, Apple Style Pack, Demo Reel Pack y Ghost Pack. Permite editar el texto, ajustar curvas Bézier y Anchor Point, personalizar Fill/Echo/Ghost según el preset y crear la animación nativa a 60 fps en una composición nueva o insertarla en la composición activa. El panel incluye transporte, galería de previews, exportación y controles editables en AE.

![Motion Lab: preview, curva de movimiento y controles de creación](https://raw.githubusercontent.com/jorge360rp-rgb/YaguaTool/codex/yaguano-ui-reference-responsive/after-effects/3.1.4/presentacion/01-Motion-Lab.png)

## Construir composiciones y layouts

**Grid Pro** conserva sus cuatro espacios: Grid, Animate, Backdrop y Attach. Incluye seis layouts de partida, divisores editables, once movimientos, curvas, stagger, layouts personalizados, fondos y vinculación de imágenes o capas mediante celdas, líneas e intersecciones.

**Carrousel** aporta Línea editorial y Órbita suave, con preview interactiva, tres puntos de trayectoria y ajustes de cantidad, tamaño, velocidad, radios y orientación.

**Complex Text** conserva la imagen de referencia del efecto fluido y las opciones de abrir el original, crear una copia editable o insertarla, con personalización opcional de sus dos textos.

![Grid Pro: cuadrícula personalizable, navegación y pestañas Grid, Animate, Backdrop y Attach](https://raw.githubusercontent.com/jorge360rp-rgb/YaguaTool/codex/yaguano-ui-reference-responsive/after-effects/3.1.4/presentacion/02-Grid-Pro.png)

## Biblioteca y herramientas para el día a día

La **Biblioteca contiene 51 composiciones originales** agrupadas en Text Animation Pack 1, Text Animation Pack 2 y Dynamic Text Animation. Incluye organización por familias, búsqueda y acceso a los originales y sus copias desde AE.

![Biblioteca: packs y catálogo de composiciones originales](https://raw.githubusercontent.com/jorge360rp-rgb/YaguaTool/codex/yaguano-ui-reference-responsive/after-effects/3.1.4/presentacion/03-Biblioteca.png)

| Sección | Qué aporta |
| --- | --- |
| **Movimiento** | Expresiones, previews azules, CTA Ping, Lo-Fi Steps y biblioteca de expresiones propias. |
| **Fondos** | Pearl Bloom, Cobalt Horizon, Aurora Silk y Nocturne Flux; tres colores editables, velocidad e intensidad. |
| **Curvas** | Value Graph y Speed Graph, Bézier, curvas propias, lectura/aplicación en AE y rebote con preview. |
| **Herramientas** | Keyframes, retiming, Easy Ease, Anchor Point, capas, formas, distribución, precomposiciones, timeline, renombrado, scripts y expresiones. |
| **Guardado** | Paletas, referencias, composiciones y fuentes favoritas. |
| **Retícula** | Diez formatos de composición y overlays guía para TikTok, Reels y Shorts. |
| **Ajustes** | Temas, acento, ayudas, movimiento reducido, preferencias de animación y copias de datos. |

![Herramientas: editor de curvas y utilidades de keyframes](https://raw.githubusercontent.com/jorge360rp-rgb/YaguaTool/codex/yaguano-ui-reference-responsive/after-effects/3.1.4/presentacion/04-Herramientas.png)

## Una interfaz más cómoda

- Acabado Glass, halos de borde y estados seleccionados con relieve.
- Barra lateral desplegable, búsqueda de presets y temas claro/oscuro/Midnight.
- Ayudas que se mantienen dentro del panel, cruces de 36 px y foco visible para teclado sin marco temporal al hacer clic.
- Controles adaptables a paneles estrechos y respeto al movimiento reducido.

## Instalar y empezar

1. Descarga uno de los dos ZIP y **extrae todo su contenido**.
2. Guarda tus proyectos y **cierra After Effects**. Si el instalador detecta `AfterFX.exe`, ciérralo antes de continuar.
3. Ejecuta `install_windows.bat` o `install_mac.command` desde la raíz del paquete. En Windows no hace falta administrador.
4. Instala la fuente incluida `GeistLab760.ttf` y abre **Ventana → Extensiones (heredadas) → YaguaTool**.

El instalador Windows utiliza la carpeta CEP del usuario, verifica integridad, respalda la instalación anterior y dispone de restauración ante fallos. Las guías `README_INSTALACION.md` y `README_FUNCIONES.md` están incluidas en **ambos** descargables.

## Compatibilidad y comprobaciones

Compatibilidad declarada: **After Effects 2024/2025**. Las capturas muestran la interfaz en modo demo. Las funciones que modifican composiciones o capas requieren AE; las fuentes y los permisos de scripts también influyen en el resultado.

La revisión incluye 450 combinaciones responsive de la propuesta, 60 estados de la interfaz nativa y pruebas del núcleo de instalación en PowerShell/Linux. La ejecución del instalador en Windows/macOS y el render real dentro de AE siguen pendientes de validación en esos sistemas.


Guías: [Instalación](after-effects/3.1.5/README_INSTALACION.md) · [Todas las funciones](after-effects/3.1.5/README_FUNCIONES.md).
