// Native adapter based on the user's AE Lab v0.1; source poses are sampled unchanged at 60 fps.
var YaguaNativeLab=(function(){
 function rgb(s) {var v=s.match(/[\d.]+/g);return [Number(v[0])/255,Number(v[1])/255,Number(v[2])/255];}
 // M = R(u) * diag(s1,s2) * R(v). Three ordinary AE transforms preserve skew too.
 function affine(m) {
  var a=m[0],b=m[1],c=m[2],d=m[3],v=.5*Math.atan2(2*(a*c+b*d),a*a+b*b-c*c-d*d),cv=Math.cos(v),sv=Math.sin(v);
  var x=a*cv+c*sv,y=b*cv+d*sv,s1=Math.sqrt(x*x+y*y),s2=s1>1e-10?(a*d-b*c)/s1:0,u=s1>1e-10?Math.atan2(y,x):0;
  return {u:u*180/Math.PI,v:-v*180/Math.PI,s:[s1*100,s2*100]};
 }
 // Keep the original piecewise-linear functions; only redundant samples are removed.
 var EPS=1e-9;
 function scalar(v){return typeof v==='number';}
 function same(a,b){var i;if(scalar(a))return Math.abs(a-b)<=EPS;for(i=0;i<a.length;i++)if(Math.abs(a[i]-b[i])>EPS)return false;return true;}
 function onLine(a,b,c,u){var i;if(scalar(a))return Math.abs(b-(a+(c-a)*u))<=EPS;for(i=0;i<a.length;i++)if(Math.abs(b[i]-(a[i]+(c[i]-a[i])*u))>EPS)return false;return true;}
 function compact(times,values,spatial){
  var i,j,last=0,constant=true,keep=[0],tt=[],vv=[];
  for(i=1;i<values.length;i++)if(!same(values[0],values[i])){constant=false;break;}
  if(constant)return{value:values[0],times:[],values:[]};
  // Preserve every spatial knot: AE may derive spatial Bezier tangents from neighbors.
  if(spatial)return{times:times.slice(0),values:values.slice(0)};
  for(i=1;i<values.length-1;i++)if(!onLine(values[last],values[i],values[i+1],(times[i]-times[last])/(times[i+1]-times[last]))){keep.push(i);last=i;}
  keep.push(values.length-1);
  // Recheck every original knot against the final segments so error never accumulates.
  var segment=0,valid=true;
  for(i=0;i<values.length;i++){
   while(segment<keep.length-2&&i>keep[segment+1])segment++;
   var left=keep[segment],right=keep[segment+1];
   if(!onLine(values[left],values[i],values[right],(times[i]-times[left])/(times[right]-times[left]))){valid=false;break;}
  }
  if(!valid){for(i=0;i<times.length;i++){tt.push(times[i]);vv.push(values[i]);}}
  else for(i=0;i<keep.length;i++){tt.push(times[keep[i]]);vv.push(values[keep[i]]);}
  return{times:tt,values:vv};
 }
 function applyTrack(property,track,stats,denseCount){
  stats.denseNumericKeys+=denseCount;
  if(!track.times.length){property.setValue(track.value);stats.staticProperties++;return;}
  property.setValuesAtTimes(track.times,track.values);stats.numericKeys+=track.times.length;
  for(var i=1;i<=property.numKeys;i++)property.setInterpolationTypeAtKey(i,KeyframeInterpolationType.LINEAR,KeyframeInterpolationType.LINEAR);
 }
 function keys(property,times,values,stats){applyTrack(property,compact(times,values,property.isSpatial===true),stats,times.length);}
 function nullLayer(comp,name){var n=comp.layers.addNull(comp.duration);n.name=name;n.transform.anchorPoint.setValue([0,0]);n.transform.position.setValue([0,0]);n.guideLayer=false;return n;}
 function glyphPlan(data,rec,g,times){
  var list=[],i,j,r,ch,positions,alphas,colors,previous,color;
  for(j=0;j<g.chars.length;j++){
   positions=[];alphas=[];colors=[];previous=null;
   for(i=0;i<data.frames.length;i++){
    r=rec.frames[i];ch=r&&r.chars[j]?r.chars[j]:{x:0,y:0,opacity:0,color:'rgb(255,255,255)'};
    positions.push([g.x+g.chars[j].x+ch.x,g.y+g.chars[j].y+ch.y]);alphas.push(ch.opacity*100);color=rgb(ch.color);
    if(previous===null||!same(previous,color)){colors.push({time:times[i],value:color});previous=color;}
   }
   list.push({text:g.chars[j].text,position:compact(times,positions,true),opacity:compact(times,alphas),colors:colors});
  }
  return list;
 }
 function textPiece(data,id,plans,folder,duration,stats){
  var piece=app.project.items.addComp(id,data.width,data.height,1,duration,data.fps);piece.parentFolder=folder;
  for(var j=0;j<plans.length;j++){
   var plan=plans[j],charLayer=piece.layers.addText(plan.text),source=charLayer.property('ADBE Text Properties').property('ADBE Text Document'),doc=source.value;
   doc.font=data.font;doc.fontSize=data.fontSize;doc.applyFill=true;doc.fillColor=plan.colors[0].value;doc.applyStroke=false;doc.tracking=0;source.setValue(doc);
   var actualFont=source.value;
   if(actualFont.font!==data.font)throw Error('Instala primero GeistLab760.ttf desde assets/fonts. AE ha sustituido la fuente.');
   try{if(actualFont.fontObject&&actualFont.fontObject.isSubstitute)throw Error('Instala primero GeistLab760.ttf desde assets/fonts.');}catch(fontError){if(String(fontError).indexOf('Instala primero')>=0)throw fontError;}
   charLayer.transform.anchorPoint.setValue([0,0]);
   if(plan.colors.length>1)for(var ci=0;ci<plan.colors.length;ci++){doc=source.value;doc.fillColor=plan.colors[ci].value;source.setValueAtTime(plan.colors[ci].time,doc);stats.textDocumentKeys++;}
   else stats.staticTextDocuments++;
   applyTrack(charLayer.transform.position,plan.position,stats,data.frames.length);applyTrack(charLayer.transform.opacity,plan.opacity,stats,data.frames.length);stats.glyphLayers++;
  }
  stats.pieceCompositions++;return piece;
 }
 function buildNative(data,options) {
  options=options||{};var receiving=app.project.activeItem;
  if(!app.project)app.newProject();var folder=app.project.items.addFolder('YaguaTool Lab - '+data.name),duration=data.frames.length/data.fps;
  var comp=app.project.items.addComp('YaguaTool - '+data.name,data.width,data.height,1,duration,data.fps);comp.parentFolder=folder;comp.bgColor=[.06,.06,.07];
  var stats={encoding:'sparse-native-v1',records:0,pieceCompositions:0,reusedPieceCompositions:0,glyphLayers:0,auxiliaryLayers:0,flattenedTransforms:0,blurEffects:0,omittedZeroBlurs:0,staticProperties:0,staticTextDocuments:0,textDocumentKeys:0,numericKeys:0,denseNumericKeys:0};
  var records={},order=[],pieceCache={},i,j,k,r,id,times=[];
  for(i=0;i<data.frames.length;i++){times.push(i/data.fps);for(j=0;j<data.frames[i].length;j++){r=data.frames[i][j];if(!records[r.id]){records[r.id]={piece:r.piece,z:r.z,frames:[]};order.push(r.id);}records[r.id].frames[i]=r;}}
  order.sort(function(a,b){return records[a].z-records[b].z;});
  for(k=0;k<order.length;k++){
   id=order[k];var rec=records[id],g=data.geometry[rec.piece],origin=g.origin,first=null,firstIndex=-1,lastIndex=-1;
   var plans=glyphPlan(data,rec,g,times),signature=JSON.stringify(plans),piece=pieceCache[signature];
   if(piece)stats.reusedPieceCompositions++;
   else{piece=textPiece(data,id,plans,folder,duration,stats);pieceCache[signature]=piece;}
   var layer=comp.layers.add(piece);layer.name=id;layer.transform.anchorPoint.setValue([g.x+origin[0],g.y+origin[1]]);layer.transform.position.setValue([0,0]);
   var pos=[],rot=[],inner=[],combined=[],scales=[],opacity=[],blurs=[],uniform=true,zeroInner=true,zeroBlur=true;
   for(i=0;i<data.frames.length;i++){
    r=rec.frames[i];if(r){if(firstIndex<0){firstIndex=i;first=r;}lastIndex=i;}else r={m:[1,0,0,1,0,0],opacity:0,blur:0};
    var decomposition=affine(r.m);
    pos.push([g.x+origin[0]+r.m[4],g.y+origin[1]+r.m[5]]);rot.push(decomposition.u);inner.push(decomposition.v);combined.push(decomposition.u+decomposition.v);scales.push(decomposition.s);opacity.push(r.opacity*100);blurs.push(r.blur);
    if(Math.abs(decomposition.s[0]-decomposition.s[1])>EPS)uniform=false;
    if(Math.abs(decomposition.v)>EPS)zeroInner=false;
    if(Math.abs(r.blur)>EPS)zeroBlur=false;
   }
   // Ru*S*Rv = R(u+v)*S only for uniform S; v=0 is safe for any scale.
   // These identities hold between samples too, without unwrapping either rotation.
   if(uniform||zeroInner){
    keys(layer.transform.position,times,pos,stats);keys(layer.transform.rotation,times,uniform?combined:rot,stats);keys(layer.transform.scale,times,scales,stats);stats.flattenedTransforms++;
   }else{
    var scaleNode=nullLayer(comp,id+' scale'),rotationNode=nullLayer(comp,id+' position');
    layer.parent=scaleNode;scaleNode.parent=rotationNode;layer.transform.position.setValue([0,0]);scaleNode.transform.position.setValue([0,0]);
    keys(rotationNode.transform.position,times,pos,stats);keys(rotationNode.transform.rotation,times,rot,stats);keys(scaleNode.transform.scale,times,scales,stats);keys(layer.transform.rotation,times,inner,stats);
    scaleNode.shy=true;rotationNode.shy=true;stats.auxiliaryLayers+=2;
   }
   keys(layer.transform.opacity,times,opacity,stats);
   if(!zeroBlur){var fx=layer.property('ADBE Effect Parade').addProperty('ADBE Gaussian Blur 2');keys(fx.property(1),times,blurs,stats);stats.blurEffects++;}else stats.omittedZeroBlurs++;
   // Keep the complete linear fade at each boundary, including fractional frames.
   layer.inPoint=Math.max(0,(firstIndex-1)/data.fps);layer.outPoint=Math.min(duration,(lastIndex===data.frames.length-1?data.frames.length:lastIndex+1)/data.fps);
   if(first&&first.blend==='ADD')try{layer.blendingMode=BlendingMode.ADD;}catch(ignoreBlend){}
   stats.records++;
  }
  comp.hideShyLayers=true;comp.comment='YaguaTool Motion Lab v0.9 | '+JSON.stringify({parameters:data.parameters,sequence:data.sequence,holdMs:data.holdMs,sourceEngine:data.sourceEngine||'AE Lab v0.1',nativePerformance:stats});
  if(options.cacheOnly)return comp;
  if(options.editable)return YaguaLabRig.create(comp,data,options,receiving);
  if(options.insert){if(!(receiving instanceof CompItem))throw Error("Abre una composición antes de insertar la animación.");var inserted=receiving.layers.add(comp);inserted.startTime=receiving.time;inserted.name="YaguaTool Lab · "+data.name;receiving.openInViewer();}else comp.openInViewer();return comp;
 }

 function build(data,options){
  var previous,restore=false;
  try{
   if(typeof app.disableRendering==='boolean'){previous=app.disableRendering;app.disableRendering=true;restore=true;}
   return buildNative(data,options);
  }finally{if(restore)app.disableRendering=previous;}
 }

 function safeBuild(data,options){
  var before={},i,original=app.project.activeItem;for(i=1;i<=app.project.numItems;i++)before[app.project.item(i).id]=true;
  try{return build(data,options);}catch(e){for(i=app.project.numItems;i>=1;i--)if(!before[app.project.item(i).id])try{app.project.item(i).remove();}catch(ignoreRemove){}if(original instanceof CompItem)original.openInViewer();throw e;}
 }
 function validate(data){
  if(!data||data.schema!==1||!data.frames||!data.frames.length||data.fps!==60||!data.geometry)throw Error("Formato de animación nativa no válido.");
  if(!data.text||!String(data.text).replace(/\s/g,""))throw Error("Escribe algún carácter visible.");
 }
 Animix.api.ytLabBuild=function(o){
  if(o.insert&&!(app.project.activeItem instanceof CompItem))throw Error("Abre una composición antes de insertar.");
  var file=new File(o.path),data=YaguaHost.read(file),created,before={},i;
  validate(data);for(i=1;i<=app.project.numItems;i++)before[app.project.item(i).id]=true;
  try{created=build(data,o);return{msg:"Animación creada a 60 fps: "+created.name,data:{id:created.id,name:created.name,frames:data.frames.length}};}
  catch(e){for(i=app.project.numItems;i>=1;i--)if(!before[app.project.item(i).id])try{app.project.item(i).remove();}catch(ignoreRemove){}throw e;}
  finally{if(o.temporary&&file.fsName.indexOf(Folder.temp.fsName)===0&&file.name.indexOf("YaguaTool_Lab_")===0)try{file.remove();}catch(ignoreTemp){}}
 };
 Animix.api.ytLabDefault=function(o){
  if(!/^pack-[a-z0-9-]+$/.test(o.id))throw Error("Preset no válido.");
  var file=new File(YaguaHost.root+"/lab-data/"+o.id+".json"),data=YaguaHost.read(file);validate(data);var c=safeBuild(data,{editable:true});
  return{msg:"Original nativo AE Lab v0.1 creado: "+c.name,data:{id:c.id}};
 };
 return{build:build,affine:affine,safeBuild:safeBuild};
})();
