# Yagua Tool 3.1.2 · After Effects

Extensión CEP completa para After Effects 2024/2025, con la estética aprobada y las funciones nativas de 3.1.0. Incluye recursos AEP, fuentes, datos del Lab, scripts JSX, puente CEP e instaladores Windows/macOS. Conserva el ID de extensión y las preferencias existentes.

## Instalar

1. Cierra After Effects y extrae **todo** `YaguaTool_3.1.2_AfterEffects.zip`.
2. Ejecuta `YaguaTool/install_windows.bat` o `YaguaTool/install_mac.command`. El instalador guarda una copia de la instalación anterior.
3. Instala `YaguaTool/assets/fonts/GeistLab760.ttf` para Motion Lab.
4. Abre AE → Ventana → Extensiones (heredadas) → YaguaTool. Activa el permiso de escritura de scripts en Preferencias de AE para las previews y el Lab.

Consulta `YaguaTool/GUIA_INSTALACION.md` para instalación manual, restauración y controles editables.

## Pulido 3.1.2

- Marca de selección independiente, centrada a la derecha del texto; las ayudas no la desplazan.
- Halo en una capa propia que recorre el borde completo de la familia de efectos. Sin arcos diagonales ni choques con chevrons.
- Más separación entre títulos y tarjetas de Zoom.
- Ayudas emergentes en una capa del documento, con anchura legible y posición limitada al panel; se muestran con hover o foco y se cierran al salir, desplazar, redimensionar o pulsar Escape.
- Textos informativos de 11 px en paneles estrechos y 12 px en tamaños amplios, con saltos de línea naturales.
- Checkbox de 16 px con radio suave, acento azul y marca discreta, conservando un área de interacción de al menos 32 px en su etiqueta y manejo por teclado.

## Funciones conservadas

- Grid Pro conserva Grid, Animate, Backdrop y Attach completos, con layouts, divisores editables, simetría, curvas, tiempos, fondos, picks y vínculos.
- Los cinco barridos mantienen todos sus controles de colores, blur, anchura, separación, suavidad, potencia, brillo, modo, tiempos y opciones específicas.
- Rail desplegable con transición suave; desplegarlo no reconstruye el contenido ni reinicia las previews. Selección y halo comparten el mismo marco.
- Responsive abierto: halo únicamente en la sección seleccionada. Anchor Point con separación de 8 px y botones adaptables. Buscador con filas amplias y presets nativos, Lab y barridos.
- Cabecera YaguaTool / Motion Lab, tema funcional, pie Yagua Tool y versión. Previews del Lab con Yaguano. Se mantienen Fill, Echo/Ghost, Bézier y todos los modificadores.

## Validación y límite

La interfaz se comprueba en Chromium instalado; no se ejecuta AE en este entorno Linux. Los JSX, el puente CEP, el motor de captura, el catálogo y los recursos originales se verifican sin modificaciones mediante SHA-256. Las pruebas de interfaz no certifican el render, las fuentes ni la instalación en Windows/macOS. El host nativo conserva su versión interna 3.1.0; el paquete y la interfaz son 3.1.2.

`validation/RESULTADOS.json` recoge las comprobaciones. La primera ejecución y el render dentro de AE quedan pendientes de validación en AE.

## Fuente y reconstrucción

`patch/` contiene los archivos modificados, revisables. Desde este repositorio: `python after-effects/3.1.2/build.py`. Parte del ZIP original 3.1.0 incluido y genera el instalable completo.
