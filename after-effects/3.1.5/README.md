# YaguaTool 3.1.5 · Optimización de Motion Lab

Se reduce la estructura generada al incorporar animaciones al proyecto: propiedades estáticas sin keyframes, compactación de tramos lineales no espaciales, reutilización de precomposiciones idénticas, menos capas auxiliares cuando la transformación lo permite y desenfoques omitidos cuando son siempre cero. La vista de AE se suspende durante la construcción y se restaura al terminar, también ante errores.

Se conservan los datos muestreados a 60 fps, las curvas y los controles editables. Los datos del motor web, fuentes, catálogos y capturas de referencia no se modifican.

| Medida en los 33 presets de referencia | Anterior | 3.1.5 |
| --- | ---: | ---: |
| Keyframes | 1.533.631 | 355.979 |
| Capas | 6.907 | 4.244 |
| Composiciones | 1.462 | 1.354 |

La prueba compara 633.008 poses, incluyendo instantes entre fotogramas, con el adaptador anterior en un modelo de la API de AE. El error numérico máximo observado es menor de 0,000000012. No es una prueba de píxeles ni de tiempo de render ejecutada en After Effects.

También se comprueban creación editable, inserción en una composición, controlador externo, actualización de texto/parámetros, sustitución de caché y rechazo de cambios obsoletos mediante Chromium y una API AE simulada.

## Descargas y actualización

- `YaguaTool_3.1.5_AfterEffects.zip`: paquete limpio con instaladores y guías de instalación/funciones.
- `YaguaTool_3.1.5_Completo.zip`: mismo panel e instaladores, más historial y validación en `Documentacion`.

Cierra AE antes de instalar. Para aprovechar la mejora, crea la animación de nuevo con esta versión: instalar la extensión no reescribe las composiciones ya guardadas. Las fuentes y permisos siguen siendo los de la versión anterior. Compatibilidad declarada: AE 2024/2025.

El rendimiento real depende del texto, Echo/Ghost, efectos, resolución y equipo. La ejecución y el render en AE siguen pendientes de medir en AE; no se promete una reducción porcentual de segundos basada en estos recuentos.

## Reconstruir y verificar

`python after-effects/3.1.5/build.py` genera las dos distribuciones. `python after-effects/3.1.5/validation/verify-package.py` verifica integridad y equivalencia. El benchmark usa Node, `acorn` y `YAGUA_DATA_DIR` apuntando a `lab-data` de una extensión extraída.
