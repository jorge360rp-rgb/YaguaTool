// Semantic AE model for the native encoder. It does not render AE pixels.
const vm=require('vm');
const copy=v=>v===undefined?undefined:JSON.parse(JSON.stringify(v));
function fixture(source,{missingFont=false,disableRendering=false}={}){
 let id=0,items=[];
 class Prop{
  constructor(value=0,{text=false}={}){this.base=copy(value);this.keys=[];this.text=text;this.interpolations=[];}
  get value(){return copy(this.at(0));}set value(v){this.base=copy(v)}get numKeys(){return this.keys.length}
  setValue(v){this.base=copy(v);if(this.text&&missingFont)this.base.font='SubstitutedFont';}
  setValueAtTime(t,v){this.keys.push([t,copy(v)]);this.keys.sort((a,b)=>a[0]-b[0]);}
  setValuesAtTimes(ts,vs){ts.forEach((t,i)=>this.setValueAtTime(t,vs[i]));}
  setInterpolationTypeAtKey(i,a,b){this.interpolations[i-1]=[a,b];}
  at(t){if(!this.keys.length)return this.base;const a=this.keys;if(t<=a[0][0])return a[0][1];if(t>=a.at(-1)[0])return a.at(-1)[1];let lo=0,hi=a.length-1;while(hi-lo>1){let m=(lo+hi)>>1;if(a[m][0]<=t)lo=m;else hi=m;}if(this.text)return a[lo][1];let u=(t-a[lo][0])/(a[hi][0]-a[lo][0]);return Array.isArray(a[lo][1])?a[lo][1].map((v,j)=>v+(a[hi][1][j]-v)*u):a[lo][1]+(a[hi][1]-a[lo][1])*u;}
 }
 class Effects{constructor(){this.arr=[]}addProperty(name){let amount=new Prop(),fx={name,property(){return amount},amount};this.arr.push(fx);return fx;}}
 class Layer{
  constructor(c,source=null,text=null){this.id=++id;this.comp=c;this.source=source;this.name='Layer';this.parent=null;this.inPoint=0;this.outPoint=c.duration;this.effects=new Effects();this.transform={position:Object.assign(new Prop([0,0]),{isSpatial:true}),scale:new Prop([100,100]),rotation:new Prop(0),opacity:new Prop(100),anchorPoint:new Prop([0,0])};if(text!==null)this.document=new Prop({text,font:'Default',fontSize:12,fillColor:[1,1,1]},{text:true});}
  property(name){if(name==='ADBE Effect Parade')return this.effects;if(name==='ADBE Text Properties')return{property:()=>this.document};throw Error('Unknown layer property '+name)}
 }
 class CompItem{
  constructor(name,w,h,d,fps){Object.assign(this,{id:++id,name,width:w,height:h,duration:d,frameRate:fps,arr:[],comment:''});this.layers={add:s=>this.add(new Layer(this,s)),addText:t=>this.add(new Layer(this,null,t)),addNull:()=>this.add(new Layer(this))};}
  add(l){this.arr.unshift(l);return l}get numLayers(){return this.arr.length}layer(n){return typeof n==='number'?this.arr[n-1]:this.arr.find(x=>x.name===n)}
  get usedIn(){return items.filter(i=>i instanceof CompItem&&i.arr.some(l=>l.source===this))}
  openInViewer(){project.activeItem=this}remove(){items=items.filter(i=>i!==this)}
 }
 class FolderItem{constructor(name){this.name=name;this.id=++id}get numItems(){return items.filter(i=>i.parentFolder===this).length}item(i){return items.filter(x=>x.parentFolder===this)[i-1]}remove(){items=items.filter(i=>i!==this)}}
 const project={activeItem:null,items:{addFolder(name){const f=new FolderItem(name);items.push(f);return f},addComp(n,w,h,p,d,fps){const c=new CompItem(n,w,h,d,fps);items.push(c);return c}},get numItems(){return items.length},item:i=>items[i-1]};
 const renderingChanges=[];let renderDisabled=disableRendering;const app={project,newProject(){}};Object.defineProperty(app,'disableRendering',{get(){return renderDisabled},set(v){renderDisabled=v;renderingChanges.push(v)}});
 const c={app,CompItem,Animix:{api:{}},KeyframeInterpolationType:{LINEAR:'LINEAR'},BlendingMode:{ADD:'ADD'},JSON,Math};vm.createContext(c);vm.runInContext(source,c);
 return{renderingChanges,getRenderingDisabled:()=>renderDisabled,module:c.YaguaNativeLab,items:()=>items,CompItem,project,Prop,layerCount(){return items.filter(x=>x instanceof CompItem).reduce((n,c)=>n+c.arr.length,0)},keyCount(){let n=0;for(const c of items.filter(x=>x instanceof CompItem))for(const l of c.arr){n+=Object.values(l.transform).reduce((s,p)=>s+p.numKeys,0)+(l.document?.numKeys||0)+l.effects.arr.reduce((s,e)=>s+e.amount.numKeys,0)}return n},numericKeyCount(){let n=0;for(const c of items.filter(x=>x instanceof CompItem))for(const l of c.arr)n+=Object.values(l.transform).reduce((s,p)=>s+p.numKeys,0)+l.effects.arr.reduce((s,e)=>s+e.amount.numKeys,0);return n}};
}
const mul=(a,b)=>[a[0]*b[0]+a[2]*b[1],a[1]*b[0]+a[3]*b[1],a[0]*b[2]+a[2]*b[3],a[1]*b[2]+a[3]*b[3],a[0]*b[4]+a[2]*b[5]+a[4],a[1]*b[4]+a[3]*b[5]+a[5]];
function matrix(l,t){const a=l.transform.anchorPoint.at(t),p=l.transform.position.at(t),s=l.transform.scale.at(t),r=l.transform.rotation.at(t)*Math.PI/180,c=Math.cos(r),sn=Math.sin(r);let m=[c*s[0]/100,sn*s[0]/100,-sn*s[1]/100,c*s[1]/100,0,0];m[4]=p[0]-m[0]*a[0]-m[2]*a[1];m[5]=p[1]-m[1]*a[0]-m[3]*a[1];return l.parent?mul(matrix(l.parent,t),m):m;}
function pose(l,t){if(t<l.inPoint||t>=l.outPoint)return{opacity:0};const a=l.transform.opacity.at(t)/100;return{opacity:a,matrix:matrix(l,t),blur:l.effects.arr[0]?.amount.at(t)||0,blend:l.blendingMode||'NORMAL',glyphs:l.source.arr.map(g=>({text:g.document.at(t).text,font:g.document.at(t).font,fontSize:g.document.at(t).fontSize,color:g.document.at(t).fillColor,pos:g.transform.position.at(t),opacity:g.transform.opacity.at(t)/100}))};}
module.exports={fixture,pose,matrix};
