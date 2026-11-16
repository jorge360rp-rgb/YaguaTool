# Validación de la restauración 3.1.4.1

Todas las pruebas de API nativa usan un modelo de After Effects. No reproducen el foco del editor nativo ni renderizan píxeles en Adobe.

- `verify-restoration.py`: identidad de los seis archivos del motor con el ZIP 3.1.4, ausencia del adaptador experimental, 33 predeterminados con texto/geometría «Yaguano», parámetros originales, 60 fps y hashes del manifiesto.
- `default-native.cjs`: ejecuta el API real `ytLabDefault` sobre cada conjunto de datos en el modelo AE y comprueba el controlador y las capas de caracteres generadas. Un proceso por preset evita acumular todas las composiciones en memoria.
- `text-editing.cjs`: reloj virtual que reproduce 15 consultas en 10 segundos con el código anterior y ninguna al quedar inactiva la versión nueva; comprueba sincronización explícita, cancelación, errores, duplicados y muestras obsoletas sin reintento automático.
- `read-only-dispatch.cjs`: ejecución del despachador empaquetado; las lecturas no abren grupos de deshacer y las acciones que modifican el proyecto conservan su grupo, incluso ante errores.
- `editable-browser.cjs`: Chromium + puente CEP/host simulados; inactividad sin consultas, creación, sincronización mediante botón, texto/parámetros, identidad estable de la composición, inserción, controlador externo y regresiones de otras herramientas.
- `test-installer.ps1`: copia, actualización, integridad y rollback en PowerShell sobre Linux. El launcher y registro de Windows no se ejecutan en esta prueba.
- `verify-package.py`: integridad y separación del ZIP limpio/completo, referencias de recursos e identidad de runtime/instaladores/guías.
- `rebuild-defaults.cjs`: herramienta de regeneración de datos con el muestreador original de 3.1.4. No forma parte del runtime instalado.

Las pruebas de regresión de consultas y deshacer se ejecutaron también contra el código previo y fallaron por las llamadas/grupos de deshacer adicionales. La verificación de branding falló inicialmente con «Meet Qwix» antes de regenerar los datos.

Repetición: Node requiere `acorn` y, para Chromium, `playwright`. `YAGUA_EXTENSION_ROOT` apunta a una instalación extraída y `YAGUA_TEST_URL` a su servidor HTTP (por defecto puerto 8779). Para regenerar predeterminados, `YAGUA_ORIGINAL_DATA` apunta al `lab-data` original 3.1.4; mantén esos datos sin sustituir durante la regeneración.
