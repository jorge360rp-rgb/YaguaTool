# Novedades · 3.1.5

- Motion Lab nativo: propiedades constantes sin keyframes y compactación validada de los tramos lineales no espaciales. Las posiciones animadas conservan todos sus puntos para respetar las tangentes espaciales de AE.
- Jerarquía de transformación reducida cuando la escala es uniforme o la rotación interna es nula. El resto conserva la descomposición completa, incluido skew.
- Reutilización de precomposiciones de glifos con contenido y animación idénticos, sin compartir cachés entre instancias independientes.
- Sin Gaussian Blur cuando es cero en toda la pista; intervalos de visibilidad reducidos conservando las rampas de los extremos.
- Vista de AE suspendida durante la construcción y restaurada al finalizar o fallar.
- Host y puente actualizados juntos a 3.1.5 para impedir cargar por error el adaptador anterior.
- Se mantienen controles, 60 fps y el motor de muestreo. No se actualizan automáticamente las animaciones ya creadas.
- Distribuciones limpia y completa, ambas con instaladores y las dos guías.
