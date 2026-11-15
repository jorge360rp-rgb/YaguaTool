const fs=require('fs'),{chromium}=require('playwright');
const root=require('path').resolve(__dirname,'..'),out=root+'/revision-referencia';
(async()=>{
 const postcss=require('postcss'),doiuse=require('doiuse');
 const warnings=[];for(const file of ['design.css','reference.css'])await postcss([doiuse({browsers:['Chrome 99'],onFeatureUsage(info){warnings.push({file,feature:info.feature,message:info.message})}})]).process(fs.readFileSync(root+'/mock/'+file,'utf8'),{from:file});
 fs.writeFileSync(out+'/CHROMIUM99.json',JSON.stringify({target:'Chrome 99',actualBrowser:'installed Chromium, not CEF99',warnings},null,2));
 const b=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox']}),p=await b.newPage({viewport:{width:1000,height:800},reducedMotion:'reduce'});await p.goto('http://127.0.0.1:8771/mock/');await p.addScriptTag({path:require.resolve('axe-core/axe.min.js')});
 const states=await p.evaluate(()=>YaguanoMock.sections),results=[];
 for(const state of states){await p.evaluate(s=>YaguanoMock.select(s.id),state);const result=await p.evaluate(()=>axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa']}}));results.push({state:state.id,violations:result.violations});}
 fs.writeFileSync(out+'/ACCESIBILIDAD.json',JSON.stringify(results,null,2));console.log('doiuse warnings',warnings.map(w=>w.feature));console.log('axe violations',results.reduce((n,r)=>n+r.violations.length,0));await b.close();if(results.some(r=>r.violations.length))process.exit(1);
})();
