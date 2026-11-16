// Follow the actual Original nativo API through native comp creation in the simulated AE API.
const fs=require('fs'),path=require('path'),assert=require('assert'),{spawnSync}=require('child_process');
const dir=process.env.YAGUA_EXTENSION_ROOT||'/workspace/work/ae-ui-3.1.4.1/Extension/YaguaTool';
if(process.argv[2]){
 const fixture=require('./ae-fixture.cjs'),id=process.argv[2];fixture.evaluate('$._yaguaExtensionRoot="C:/YaguaTool Fixture";$.evalFile(new File("C:/YaguaTool Fixture/jsx/yagua-host.jsx"));');
 const reply=fixture.call('ytLabDefault',{id});assert(reply.ok,reply.msg);const rig=fixture.rig(),meta=JSON.parse(rig.comment.split('|').slice(1).join('|')),driver=rig.layer(meta.driverName);assert.equal(driver.property('ADBE Text Properties').property('ADBE Text Document').value.text,'Yaguano');
 const raw=rig.layer(meta.cacheName).source;let chars=0;for(const layer of raw.arr){if(!layer.source)continue;for(const glyph of layer.source.arr){let text=glyph.property('ADBE Text Properties').property('ADBE Text Document').value.text;assert.equal(text.length,1);assert('Yaguano'.includes(text),id+' generated old text '+text);chars++;}}
 assert(chars>=7);console.log(JSON.stringify({id,text:'Yaguano',glyphLayers:chars}));
}else{
 const manifest=JSON.parse(fs.readFileSync(path.join(dir,'lab-data/manifest.json'),'utf8')),rows=[];
 for(const item of manifest){const child=spawnSync(process.execPath,[__filename,item.id],{encoding:'utf8',env:process.env});assert.equal(child.status,0,child.stderr);rows.push(JSON.parse(child.stdout));console.log(item.id+' · native text Yaguano');}
 const report={scope:'Original nativo host API and layer creation in a simulated AE API, no real AE render',presets:rows};fs.writeFileSync(path.join(__dirname,'DEFAULT_NATIVE.json'),JSON.stringify(report,null,2));
}
