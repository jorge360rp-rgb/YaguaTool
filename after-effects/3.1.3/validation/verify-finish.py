from pathlib import Path
from playwright.sync_api import sync_playwright
import json
out=Path(__file__).resolve().parent
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox']);page=b.new_page(viewport={'width':1100,'height':850});errors=[];page.on('pageerror',lambda e:errors.append(str(e)));page.goto('http://127.0.0.1:8774/YaguaTool/');page.wait_for_timeout(200);report={'selected':[]}
 def state(e):return e.evaluate('e=>({text:e.textContent.trim(),bg:getComputedStyle(e).backgroundImage,shadow:getComputedStyle(e).boxShadow,border:getComputedStyle(e).borderColor,selected:e.dataset.yaguaSelected,outline:getComputedStyle(e).outlineStyle,halo:getComputedStyle(e.querySelector(".yagua-halo-ring")).opacity})')
 # Check state distinction on both text workspaces, phases and curve editor.
 for section,group in [('text','.text-workspace-tabs .seg'),('text','.phase-options .seg'),('graph','.seg')]:
  page.evaluate('(s)=>YaguaPanel.navigate(s)',section);page.wait_for_timeout(100);buttons=page.locator(group).first.locator('button');
  for i in range(min(2,buttons.count())):
   buttons.nth(i).click();page.wait_for_timeout(150);buttons=page.locator(group).first.locator('button');active=buttons.nth(i);value=state(active);assert value['selected']=='true';assert 'linear-gradient' in value['bg'];assert float(value['halo'])>=.5;assert value['outline']=='none';report['selected'].append(value)
   if section=='text' and group=='.text-workspace-tabs .seg':page.screenshot(path=str(out/('workspace-'+str(i)+'.png')))
  page.screenshot(path=str(out/('selected-'+section+'.png')))
 page.evaluate('YaguaPanel.navigate("dynamicgrid")');page.wait_for_timeout(100);action=page.get_by_role('button',name='Crear / reconstruir grid',exact=True);report['action']=state(action);assert 'linear-gradient' in report['action']['bg'];assert 'inset' in report['action']['shadow'];action.scroll_into_view_if_needed();page.screenshot(path=str(out/'Grid-actions.png'))
 page.evaluate('YaguaPanel.navigate("library")');page.wait_for_timeout(100);page.locator('.lib-pack-bar button').nth(1).click();page.wait_for_timeout(150);report['library_selection']=state(page.locator('.lib-pack-bar button').nth(1));assert report['library_selection']['selected']=='true';page.screenshot(path=str(out/'Library-packs.png'))
 page.evaluate('YaguaPanel.navigate("motion")');page.wait_for_timeout(100);report['motion_shape']=page.locator('.pv-shape').first.evaluate('e=>getComputedStyle(e).backgroundImage');assert '116, 203, 255' in report['motion_shape'];page.screenshot(path=str(out/'Motion-blue.png'))
 page.evaluate('YaguaPanel.navigate("complex")');assert page.locator('.fluid-transport').count()==0;assert page.get_by_role('button',name='Renderizar preview real',exact=True).count()==0;assert page.locator('.fluid-reference').evaluate('e=>e.complete&&e.naturalWidth===940');assert page.get_by_role('button',name='Crear copia editable',exact=True).count()==1;page.screenshot(path=str(out/'Complex-static.png'));report['complex_static']=True
 page.locator('.nav-toggle').click();page.wait_for_timeout(450);assert page.locator('.nav-toggle').inner_text().strip()=='Dashboard';assert page.get_by_role('button',name='Complex Text',exact=True).count()==1
 for target in [page.locator('.nav-toggle'),page.get_by_role('button',name='Texto',exact=True),page.get_by_role('button',name='Curvas',exact=True)]:
  target.click();page.wait_for_timeout(40);assert target.evaluate('e=>getComputedStyle(e).outlineStyle')=='none'
 page.keyboard.press('Tab');focused=page.locator(':focus');report['keyboard_focus']=focused.evaluate('e=>({tag:e.tagName,outline:getComputedStyle(e).outlineStyle,color:getComputedStyle(e).outlineColor})');assert report['keyboard_focus']['outline']!='none'
 report['errors']=errors;assert not errors;b.close()
(out/'FINISH.json').write_text(json.dumps(report,indent=2));print('PASS: raised selections, recessed actions, blue previews, static Complex, labels, pointer/keyboard focus')
