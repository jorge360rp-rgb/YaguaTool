# Validación · 3.1.5

`NATIVE_PERFORMANCE.json` compara el adaptador anterior y el nuevo en los 33 presets de referencia, a cada fotograma y en tres subpasos de cada intervalo: 633.008 poses. Comprueba matrices, opacidad, blur, color, posiciones y fuente de los glifos; incluye casos sintéticos de skew, animación interna, visibilidad, reutilización, blur cero y error de fuente. Las pistas de posición conservan todos sus keyframes espaciales. Verifica la restauración del estado de render, incluida una vista previamente desactivada.

`EDITABLE_INTEGRATION.json` recoge la prueba del panel con Chromium y una API AE simulada: creación, inserción, controles externos, texto/parámetros, caché estable y protección frente a actualizaciones obsoletas.

El recuento de capas y keyframes es real para la estructura que emite el script, pero las pruebas no miden render de píxeles ni tiempo de ejecución en After Effects. Los resultados no permiten prometer un porcentaje de reducción de segundos en AE.

Para repetir el benchmark: Node + acorn, y `YAGUA_DATA_DIR` apuntando a `Extension/YaguaTool/lab-data` de una instalación extraída. Ejecute `node --expose-gc benchmark-native.cjs`. El adaptador anterior está en `native-baseline.jsx`; no se carga en la extensión.
