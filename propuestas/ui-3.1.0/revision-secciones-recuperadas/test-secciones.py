from pathlib import Path
from playwright.sync_api import sync_playwright
import json,hashlib,re
repo=Path('/workspace/work/yaguano-visual');out=repo/'propuestas/ui-3.1.0/revision-secciones-recuperadas';out.mkdir(exist_ok=True)
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True);page=b.new_page(viewport={'width':1000,'height':850});errors=[];page.on('pageerror',lambda e:errors.append(str(e)));page.goto('http://127.0.0.1:8771/mock/')
 page.evaluate("YaguanoMock.select('library')");packs=page.evaluate('YAG_AEP_PACKS');assert len(packs)==3 and sum(len(x['items']) for x in packs)==51
 for pack in packs:
  page.locator('.lib-pack-bar button').filter(has_text=pack['name']).click();assert page.locator('.lib-preset-name').all_inner_texts()==[x['name'] for x in pack['items']]
 page.locator('input[type=search]').last.fill('zzzzmissing');assert page.locator('.lib-preset').count()==0
 for section in ['tools','graph','motion','backgrounds']:
  page.evaluate('s=>YaguanoMock.select(s)',section);page.wait_for_timeout(180)
  if section=='tools':
   assert page.locator('.tools-curve-presets button').count()>=14
   page.locator('.tools-pro-tabs [data-tab=shapes]').click();assert page.get_by_text('Nulos siguiendo vértices',exact=True).is_visible()
   page.locator('.tools-pro-tabs [data-tab=code]').click();page.locator('.code-drop textarea').fill('window.SHOULD_NOT_EXECUTE=1;');page.get_by_text('Ejecutar / aplicar',exact=True).click();assert page.evaluate('window.SHOULD_NOT_EXECUTE===undefined')
  elif section=='graph':assert page.locator('canvas').count()>=20 and len(page.locator('#bounce-preview-path').get_attribute('d'))>100
  elif section=='motion':assert page.locator('.animix-preview-stage').count()>=3
  elif section=='backgrounds':assert page.locator('.bg-style-btn').count()==4 and page.locator('.bg-preview').evaluate('e=>e.getAnimations({subtree:true}).length')>0
 # Recover all source computations; only prototype host guard and cosmetic code are new.
 base=(repo/'review/YaguaTool/js/main.js').read_text();copy=(repo/'propuestas/ui-3.1.0/mock/previous-sections/previous-sections.js').read_text();native=[]
 for name in ['pageAepLibrary','pageTools','pageGraph','pageBackgrounds','pageExpr']:
  start=base.index('  function '+name+'(');match=re.search(r'^  function ',base[start+1:],re.M);end=start+1+match.start() if match else len(base)
  assert base[start:end] in copy,name;native.append(name)
 # Selection is measured against untransformed layout, including during pointer-down and after scroll.
 measurements=[]
 for width in [240,1000]:
  page.set_viewport_size({'width':width,'height':800});page.wait_for_timeout(100);page.evaluate('YaguanoReference.setOpen(true)')
  for section in ['text','tools','settings','library']:
   button=page.locator('#nav [data-page='+section+']');button.scroll_into_view_if_needed();button.hover();page.mouse.down();page.wait_for_timeout(130);page.mouse.up();page.wait_for_timeout(380)
   delta=page.evaluate('''()=>{const a=document.querySelector('#nav button[aria-current=page]').getBoundingClientRect(),b=document.querySelector('.nav-selection').getBoundingClientRect();return Math.max(Math.abs(a.left-b.left),Math.abs(a.top-b.top),Math.abs(a.width-b.width),Math.abs(a.height-b.height));}''');assert delta<1.1,(section,width,delta);measurements.append(delta)
 page.evaluate("YaguanoReference.setOpen(false);YaguanoMock.select('text','Motion Lab v0.9')");page.wait_for_timeout(200)
 assert not page.get_by_text('Texto original del preset',exact=True).is_visible()
 assert page.get_by_text('Preview real y controles completos v0.9 · propuesta independiente, sin conexión a AE.',exact=True).count()==0
 for pack in ['Echo Pack','Apple Style Pack','Demo Reel Pack','Ghost Pack']:
  page.locator('#packTabs button').filter(has_text=pack).click();assert set(page.locator('#cards .ymx-fx-host > .qfx-text').all_text_contents())=={'Yaguano'}
 assert not errors,errors
 result={'libraryPacks':len(packs),'libraryPresets':51,'originalFunctionsPreserved':native,'railMaxDelta':max(measurements),'prototypeBlocksScriptExecution':True,'motionPreviews':True,'backgroundAnimations':True,'labThumbnailText':'Yaguano','removedVisibleOriginalToggle':True,'pageErrors':errors}
 (out/'FUNCIONES_Y_RAIL.json').write_text(json.dumps(result,indent=2));b.close();print(result)
