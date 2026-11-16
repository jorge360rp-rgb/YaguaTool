// Reproduce host traffic with a virtual clock. This does not emulate AE's text editor focus.
const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('assert');
function harness(source){
 let now=0,next=0,timers=new Map(),calls=[],events=[],files=new Map(),deleted=[],captureCount=0;
 let state={ok:true,data:null},update={ok:true,msg:'Motion Lab sincronizado',data:{}},capture=async()=>({schema:1});
 const document={hidden:false,dispatchEvent:e=>events.push(e.detail)};
 const sandbox={window:{YMX_CATALOG:[{id:'test',name:'Test',pack:'Pack',smartKind:'smartReveal'}]},document,CustomEvent:class{constructor(type,o){this.type=type;this.detail=o.detail}},Date:{now:()=>now},JSON,Error,Promise,
  setTimeout(fn,ms){const id=++next;timers.set(id,{at:now+ms,fn});return id},clearTimeout(id){timers.delete(id)},
  YaguaAEBridge:{getState:()=>({status:'ready'}),async call(name,args){calls.push({name,args,at:now});if(name==='ytLabRigState')return state;if(name==='tempDir')return{ok:true,data:'/tmp'};if(name==='ytLabRigUpdate')return update;throw Error('unexpected host call '+name)}},
  YaguaLabBake:{async capture(...args){captureCount++;return capture(...args)}}};
 sandbox.window.cep={fs:{writeFile(p,s){files.set(p,s);return{err:0}},deleteFile(p){files.delete(p);deleted.push(p)}}};
 vm.createContext(sandbox);vm.runInContext(source,sandbox);
 return{api:sandbox.window.YaguaLabLive,calls,events,files,deleted,get captures(){return captureCount},setState:s=>state=s,setUpdate:r=>update=r,setCapture:c=>capture=c,
  async advance(ms){const end=now+ms;for(let guard=0;guard<1000;guard++){let first=[...timers].filter(([id,t])=>t.at<=end).sort((a,b)=>a[1].at-b[1].at)[0];if(!first){now=end;return}let[id,t]=first;timers.delete(id);now=t.at;await t.fn()}throw Error('runaway timer')},get timerCount(){return timers.size}};
}
(async()=>{
 const current=fs.readFileSync(process.env.YAGUA_LIVE_SOURCE||path.resolve(__dirname,'../patch/js/lab-live.js'),'utf8'),old=fs.readFileSync(path.resolve(__dirname,'../../../review/YaguaTool/js/lab-live.js'),'utf8');
 const oldH=harness(old);oldH.api.start();await oldH.advance(10000);assert(oldH.calls.length>=10,'old polling reproduction');oldH.api.stop();
 const h=harness(current);h.api.start();await h.advance(10000);assert.equal(h.calls.length,0);assert.equal(h.timerCount,0);h.api.stop();h.api.start();await h.advance(10000);assert.equal(h.calls.length,0);
 await h.api.sync();assert.equal(h.calls.length,1);assert.equal(h.calls[0].name,'ytLabRigState');await h.advance(10000);assert.equal(h.calls.length,1,'one explicit read, no background follow-up');
 const rig={id:10,signature:'new',applied:'old',options:{text:'YAGUA',presetId:'test',data:{name:'Test',pack:'Pack'},params:{}}};
 h.setState({ok:true,data:rig});let before=h.calls.length;await h.api.sync();assert.deepEqual(h.calls.slice(before).map(c=>c.name),['ytLabRigState','tempDir','ytLabRigUpdate']);assert.equal(h.files.size,0);assert.equal(h.deleted.length,1);assert.equal(h.api.getState().busy,false);
 before=h.calls.length;await h.advance(60000);assert.equal(h.calls.length,before,'no future calls after a successful sync');
 h.setState({ok:true,data:{...rig,applied:'new'}});before=h.calls.length;await h.api.sync();assert.deepEqual(h.calls.slice(before).map(c=>c.name),['ytLabRigState']);
 h.setState({ok:true,data:rig});h.setUpdate({ok:true,data:{stale:true}});await h.api.sync();before=h.calls.length;await h.advance(60000);assert.equal(h.calls.length,before);assert(h.events.at(-1).message.includes('cambios más recientes'));
 let release;h.setCapture(()=>new Promise(r=>release=r));const inFlight=h.api.sync();await Promise.resolve();await Promise.resolve();before=h.calls.length;const duplicate=await h.api.sync();assert.equal(duplicate.ok,false);assert.equal(h.calls.length,before);h.api.pause();release({schema:1});await inFlight;assert.equal(h.calls.length,before,'cancel during bake must not request tempDir or write AE');assert.equal(h.api.getState().busy,false);
 h.api.start();h.setState({ok:false,msg:'read error'});await h.api.sync();before=h.calls.length;await h.advance(60000);assert.equal(h.calls.length,before);assert(h.events.at(-1).message.includes('read error'));assert.equal(h.timerCount,0);
 const report={scope:'Virtual-clock JavaScript simulation; no native AE text focus verification',oldHostReadsIn10Seconds:oldH.calls.length,newIdleHostReadsIn10Seconds:0,checks:['startup and restart schedule no host calls','one state read only on explicit action','one update per requested sync','successful sync stays idle','unchanged rig avoids baking','stale sample requires another explicit action','duplicate sync suppressed','cancel during bake prevents subsequent host calls','error does not retry in background','temporary sampling file removed']};fs.writeFileSync(path.join(__dirname,'TEXT_EDITING.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));
})().catch(e=>{console.error(e);process.exit(1)});
