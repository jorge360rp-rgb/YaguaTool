"""Build clean installer and full history edition."""
from pathlib import Path
import hashlib,json,shutil,tempfile,zipfile,subprocess,sys
here=Path(__file__).resolve().parent
repo=here.parents[1]
subprocess.run([sys.executable,str(here/'compile_host.py')],check=True)
runtime_dirs={'CSXS','jsx','js','css','assets','motion-lab','lab-data','library'}
runtime_files={'index.html','.debug'}
def pack(folder,output):
 with zipfile.ZipFile(output,'w',zipfile.ZIP_DEFLATED) as archive:
  for path in sorted(folder.rglob('*')):
   if path.is_file():
    info=zipfile.ZipInfo.from_file(path,path.relative_to(folder))
    if path.suffix=='.command':info.external_attr=0o100755<<16
    archive.writestr(info,path.read_bytes(),compress_type=zipfile.ZIP_DEFLATED)
 print(output)
with tempfile.TemporaryDirectory(prefix='yagua-ae-') as temp:
 root=Path(temp);original=root/'original';package=root/'package';payload=package/'Extension/YaguaTool';payload.mkdir(parents=True)
 with zipfile.ZipFile(repo/'YaguaTool_3.1.0.zip') as z:z.extractall(original)
 source=original/'YaguaTool'
 shutil.copytree(here/'patch',source,dirs_exist_ok=True)
 for path in sorted(source.iterdir()):
  if path.is_dir() and path.name in runtime_dirs:shutil.copytree(path,payload/path.name)
  elif path.name in runtime_files:shutil.copy(path,payload/path.name)
 for path in (here/'installer').iterdir():
  if path.is_file():
   if path.suffix=='.bat':(package/path.name).write_bytes(path.read_text(encoding='ascii').replace('\n','\r\n').encode('ascii'))
   else:shutil.copy(path,package/path.name)
 for name in ['README_INSTALACION.md','README_FUNCIONES.md']:shutil.copy(here/name,package/name)
 records=[]
 for path in sorted(payload.rglob('*')):
  if path.is_file():records.append({'path':path.relative_to(payload).as_posix(),'size':path.stat().st_size,'sha256':hashlib.sha256(path.read_bytes()).hexdigest()})
 (package/'PACKAGE_INTEGRITY.json').write_text(json.dumps({'version':'3.1.4.1','files':records},indent=2),encoding='utf-8')
 pack(package,here/'YaguaTool_3.1.4.1_AfterEffects.zip')
 # The full edition adds support material without changing any installable file.
 docs=package/'Documentacion';history=docs/'Historial';history.mkdir(parents=True)
 for path in sorted(source.iterdir()):
  if path.name in runtime_dirs|runtime_files|{'install_windows.bat','install_mac.command'}:continue
  dest=history/'Base_3.1.0'/path.name;dest.parent.mkdir(parents=True,exist_ok=True)
  if path.is_dir():shutil.copytree(path,dest)
  else:shutil.copy(path,dest)
 for version in ['3.1.1','3.1.2','3.1.3','3.1.4','3.1.5','3.1.6','3.1.4.1']:
  version_dir=repo/'after-effects'/version
  for name in ['README.md','NOVEDADES.md','INSTALACION.md']:
   if (version_dir/name).exists():
    dest=history/version/name;dest.parent.mkdir(parents=True,exist_ok=True);shutil.copy(version_dir/name,dest)
  if version!='3.1.4.1' and (version_dir/'validation').exists():
   for path in (version_dir/'validation').glob('*.json'):
    dest=history/version/'Validacion'/path.name;dest.parent.mkdir(parents=True,exist_ok=True);shutil.copy(path,dest)
 shutil.copytree(here/'validation',docs/'Validacion')
 for name in ['NOVEDADES.md','INSTALACION.md']:shutil.copy(here/name,docs/name)
 if (here/'presentacion').exists():shutil.copytree(here/'presentacion',docs/'Presentacion')
 pack(package,here/'YaguaTool_3.1.4.1_Completo.zip')
