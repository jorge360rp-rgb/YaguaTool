# Referencia visual Yaguano · revisión de propuesta

Fuente de verdad: mensaje del usuario con los tokens y reglas siguientes. Esta transcripción normaliza los escapes de Markdown del mensaje. Alcance confirmado posteriormente: **primero en la propuesta visual**. La implementación de producto y la puerta de calidad en AE del brief adjunto quedan pendientes.

| Componente | Referencia |
|---|---|
| Acento / arco | #66c2ff / rgb(190,230,255); arco blanco para la acción principal |
| Superficies | #15171c / #1c1f26; borde blanco al 8 % |
| Ease out | cubic-bezier(.32,.72,0,1) |
| Ease estándar | cubic-bezier(.4,0,.2,1) |
| Duraciones | fast 160 ms; base 240 ms; slow 320 ms; pulsar 120 ms; soltar 200 ms; salida halo 400 ms |
| Halo | anillo de 1px, inset −1px, radio heredado; conic-gradient(from var(--a), transparent 0 50%, var(--ac2) 78%, transparent 100%); máscara WebKit xor / exclude |
| Halo reposo | opacidad 0; animación de 7 s pausada |
| Halo hover/foco/pulsación | opacidad .75; órbita activa |
| Principal | halo blanco permanente .4, órbita 9 s, hover .8; sombra azul al 25 % |
| Sin hover | halo .22, órbita 10 s; principal conserva sus valores |
| Botones | altura 38 px, radio 10 px; principal azul con texto #0d0e11, sin borde |
| Tarjetas/opciones | radio 10 px, fondo s2, hover #222630; selección azul .12 y borde azul .55 |
| Segmented | fondo s1, radio 10, padding 2, gap 2; activa s2 y anillo blanco .08 |
| Rail activo | fondo s2 y anillo inset blanco .08; sin indicador deslizante |
| Switch visual | 38×22 px, radio 12; OFF blanco .14, ON azul; pomo blanco 18 px a 2 px; recorrido 16 px en 240 ms |
| Slider | pista 4 px, relleno azul, pomo blanco 16 px; drag escala 1.12 |
| Pulsar/soltar | escala .97 en 120 ms / escala 1 en 200 ms; sin rebote ni estiramiento |
| Chevron | rotación con despliegue TEXT, 320 ms |
| Aviso | entrada 240 ms, opacidad y desplazamiento 6 px; salida a 2400 ms; nombre Yaguano · Efecto |

Cobertura de halos: botones, tarjetas, pestañas, opciones de segmented, wrappers de inputs/selects, switches, cabeceras, filas de herramientas y rail. El recorte de previews permanece en un hijo: nunca recortar el anillo del contenedor. Sin backdrop-filter en elementos numerosos. Solo una acción ambiental principal por pantalla.

Reduced motion: sin animación orbital ni escala; transiciones instantáneas y estados accesibles conservados. Cambio de sección: contenido estático, sin transición o indicador móvil; el botón del rail sí da feedback de pulsación. Todas las duraciones/easings usan tokens.

Responsive: recuperar el despliegue del rail; 216 px abierto, 48 px compacto, nombres completos, memoria entre sesiones y cierre con Escape, fondo y selección. No se cambia el código de la extensión funcional.
