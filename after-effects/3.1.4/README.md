# YaguaTool 3.1.4 · Distribución definitiva

- **Paquete limpio**: `YaguaTool_3.1.4_AfterEffects.zip` contiene el panel, instaladores Windows/macOS, `README_INSTALACION.md` y `README_FUNCIONES.md`.
- **Paquete completo**: `YaguaTool_3.1.4_Completo.zip` añade `Documentacion` con historial de versiones, notas técnicas, validación y capturas de presentación.

Ambos instalan exactamente la misma extensión; la carpeta `Extension/YaguaTool` contiene únicamente el panel y sus recursos. Extrae todo el ZIP, guarda tu proyecto, cierra After Effects y ejecuta el instalador desde la raíz. Consulta las dos guías incluidas.

La presentación está en [presentacion/POST.md](presentacion/POST.md). La compatibilidad declarada es AE 2024/2025. Las pruebas automatizadas de interfaz y archivos no equivalen a verificar la instalación y el render dentro de Windows/macOS/AE.

Reconstrucción: `python after-effects/3.1.4/build.py`. Validación de ambos ZIP: `python after-effects/3.1.4/validation/verify-package.py`.

El archivo `YaguaTool_3.1.4_Solo_Extension.zip` se conserva para no romper los enlaces de la descarga manual anterior. Las dos opciones recomendadas son el paquete limpio con instaladores y el completo.
