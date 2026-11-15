"""Build clean runtime + separate documentation + transactional installers."""
from pathlib import Path
import hashlib,json,shutil,tempfile,zipfile
here=Path(__file__).resolve().parent
repo=here.parents[1]
runtime_dirs={'CSXS','jsx','js','css','assets','motion-lab','lab-data','library'}
runtime_files={'index.html','.debug'}
with tempfile.TemporaryDirectory(prefix='yagua-ae-') as temp:
 root=Path(temp);original=root/'original';package=root/'package';payload=package/'Extension/YaguaTool';docs=package/'Documentacion';docs.mkdir(parents=True);payload.mkdir(parents=True)
 with zipfile.ZipFile(repo/'YaguaTool_3.1.0.zip') as z:z.extractall(original)
 source=original/'YaguaTool'
 shutil.copytree(here/'patch',source,dirs_exist_ok=True)
 for path in sorted(source.iterdir()):
  if path.is_dir() and path.name in runtime_dirs:shutil.copytree(path,payload/path.name)
  elif path.name in runtime_files:shutil.copy(path,payload/path.name)
  elif path.name not in {'install_windows.bat','install_mac.command'}:
   dest=docs/'Historial'/path.name;dest.parent.mkdir(parents=True,exist_ok=True)
   if path.is_dir():shutil.copytree(path,dest)
   else:shutil.copy(path,dest)
 shutil.copy(here/'README.md',docs/'LEEME.md')
 for name in ['NOVEDADES.md','INSTALACION.md']:
  if (here/name).exists():shutil.copy(here/name,docs/name)
 if (here/'validation').exists():shutil.copytree(here/'validation',docs/'Validacion')
 for path in (here/'installer').iterdir():
  if path.is_file():
   if path.suffix=='.bat':(package/path.name).write_bytes(path.read_text(encoding='ascii').replace('\n','\r\n').encode('ascii'))
   else:shutil.copy(path,package/path.name)
 records=[]
 for path in sorted(payload.rglob('*')):
  if path.is_file():records.append({'path':path.relative_to(payload).as_posix(),'size':path.stat().st_size,'sha256':hashlib.sha256(path.read_bytes()).hexdigest()})
 (package/'PACKAGE_INTEGRITY.json').write_text(json.dumps({'version':'3.1.4','files':records},indent=2),encoding='utf-8')
 (package/'LEEME.txt').write_text('YaguaTool 3.1.4\n\nExtrae TODO el ZIP. Cierra After Effects. Ejecuta install_windows.bat o install_mac.command desde esta carpeta.\nExtension/YaguaTool contiene SOLO la extension; Documentacion contiene novedades, instrucciones y validacion.\nInstalacion manual: copia SOLO Extension/YaguaTool a Adobe/CEP/extensions de tu usuario.\nNo copies la carpeta Documentacion ni toda la carpeta del paquete dentro de CEP.\nConsulta Documentacion/INSTALACION.md.\n',encoding='utf-8')
 output=here/'YaguaTool_3.1.4_AfterEffects.zip'
 with zipfile.ZipFile(output,'w',zipfile.ZIP_DEFLATED) as archive:
  for path in sorted(package.rglob('*')):
   if path.is_file():
    info=zipfile.ZipInfo.from_file(path,path.relative_to(package))
    if path.suffix=='.command':info.external_attr=0o100755<<16
    archive.writestr(info,path.read_bytes(),compress_type=zipfile.ZIP_DEFLATED)
 print(output)
