from pathlib import Path
from playwright.sync_api import sync_playwright
import json
root=Path('/workspace/work/yaguano-visual/propuestas/ui-3.1.0');out=root/'revision-cabecera-temas';out.mkdir(exist_ok=True)
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True);page=b.new_page(viewport={'width':1280,'height':900});errors=[];page.on('pageerror',lambda e:errors.append(str(e)));page.goto('http://127.0.0.1:8771/mock/');page.evaluate('document.fonts.ready')
 assert page.locator('.topbar #nav-toggle').count()==0 and page.locator('#nav #nav-toggle').count()==1
 assert page.locator('#nav .brand-lockup,#nav .nav-brand').count()==0
 assert page.locator('.topbar [data-brand]').inner_text()=='YaguaTool'
 assert page.locator('footer').inner_text().split('\n')==['Yagua Tool','v3.1.0']
 assert page.locator('#help').count()==0
 page.evaluate("YaguanoMock.select('text','Motion Lab v0.9')")
 gap=page.evaluate("document.querySelector('.lab-section-head').getBoundingClientRect().top-document.querySelector('.lab-text-first').getBoundingClientRect().bottom")
 assert gap>=24,gap
 page.locator('.lab-section-head').scroll_into_view_if_needed();page.screenshot(path=str(out/'MotionLab_oscuro.png'))
 background=page.evaluate('getComputedStyle(document.body).backgroundColor');page.click('#theme-toggle');page.wait_for_timeout(450);assert page.locator('html').get_attribute('data-theme')=='light'
 assert page.evaluate('getComputedStyle(document.body).backgroundColor')!=background
 page.screenshot(path=str(out/'MotionLab_claro.png'));page.reload();assert page.locator('html').get_attribute('data-theme')=='light'
 assert page.locator('#theme-toggle').get_attribute('aria-label')=='Activar tema oscuro'
 page.click('#theme-toggle');page.wait_for_timeout(450);assert page.locator('html').get_attribute('data-theme')=='dark'
 # Both modes and the Lab at narrow widths must retain geometry.
 assert page.locator('#nav button[data-page]').first.evaluate('e=>getComputedStyle(e).paddingLeft')=='8px'
 measurements=[]
 for theme in ['dark','light']:
  if page.locator('html').get_attribute('data-theme')!=theme:page.click('#theme-toggle')
  for width in [220,240,320,420,1000]:
   page.set_viewport_size({'width':width,'height':800});page.wait_for_timeout(70);page.evaluate('YaguanoReference.setOpen(false)');page.evaluate("YaguanoMock.select('text','Motion Lab v0.9')")
   dimensions=page.evaluate('({document:document.documentElement.scrollWidth,viewport:innerWidth,view:document.getElementById("view").scrollWidth,client:document.getElementById("view").clientWidth})');assert dimensions['document']<=dimensions['viewport'] and dimensions['view']<=dimensions['client']+1,dimensions
   measurements.append({'theme':theme,'width':width,**dimensions})
   if width in [240,1000]:page.screenshot(path=str(out/(theme+'-'+str(width)+'.png')))
  page.locator('#nav-toggle').click();assert page.locator('#nav-toggle').get_attribute('aria-expanded')=='true'
 assert not errors,errors
 (out/'RESULTADOS.json').write_text(json.dumps({'titleGap':gap,'themePersists':True,'themeChangesSurface':True,'toggleInRail':True,'noDuplicatedBrand':True,'footer':'Yagua Tool · v3.1.0','measurements':measurements,'errors':errors},indent=2));b.close()
