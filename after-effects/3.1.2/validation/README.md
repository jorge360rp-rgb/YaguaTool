# Validación de interfaz 3.1.2

- `POLISH.json`: posiciones de ayudas con hover y foco a 260/340/488/1100 px; marca de selección, borde completo, separación de Zoom y funcionamiento del checkbox con clic/espacio.
- `RESULTADOS.json`: 60 estados de interfaz nativa; 33 presets; 76 resultados de búsqueda; scripts y recursos protegidos conservados por SHA-256.
- `RESPONSIVE450.json`: 450 combinaciones en la propuesta web sin errores de geometría.
- `ACCESIBILIDAD.json`: cero infracciones axe en las pantallas revisadas.
- `CHROMIUM99.json`: análisis CSS para Chrome 99; advertencias sobre máscaras junto con su implementación WebKit. No se ejecuta CEF99 real.

Las capturas corresponden a Chromium en Linux. La ejecución de scripts y el render dentro de After Effects requieren verificación en AE.

Los checkboxes usan una marca visual de 16 px y una etiqueta clicable de al menos 32 px. La comprobación de geometría mide la etiqueta asociada como área de interacción.
