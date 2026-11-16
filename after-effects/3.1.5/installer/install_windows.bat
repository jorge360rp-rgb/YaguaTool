@echo off
setlocal EnableExtensions DisableDelayedExpansion
title YaguaTool 3.1.5 - Instalacion
if not exist "%~dp0install_windows.ps1" goto incomplete
if not exist "%~dp0Extension\YaguaTool\CSXS\manifest.xml" goto incomplete
powershell.exe -NoLogo -NoProfile -ExecutionPolicy Bypass -File "%~dp0install_windows.ps1" -PackageRoot "%~dp0."
set "YAGUA_EXIT=%ERRORLEVEL%"
if not "%YAGUA_EXIT%"=="0" echo No se pudo completar. Revisa el error y el registro indicados arriba.
pause
exit /b %YAGUA_EXIT%
:incomplete
echo Extrae TODO el ZIP antes de ejecutar install_windows.bat.
echo Deben estar juntas la carpeta Extension y los archivos del instalador.
pause
exit /b 1
