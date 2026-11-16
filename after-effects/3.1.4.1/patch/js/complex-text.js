window.YaguaComplex=(function(){
 function stop(){}
 function render(root,api){
  var h=api.h,v=api.S.fluid=api.S.fluid||{customize:false,text1:'YAGUANO',text2:'MOTION'};
  root.appendChild(h('div',{class:'card'},h('div',{class:'preview-head'},h('b',{},'Vapor Text · original AE2024')),h('div',{class:'fluid-preview-stage'},h('div',{class:'fluid-placeholder'},h('img',{src:'assets/fluido-reference.png',alt:'Referencia original del efecto fluido',class:'fluid-reference'})))));
  root.appendChild(h('div',{class:'card'},h('b',{},'Crear una instancia independiente'),h('p',{class:'desc'},'Se conserva el AEP original, sus precomposiciones, mapas, efectos y keyframes. Requiere la fuente Impact.'),
   h('label',{class:'check-line'},h('input',{type:'checkbox',checked:v.customize,onchange:function(e){v.customize=e.target.checked;api.save();}}),'Cambiar los dos textos de la copia'),
   h('label',{class:'fluid-text-label'},'Texto 01',h('input',{type:'text',value:v.text1,'aria-label':'Texto 01 del efecto fluido',oninput:function(e){v.text1=e.target.value;api.save();}})),
   h('label',{class:'fluid-text-label'},'Texto 02',h('input',{type:'text',value:v.text2,'aria-label':'Texto 02 del efecto fluido',oninput:function(e){v.text2=e.target.value;api.save();}})),
   h('div',{class:'btns'},h('button',{class:'btn pri',onclick:function(){api.run('ytFluidCreate',{insert:true,customize:v.customize,text1:v.text1,text2:v.text2});}},'Insertar en composición activa'),h('button',{class:'btn',onclick:function(){api.run('ytFluidCreate',{insert:false,customize:v.customize,text1:v.text1,text2:v.text2});}},'Crear copia editable'),h('button',{class:'btn',onclick:function(){api.run('ytFluidOpen');}},'Abrir original importado')),
   h('p',{class:'desc'},'La imagen muestra la referencia original. Los textos personalizados se aplican a una copia. La fuente y la gestión de color del proyecto receptor influyen en el acabado.')));

 }
 return {render:render,stop:stop};
})();
