# Grid Pro, barridos y espacios

Se recuperan los módulos originales completos de 3.1.0: cuatro pestañas de Grid Pro y cinco estilos de barrido con personalización completa. El módulo Grid JS permanece idéntico al original. Los barridos reutilizan el cuerpo de la función original, con puente simulado únicamente en esta propuesta web.

Rail con interpolación de anchura y curva suave; halos inactivos ocultos únicamente en responsive desplegado. Anchor Point mantiene 8 px entre botones. Resultados del buscador con altura mínima de 64 px y texto sin recorte.

Validación: 450 combinaciones responsive sin desbordamientos ni objetivos recortados; cero infracciones axe en las pantallas comprobadas. Análisis Chrome 99: las tres advertencias sobre máscaras corresponden al halo, que usa la variante prefijada WebKit. No se ha ejecutado Chromium 99 real.

La versión nativa completa para AE se publica en `after-effects/3.1.1/`; conserva los scripts y recursos nativos. La prueba dentro de After Effects sigue pendiente.
