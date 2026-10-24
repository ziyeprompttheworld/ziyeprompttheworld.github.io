"""Materialize every diary image, preserving original files privately."""
import concurrent.futures, hashlib, json, os, shutil, subprocess, threading, time
import xml.etree.ElementTree as ET
from pathlib import Path
from PIL import Image, ImageOps

ROOT=Path(__file__).resolve().parents[1];PRIVATE=ROOT/'.private/archive'
OUT=ROOT/'public/diary-media';OUT.mkdir(parents=True,exist_ok=True)
RAW=PRIVATE/'original-media';RAW.mkdir(exist_ok=True)
MANIFEST=PRIVATE/'media-manifest.json'
manifest=json.loads(MANIFEST.read_text()) if MANIFEST.exists() else {}
nodes=json.loads((PRIVATE/'nodes.json').read_text())['data']['nodes']
resources={}
for node in nodes:
    doc=json.loads((PRIVATE/(node['obj_token']+'.json')).read_text())['data']['document']
    root=ET.fromstring('<root>'+doc['content']+'</root>')
    for el in root.iter():
        if el.tag in ['img','whiteboard']:
            token=el.get('src') or el.get('token')
            if token:resources[token]=el.tag
lock=threading.Lock();ENV=dict(os.environ,LARKSUITE_CLI_NO_UPDATE_NOTIFIER='1',LARKSUITE_CLI_NO_SKILLS_NOTIFIER='1')
previous=Path('/Users/ziye/Documents/wiki/20-29 Beta/operations/specs/images/diary-annual-assets')
def fetch(pair):
    token,kind=pair;digest=hashlib.sha256(token.encode()).hexdigest()[:16]
    name='diary-img-'+digest+'.webp';target=OUT/name
    try:
        cached=previous/name
        if not target.exists() and cached.exists():shutil.copy2(cached,target)
        if not target.exists():
            originals=list(RAW.glob(digest+'.*'))
            if not originals:
                for attempt in range(4):
                    args=['lark-cli','docs','+media-download','--token',token,'--output','./original-media/'+digest,'--as','user','--format','json']
                    if kind=='whiteboard':args+=['--type','whiteboard']
                    r=subprocess.run(args,cwd=PRIVATE,env=ENV,text=True,capture_output=True,timeout=100)
                    if r.returncode==0:
                        x=json.loads(r.stdout)
                        if not x.get('ok'):raise ValueError('API returned unsuccessful response')
                        p=Path(x['data']['saved_path']);originals=[p if p.is_absolute() else PRIVATE/p];break
                    if any(s in r.stderr.lower() for s in ['rate_limit','429','timeout','timed out','connection reset','temporarily']):time.sleep(4*2**attempt);continue
                    raise ValueError('Media download failed, exit '+str(r.returncode))
            if not originals:raise ValueError('Media unavailable after retry backoff')
            with Image.open(originals[0]) as im:
                im=ImageOps.exif_transpose(im)
                if im.mode not in ['RGB','RGBA']:im=im.convert('RGB')
                if im.width>1800:im=im.resize((1800,round(im.height*1800/im.width)),Image.Resampling.LANCZOS)
                im.save(target,'WEBP',quality=86,method=3)
        with Image.open(target) as im:w,h=im.size
        result={'file':name,'width':w,'height':h,'bytes':target.stat().st_size,'kind':kind}
    except Exception as exc:result={'error':str(exc),'kind':kind}
    with lock:
        manifest[token]=result
        tmp=MANIFEST.with_suffix('.tmp');tmp.write_text(json.dumps(manifest,ensure_ascii=False));tmp.replace(MANIFEST)
    return result
with concurrent.futures.ThreadPoolExecutor(max_workers=6) as pool:
    for i,result in enumerate(pool.map(fetch,resources.items()),1):
        if i%100==0 or i==len(resources):print(json.dumps({'processed':i,'total':len(resources),'saved':sum('file' in r for r in manifest.values()),'errors':sum('error' in r for r in manifest.values()),'MiB':round(sum(r.get('bytes',0) for r in manifest.values())/2**20,1)}),flush=True)

if any('error' in manifest.get(token,{}) for token in resources):
    raise SystemExit('Media fetch incomplete. Stop before publishing the archive.')
