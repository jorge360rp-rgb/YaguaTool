"""Assemble an ES3 CEP host from the baseline archive and the current patches."""
from pathlib import Path
import hashlib,posixpath,zipfile
here=Path(__file__).resolve().parent
repo=here.parents[1]
names=['host.jsx','yagua-core.jsx','lab-native.jsx','complex-text.jsx','carrousel.jsx','tools-pro.jsx','../js/workflow-model.js','workflow.jsx','lab-editable.jsx']
with zipfile.ZipFile(repo/'YaguaTool_3.1.0.zip') as z:
 baseline=z.read('YaguaTool/jsx/yagua-host.jsx').decode('utf-8')
 parts=['// YaguaTool 3.1.5 - self-contained CEP host.\nvar YaguaHostBoot={version:"3.1.5",modules:[],errors:[]};\n']
 for name in names:
  relative=posixpath.normpath('jsx/'+name);patch=here/'patch'/relative
  source=patch.read_text(encoding='utf-8') if patch.exists() else z.read('YaguaTool/'+relative).decode('utf-8').replace('\r\n','\n').replace('\r','\n')
  source='\n'.join(line.rstrip() for line in source.split('\n'))
  assert '#include' not in source
  parts.append('\n// MODULE '+name+' SHA256 '+hashlib.sha256(source.encode()).hexdigest()+'\ntry {\n'+source+'\nYaguaHostBoot.modules.push("'+name+'");\n} catch (yaguaModuleError) {\nYaguaHostBoot.errors.push("'+name+': "+String(yaguaModuleError.message||yaguaModuleError)+" (line "+String(yaguaModuleError.line||"?")+")");\n}\n')
 footer=baseline[baseline.rindex('\nif(typeof Animix==='):].replace('3.1.0','3.1.5')
 parts.append(footer)
 target=here/'patch/jsx/yagua-host.jsx';target.write_text(''.join(parts),encoding='utf-8')
 print('Built self-contained host 3.1.5:',target.stat().st_size,'bytes')
