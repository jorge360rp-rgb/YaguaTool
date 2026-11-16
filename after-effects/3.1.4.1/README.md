# YaguaTool 3.1.4.1 · Restauración de la 3.1.4

Esta edición recupera el motor de animación, los controles y la interfaz Glass de la **3.1.4**, con dos correcciones concretas: evitar consultas periódicas a AE mientras se escribe texto y generar **«Yaguano»** con el botón **«Original nativo»** en los 33 presets de Motion Lab.

## Motor restaurado

El adaptador nativo, el controlador editable, el reproductor de referencia, su escena, el muestreador y el catálogo conservan los mismos bytes que la distribución 3.1.4. No se incluyen las optimizaciones de codificación de 3.1.5 ni el modo experimental sobre texto existente de 3.1.6. Se mantienen todos los modificadores de la 3.1.4, incluidos Fill, Echo, Ghost, curva y anclaje según el preset.

La numeración 3.1.4.1 identifica esta restauración con correcciones y permite distinguirla del ZIP original de 3.1.4, que se conserva en el historial.

## Escritura de texto con el panel abierto

La versión anterior consultaba el estado de Motion Lab cada 650 ms. Estas llamadas pasaban por un despachador que abría un grupo de deshacer incluso para leer el estado. Es una causa plausible de que AE interrumpa la edición de texto.

Se eliminan las consultas periódicas. La conexión inicial y las acciones solicitadas por el usuario se mantienen; las lecturas de estado ya no crean grupos de deshacer. No se instala ninguna captura global de teclado ni se añaden llamadas al recuperar el foco.

La sincronización de las composiciones editables pasa a ser **manual**: termina de editar TEXTO o los controles Preset/Curva en AE, selecciona la composición o su controlador y pulsa **Sincronizar Motion Lab**. Espera a que termine antes de volver a editar en AE. Los controles Global continúan funcionando mediante expresiones nativas y no necesitan esta actualización.

No hay After Effects en el entorno de desarrollo: se verifica la eliminación de las llamadas periódicas y de los grupos de deshacer de lectura mediante pruebas, pero el foco del editor de texto debe confirmarse en AE. No se presenta como una comprobación ejecutada en Adobe.

## Original nativo: Yaguano

Los 33 conjuntos de datos se regeneran con el motor y los parámetros originales de 3.1.4, cambiando el texto a «Yaguano». Se recalculan geometría, caracteres y fotogramas; no se sustituye solamente una etiqueta. Se actualiza el manifiesto de integridad de los datos.

El botón «Original nativo» sigue usando los parámetros predeterminados del preset, independientemente de los cambios actuales del inspector. El texto de las creaciones personalizadas continúa siendo el que escribas en el campo del panel.

## Instalación y prueba

1. Guarda el proyecto, cierra AE y sustituye la extensión con el instalador del paquete o copiando `Extension/YaguaTool` a la carpeta CEP. Reinicia AE para descargar el host anterior. Conserva una copia del proyecto.
2. Con el panel abierto, crea una capa de texto y escribe. Repite editando una capa existente y el controlador TEXTO de Motion Lab, tanto en Texto como en otra sección del panel.
3. Crea una animación nueva de **Bounce Rotation Reveal** para comprobar la vuelta al motor de 3.1.4. Instalar no reescribe animaciones generadas con 3.1.5/3.1.6.
4. Pulsa «Original nativo» en cualquier preset de Motion Lab: las nuevas composiciones deben contener «Yaguano». Los proyectos ya creados conservan su texto.
5. Después de editar el texto o los parámetros de un controlador, pulsa **Sincronizar Motion Lab**.

## Descargas

- `YaguaTool_3.1.4.1_AfterEffects.zip`: extensión limpia, instaladores Windows/macOS y guías de instalación/funciones.
- `YaguaTool_3.1.4.1_Completo.zip`: el mismo runtime e instaladores, más historial, capturas y validación en `Documentacion`.

La comprobación de identidad de archivos acredita la restauración del motor de 3.1.4; las pruebas de creación usan una API AE simulada. No se garantiza igualdad de píxeles ni tiempo de render mediante estas pruebas locales.
