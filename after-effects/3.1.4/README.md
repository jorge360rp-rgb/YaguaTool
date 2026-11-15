# Yagua Tool 3.1.4 · After Effects

Panel completo para AE 2024/2025, con botones Glass, cierres más cómodos e instalador Windows renovado. Conserva los motores, presets, controles editables y recursos de la extensión anterior.

Extrae todo `YaguaTool_3.1.4_AfterEffects.zip`, cierra AE y ejecuta `install_windows.bat` o `install_mac.command` desde la raíz del paquete. No necesitas administrador. Las instrucciones completas están en `Documentacion/INSTALACION.md`.

El ZIP separa dos carpetas:

- **Extension/YaguaTool**: solo el panel y sus recursos. Esta es la carpeta que puedes copiar manualmente a `%APPDATA%\Adobe\CEP\extensions`.
- **Documentacion**: novedades, instrucciones, historial y validación.

Los instaladores quedan en la raíz. El de Windows copia a la carpeta Roaming del usuario actual, verifica SHA-256, crea respaldo y restaura la versión anterior ante un fallo de la transacción. Las copias con el mismo ID CEP se respaldan fuera de CEP. Los registros quedan en `%LOCALAPPDATA%\YaguaTool\InstallLogs`.

La lógica de instalación se prueba con PowerShell en Linux. El lanzador y el registro de Windows, la instalación macOS y el render en AE requieren comprobación en esos sistemas. El host nativo conserva su versión interna 3.1.0 y la interfaz es 3.1.4.

Para reconstruir desde este repositorio: `python after-effects/3.1.4/build.py`. `patch/` contiene las modificaciones del panel; `installer/`, los instaladores. El constructor parte del ZIP original 3.1.0 y genera una extensión completa, sin archivos de documentación dentro de CEP.
