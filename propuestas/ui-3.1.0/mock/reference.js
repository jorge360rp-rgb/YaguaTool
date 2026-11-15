(function(){'use strict';
 const root=document.documentElement,nav=document.getElementById('nav'),toggle=document.getElementById('nav-toggle'),shade=document.getElementById('nav-shade'),mq=matchMedia('(max-width:720px)');
 const key=()=>mq.matches?'yaguano.nav.narrow':'yaguano.nav.wide';
 function stored(){try{const v=localStorage.getItem(key());return v===null?!mq.matches:v==='true';}catch(e){return !mq.matches;}}
 function setOpen(value,persist){root.dataset.navOpen=String(value);toggle.setAttribute('aria-expanded',String(value));toggle.setAttribute('aria-label',value?'Contraer navegación':'Desplegar navegación');toggle.title=toggle.getAttribute('aria-label');shade.hidden=!value||!mq.matches;window.YaguanoNavIndicator?.update();if(persist)try{localStorage.setItem(key(),String(value));}catch(e){} }
 nav.prepend(toggle);
 toggle.addEventListener('click',()=>setOpen(root.dataset.navOpen!=='true',true));shade.addEventListener('click',()=>{setOpen(false,true);toggle.focus();});mq.addEventListener('change',()=>setOpen(stored(),false));setOpen(stored(),false);
 // The rail stays in the state the user chooses, at every width.

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
 function decorate(){document.querySelectorAll('input[type=range]').forEach(paint);
 document.querySelectorAll('.yt-lab button').forEach(b=>b.classList.add('halo'));
 document.querySelectorAll('.yt-lab select,.yt-lab textarea,.yt-lab input[type=text],.yt-lab input[type=number]').forEach(input=>{if(input.parentElement.classList.contains('lab-field'))return;const wrap=document.createElement('span');wrap.className='lab-field halo';input.before(wrap);wrap.append(input);});}

 new MutationObserver(decorate).observe(document.getElementById('view'),{childList:true,subtree:true});decorate();
 const indicator=document.createElement('div');indicator.className='nav-selection halo';indicator.setAttribute('aria-hidden','true');nav.prepend(indicator);
 let first=true;
 function positionIndicator(){const active=nav.querySelector('button[data-page][aria-current=page]');if(!active)return;
 indicator.style.transition=first?'none':'';
 // Read layout geometry, never transformed press geometry. Both layers share this box.
 indicator.style.width=active.offsetWidth+'px';indicator.style.height=active.offsetHeight+'px';indicator.style.transform='translate3d('+active.offsetLeft+'px,'+active.offsetTop+'px,0)';
 indicator.dataset.lit=String(active.matches(':hover,:focus-visible'));first=false;
 }
 function lightSelected(){const active=nav.querySelector('button[data-page][aria-current=page]');indicator.dataset.lit=String(!!active&&active.matches(':hover,:focus-visible'));}
 ['pointerover','pointerout','focusin','focusout'].forEach(type=>nav.addEventListener(type,lightSelected));

 window.YaguanoNavIndicator={update:positionIndicator};new ResizeObserver(positionIndicator).observe(nav);window.addEventListener('resize',positionIndicator);document.fonts.ready.then(positionIndicator);positionIndicator();
 const themeButton=document.getElementById('theme-toggle');
 const sun='<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="4"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2"/></svg>';
 const moon='<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M20 15.5A8.5 8.5 0 0 1 8.5 4a8.5 8.5 0 1 0 11.5 11.5Z"/></svg>';
 function setTheme(theme){const light=theme==='light';root.dataset.theme=light?'light':'dark';window.dispatchEvent(new Event('yaguano-theme-change'));themeButton.innerHTML=light?moon:sun;themeButton.setAttribute('aria-pressed',String(light));themeButton.setAttribute('aria-label',light?'Activar tema oscuro':'Activar tema claro');themeButton.title=themeButton.getAttribute('aria-label');try{localStorage.setItem('yaguano.theme',root.dataset.theme);}catch(e){}}
 let initialTheme='dark';try{initialTheme=localStorage.getItem('yaguano.theme')||'dark';}catch(e){}setTheme(initialTheme);
 themeButton.addEventListener('click',()=>setTheme(root.dataset.theme==='light'?'dark':'light'));
 window.YaguanoReference={setOpen(value){setOpen(value,true)},isOpen(){return root.dataset.navOpen==='true'}};
})();
