# Organización anterior recuperada

Base: review/YaguaTool/js/main.js y módulos data.js, aep-library.js, tools-pro.js, text-preview.js y workflow-model.js de la versión 3.1.0 ya revisada.

Se conservan las funciones de interfaz pageAepLibrary, pageTools, pageGraph, pageBackgrounds y pageExpr. Se sustituye el arranque de la aplicación por un adaptador de montaje dentro de la propuesta y el puente AE por una respuesta local sin ejecución. Estado de propuesta en una clave propia; no toca el almacenamiento de la extensión.

scoped.css deriva de las hojas existentes con selectores limitados al contenedor. Se retiran propiedades incompatibles con Chromium 99 y fuentes externas. theme.css adapta superficies, tipografía y controles a la estética aprobada. Las animaciones de las previews conservan sus cálculos/estilos originales.

Las previews de Biblioteca originales se abren en AE: en esta propuesta se conservan sus botones, pero no se ejecuta la importación ni se inventa una preview del AEP. Movimiento y Fondos sí muestran sus previews CSS originales, y Curvas/Herramientas sus gráficos interactivos originales.
