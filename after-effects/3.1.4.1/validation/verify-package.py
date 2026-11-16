from pathlib import Path
import hashlib,json,re,zipfile
here=Path(__file__).resolve().parent
version=here.parent
repo=version.parents[1]
archive=version/'YaguaTool_3.1.4.1_AfterEffects.zip'
allowed={'CSXS','jsx','js','css','assets','motion-lab','lab-data','library','index.html','.debug'}
guides={'README_INSTALACION.md','README_FUNCIONES.md'}
with zipfile.ZipFile(archive) as clean:
 names=set(clean.namelist());prefix='Extension/YaguaTool/';runtime=[n for n in names if n.startswith(prefix)]
 assert runtime and not any(n.startswith('Documentacion/') for n in names)
 assert all(n.removeprefix(prefix).split('/')[0] in allowed for n in runtime)
 assert not any('/qa/' in n or n.endswith(('.md','.bat','.ps1','.command')) for n in runtime if '/assets/' not in n)
 for name in {'install_windows.bat','install_windows.ps1','Install-Core.ps1','install_mac.command','PACKAGE_INTEGRITY.json'}|guides:assert name in names,name
 for name in guides:assert clean.read(name)==(version/name).read_bytes()
 assert clean.read('Install-Core.ps1')==(version/'installer/Install-Core.ps1').read_bytes()
 assert clean.read('install_windows.ps1')==(version/'installer/install_windows.ps1').read_bytes()
 records=json.loads(clean.read('PACKAGE_INTEGRITY.json'))['files'];assert len(records)==len(runtime)
 for entry in records:
  data=clean.read(prefix+entry['path']);assert len(data)==entry['size'];assert hashlib.sha256(data).hexdigest()==entry['sha256']
 for ref in re.findall(r'(?:src|href)="([^"#]+)"',clean.read(prefix+'index.html').decode()):
  if not re.match(r'(https?:|data:)',ref):assert prefix+ref in names,ref
 assert clean.getinfo('install_mac.command').external_attr>>16 & 0o111
 bat=clean.read('install_windows.bat');assert b'\r\n' in bat and b'%~dp0.' in bat
 unchanged=0
 with zipfile.ZipFile(repo/'YaguaTool_3.1.0.zip') as original:
  for name in original.namelist():
   if not name.startswith('YaguaTool/') or name.endswith('/'):continue
   relative=name.removeprefix('YaguaTool/')
   if relative.split('/')[0] not in allowed or (version/'patch'/relative).exists():continue
   assert original.read(name)==clean.read(prefix+relative),relative
   unchanged+=1
 with zipfile.ZipFile(version/'YaguaTool_3.1.4.1_Completo.zip') as full:
  complete=set(full.namelist());assert names<=complete
  for name in names:assert clean.read(name)==full.read(name),name
  assert all(n.startswith('Documentacion/') for n in complete-names)
  assert any(n.startswith('Documentacion/Historial/') for n in complete)
  assert 'Documentacion/Validacion/TEXT_EDITING.json' in complete
  assert 'Documentacion/Presentacion/01-Motion-Lab.png' in complete
  assert full.testzip() is None
 assert clean.testzip() is None
 result={'runtime_files':len(runtime),'integrity_files':len(records),'original_unmodified_files':unchanged,'guides_in_both':sorted(guides),'same_runtime_installers_and_guides':True,'clean_has_no_history_or_validation':True,'full_contains_history_validation_and_screenshots':True,'all_references_exist':True,'mac_executable':True}
 (here/'PACKAGE.json').write_text(json.dumps(result,indent=2));print('PASS both distributions:',result)
