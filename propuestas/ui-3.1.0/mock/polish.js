(function(){
var tipOwner=null,tip=document.createElement('div');tip.id='yagua-tooltip';tip.setAttribute('role','tooltip');tip.hidden=true;document.body.appendChild(tip);
function hideTip(){if(tipOwner){var ids=(tipOwner.getAttribute('aria-describedby')||'').split(/\s+/).filter(function(id){return id&&id!==tip.id;});if(ids.length)tipOwner.setAttribute('aria-describedby',ids.join(' '));else tipOwner.removeAttribute('aria-describedby');}tipOwner=null;tip.hidden=true;}
function showTip(el){if(!el||!el.dataset.tip)return;hideTip();tipOwner=el;tip.textContent=el.dataset.tip;tip.hidden=false;tip.style.left='12px';tip.style.top='12px';var ids=el.getAttribute('aria-describedby');el.setAttribute('aria-describedby',(ids?ids+' ':'')+tip.id);var box=el.getBoundingClientRect(),width=tip.offsetWidth,height=tip.offsetHeight,pad=12,gap=10;var top=box.bottom+gap;if(top+height>innerHeight-pad)top=box.top-height-gap;tip.style.left=Math.max(pad,Math.min(innerWidth-width-pad,box.left+(box.width-width)/2))+'px';tip.style.top=Math.max(pad,Math.min(innerHeight-height-pad,top))+'px';}
document.addEventListener('pointerover',function(e){var el=e.target.closest('[data-tip]');if(el&&el!==tipOwner)showTip(el);});
document.addEventListener('pointerout',function(e){if(tipOwner&&tipOwner.contains(e.target)&&(!e.relatedTarget||!tipOwner.contains(e.relatedTarget)))hideTip();});
document.addEventListener('focusin',function(e){var el=e.target.closest('[data-tip]');if(el)showTip(el);});document.addEventListener('focusout',hideTip);
document.addEventListener('scroll',hideTip,true);window.addEventListener('resize',hideTip);document.addEventListener('keydown',function(e){if(e.key==='Escape')hideTip();});


function decorate(){document.querySelectorAll('button,summary,.card,.dg-card,.preset-family').forEach(function(e){if(e.id!=='nav-shade'&&!e.classList.contains('preset-family-title'))e.classList.add('halo');});
document.querySelectorAll('.preset-family-title.halo').forEach(function(e){e.classList.remove('halo');});
document.querySelectorAll('.halo').forEach(function(e){if(!e.querySelector(':scope > .yagua-halo-ring')){var ring=document.createElement('span');ring.className='yagua-halo-ring';ring.setAttribute('aria-hidden','true');e.appendChild(ring);}});
document.querySelectorAll('.chip').forEach(function(e){if(!e.querySelector('.yagua-selection-mark')){var mark=document.createElement('span');mark.className='yagua-selection-mark';mark.textContent='✓';mark.setAttribute('aria-hidden','true');e.appendChild(mark);}});
document.querySelectorAll('.dg-switch input[type=checkbox]').forEach(function(e){e.classList.add('yagua-switch');});
document.querySelectorAll('[data-tip][title]').forEach(function(e){e.removeAttribute('title');});
document.querySelectorAll('input[type=checkbox]:not(.yagua-switch)').forEach(function(e){Array.prototype.forEach.call(e.labels||[],function(label){label.classList.add('yagua-check-label');});});
if(tipOwner&&!tipOwner.isConnected)hideTip();
}
let queued=false;function queue(){if(!queued){queued=true;requestAnimationFrame(()=>{queued=false;decorate()})}}
new MutationObserver(queue).observe(document.getElementById("view"),{childList:true,subtree:true});new MutationObserver(queue).observe(document.getElementById("nav"),{childList:true,subtree:true});decorate();
})();
