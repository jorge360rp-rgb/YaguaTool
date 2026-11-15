# Validación 3.1.4

- `GLASS_CLOSE.json`: estilos Glass diferenciados; cierre de búsqueda a 260/420/1100 px; cruz real de Referencias de 36 px y eliminación mediante Enter; tema claro.
- `INSTALLER.json`: siete escenarios del núcleo de instalación con PowerShell 7.7 en Linux: primera instalación, actualización, rutas con espacios/corchetes/apóstrofo, respaldo, duplicados, misma ruta, fallo/restauración e integridad. No se ejecutan el BAT ni el registro de Windows.
- `RESULTADOS.json`: 60 estados de la interfaz nativa, 33 presets del Lab y 76 resultados de búsqueda; motor/host/recursos originales protegidos.
- `RESPONSIVE450.json`: 450 combinaciones de la propuesta visual sin errores de geometría.
- `ACCESIBILIDAD.json`: cero infracciones axe en las pantallas revisadas. `CHROMIUM99.json` documenta el análisis CSS, con advertencias sobre máscaras junto con su implementación WebKit.
- `PACKAGE.json`: estructura limpia, recursos enlazados, archivos originales preservados y SHA-256 del contenido instalable.

La instalación y las APIs de Windows/macOS, CEF99 real y el render dentro de AE requieren verificación en esos sistemas. La prueba de PowerShell usa archivos de prueba y callbacks de configuración; no equivale a ejecutar Windows.
