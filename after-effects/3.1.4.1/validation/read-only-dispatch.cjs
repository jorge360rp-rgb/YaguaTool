// Executes the packaged dispatcher against the project's simulated AE API.
const assert=require('assert'),fs=require('fs'),path=require('path'),fixture=require('./ae-fixture.cjs');
fixture.evaluate('$._yaguaExtensionRoot="C:/YaguaTool Fixture";$.evalFile(new File("C:/YaguaTool Fixture/jsx/yagua-host.jsx"));var undoCalls={start:0,end:0};app.beginUndoGroup=function(){undoCalls.start++;};app.endUndoGroup=function(){undoCalls.end++;};');
const counts=()=>JSON.parse(fixture.evaluate('JSON.stringify(undoCalls)'));
let result=fixture.call('ytLabRigState',{});assert(result.ok,result.msg);assert.deepEqual(counts(),{start:0,end:0},'read-only rig state must not enter/leave undo groups');
fixture.resetText();result=fixture.call('ytLabRigState',{});assert.deepEqual(counts(),{start:0,end:0},'repeated reads must not enter undo groups');
fixture.evaluate('var originalRead=Animix.api.ytLabRigState;Animix.api.ytLabRigState=function(){throw Error("read failure");};');result=fixture.call('ytLabRigState',{});assert.equal(result.ok,false);assert.deepEqual(counts(),{start:0,end:0});fixture.evaluate('Animix.api.ytLabRigState=originalRead;');
result=fixture.call('ytSocialComp',{id:'ig-feed',duration:10,fps:30});assert(result.ok,result.msg);assert.deepEqual(counts(),{start:1,end:1},'project mutation retains undo group');
result=fixture.call('unknownAction',{});assert.equal(result.ok,false);assert.deepEqual(counts(),{start:2,end:2},'mutating dispatcher closes undo on errors');
const report={scope:'Packaged ExtendScript host executed in a simulated AE API; no native text-editor focus verification',checks:['rig-state read creates no undo group','repeated state reads create no undo group','read failure creates no undo group','project mutation keeps one undo group','dispatch failure closes mutation undo group'],status:'passed'};fs.writeFileSync(path.join(__dirname,'READ_ONLY_DISPATCH.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));
