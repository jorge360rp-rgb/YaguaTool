/* Synchronize a rig only after an explicit panel action. Never poll After Effects. */
window.YaguaLabLive=(function(){
 'use strict';
 var running=false,busy=false,generation=0,pending='',failed='',lastMessage='';
 function report(status,msg){if(status+'|'+msg===lastMessage)return;lastMessage=status+'|'+msg;document.dispatchEvent(new CustomEvent('yagua-lab-sync',{detail:{status:status,message:msg}}));}
 function start(){if(running)return;running=true;report('manual','Motion Lab · sincronización manual. Tras editar TEXTO o Preset, pulsa Sincronizar Motion Lab.');}
 function stop(){running=false;generation++;}
 function pause(){stop();report('paused','Motion Lab · sincronización cancelada. Los controles Global siguen funcionando.');}
 async function sync(){
  if(busy)return{ok:false,msg:'Ya hay una sincronización en curso.'};
  if(!running)start();
  if(YaguaAEBridge.getState().status!=='ready'){report('error','Conecta After Effects antes de sincronizar.');return{ok:false};}
  var token=generation;busy=true;failed='';
  function cancelled(){return !running||token!==generation;}
  report('working','Motion Lab · leyendo el texto y los controles seleccionados…');
  try{
   const reply=await YaguaAEBridge.call('ytLabRigState',{});if(cancelled())return{ok:false,cancelled:true};
   if(!reply.ok)throw Error(reply.msg);const rig=reply.data;
   if(!rig){pending='';report('manual','Motion Lab · selecciona una composición o controlador de Motion Lab y pulsa Sincronizar.');return{ok:true,data:null};}
   pending=rig.id+'|'+rig.signature;
   if(rig.signature===rig.applied){pending='';report('ready','Motion Lab · texto y controles sincronizados');return{ok:true,unchanged:true};}
   report('working','Motion Lab · actualizando animación. Espera a que termine antes de editar en AE…');
   const options=JSON.parse(JSON.stringify(rig.options)),preset=(window.YMX_CATALOG||[]).find(p=>p.id===options.presetId||(p.pack===options.data.pack&&p.name===options.data.name));
   if(!preset)throw Error('No se encuentra el preset original para sincronizar.');
   options.data={name:preset.name,pack:preset.pack,kind:preset.smartKind};options.presetId=preset.id;
   if(!options.text.trim())throw Error('Escribe algún carácter visible en TEXTO.');
   const baked=await YaguaLabBake.capture(options,null,cancelled);if(cancelled())return{ok:false,cancelled:true};
   const temp=await YaguaAEBridge.call('tempDir',{});if(cancelled())return{ok:false,cancelled:true};if(!temp.ok)throw Error(temp.msg);
   const path=temp.data+'/YaguaTool_Lab_Live_'+Date.now()+'.json',fs=window.cep&&window.cep.fs;if(!fs)throw Error('CEP no permite guardar el muestreo temporal.');
   const written=fs.writeFile(path,JSON.stringify(baked));if(written.err)throw Error('No se ha podido escribir el muestreo temporal.');
   try{
    if(cancelled())return{ok:false,cancelled:true};
    const result=await YaguaAEBridge.call('ytLabRigUpdate',{id:rig.id,path:path,signature:rig.signature,temporary:true});
    if(cancelled())return{ok:false,cancelled:true};if(!result.ok)throw Error(result.msg);
    pending='';
    if(result.data&&result.data.stale){report('manual','Motion Lab · hay cambios más recientes. Termina de editar y vuelve a pulsar Sincronizar.');return result;}
    report('ready',result.msg);return result;
   }finally{if(fs.deleteFile)try{fs.deleteFile(path);}catch(ignoreDelete){}}
  }catch(e){if(!cancelled()){failed=pending;report('error','Motion Lab · '+e.message);}return{ok:false,msg:e.message,cancelled:cancelled()};}
  finally{busy=false;}
 }
 // start/stop/retry remain compatible with older callers. start never requests host state.
 return{start:start,stop:stop,pause:pause,sync:sync,retry:sync,getState:function(){return{running:running,busy:busy,pending:pending,failed:failed,mode:'manual'};}};
})();
