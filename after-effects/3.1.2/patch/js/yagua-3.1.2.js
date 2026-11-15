/* Presentation helper; all host actions use the original AE bridge. */
(function(){
'use strict';

var tipOwner=null,tip=document.createElement('div');tip.id='yagua-tooltip';tip.setAttribute('role','tooltip');tip.hidden=true;document.body.appendChild(tip);
function hideTip(){if(tipOwner){var ids=(tipOwner.getAttribute('aria-describedby')||'').split(/\s+/).filter(function(id){return id&&id!==tip.id;});if(ids.length)tipOwner.setAttribute('aria-describedby',ids.join(' '));else tipOwner.removeAttribute('aria-describedby');}tipOwner=null;tip.hidden=true;}
function showTip(el){if(!document.body.classList.contains('tips')||!el||!el.dataset.tip)return;hideTip();tipOwner=el;tip.textContent=el.dataset.tip;tip.hidden=false;tip.style.left='12px';tip.style.top='12px';var ids=el.getAttribute('aria-describedby');el.setAttribute('aria-describedby',(ids?ids+' ':'')+tip.id);var box=el.getBoundingClientRect(),width=tip.offsetWidth,height=tip.offsetHeight,pad=12,gap=10;var top=box.bottom+gap;if(top+height>innerHeight-pad)top=box.top-height-gap;tip.style.left=Math.max(pad,Math.min(innerWidth-width-pad,box.left+(box.width-width)/2))+'px';tip.style.top=Math.max(pad,Math.min(innerHeight-height-pad,top))+'px';}
document.addEventListener('pointerover',function(e){var el=e.target.closest('[data-tip]');if(el&&el!==tipOwner)showTip(el);});
document.addEventListener('pointerout',function(e){if(tipOwner&&tipOwner.contains(e.target)&&(!e.relatedTarget||!tipOwner.contains(e.relatedTarget)))hideTip();});
document.addEventListener('focusin',function(e){var el=e.target.closest('[data-tip]');if(el)showTip(el);});document.addEventListener('focusout',hideTip);
document.addEventListener('scroll',hideTip,true);window.addEventListener('resize',hideTip);document.addEventListener('keydown',function(e){if(e.key==='Escape')hideTip();});

var nav=document.getElementById('tabs'),page=document.getElementById('page'),pressed=null,scheduled=false;
function release(){if(pressed)pressed.classList.remove('is-down');pressed=null;}
document.addEventListener('pointerdown',function(e){var el=e.target.closest('button,summary');if(e.button===0&&el&&!el.disabled){release();pressed=el;el.classList.add('is-down');}});
['pointerup','pointercancel'].forEach(function(t){document.addEventListener(t,release);});window.addEventListener('blur',release);
document.addEventListener('keydown',function(e){if((e.key===' '||e.key==='Enter')&&!e.repeat&&e.target.matches('button,summary')){pressed=e.target;pressed.classList.add('is-down');}});document.addEventListener('keyup',release);
function paint(e){var min=Number(e.min)||0,max=Number(e.max)||100;e.style.setProperty('--range-progress',Math.max(0,Math.min(100,(Number(e.value)-min)/(max-min||1)*100))+'%');}
document.addEventListener('input',function(e){if(e.target.matches('input[type=range]'))paint(e.target);});
function position(){var active=nav.querySelector('.nav-item.on'),indicator=nav.querySelector('.nav-selection'),list=nav.querySelector('.nav-list');if(!active||!indicator)return;indicator.style.width=active.offsetWidth+'px';indicator.style.height=active.offsetHeight+'px';indicator.style.transform='translate3d('+(list.offsetLeft+active.offsetLeft)+'px,'+(list.offsetTop+active.offsetTop)+'px,0)';indicator.dataset.lit=String(active.matches(':hover,:focus-visible'));}
function decorate(){scheduled=false;
document.querySelectorAll('button,summary,.card,.dg-card,.preset-family').forEach(function(e){if(e.id!=='nav-shade'&&!e.classList.contains('preset-family-title'))e.classList.add('halo');});
page.querySelectorAll('.preset-family-title.halo').forEach(function(e){e.classList.remove('halo');});
document.querySelectorAll('.halo').forEach(function(e){if(!e.querySelector(':scope > .yagua-halo-ring')){var ring=document.createElement('span');ring.className='yagua-halo-ring';ring.setAttribute('aria-hidden','true');e.appendChild(ring);}});
page.querySelectorAll('.chip').forEach(function(e){if(!e.querySelector('.yagua-selection-mark')){var mark=document.createElement('span');mark.className='yagua-selection-mark';mark.textContent='✓';mark.setAttribute('aria-hidden','true');e.appendChild(mark);}});
page.querySelectorAll('.dg-switch input[type=checkbox]').forEach(function(e){e.classList.add('yagua-switch');});
page.querySelectorAll('[data-tip][title]').forEach(function(e){e.removeAttribute('title');});
document.querySelectorAll('input[type=checkbox]:not(.yagua-switch)').forEach(function(e){Array.prototype.forEach.call(e.labels||[],function(label){label.classList.add('yagua-check-label');});});
if(tipOwner&&!tipOwner.isConnected)hideTip();
var indicator=nav.querySelector('.nav-selection');if(indicator)indicator.classList.add('halo');
page.querySelectorAll('input[type=range]').forEach(paint);
page.querySelectorAll('input,select,textarea').forEach(function(e){if(!e.getAttribute('aria-label')&&!(e.labels&&e.labels.length)){var row=e.closest('.row,.dg-line,.dg-range'),label=row&&row.querySelector('label');e.setAttribute('aria-label',label?label.textContent:e.placeholder||e.id||'Valor');}});
page.querySelectorAll('.main').forEach(function(e){e.classList.remove('main');});var primary=page.querySelector('.btn.pri:not([aria-pressed]),#nativeApply');if(primary)primary.classList.add('main');
page.querySelectorAll('button.tog').forEach(function(e){if(!e.querySelector('.legacy-switch-track')){var track=document.createElement('span');track.className='legacy-switch-track';track.setAttribute('aria-hidden','true');e.appendChild(track);}e.setAttribute('role','switch');e.setAttribute('aria-checked',String(e.classList.contains('on')));});position();}
function queue(){if(!scheduled){scheduled=true;requestAnimationFrame(decorate);}}
new MutationObserver(queue).observe(page,{childList:true,subtree:true});new MutationObserver(queue).observe(nav,{childList:true,subtree:true});new ResizeObserver(position).observe(nav);window.addEventListener('resize',position);['pointerover','pointerout','focusin','focusout'].forEach(function(t){nav.addEventListener(t,position);});decorate();
function search(){var last=document.activeElement,back=document.createElement('div');back.className='palette-backdrop';back.innerHTML='<section class="preset-palette" role="dialog" aria-modal="true" aria-label="Buscar presets"><header><strong>Buscar presets</strong><button aria-label="Cerrar búsqueda">×</button></header><input type="search" placeholder="Buscar un preset…" aria-label="Buscar un preset"><div class="palette-results"></div></section>';document.body.appendChild(back);var input=back.querySelector('input'),list=back.querySelector('.palette-results'),items=[];
[['text',window.TEXT_PRESETS],['motion',window.EXPR_PRESETS]].forEach(function(group){(group[1]||[]).forEach(function(p){items.push({page:group[0],name:p.name||p.label||p.id,id:p.id});});});
(window.YMX_CATALOG||[]).forEach(function(p){items.push({page:'text',name:p.name,id:p.id,kind:'lab'});});[['classic','Color Sweep Glow'],['silk','Iridescent Silk'],['chrome','Chrome Glint'],['prism','Prism Split'],['scan','Signal Scan']].forEach(function(p){items.push({page:'text',name:p[1],id:p[0],kind:'sweep'});});
function close(){back.remove();last.focus();document.removeEventListener('keydown',keys);}
function keys(e){if(e.key==='Escape')close();if(e.key==='Tab'){var all=Array.prototype.slice.call(back.querySelectorAll('button,input')),first=all[0],end=all[all.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();end.focus();}else if(!e.shiftKey&&document.activeElement===end){e.preventDefault();first.focus();}}}
function draw(){list.innerHTML='';items.filter(function(x){return x.name.toLowerCase().indexOf(input.value.toLowerCase())>=0;}).forEach(function(x){var b=document.createElement('button');b.className='halo';var title=document.createElement('span'),sub=document.createElement('small');title.textContent=x.name;sub.textContent=x.kind==='lab'?'Motion Lab v0.9':x.kind==='sweep'?'Barridos de color':x.page==='text'?'Presets de texto':'Movimiento';b.appendChild(title);b.appendChild(sub);b.onclick=function(){close();window.YaguaPanel.navigate(x.page,x.name,x.kind,x.id);};list.appendChild(b);});}
input.addEventListener('input',draw);back.querySelector('header button').onclick=close;back.addEventListener('click',function(e){if(e.target===back)close();});document.addEventListener('keydown',keys);draw();input.focus();}
document.getElementById('preset-search').addEventListener('click',search);
})();
