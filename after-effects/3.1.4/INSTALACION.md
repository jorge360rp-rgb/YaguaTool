# Instalación · YaguaTool 3.1.4

Extrae **todo el ZIP** antes de instalar y cierra After Effects. Ejecuta `install_windows.bat` desde la carpeta principal del paquete, sin necesidad de administrador. No lo ejecutes directamente desde la vista del ZIP de Windows.

El instalador usa la carpeta Roaming del usuario actual y crea exactamente:

`%APPDATA%\Adobe\CEP\extensions\YaguaTool`

Por ejemplo, en tu equipo: `C:\Users\yanos\AppData\Roaming\Adobe\CEP\extensions\YaguaTool`.

Copia los archivos, comprueba su integridad, respalda la instalación anterior y activa PlayerDebugMode para el usuario actual. Si falla la instalación después de empezar a sustituirla, intenta restaurar la versión anterior. Las copias con el mismo ID CEP se respaldan y retiran del directorio de extensiones para evitar duplicados; las demás extensiones no se modifican.

El respaldo se guarda fuera de CEP y de las carpetas protegidas de Documentos/OneDrive, en `%LOCALAPPDATA%\YaguaTool\Backups`. El registro de cada ejecución queda en `%LOCALAPPDATA%\YaguaTool\InstallLogs`. Si se bloquea la ejecución por una política del equipo, la consola muestra el error y permanece abierta. El instalador usa Windows PowerShell 5.1, incluido en Windows 10/11; no necesita instalar PowerShell 7.

## Paquete limpio

- `Extension/YaguaTool`: archivos del panel y recursos necesarios para AE. Sin notas de versiones, instaladores ni pruebas.
- La documentación, el historial y las pruebas se consultan en este repositorio y se excluyen del ZIP.
- En la raíz: instaladores y manifiesto de integridad del paquete.

## Instalación manual

Copia **solo** la carpeta `Extension/YaguaTool` a `%APPDATA%\Adobe\CEP\extensions`. Debe existir `...\extensions\YaguaTool\CSXS\manifest.xml`, sin carpetas adicionales entre medias. Conserva fuera de CEP la copia anterior si quieres volver a ella.

En macOS ejecuta `install_mac.command` desde la raíz del paquete. La ruta manual es `~/Library/Application Support/Adobe/CEP/extensions/YaguaTool`.

## Abrir el panel

Instala la fuente `Extension/YaguaTool/assets/fonts/GeistLab760.ttf` para Motion Lab. Reinicia AE → Ventana → Extensiones (heredadas) → YaguaTool. Activa el permiso de escritura de scripts en Preferencias de AE para generar previews y animaciones nativas. El paquete conserva compatibilidad declarada con AE 2024/2025.

La lógica de archivos del instalador se verifica con PowerShell en Linux. La ejecución del lanzador, el registro de Windows, la instalación en Windows/macOS y el render dentro de AE requieren verificación en esos sistemas.
