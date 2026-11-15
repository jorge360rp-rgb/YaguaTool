from playwright.sync_api import sync_playwright
from pathlib import Path
import json,hashlib
root=Path(__file__).resolve().parents[3];out=root/'propuestas/ui-3.1.0/revision-motion-lab';out.mkdir(exist_ok=True)
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True)
 page=b.new_page(viewport={'width':1280,'height':900});errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 page.goto('http://127.0.0.1:8771/mock/');page.evaluate("YaguanoMock.select('text','Motion Lab v0.9')");page.evaluate('document.fonts.ready')
 result=page.evaluate('''() => {
  const structural={mode:'io',direction:'direction',split:'unit',trajectory:'order',bezier:'curveNumbers',anchorX:'anchorXNumber',anchorY:'anchorYNumber',fillStyle:'fillMode',fillUnit:'fillUnit',fillDirection:'fillDirection',fillColor:'fillOneColor',fill2Color:'fillTwoColor',fill3Color:'fillThreeColor',previewText:'sampleText'};
  const results=[];
  for(const item of YMX_TEST.catalog){
   YMX_TEST.select(item.id);YMX_TEST.pause();const keys=new Set();
   for(const tab of ['motion','fill','trails','advanced']){document.querySelector('#controlTabs [data-tab="'+tab+'"]').click();document.querySelectorAll('.slider-field').forEach(e=>keys.add(e.dataset.key));}
   const missing=Object.keys(item.p).filter(k=>!keys.has(k)&&!(structural[k]&&document.getElementById(structural[k])));
   results.push({name:item.name,parameters:Object.keys(item.p).length,missing});
  }
  return results;
 }''');print('MISSING',[(x['name'],x['missing']) for x in result if x['missing']])
 assert all(not x['missing'] for x in result)
 page.evaluate("YMX_TEST.select('pack-apple-style-pack-slide');YMX_TEST.pause();YMX_TEST.render(.4)")
 before=page.evaluate('YMX_TEST.sample(.4).pieces[0].y');page.locator('#controlTabs [data-tab=motion]').click();control=page.locator('[data-key=distanceX] input');control.fill('80');control.dispatch_event('input');after=page.evaluate('YMX_TEST.sample(.4).pieces[0].y');assert after>before
 page.evaluate("YMX_TEST.select('pack-apple-style-pack-color-scale');YMX_TEST.pause()");page.locator('#controlTabs [data-tab=fill]').click();page.locator('#addColorPass').click();page.locator('#addColorPass').click();page.locator('#addColorPass').click();page.locator('#addColorPass').click();assert page.evaluate('YMX_TEST.presetParameters().fill5')==100
 page.locator('#controlTabs [data-tab=trails]').click();page.locator('[data-key=echo] input').fill('80');page.locator('[data-key=echo] input').dispatch_event('input');assert page.evaluate('YMX_TEST.presetParameters().echo')==80
 page.locator('#controlTabs [data-tab=advanced]').click()
 assert not errors,errors
 (out/'CONTROLES.json').write_text(json.dumps({'presets':result,'distanceResponds':True,'fiveFillPasses':True,'echoEditable':True,'errors':errors},indent=2))
 # Live main and thumbnail clocks must advance, then all listeners/scenes are disposed.
 page.evaluate("YaguanoMock.select('text','Motion Lab v0.9')");start=page.evaluate('YMX_TEST.galleryClock()');page.wait_for_timeout(250);assert page.evaluate('YMX_TEST.galleryClock()')>start
 assert page.locator('.ymx-fx-host .qfx-piece').count()>0
 for name in ['reference-player.js','reference-scene.js','catalog-data.js']:
  a=root/'review/YaguaTool/motion-lab'/name;c=root/'propuestas/ui-3.1.0/mock/motion-lab'/name;assert a.read_bytes()==c.read_bytes(),name
 page.evaluate("YaguanoMock.select('tools')");assert page.evaluate('window.YMX_TEST===null')
 # Navigation indicator moves and final rect follows active row. Rail stays open on selection.
 page.evaluate('YaguanoReference.setOpen(true)');before=page.locator('.nav-selection').evaluate('e=>getComputedStyle(e).transform');page.locator('#nav [data-page=complex]').click();page.wait_for_timeout(100);middle=page.locator('.nav-selection').evaluate('e=>getComputedStyle(e).transform');page.wait_for_timeout(320);last=page.locator('.nav-selection').evaluate('e=>getComputedStyle(e).transform');assert before!=middle and middle!=last
 assert page.locator('#nav-toggle').get_attribute('aria-expanded')=='true'
 assert page.locator('.wordmark [data-brand]').inner_text()=='YagutaTool'
 assert page.locator('.wordmark small').inner_text()=='Motion Lab'
 (out/'INTERACCIONES.json').write_text(json.dumps({'livePreview':True,'thumbnailClockAdvances':True,'disposeWhenLeaving':True,'rendererAndCatalogueByteIdentical':True,'indicatorIntermediateFrame':True,'railStaysOpen':True,'branding':'YagutaTool / Motion Lab'},indent=2))
 b.close()
