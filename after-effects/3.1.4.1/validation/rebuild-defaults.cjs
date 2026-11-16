// Rebuild default samples with the unchanged 3.1.4 renderer, changing only the text.
const {chromium}=require('playwright'),fs=require('fs'),path=require('path'),crypto=require('crypto'),assert=require('assert');
(async()=>{
 const version=path.resolve(__dirname,'..'),runtime=process.env.YAGUA_EXTENSION_ROOT||'/workspace/work/ae-ui-3.1.4.1/Extension/YaguaTool',source=process.env.YAGUA_ORIGINAL_DATA||'/workspace/work/ae-ui-3.1.4/Extension/YaguaTool/lab-data';
 const manifest=JSON.parse(fs.readFileSync(path.join(source,'manifest.json'),'utf8')),out=path.join(version,'patch/lab-data');fs.mkdirSync(out,{recursive:true});
 const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox']}),page=await browser.newPage({viewport:{width:1200,height:950}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 try{
  await page.goto(process.env.YAGUA_TEST_URL||'http://127.0.0.1:8779/YaguaTool/');await page.waitForFunction(()=>window.YaguaLabBake&&window.YMX_CATALOG);await page.evaluate(()=>document.fonts.ready);
  for(const entry of manifest){
   const previous=JSON.parse(fs.readFileSync(path.join(source,entry.file),'utf8'));
   const baked=await page.evaluate(async previous=>{
    const preset=YMX_CATALOG.find(p=>p.id===previous.id);if(!preset)throw Error('Missing original preset '+previous.id);
    return YaguaLabBake.capture({data:{name:previous.name,pack:previous.pack,kind:preset.smartKind},params:previous.parameters,text:'Yaguano',baseColor:previous.parameters.baseColor||'#ffffff',fontSize:96,presetId:previous.id,sequence:!!previous.sequence,holdMs:previous.holdMs===undefined?500:previous.holdMs});
   },previous);
   assert.equal(baked.text,'Yaguano');assert.deepEqual(baked.parameters,previous.parameters);
   const raw=JSON.stringify(baked);fs.writeFileSync(path.join(out,entry.file),raw);fs.writeFileSync(path.join(runtime,'lab-data',entry.file),raw);
   entry.frames=baked.frames.length;entry.sha256=crypto.createHash('sha256').update(raw).digest('hex');console.log(entry.id,entry.frames,'frames · Yaguano');
  }
  assert.deepEqual(errors,[]);const raw=JSON.stringify(manifest,null,2);fs.writeFileSync(path.join(out,'manifest.json'),raw);fs.writeFileSync(path.join(runtime,'lab-data/manifest.json'),raw);
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exit(1)});
