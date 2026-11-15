from playwright.sync_api import sync_playwright
from pathlib import Path
import json
root=Path(__file__).resolve().parent.parent;out=root/'revision-referencia';out.mkdir(exist_ok=True)
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
 ctx=b.new_context(viewport={'width':1000,'height':800},record_video_dir=str(out/'video'),record_video_size={'width':1000,'height':800})
 page=ctx.new_page();errors=[];page.on('pageerror',lambda e:errors.append(str(e)));page.goto('http://127.0.0.1:8771/mock/');page.evaluate('document.fonts.ready')
 assert page.locator('#nav-toggle').get_attribute('aria-expanded')=='true'
 page.set_viewport_size({'width':240,'height':800});page.wait_for_timeout(150)
 assert page.locator('#nav-toggle').get_attribute('aria-expanded')=='false'
 page.click('#nav-toggle');page.wait_for_timeout(250)
 assert page.locator('#nav-toggle').get_attribute('aria-expanded')=='true'
 assert page.locator('#nav').evaluate('e=>e.getBoundingClientRect().width')==216
 assert page.locator('#nav .nav-name').filter(has_text='Complex text animation').evaluate('e=>e.scrollWidth<=e.clientWidth+1')
 page.screenshot(path=str(out/'Rail_240_abierto.png'));page.reload();assert page.locator('#nav-toggle').get_attribute('aria-expanded')=='true'
 page.keyboard.press('Escape');assert page.locator('#nav-toggle').get_attribute('aria-expanded')=='false'
 page.click('#nav-toggle');page.locator('#nav [data-page=complex]').click();assert page.locator('#nav-toggle').get_attribute('aria-expanded')=='false'
 page.set_viewport_size({'width':1000,'height':800});page.wait_for_timeout(100)
 switch=page.locator('.switch').first;track=switch.locator('.switch-track')
 assert track.evaluate('e=>[e.offsetWidth,e.offsetHeight]')==[38,22]
 assert track.evaluate("e=>getComputedStyle(e,'::after').backgroundColor")=='rgb(255, 255, 255)'
 switch.click();page.wait_for_timeout(300)
 assert track.evaluate("e=>getComputedStyle(e,'::after').transform")=='matrix(1, 0, 0, 1, 16, 0)'
 switch.screenshot(path=str(out/'Interruptor_ON.png'));page.keyboard.press('Space');page.wait_for_timeout(300)
 assert track.evaluate("e=>new DOMMatrix(getComputedStyle(e,'::after').transform).e")==0
 switch.screenshot(path=str(out/'Interruptor_OFF.png'))
 page.evaluate("YaguanoMock.select('text')")
 primary=page.locator('#actionbar .primary');primary.click();assert 'Yaguano ·' in page.locator('#toast').inner_text();page.wait_for_timeout(2700);assert 'show' not in (page.locator('#toast').get_attribute('class')or'')
 assert page.locator('#view .screen').evaluate('e=>getComputedStyle(e).animationName')=='none'
 # Only one ambient primary; idle halos are paused.
 assert page.locator('.primary').count()==1
 secondary=page.locator('#actionbar .secondary-action');page.mouse.move(0,0);secondary.screenshot(path=str(out/'Halo_reposo.png'))
 assert secondary.evaluate("e=>getComputedStyle(e,'::before').animationPlayState")=='paused'
 secondary.hover();page.wait_for_timeout(300);secondary.screenshot(path=str(out/'Halo_hover.png'))
 assert secondary.evaluate("e=>getComputedStyle(e,'::before').opacity")=='0.75'
 page.mouse.down();page.wait_for_timeout(150);secondary.screenshot(path=str(out/'Halo_pulsado.png'));page.mouse.up()
 assert secondary.evaluate("e=>getComputedStyle(e).transitionDuration.split(',')[0]").strip()=='0.2s'
 primary.screenshot(path=str(out/'Halo_principal.png'))
 page.mouse.move(0,0);secondary.focus();page.keyboard.press('Tab');page.keyboard.press('Shift+Tab');secondary.screenshot(path=str(out/'Halo_foco.png'))
 # Pointer cancellation clears press state; section changes do not animate content.
 secondary.dispatch_event('pointerdown',{'button':0});secondary.dispatch_event('pointercancel');assert not secondary.evaluate("e=>e.classList.contains('is-down')")
 page.evaluate("YaguanoMock.select('text')")
 preset=page.locator('.preset').first;identity=preset.evaluate('e=>{window.testPreset=e;return true;}');preset.click();assert page.evaluate('testPreset.isConnected');assert preset.get_attribute('aria-pressed')=='true'
 # Small-view expanded rail is checked for every width.
 for width in [220,240,280,320,360,420,520,720]:
  page.set_viewport_size({'width':width,'height':560});page.wait_for_timeout(60);page.evaluate('YaguanoReference.setOpen(true)');assert page.evaluate('document.documentElement.scrollWidth<=innerWidth');page.keyboard.press('Escape')
 states=page.evaluate('YaguanoMock.sections');states += [{'id':'motion-lab','page':'text','sub':'Motion Lab v0.9'},{'id':'tools-shapes','page':'tools','sub':'Shapes y comps'},{'id':'tools-code','page':'tools','sub':'Scripts y expresiones'}]
 page.wait_for_timeout(2700);page.mouse.move(0,0);page.evaluate('document.activeElement.blur()')
 # Reproducible per-screen captures, reduced motion to avoid time-dependent frames.
 page.emulate_media(reduced_motion='reduce')
 for state in states:
  page.evaluate('s=>YaguanoMock.select(s.page||s.id,s.sub)',state)
  for width in [240,320,420,1000]:
   page.set_viewport_size({'width':width,'height':800});page.wait_for_timeout(60);page.evaluate('YaguanoReference.setOpen(innerWidth>720)');page.screenshot(path=str(out/(state['id']+'-'+str(width)+'.png')))
 page.evaluate("YaguanoMock.select('complex')");page.locator('.switch').first.click()
 assert page.locator('.switch').first.evaluate('e=>getComputedStyle(e).transform')=='none'
 assert page.locator('.halo').first.evaluate("e=>getComputedStyle(e,'::before').animationName")=='none'
 assert not errors,errors
 (out/'INTERACCIONES.json').write_text(json.dumps({'responsiveRailWidths':8,'screenshots':60,'checks':['rail open/close/persistence/Escape','switch 38x22 white knob 18, travel 16','toast naming and timeout','one ambient primary','idle/hover/pressed/cancelled halos','selection DOM retained','static section content','reduced motion'],'pageErrors':errors},indent=2))
 ctx.close();b.close()
