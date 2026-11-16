# YaguaTool 3.1.5 · Instalación rápida

Compatible con After Effects 2024/2025. Usa el paquete **limpio** para instalar, o el **completo** si también quieres historial y validación: ambos incluyen exactamente la misma extensión y los mismos instaladores.

## Windows

1. Extrae **todo el ZIP** en una carpeta normal. No ejecutes el instalador desde la vista del ZIP.
2. Guarda tus proyectos y **cierra After Effects**. Si aparece el aviso de que sigue abierto, comprueba en el Administrador de tareas que no quede `AfterFX.exe` en ejecución.
3. Ejecuta `install_windows.bat` desde la raíz del paquete. No necesitas administrador.
4. Instala la fuente incluida `Extension/YaguaTool/assets/fonts/GeistLab760.ttf` para Motion Lab.
5. Abre AE → **Ventana → Extensiones (heredadas) → YaguaTool**.
6. Activa el permiso de escritura de scripts en Preferencias de AE para generar las animaciones y previews nativas.

El destino es `%APPDATA%\Adobe\CEP\extensions\YaguaTool`. El instalador verifica los archivos, respalda la instalación anterior y configura PlayerDebugMode para el usuario actual. Respaldo: `%LOCALAPPDATA%\YaguaTool\Backups`. Registros: `%LOCALAPPDATA%\YaguaTool\InstallLogs`. Si falla la sustitución, intenta recuperar la instalación anterior y muestra el error.

## macOS

Con AE cerrado, ejecuta `install_mac.command` desde la raíz del paquete. Si el archivo no tiene permiso de ejecución, concédeselo desde Terminal con `chmod +x` y la ruta del archivo. Instala la fuente incluida y abre el panel desde Extensiones (heredadas). La instalación se realiza en `~/Library/Application Support/Adobe/CEP/extensions/YaguaTool`.

## Instalación manual

Con AE cerrado, copia **solo** `Extension/YaguaTool` al directorio CEP de tu usuario. La ruta final debe contener `extensions/YaguaTool/CSXS/manifest.xml`, sin carpetas adicionales. Si no has usado antes una extensión CEP sin firmar, el instalador configura el modo de depuración necesario. Guarda fuera de CEP las versiones anteriores con el mismo ID.

## Actualizar desde 3.1.4

Instala con AE cerrado. Las animaciones nuevas usan la estructura optimizada. Las ya guardadas no se reescriben al instalar: vuelve a generarlas con esta versión para aprovechar la mejora. Guarda una copia del proyecto antes de sustituir una animación existente.

## Qué contiene el paquete

- `Extension/YaguaTool`: panel y recursos necesarios para AE.
- Instaladores, `Install-Core.ps1` y `PACKAGE_INTEGRITY.json`: se necesitan juntos para la instalación automática.
- `README_INSTALACION.md` y `README_FUNCIONES.md`: guías breves.
- Solo el paquete completo añade `Documentacion`, con historial, pruebas y capturas.

No copies la raíz del paquete ni `Documentacion` dentro de CEP. Para revertir una actualización, cierra AE y restaura la carpeta `YaguaTool` del respaldo.

La interfaz y la lógica de archivos se han comprobado en Linux/Chromium/PowerShell. La ejecución del instalador en Windows/macOS y el render dentro de AE requieren verificación en esos sistemas.
