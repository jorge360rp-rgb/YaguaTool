// Motion Lab: conservative native text animator adapter. No project items are created.
var YaguaLabSelected=(function(){
 var PREFIX='YaguaTool Lab directo | ',EPS=1e-6;
 function fail(s){throw Error(s);}
 function textSelection(){
  var c=YaguaHost.comp(),ls=c.selectedLayers;
  if(ls.length!==1||!ls[0].property('ADBE Text Properties'))fail('Selecciona una única capa de texto.');
  if(ls[0].locked)fail('Desbloquea la capa de texto antes de modificar Motion Lab.');
  return{comp:c,layer:ls[0]};
 }
 function selected(){
  var x=textSelection(),c=x.comp,l=x.layer,source=l.property('ADBE Text Properties').property('ADBE Text Document');
  if(source.numKeys||source.expressionEnabled)fail('El modo directo necesita texto sin keyframes ni expresión en Texto de origen.');
  if(l.timeRemapEnabled||l.stretch!==100)fail('El modo directo necesita una capa sin remapeo y con estiramiento al 100 %.');
  var d=source.value;
  if(d.boxText)fail('El modo directo inicial admite texto de punto; el texto de párrafo requiere comprobar su distribución.');
  if(!d.text||!d.text.replace(/\s/g,''))fail('La capa de texto está vacía.');
  if(/[\r\n\u0300-\u036f\u0590-\u08ff\ud800-\udfff]/.test(d.text))fail('El modo directo inicial admite una línea sin escritura compleja ni emojis. Usa el compositor para este texto.');
  if(!isFinite(d.fontSize)||d.fontSize<=0)fail('No se puede determinar un tamaño de fuente uniforme.');
  // Newer AE exposes character ranges: reject mixed sizes rather than applying a wrong scale.
  if(d.characterRange)for(var i=0;i<d.text.length;i++)try{if(Math.abs(d.characterRange(i,i+1).fontSize-d.fontSize)>EPS)fail('El modo directo necesita un tamaño de fuente uniforme.');}catch(e){if(String(e).indexOf('uniforme')>=0)throw e;}
  return{comp:c,layer:l,doc:d};
 }
 function context(){var x=selected();return{compId:x.comp.id,layerId:x.layer.id,layerIndex:x.layer.index,text:String(x.doc.text),font:x.doc.font,fontSize:x.doc.fontSize,start:x.comp.time,name:x.layer.name};}
 function equals(a,b){return JSON.stringify(a)===JSON.stringify(b);}
 function track(p,ts,vs){
  var constant=true,i;for(i=1;i<vs.length;i++)if(!equals(vs[i],vs[0])){constant=false;break;}
  if(constant){p.setValue(vs[0]);return;}
  p.setValuesAtTimes(ts,vs);
  for(i=1;i<=p.numKeys;i++){
   p.setInterpolationTypeAtKey(i,KeyframeInterpolationType.LINEAR,KeyframeInterpolationType.LINEAR);
   if(p.isSpatial)try{p.setSpatialAutoBezierAtKey(i,false);p.setSpatialContinuousAtKey(i,false);p.setSpatialTangentsAtKey(i,[0,0,0],[0,0,0]);}catch(ignoreSpatial){}
  }
 }
 function normalize(s){return String(s).replace(/\u00a0/g,' ');}
 function plan(data,ctx){
  if(!data||data.schema!==1||data.fps!==60||!data.geometry||!data.frames||!data.frames.length||!isFinite(data.fontSize)||data.fontSize<=0)fail('Muestreo de Motion Lab no válido.');
  if(normalize(data.text)!==normalize(ctx.text))fail('El texto muestreado no coincide con la capa seleccionada.');
  var maps=[],cursor=0,i,j,g,t,index,seen={},ratio=ctx.fontSize/data.fontSize,tracks=[];
  for(i=0;i<data.geometry.length;i++){
   g=data.geometry[i];maps[i]=[];
   if(!ctx.text.slice(cursor).replace(/\s/g,''))cursor=0;
   for(j=0;j<g.chars.length;j++){
    t=normalize(g.chars[j].text);index=normalize(ctx.text).indexOf(t,cursor);
    if(t.length!==1||index<0||ctx.text.slice(cursor,index).replace(/\s/g,''))fail('La distribución de caracteres no es compatible con la capa.');
    maps[i].push(index);seen[index]=true;cursor=index+1;
   }
  }
  for(i=0;i<ctx.text.length;i++){
   if(!/\s/.test(ctx.text.charAt(i))&&!seen[i])fail('El muestreo no incluye todos los caracteres de la capa.');
   if(seen[i])tracks.push({index:i,position:[],opacity:[],blur:[],color:[]});
  }
  var ts=[],frame,byChar,r,m,ch,entry,slot,color;
  for(i=0;i<data.frames.length;i++){
   ts.push(ctx.start+i/60);frame=data.frames[i];byChar={};
   for(j=0;j<frame.length;j++){
    r=frame[j];if(!/^(s\d+_)?main_\d+$/.test(r.id))fail('Este ajuste incluye Ghost, Echo o resplandor. Usa el compositor completo; no se eliminarán esos efectos del preset.');
    m=r.m;
    if(!m||m.length!==6||Math.abs(m[0]-1)>EPS||Math.abs(m[1])>EPS||Math.abs(m[2])>EPS||Math.abs(m[3]-1)>EPS)fail('Este ajuste incluye giro, escala o deformación. El modo directo inicial conserva solo traslación, opacidad, tracking, fill y desenfoque; usa el compositor completo para este preset.');
    if(!maps[r.piece]||r.chars.length!==maps[r.piece].length)fail('La geometría del muestreo ha cambiado.');
    for(var k=0;k<r.chars.length;k++){
     ch=r.chars[k];index=maps[r.piece][k];
     if(byChar[index])fail('Hay pases superpuestos: se necesita el compositor completo.');
     color=String(ch.color).match(/[\d.]+/g);
     if(!color||color.length<3)fail('Color de relleno no válido.');
     entry={p:[(m[4]+ch.x)*ratio,(m[5]+ch.y)*ratio,0],o:r.opacity*ch.opacity*100,b:r.blur*ratio,c:[Number(color[0])/255,Number(color[1])/255,Number(color[2])/255]};
     if(!isFinite(entry.p[0])||!isFinite(entry.p[1])||!isFinite(entry.o)||!isFinite(entry.b))fail('El muestreo contiene valores no válidos.');
     byChar[index]=entry;
    }
   }
   for(j=0;j<tracks.length;j++){
    slot=tracks[j];entry=byChar[slot.index]||{p:[0,0,0],o:0,b:0,c:[1,1,1]};
    slot.position.push(entry.p);slot.opacity.push(entry.o);slot.blur.push([entry.b,entry.b]);slot.color.push(entry.c);
   }
  }
  if(ctx.start<0||ctx.start>=ctx.outPoint||ts[ts.length-1]>ctx.outPoint+EPS||ctx.start<ctx.inPoint-EPS)fail('La animación no cabe desde el cabezal hasta el final de la capa. Amplía la capa o mueve el cabezal.');
  var params=data.parameters||{},fill=false;
  for(i=1;i<=5;i++)if(Number(params[i===1?'fill':'fill'+i])>0)fill=true;
  return{times:ts,tracks:tracks,fill:fill};
 }
 function apply(data,expected){
  if(!expected||expected.layerId===undefined||expected.compId===undefined)fail('Lee de nuevo la capa seleccionada antes de aplicar.');
  var x=selected(),now=context(),key;
  for(key in expected)if(expected.hasOwnProperty(key)&&!equals(now[key],expected[key]))fail('La selección, el texto, la fuente o el cabezal han cambiado. Vuelve a aplicar.');
  now.inPoint=x.layer.inPoint;now.outPoint=x.layer.outPoint;
  var p=plan(data,now),anims=x.layer.property('ADBE Text Properties').property('ADBE Text Animators'),added=[],old=[],i,j,a,ap,selectors,sel,adv;
  for(i=1;i<=anims.numProperties;i++)if(anims.property(i).name.indexOf(PREFIX)===0)old.push(i);
  try{
   for(i=0;i<p.tracks.length;i++){
    var t=p.tracks[i];a=anims.addProperty('ADBE Text Animator');added.push(a.propertyIndex);a.name=PREFIX+data.name+' | '+(t.index+1);
    ap=a.property('ADBE Text Animator Properties');
    track(ap.addProperty('ADBE Text Position 3D'),p.times,t.position);
    // A full-strength range selector uses the animator opacity target (100 visible, 0 hidden).
    track(ap.addProperty('ADBE Text Opacity'),p.times,t.opacity);
    var hasBlur=false;for(j=0;j<t.blur.length;j++)if(t.blur[j][0]>EPS){hasBlur=true;break;}
    if(hasBlur)track(ap.addProperty('ADBE Text Blur'),p.times,t.blur);
    if(p.fill)track(ap.addProperty('ADBE Text Fill Color'),p.times,t.color);
    selectors=a.property('ADBE Text Selectors');sel=selectors.numProperties?selectors.property(1):selectors.addProperty('ADBE Text Selector');
    adv=sel.property('ADBE Text Range Advanced');adv.property('ADBE Text Range Units').setValue(2);adv.property('ADBE Text Range Type2').setValue(1);adv.property('ADBE Text Selector Smoothness').setValue(0);
    sel.property('ADBE Text Index Start').setValue(t.index);sel.property('ADBE Text Index End').setValue(t.index+1);
   }
  }catch(e){for(i=added.length-1;i>=0;i--)try{anims.property(added[i]).remove();}catch(ignoreRemove){}throw e;}
  // Replace only our previous direct animators after the new set has been built successfully.
  for(i=old.length-1;i>=0;i--)anims.property(old[i]).remove();
  return{msg:'Aplicado a «'+x.layer.name+'»: una capa de texto, sin precomposiciones. Comprueba el resultado con la preview de AE.',data:{layerId:x.layer.id,animators:p.tracks.length,start:now.start,duration:(p.times.length-1)/60}};
 }
 Animix.api.ytLabSelectedContext=function(){return{msg:'Texto seleccionado leído.',data:context()};};
 Animix.api.ytLabApplySelected=function(o){
  var f=new File(o.path);
  try{return apply(YaguaHost.read(f),o.context||{});}
  finally{if(o.temporary&&f.fsName.indexOf(Folder.temp.fsName)===0&&f.name.indexOf('YaguaTool_Lab_')===0)try{f.remove();}catch(ignoreTemp){}}
 };
 Animix.api.ytLabRemoveSelected=function(){var x=textSelection(),a=x.layer.property('ADBE Text Properties').property('ADBE Text Animators'),n=0;for(var i=a.numProperties;i>=1;i--)if(a.property(i).name.indexOf(PREFIX)===0){a.property(i).remove();n++;}return{msg:n+' animadores de Motion Lab directo retirados.'};};
 var previewFolder=null;
 function clearPreview(){if(previewFolder&&previewFolder.exists){var files=previewFolder.getFiles();for(var i=0;i<files.length;i++)if(files[i] instanceof File)files[i].remove();previewFolder.remove();}previewFolder=null;}
 Animix.api.ytLabPreviewSelected=function(o){
  var c=YaguaHost.comp(),start=Number(o.start),span=Number(o.duration),oldTime=c.time,oldResolution=c.resolutionFactor,oldRendering=app.disableRendering,frames=[],folder;
  if(!isFinite(start))start=c.time;if(!isFinite(span)||span<=0)span=2;
  start=Math.max(0,start);span=Math.min(span,c.duration-start);
  if(span<=0)fail('No hay fotogramas visibles desde el cabezal.');
  clearPreview();folder=new Folder(Folder.temp.fsName+'/YaguaTool_LabPreview_'+(new Date()).getTime());
  if(!folder.create())fail('No se pudo crear la carpeta temporal de preview.');previewFolder=folder;
  try{
   c.resolutionFactor=[4,4];if(typeof oldRendering==='boolean')app.disableRendering=false;
   var count=32;
   for(var i=0;i<count;i++){
    var t=Math.min(c.duration-c.frameDuration,start+span*i/count),file=new File(folder.fsName+'/frame-'+i+'.png');
    c.saveFrameToPng(t,file);if(!file.exists)fail('AE no ha guardado el fotograma de preview.');frames.push(YaguaHost.uri(file));
   }
   return{msg:'Preview renderizada por AE · composición completa a 1/4 de resolución.',data:{frames:frames,fps:count/span,duration:span,start:start}};
  }catch(e){clearPreview();throw e;}
  finally{c.time=oldTime;c.resolutionFactor=oldResolution;if(typeof oldRendering==='boolean')app.disableRendering=oldRendering;}
 };
 Animix.api.ytLabClearSelectedPreview=function(){clearPreview();return{msg:'Preview temporal eliminada.'};};
 return{plan:plan,apply:apply,context:context};
})();
