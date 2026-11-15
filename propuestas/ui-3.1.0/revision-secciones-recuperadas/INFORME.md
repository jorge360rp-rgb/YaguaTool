# Revisión actual: organización anterior con la estética nueva

**Solo propuesta visual. La extensión instalable y sus scripts AE no se modifican.**

## Secciones recuperadas

- **Biblioteca:** los tres packs originales y sus 51 elementos, nombres y agrupaciones, en el orden del catálogo anterior. Buscador, selección, detalle, ajuste de tamaño y acciones originales presentes. Las previews de proyectos AEP siguen requiriendo AE; aquí se conservan las acciones como muestras sin ejecución.
- **Herramientas:** módulo completo Keys y curvas / Shapes y comps / Scripts y expresiones. Curvas de velocidad y biblioteca, guardado, keyframes y retiming, geometría, composiciones, loops/elasticidad, anclas, capas, editor, librería e importación de código. No se ejecutan scripts en la propuesta.
- **Curvas:** editor interactivo Valor/Velocidad, lectura/aplicación simulada, guardado, Curva Rebote y biblioteca con sus miniaturas canvas anteriores.
- **Fondos:** Pearl Bloom, Cobalt Horizon, Aurora Silk y Nocturne Flux, con su preview CSS animada anterior, tres colores, velocidad e intensidad. Se conservan las diferencias de color de los efectos.
- **Movimiento:** catálogo de expresiones anterior, parámetros correspondientes al preset, preview específica, CTA Ping, Lo-Fi Steps y expresiones personalizadas.

Los cuerpos originales de las cinco funciones de interfaz están intactos en el adaptador: lo nuevo es el montaje en la propuesta, el bloqueo del puente AE, el ámbito del CSS y el skin. También se corrigieron etiquetas accesibles sin alterar cálculos.

## Rail y Motion Lab

La selección y su halo usan ahora una sola caja. Se miden offsetLeft/offsetTop/offsetWidth/offsetHeight, que no se alteran al pulsar. La escala se aplica solo al icono/texto interior; el marco conserva alineación. La posición acompaña al scroll y al resize, con ease-out de 320 ms y sin movimiento bajo reduced motion.

En Motion Lab se ha retirado de la vista Texto original del preset y la frase explicativa solicitada. Se conserva internamente el checkbox necesario para no romper IDs del módulo, pero no se muestra. Todas las miniaturas inferiores de los cuatro packs muestran **Yaguano**, sin cambiar sus parámetros ni el motor. Los controles completos siguen disponibles.

También se conservan los últimos ajustes: cabecera YaguaTool / Motion Lab, tema claro/oscuro persistente, sin interrogación; botón de despliegue en la parte superior del rail sin marca duplicada; pie Yagua Tool y versión; 24 px entre la caja de texto y el título Motion Lab; filas del rail con más aire; Grid Pro al final de Crear.

## Pruebas

- 450 casos responsive pasan, incluyendo las tres vistas reales de Herramientas. Las geometrías artísticas dentro de previews recortadas no se confunden con texto de interfaz recortado.
- Biblioteca: las tres listas coinciden con el orden y nombres de sus 51 entradas; búsqueda sin resultados comprobada.
- Funciones originales de las cinco secciones comparadas con la base.
- Rail: máximo error medido **0 px** entre marco y fila, tras pulsar/soltar, cambiar de sección, scroll y en 240/1000 px.
- Previews animadas de Movimiento/Fondos presentes; editores y biblioteca de curvas presentes. Editor de código de prueba no ejecuta código.
- Los cuatro packs inferiores de Lab contienen únicamente Yaguano como texto de preview.
- Tema persistente, cabecera, botón de despliegue, pie y separación del título comprobados en 10 combinaciones claro/oscuro y anchuras.
- Axe sobre las 12 secciones y Lab: sin infracciones automáticas tras adaptar nombres/roles heredados. No equivale a certificación de accesibilidad completa.
- Chrome 99: máscaras CSS con soporte parcial, variante WebKit conservada. No se ha probado el CEF de AE.

Resultados, capturas y vídeo en esta carpeta. Se mantienen los resultados anteriores como históricos; esta revisión incorpora todas las peticiones posteriores.

## Revisar

Descomprime el ZIP y abre mock/index.html. Comprueba Biblioteca y sus tres packs, las tres pestañas de Herramientas, el editor y las miniaturas de Curvas, las cuatro opciones de Fondos y la selección de Movimiento. En Motion Lab revisa las tarjetas inferiores y sus controles. Los botones de AE solo muestran información de la propuesta.
