from pathlib import Path
from playwright.sync_api import sync_playwright
import json
root=Path(__file__).resolve().parent.parent;out=root/'revision-motion-lab';out.mkdir(exist_ok=True)
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True)
 ctx=b.new_context(viewport={'width':1280,'height':900},record_video_dir='/workspace/work/new-ui-clip',record_video_size={'width':1280,'height':900});page=ctx.new_page();page.goto('http://127.0.0.1:8771/mock/');page.evaluate('document.fonts.ready')
 labels=page.locator('#nav').evaluate('e=>[...e.querySelectorAll("button[data-page]")].slice(0,5).map(x=>x.dataset.page)');assert labels==['text','complex','library','carrousel','dynamicgrid'],labels
 assert page.locator('.wordmark [data-brand]').inner_text()=='YagutaTool'
 assert page.locator('.wordmark small').evaluate('e=>getComputedStyle(e).fontWeight')=='300'
 assert page.locator('#nav [data-page=complex]').evaluate("e=>getComputedStyle(e,'::after').content")=='none'
 page.screenshot(path=str(out/'Texto_1280.png'))
 for name in ['motion','tools','complex','dynamicgrid']:
  page.locator('#nav [data-page='+name+']').click();page.wait_for_timeout(450)
 page.locator('#nav').screenshot(path=str(out/'Rail_iconos_orden.png'))
 page.evaluate("YaguanoMock.select('text','Motion Lab v0.9')");page.wait_for_timeout(300)
 page.locator('.yt-lab .output-stage').scroll_into_view_if_needed();page.wait_for_timeout(400);page.screenshot(path=str(out/'MotionLab_preview_1280.png'))
 for tab in ['motion','fill','trails','advanced']:
  page.locator('#controlTabs [data-tab='+tab+']').click();page.locator('#controlTabs').scroll_into_view_if_needed();page.wait_for_timeout(200);page.screenshot(path=str(out/('MotionLab_'+tab+'_1280.png')))
 page.locator('#packTabs button').filter(has_text='Ghost Pack').click();page.locator('#cards').scroll_into_view_if_needed();page.wait_for_timeout(350);page.screenshot(path=str(out/'Ghost_previews.png'))
 # Preview and full controls at narrow widths; native glyphs intentionally clip in preview viewport.
 for width in [240,320,420,1000]:
  page.set_viewport_size({'width':width,'height':800});page.wait_for_timeout(100);page.evaluate('YaguanoReference.setOpen(false)');page.locator('.yt-lab .output-stage').scroll_into_view_if_needed();page.wait_for_timeout(200);page.screenshot(path=str(out/('MotionLab_preview_'+str(width)+'.png')))
 page.set_viewport_size({'width':320,'height':800});page.click('#nav-toggle');page.locator('#nav [data-page=tools]').click();assert page.locator('#nav-toggle').get_attribute('aria-expanded')=='true';page.screenshot(path=str(out/'Rail_320_abierto.png'))
 video=page.video;ctx.close();video.save_as(str(out/'Navegacion_y_preview.webm'));b.close()
 (out/'ORDEN_Y_MARCA.json').write_text(json.dumps({'createOrder':labels,'branding':'YagutaTool','subtitle':'Motion Lab','subtitleWeight':300,'complexExtraLine':False,'railAutoClosesOnSelection':False},indent=2))
