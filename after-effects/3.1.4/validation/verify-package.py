from pathlib import Path
import hashlib,json,re,zipfile
here=Path(__file__).resolve().parent
version=here.parent
repo=version.parents[1]
archive=version/'YaguaTool_3.1.4_AfterEffects.zip'
allowed={'CSXS','jsx','js','css','assets','motion-lab','lab-data','library','index.html','.debug'}
with zipfile.ZipFile(archive) as z:
 names=set(z.namelist());prefix='Extension/YaguaTool/'
 runtime=[n for n in names if n.startswith(prefix)]
 assert runtime
 assert all(n.removeprefix(prefix).split('/')[0] in allowed for n in runtime)
 assert not any('/qa/' in n or n.endswith(('.md','.bat','.ps1','.command')) for n in runtime if '/assets/' not in n)
 for name in ['install_windows.bat','install_windows.ps1','Install-Core.ps1','install_mac.command','PACKAGE_INTEGRITY.json','Documentacion/INSTALACION.md','Documentacion/NOVEDADES.md']:
  assert name in names,name
 assert z.read('Install-Core.ps1')==(version/'installer/Install-Core.ps1').read_bytes()
 assert z.read('install_windows.ps1')==(version/'installer/install_windows.ps1').read_bytes()
 records=json.loads(z.read('PACKAGE_INTEGRITY.json'))['files'];assert len(records)==len(runtime)
 for entry in records:
  data=z.read(prefix+entry['path']);assert len(data)==entry['size'];assert hashlib.sha256(data).hexdigest()==entry['sha256']
 for ref in re.findall(r'(?:src|href)="([^"#]+)"',z.read(prefix+'index.html').decode()):
  if not re.match(r'(https?:|data:)',ref):assert prefix+ref in names,ref
 assert z.getinfo('install_mac.command').external_attr>>16 & 0o111
 bat=z.read('install_windows.bat');assert b'\r\n' in bat and b'%~dp0.' in bat and b'install_windows.ps1' in bat
 unchanged=0
 with zipfile.ZipFile(repo/'YaguaTool_3.1.0.zip') as original:
  for name in original.namelist():
   if not name.startswith('YaguaTool/') or name.endswith('/'):continue
   relative=name.removeprefix('YaguaTool/')
   if relative.split('/')[0] not in allowed:continue
   if (version/'patch'/relative).exists():continue
   assert original.read(name)==z.read(prefix+relative),relative
   unchanged+=1
 result={'runtime_files':len(runtime),'integrity_files':len(records),'original_unmodified_files':unchanged,'folders':['Extension/YaguaTool','Documentacion'],'all_references_exist':True,'runtime_has_no_docs_or_installers':True,'windows_launchers_in_root':True,'mac_executable':True}
 (here/'PACKAGE.json').write_text(json.dumps(result,indent=2));print('PASS package:',result)
