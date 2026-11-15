from pathlib import Path
from playwright.sync_api import sync_playwright
import json,hashlib,zipfile,subprocess
r=Path(__file__).resolve().parents[3];a=Path(__import__('os').environ['YAGUA_AE_SOURCE']);out=r/'after-effects/3.1.1/validation';out.mkdir(parents=True,exist_ok=True);report={}
with zipfile.ZipFile(r/'YaguaTool_3.1.0.zip') as z:
 protected=[n for n in z.namelist() if '/jsx/' in n or '/library/' in n or '/assets/' in n or n.endswith(('js/ae-bridge.js','js/lab-live.js','js/dynamic-grid.js','motion-lab/bake.js','motion-lab/catalog-data.js','motion-lab/reference-player.js','motion-lab/reference-scene.js'))]
 report['protected_files']={n:hashlib.sha256(z.read(n)).hexdigest()==hashlib.sha256((a.parent/n).read_bytes()).hexdigest() for n in protected if not n.endswith('/')};assert all(report['protected_files'].values())
for path in list((a/'js').glob('*.js'))+list((a/'motion-lab').glob('*.js')):subprocess.run(['node','--check',str(path)],check=True,capture_output=True)
report['javascript_syntax']='pass'
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox']);page=b.new_page();errors=[];page.on('pageerror',lambda e:errors.append(str(e)));page.goto('http://127.0.0.1:8772/YaguaTool/');page.wait_for_timeout(250);print('loaded',flush=True)
 page.locator('#preset-search').click();report['search_results']=page.locator('.palette-results button').count();assert report['search_results']>=76
 page.locator('.preset-palette input').fill('Prism Split');page.locator('.palette-results button').first.click();assert page.locator('.sweep-style-choice.active').inner_text().startswith('Prism Split');report['search_select_sweep']='pass'
 page.locator('#preset-search').click();page.locator('.preset-palette input').fill('Slide');page.locator('.palette-results button').filter(has_text='Motion Lab v0.9').first.click();assert page.locator('#yt-lab').count();report['search_select_lab']='pass'
 print('search passed',flush=True);report['lab_presets']=page.evaluate('YMX_TEST.catalog.length');assert report['lab_presets']==33
 report['lab_parameters']=page.evaluate('''()=>{let result=[];for(let p of YMX_TEST.catalog){YMX_TEST.select(p.id);result.push({id:p.id,controls:document.querySelectorAll('#yt-lab input,#yt-lab select').length,fill:!!document.querySelector('#fillMode')});}return result}''')
 report['responsive']=[]
 for section in ['text','complex','library','carrousel','dynamicgrid','motion','backgrounds','graph','tools','saved','grid','settings']:
  page.evaluate('(s)=>YaguaPanel.navigate(s)',section)
  for w in [260,340,420,720,1100]:
   page.set_viewport_size({'width':w,'height':800});page.wait_for_timeout(430);v=page.evaluate('({doc:document.documentElement.scrollWidth,cw:innerWidth,view:document.getElementById("page").scrollWidth,vw:document.getElementById("page").clientWidth})');report['responsive'].append({'section':section,'width':w,**v});assert v['doc']<=v['cw']+1 and v['view']<=v['vw']+1,(section,w,v)
 page.set_viewport_size({'width':420,'height':800});page.locator('.nav-toggle').click();page.wait_for_timeout(450);assert page.locator('#tabs.is-open').count();report['inactive_responsive_halos']=page.locator('#tabs .nav-item:not(.on)').evaluate_all('(els)=>els.map(e=>getComputedStyle(e,"::before").opacity)');assert set(report['inactive_responsive_halos'])=={'0'}
 page.locator('.nav-toggle').click();page.wait_for_timeout(450);page.evaluate('YaguaPanel.navigate("dynamicgrid")');report['grid_tabs']={}
 for tab in ['Grid','Animate','Backdrop','Attach']:
  page.locator('.dg-tabbar button').filter(has_text=tab).click();report['grid_tabs'][tab]=page.locator('.dg-card input,.dg-card select,.dg-card button').count()
 page.screenshot(path=str(out/'Grid-Pro-responsive.png'))
 page.evaluate('YaguaPanel.navigate("tools")');page.set_viewport_size({'width':1100,'height':800});page.wait_for_timeout(450);page.locator('.anchor').scroll_into_view_if_needed();page.screenshot(path=str(out/'Anchor-Point.png'));report['anchor_gap']=page.locator('.anchor').evaluate('(e)=>getComputedStyle(e).gap');assert report['anchor_gap']=='8px'
 page.locator('#preset-search').click();page.screenshot(path=str(out/'Buscador.png'));page.keyboard.press('Escape');page.evaluate('YaguaPanel.navigate("text",null,"lab","pack-apple-style-pack-slide")');page.wait_for_timeout(200);page.screenshot(path=str(out/'Motion-Lab.png'));report['errors']=errors;assert not errors;report['ae_runtime']='Not executed: After Effects is unavailable in this Linux environment.';b.close()
(out/'RESULTADOS.json').write_text(json.dumps(report,indent=2,ensure_ascii=False));print('PASS',len(report['protected_files']),'protected files;',len(report['responsive']),'responsive states;',report['lab_presets'],'Lab presets;',report['search_results'],'search results')
