from pathlib import Path
import hashlib,json,os,zipfile
here=Path(__file__).resolve().parent
repo=here.parents[2]
runtime=Path(os.environ.get('YAGUA_EXTENSION_ROOT','/workspace/work/ae-ui-3.1.4.1/Extension/YaguaTool'))
unchanged=['jsx/lab-native.jsx','jsx/lab-editable.jsx','motion-lab/reference-player.js','motion-lab/reference-scene.js','motion-lab/bake.js','motion-lab/catalog-data.js']
with zipfile.ZipFile(repo/'after-effects/3.1.4/YaguaTool_3.1.4_AfterEffects.zip') as base:
 for name in unchanged:
  assert (runtime/name).read_bytes()==base.read('Extension/YaguaTool/'+name),name+' differs from 3.1.4'
 assert not (runtime/'jsx/lab-selected.jsx').exists(),'experimental native text adapter must not ship'
 manifest=json.loads((runtime/'lab-data/manifest.json').read_text())
 assert len(manifest)==33
 rows=[]
 for entry in manifest:
  file=runtime/'lab-data'/entry['file'];raw=file.read_bytes();data=json.loads(raw)
  assert data['text']=='Yaguano',entry['name']+' still generates '+repr(data['text'])
  previous=json.loads(base.read('Extension/YaguaTool/lab-data/'+entry['file']))
  assert data['parameters']==previous['parameters'],entry['name']+' preset parameters changed'
  assert data['fps']==previous['fps']==60
  assert ''.join(c['text'] for g in data['geometry'] for c in g['chars'])=='Yaguano',entry['name']+' glyphs do not spell Yaguano'
  assert len(data['frames'])==entry['frames'] and any(data['frames'])
  assert hashlib.sha256(raw).hexdigest()==entry['sha256']
  rows.append({'id':entry['id'],'text':data['text'],'frames':entry['frames']})
 report={'scope':'File identity with 3.1.4 and regenerated default data; no AE pixel rendering','unchangedEngineFiles':unchanged,'defaultPresets':rows,'allDefaultTexts':'Yaguano','defaultParametersUnchanged':True,'noExperimentalTextAdapter':True}
 (here/'RESTORATION.json').write_text(json.dumps(report,indent=2));print('PASS: 3.1.4 engine preserved; all 33 native defaults use Yaguano with original parameters.')
