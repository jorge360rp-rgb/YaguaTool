## Pulido actual · 3.1.2

[Descargar extensión completa para After Effects](https://raw.githubusercontent.com/jorge360rp-rgb/yaguami/codex/yaguano-ui-reference-responsive/after-effects/3.1.2/YaguaTool_3.1.2_AfterEffects.zip) · [Propuesta visual](https://raw.githubusercontent.com/jorge360rp-rgb/yaguami/codex/yaguano-ui-reference-responsive/propuestas/ui-3.1.0/YaguaTool_UI_Pulida_3.1.2.zip) · [Instalación y cambios](https://github.com/jorge360rp-rgb/yaguami/blob/codex/yaguano-ui-reference-responsive/after-effects/3.1.2/README.md)

Corregidos la marca de selección, el halo del contenedor, el espacio de Zoom, las ayudas responsive y los checkboxes. La ejecución y el render dentro de AE quedan pendientes de prueba en AE.

## Revisión actual · Grid Pro, barridos y After Effects 3.1.1

- [Instalable completo para After Effects 2024/2025](https://raw.githubusercontent.com/jorge360rp-rgb/yaguami/codex/yaguano-ui-reference-responsive/after-effects/3.1.1/YaguaTool_3.1.1_AfterEffects.zip)
- [Propuesta visual actualizada](https://raw.githubusercontent.com/jorge360rp-rgb/yaguami/codex/yaguano-ui-reference-responsive/propuestas/ui-3.1.0/YaguaTool_UI_Grid_Barridos.zip)
- [Instalación, cambios y validación de AE](https://github.com/jorge360rp-rgb/yaguami/blob/codex/yaguano-ui-reference-responsive/after-effects/3.1.1/README.md)

Grid Pro y cinco barridos completos, rail suave, correcciones de halos y espacios. La interfaz ha sido probada en navegador; la instalación y el render dentro de After Effects quedan pendientes de prueba en AE.

# Propuesta actual: secciones anteriores recuperadas

- [Descargar propuesta actualizada](YaguaTool_UI_Propuesta_Secciones_Recuperadas.zip)
- [Informe y resultados actuales](revision-secciones-recuperadas/INFORME.md)
- [Capturas y vídeo](revision-secciones-recuperadas)

Biblioteca, Herramientas, Curvas, Fondos y Movimiento recuperan su organización anterior con el skin actual. También se incluyen las correcciones de cabecera, tema, pie, rail y textos de Motion Lab. Los enlaces de revisiones anteriores son históricos.

---

# Propuesta actual: Motion Lab completo y últimos ajustes

- [Descargar ZIP actualizado](YagutaTool_UI_Propuesta_MotionLab_Completo.zip)
- [Cambios y auditoría de controles](revision-motion-lab/INFORME.md)
- [Capturas y vídeo actuales](revision-motion-lab)
- [Abrir propuesta](mock/index.html)

Marca YagutaTool / Motion Lab, rail con selección animada, Grid Pro en Crear y controles completos de Motion Lab. Las entregas de referencia anteriores que aparecen a continuación son históricas.

---

# Revisión visual: referencia exacta y rail responsive

**Solo propuesta visual**, según la aclaración del usuario. La extensión instalable no se ha modificado.

- [Descargar la propuesta actualizada](Yaguano_UI_Propuesta_3.1.0_Referencia.zip)
- [Abrir propuesta interactiva](mock/index.html)
- [Galería de capturas](revision-referencia/index.html)
- [Cambios, pruebas y límites](revision-referencia/INFORME.md)
- [Referencia visual normalizada](REFERENCIA_VISUAL.md)

La documentación y el ZIP de la entrega anterior, a continuación, son históricos. Las capturas y resultados de esta revisión están en `revision-referencia` y `PROTOTIPO_RESPONSIVE.json`.

---

[Descargar propuesta completa con prototipo y todas las capturas](Yaguano_UI_Propuesta_3.1.0.zip)

# Yaguano · Propuesta UI 3.1.0 — pendiente de aprobación

Esta entrega prepara las decisiones solicitadas antes de implementar. **No es una extensión instalable y no modifica la versión 3.1.0 ni sus AEP/ZIP.**

1. Abre **informe.html** para ver comparación, capturas de los 450 casos base y450 de maqueta, regresión de medios y halo.
2. Abre **mock/index.html** para navegar el prototipo sin conexión a AE. Búsqueda global, sliders, controles, tabs y switches son muestras de interacción; previews/pins son representativos y ningún botón ejecuta scripts. La muestra de búsqueda indexa78 presets; el producto deberá indexar también los recursos/bibliotecas del usuario.
3. Revisa **DECISIONES_UI.md** (causa del bug y decisiones), **MAPA_E_INVENTARIO.md**, **COMPONENTES_Y_TOKENS.md** y **REFERENCIAS.md**.
4. Revisa **NAMING.md** y **DEFAULTS_POR_EFECTO.md**: nombres centralizados, compatibilidad con proyectos antiguos y excepciones funcionales de números/Timer/originales.

Base correcta: release e2bc261… de3.1.0, con PR#4 como ancestro. main no contiene esa entrega. Fuente y producto protegidos por hash:153 archivos sin cambios.

Decisiones clave a aprobar: diseño oscuro con azul #66C2FF; mínimo220×360; preview/controles/acciones coherentes; Complex dentro de Texto con alias; naming Yaguano para nuevas creaciones; valores numéricos y modo original conservan contenido funcional. La versión pública seguirá siendo3.1.0 por el brief; se diferenciará la revisión interna para evitar un host antiguo en memoria.

La aprobación autoriza implementación por fases. El documento original pide: «Espera mi aprobación de todo esto antes de implementar» (BRIEF_ORIGINAL.txt). No se ha hecho todavía el rediseño del producto.


Para revisar: descomprime todo y abre informe.html; contiene enlaces a las imágenes y al prototipo. Si tu navegador restringe file://, sirve esta carpeta con `python -m http.server 8771` y abre http://localhost:8771/informe.html. El entorno de desarrollo bloquea file:// por política, por lo que la prueba interactiva se realizó con HTTP local, sin recursos de internet en la maqueta.

Las carpetas con las 900 capturas están en el ZIP; no se duplican como 900 blobs de Git.
