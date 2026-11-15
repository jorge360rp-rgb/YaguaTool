(function(){'use strict';
 const root=document.documentElement,nav=document.getElementById('nav'),toggle=document.getElementById('nav-toggle'),shade=document.getElementById('nav-shade'),mq=matchMedia('(max-width:720px)');
 const key=()=>mq.matches?'yaguano.nav.narrow':'yaguano.nav.wide';
 function stored(){try{const v=localStorage.getItem(key());return v===null?!mq.matches:v==='true';}catch(e){return !mq.matches;}}
 function setOpen(value,persist){root.dataset.navOpen=String(value);toggle.setAttribute('aria-expanded',String(value));toggle.setAttribute('aria-label',value?'Contraer navegación':'Desplegar navegación');toggle.title=toggle.getAttribute('aria-label');shade.hidden=!value||!mq.matches;if(persist)try{localStorage.setItem(key(),String(value));}catch(e){} }
 const brand=document.createElement('div');brand.className='nav-brand';brand.innerHTML='<img src="assets/brand-mark.png" alt="" width="20" height="20"><span>Yaguano</span>';nav.prepend(brand);
 toggle.addEventListener('click',()=>setOpen(root.dataset.navOpen!=='true',true));shade.addEventListener('click',()=>{setOpen(false,true);toggle.focus();});mq.addEventListener('change',()=>setOpen(stored(),false));setOpen(stored(),false);
 nav.addEventListener('click',e=>{if(mq.matches&&e.target.closest('button')){setOpen(false,false);toggle.focus();}});
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&mq.matches&&root.dataset.navOpen==='true'){setOpen(false,true);toggle.focus();}});
 let pressed=null,focused=null;
 function release(){if(pressed)pressed.classList.remove('is-down');pressed=null;}
 function press(el){release();if(el&&!el.disabled&&el.getAttribute('aria-disabled')!=='true'){pressed=el;el.classList.add('is-down');}}
 document.addEventListener('pointerdown',e=>{if(e.button===0&&!e.target.closest('input,select,textarea'))press(e.target.closest('button,summary,.card,.media-frame,.preset,.tool-grid button'));});
 ['pointerup','pointercancel','lostpointercapture'].forEach(type=>document.addEventListener(type,release));window.addEventListener('blur',release);
 document.addEventListener('keydown',e=>{if((e.key===' '||e.key==='Enter')&&!e.repeat&&e.target.matches('button,summary'))press(e.target);});
 document.addEventListener('keyup',e=>{if(e.key===' '||e.key==='Enter')release();});
 document.addEventListener('focusin',e=>{if(focused)focused.classList.remove('is-focus');focused=e.target.closest('.halo');if(focused&&e.target.matches(':focus-visible'))focused.classList.add('is-focus');});
 document.addEventListener('focusout',()=>{if(focused)focused.classList.remove('is-focus');focused=null;});
 function paint(input){const min=Number(input.min)||0,max=Number(input.max)||100;input.style.setProperty('--range-progress',Math.max(0,Math.min(100,(Number(input.value)-min)/(max-min||1)*100))+'%');}
 document.addEventListener('input',e=>{if(e.target.matches('input[type=range]'))paint(e.target);else if(e.target.matches('input[type=number]')){const range=e.target.closest('.range-line')?.querySelector('input[type=range]');if(range)paint(range);}});
 function decorate(){document.querySelectorAll('input[type=range]').forEach(paint);}
 new MutationObserver(decorate).observe(document.getElementById('view'),{childList:true,subtree:true});decorate();
 window.YaguanoReference={setOpen(value){setOpen(value,true)},isOpen(){return root.dataset.navOpen==='true'}};
})();
