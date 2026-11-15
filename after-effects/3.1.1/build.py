"""Build the full CEP extension from the original 3.1.0 archive and reviewed UI patches."""
from pathlib import Path
import shutil, tempfile, zipfile
here=Path(__file__).resolve().parent
repo=here.parents[1]
with tempfile.TemporaryDirectory(prefix='yagua-ae-') as temp:
    root=Path(temp)
    with zipfile.ZipFile(repo/'YaguaTool_3.1.0.zip') as original:
        original.extractall(root)
    shutil.copytree(here/'patch',root/'YaguaTool',dirs_exist_ok=True)
    (root/'LEEME.txt').write_text((here/'README.md').read_text(),encoding='utf-8')
    with zipfile.ZipFile(here/'YaguaTool_3.1.1_AfterEffects.zip','w',zipfile.ZIP_DEFLATED) as archive:
        for path in sorted(root.rglob('*')):
            if path.is_file():
                info=zipfile.ZipInfo.from_file(path,path.relative_to(root))
                if path.suffix=='.command': info.external_attr=0o100755<<16
                archive.writestr(info,path.read_bytes(),compress_type=zipfile.ZIP_DEFLATED)
print(here/'YaguaTool_3.1.1_AfterEffects.zip')
