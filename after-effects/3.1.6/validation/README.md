# Validación 3.1.6

Estas pruebas simulan la API de AE. No verifican píxeles ni tiempo de render en After Effects.

- `selected-text.cjs`: conservación de capa, documento, fuente y animadores del usuario; rangos por índice; visibilidad; timing/tamaño; sustitución; rollback; selección obsoleta; rechazo de efectos incompatibles; retirada incluso tras cambiar Texto de origen. Comprueba además guardado de 32 fotogramas y restauración/limpieza de preview, con un render simulado.
- `direct-browser.cjs`: flujo Chromium → CEP → host simulado del modo directo con texto real de la selección; ninguna capa/composición nueva; rechazo de Bounce Rotation Reveal sin mutación; retirada.
- `editable-browser.cjs`: creación/inserción con compositor completo y sincronización editable existentes, protección contra datos obsoletos y regresión de otras herramientas.
- `benchmark-native.cjs`: comparación numérica con el adaptador original sobre los 33 conjuntos de datos de referencia. No prueba igualdad visual con el navegador. Conserva la jerarquía original de transformaciones en 3.1.6.
- `test-installer.ps1`: escenarios de copia, actualización, integridad y rollback en PowerShell sobre Linux. El launcher Windows y el registro de Windows no se ejecutan aquí.
- `verify-package.py`: ZIP limpio/completo, identidad de runtime/instaladores/guías, integridad de todos los archivos, referencias locales, separación de documentación y librerías originales conservadas.

Para Node se necesitan `acorn` y `playwright` (solo flujos de navegador). El benchmark y la prueba estructural usan `YAGUA_DATA_DIR` apuntando a los datos `lab-data` originales. Los flujos Chromium usan `YAGUA_EXTENSION_ROOT` y `YAGUA_TEST_URL` para una instalación extraída servida por HTTP; la ruta predeterminada es `http://127.0.0.1:8777/YaguaTool/`.

**Pendiente:** renderizar Bounce Rotation Reveal en AE y comparar fotogramas con la referencia usando los mismos parámetros/texto/fase/fuente. El modo directo es experimental y no soporta ese preset. No se anuncia corregida la incidencia visual.
