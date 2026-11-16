// Structural API simulation. This does NOT verify AE pixels or text animator rendering.
const fs=require('fs'),vm=require('vm'),assert=require('assert'),path=require('path');
const base=path.resolve(__dirname,'..');let failAt=Infinity,created=0;
class Prop{
 constructor(name,parent=null){this.name=name;this.parent=parent;this.children=[];this.value=0;this.keys=[];this.expressionEnabled=false;this.isSpatial=name==='ADBE Text Position 3D'}
 get numProperties(){return this.children.length} get propertyIndex(){return this.parent.children.indexOf(this)+1}get numKeys(){return this.keys.length}
 property(n){return typeof n==='number'?this.children[n-1]:this.children.find(x=>x.name===n)}
 addProperty(name){if(++created===failAt)throw Error('injected failure');let p=new Prop(name,this);this.children.push(p);if(name==='ADBE Text Animator'){p.addProperty('ADBE Text Animator Properties');let s=p.addProperty('ADBE Text Selectors'),r=s.addProperty('ADBE Text Selector'),a=r.addProperty('ADBE Text Range Advanced');for(let k of ['ADBE Text Range Units','ADBE Text Range Type2','ADBE Text Selector Smoothness'])a.addProperty(k);r.addProperty('ADBE Text Index Start');r.addProperty('ADBE Text Index End')}return p}
 setValue(v){this.value=v}setValuesAtTimes(t,v){this.keys=t.map((x,i)=>[x,v[i]])}setInterpolationTypeAtKey(){}setSpatialAutoBezierAtKey(){}setSpatialContinuousAtKey(){}setSpatialTangentsAtKey(){}remove(){this.parent.children.splice(this.propertyIndex-1,1)}
}
let source=new Prop('ADBE Text Document');source.value={text:'Meet Qwix',fontSize:96,font:'UserFont',fillColor:[.2,.7,.8]};let anims=new Prop('ADBE Text Animators'),custom=anims.addProperty('ADBE Text Animator');custom.name='User animator';
let tp={property:n=>n==='ADBE Text Document'?source:anims};
let layer={name:'Original',id:5,index:1,stretch:100,locked:false,inPoint:0,outPoint:20,transform:{position:[300,400],scale:[80,120],rotation:12},property:n=>n==='ADBE Text Properties'?tp:null};
let c={id:1,time:2,selectedLayers:[layer],duration:20};let api={};let sandbox={Animix:{api},YaguaHost:{comp:()=>c},KeyframeInterpolationType:{LINEAR:1},Math,JSON,isFinite,Error};vm.createContext(sandbox);vm.runInContext(fs.readFileSync(path.join(base,'patch/jsx/lab-selected.jsx'),'utf8'),sandbox);const moduleAPI=sandbox.YaguaLabSelected;
const dir=process.env.YAGUA_DATA_DIR||'/workspace/work/ae-ui-3.1.4/Extension/YaguaTool/lab-data';
const data=name=>JSON.parse(fs.readFileSync(path.join(dir,'pack-'+name+'.json'),'utf8'));
const ctx=()=>({...moduleAPI.context(),inPoint:0,outPoint:20});
let slide=data('apple-style-pack-slide'),plan=moduleAPI.plan(slide,ctx());assert.equal(plan.tracks.length,8);assert.equal(plan.times[0],2);assert(plan.tracks.some(t=>t.opacity.some(x=>x===0)));assert(plan.tracks.some(t=>t.opacity.some(x=>x===100)));assert.equal(plan.fill,false);
let before=JSON.stringify({source:source.value,transform:layer.transform});let result=moduleAPI.apply(slide,moduleAPI.context());assert.equal(result.data.animators,8);assert.equal(anims.numProperties,9);assert.strictEqual(anims.property(1),custom);assert.equal(JSON.stringify({source:source.value,transform:layer.transform}),before);
for(let a of anims.children.slice(1)){let sel=a.property('ADBE Text Selectors').property(1),adv=sel.property('ADBE Text Range Advanced');assert.equal(adv.property('ADBE Text Range Units').value,2);assert.equal(adv.property('ADBE Text Selector Smoothness').value,0);assert(!a.property('ADBE Text Animator Properties').property('ADBE Text Fill Color'))}
moduleAPI.apply(slide,moduleAPI.context());assert.equal(anims.numProperties,9); // replace, never accumulate.
const old=anims.children.slice();failAt=created+13;assert.throws(()=>moduleAPI.apply(slide,moduleAPI.context()),/injected/);assert.deepStrictEqual(anims.children,old);failAt=Infinity;
let stale={...moduleAPI.context(),text:'old'};assert.throws(()=>moduleAPI.apply(slide,stale),/cambiado/);assert.deepStrictEqual(anims.children,old);
assert.throws(()=>moduleAPI.plan(data('ghost-pack-bounce-rotation-reveal'),ctx()),/giro|Ghost/);assert.deepStrictEqual(anims.children,old);
assert.throws(()=>moduleAPI.plan(data('echo-pack-comet'),ctx()),/Echo|giro/);
let scaled=moduleAPI.plan(slide,{...ctx(),fontSize:48});for(let i=0;i<plan.tracks.length;i++)for(let j=0;j<plan.times.length;j++)assert.equal(scaled.tracks[i].position[j][1],plan.tracks[i].position[j][1]/2);
assert.throws(()=>moduleAPI.plan(slide,{...ctx(),outPoint:2.1}),/cabe/);
let summary=[];for(const name of ['apple-style-pack-slide','apple-style-pack-slide-delay','apple-style-pack-blur-rise','apple-style-pack-bounce-drop','apple-style-pack-scale-tracking']){let d=data(name);summary.push({name,animators:moduleAPI.plan(d,ctx()).tracks.length})}
source.keys=[[0,{}]];assert.throws(()=>moduleAPI.context(),/keyframes/);source.keys=[];layer.locked=true;assert.throws(()=>moduleAPI.context(),/Desbloquea/);layer.locked=false;
source.value.text='Changed\rwith new lines';source.keys=[[0,{}]];api.ytLabRemoveSelected();source.keys=[];assert.equal(anims.numProperties,1);assert.strictEqual(anims.property(1),custom);
// Preview API restores composition state and clears partial/previous frame sets.
const tempFiles=new Map();let removedFolders=0,renderError=false,rendered=0;
class FakeFile{constructor(name){this.fsName=name;this.exists=false;tempFiles.set(name,this)}remove(){this.exists=false;tempFiles.delete(this.fsName)}}
class FakeFolder{constructor(name){this.fsName=name;this.exists=false}create(){this.exists=true;return true}getFiles(){return [...tempFiles.values()].filter(f=>f.fsName.startsWith(this.fsName+'/'))}remove(){this.exists=false;removedFolders++}}
FakeFolder.temp={fsName:'/tmp'};sandbox.File=FakeFile;sandbox.Folder=FakeFolder;sandbox.YaguaHost.uri=f=>'file://'+f.fsName;sandbox.app={disableRendering:true};
c.frameDuration=1/30;c.resolutionFactor=[1,1];c.time=2;c.saveFrameToPng=(t,f)=>{c.time=t;if(renderError&&++rendered===8)throw Error('render failed');f.exists=true};
let preview=api.ytLabPreviewSelected({duration:3});assert.equal(preview.data.frames.length,32);assert.equal(tempFiles.size,32);assert.equal(c.time,2);assert.deepEqual(c.resolutionFactor,[1,1]);assert.equal(sandbox.app.disableRendering,true);
renderError=true;assert.throws(()=>api.ytLabPreviewSelected({duration:3}),/render failed/);assert.equal(tempFiles.size,0);assert.equal(c.time,2);assert.deepEqual(c.resolutionFactor,[1,1]);assert.equal(sandbox.app.disableRendering,true);assert(removedFolders>=2);
const report={status:'passed',scope:'API simulation; AE pixels and actual rendering not tested',compatibleDefaultExamples:summary,checks:['original text/font/transforms/user animator preserved','one existing text layer; no comp API available','timing and font-size ratio','per-character indexed selection and visible/hidden opacity','repeat replaces owned animators','partial-failure rollback','stale selection rejected','complex Bounce Rotation Reveal rejected without mutation','unsupported Echo rejected','animated source and locked layer rejected','insufficient layer duration rejected','remove preserves user animator even after source text changes','preview saves 32 frames and restores composition time/resolution/render state','preview failure cleans partial frames and restores state']};fs.writeFileSync(path.join(__dirname,'selected-text-results.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));
