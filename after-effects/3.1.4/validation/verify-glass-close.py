from pathlib import Path
from playwright.sync_api import sync_playwright
import json
out=Path(__file__).resolve().parent
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox']);page=b.new_page(viewport={'width':1100,'height':850});errors=[];page.on('pageerror',lambda e:errors.append(str(e)));page.goto('http://127.0.0.1:8775/YaguaTool/');page.wait_for_timeout(150);report={'glass':[]}
 for section in ['text','library','dynamicgrid']:
  page.evaluate('(s)=>YaguaPanel.navigate(s)',section);page.wait_for_timeout(100);selected=page.locator('[data-yagua-selected=true]').first
  report['glass'].append(selected.evaluate('e=>({background:getComputedStyle(e).backgroundImage,color:getComputedStyle(e).backgroundColor,shadow:getComputedStyle(e).boxShadow,selected:e.dataset.yaguaSelected})'))
  other=page.locator('button[data-yagua-selected=true]').first.locator('xpath=..').locator('button:not([data-yagua-selected=true])').first
  if other.count():assert other.evaluate('e=>getComputedStyle(e).backgroundImage')!=report['glass'][-1]['background']
  assert 'linear-gradient' in report['glass'][-1]['background'];assert 'inset' in report['glass'][-1]['shadow']
  if section=='dynamicgrid':page.get_by_role('button',name='Crear / reconstruir grid',exact=True).scroll_into_view_if_needed()
  page.screenshot(path=str(out/('Glass-'+section+'.png')))
 for w in [260,420,1100]:
  page.set_viewport_size({'width':w,'height':800});page.locator('#preset-search').click();page.wait_for_timeout(100);close=page.get_by_role('button',name='Cerrar búsqueda',exact=True);box=close.bounding_box();assert box['width']>=36 and box['height']>=36;assert close.locator('svg').count()==1;assert close.locator('svg').bounding_box()['width']==18;page.screenshot(path=str(out/('Close-'+str(w)+'.png')));close.click();assert page.locator('.preset-palette').count()==0
 report['close']='36x36 target, 18px cross; search closes at 260/420/1100 px'
 page.evaluate("""()=>{let s=JSON.parse(localStorage.getItem('animix.v1'));s.savedTab='refs';s.refFolders=['General'];s.refFolder='General';s.refs=[{id:1,name:'Referencia de prueba',folder:'General',url:'assets/fluido-reference.png'}];localStorage.setItem('animix.v1',JSON.stringify(s));}""");page.reload();page.evaluate('YaguaPanel.navigate("saved")');page.wait_for_timeout(100);close=page.get_by_role('button',name='Eliminar referencia',exact=True);close.scroll_into_view_if_needed();assert close.bounding_box()['width']==36;page.screenshot(path=str(out/'Close-reference.png'));close.press('Enter');assert page.locator('.thumb').count()==0;assert page.locator('#viewer').is_hidden();report['reference_removal']='36px cross removes only the reference using Enter'
 page.locator('#theme-toggle').click();page.wait_for_timeout(250);page.evaluate('YaguaPanel.navigate("library")');page.wait_for_timeout(100);page.screenshot(path=str(out/'Glass-light.png'));report['errors']=errors;assert not errors;b.close()
(out/'GLASS_CLOSE.json').write_text(json.dumps(report,indent=2));print('PASS Glass surfaces; close size/action; light theme')
