# Reproducir comprobaciones

Herramientas solo de desarrollo, no dependencias de la propuesta.

1. Servir la carpeta ui-3.1.0 con `python -m http.server 8771 --bind 127.0.0.1`.
2. Matriz: `node test-mock.js` (Playwright; Chromium en /usr/bin/chromium, ajustar si corresponde). Guarda 450 capturas en proposal-captures.
3. Interacciones: `python revision-referencia/test-interacciones.py` (Python Playwright y su ffmpeg; ejecutar `python -m playwright install ffmpeg` si falta).
4. Estilo/axe: `node revision-referencia/test-estilo.cjs` con playwright, axe-core, postcss y doiuse disponibles para Node.

Los tests usan HTTP local porque el navegador de desarrollo bloquea file://. La propuesta distribuida no utiliza internet. La geometría se mide tras dos frames del resize para resolver media queries. La matriz y sus 450 JPG están en el ZIP. Las 60 capturas de revisión están también visibles en GitHub.
