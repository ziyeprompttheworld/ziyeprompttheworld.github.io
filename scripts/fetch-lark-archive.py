"""Read the user-selected diary wiki. Keep raw API responses private."""
import argparse, concurrent.futures, json, os, subprocess, time, xml.etree.ElementTree as ET
from pathlib import Path

parser=argparse.ArgumentParser(description=__doc__)
parser.add_argument('--refresh',action='store_true',help='Fetch current versions instead of using cached source snapshots.')
args=parser.parse_args()
ROOT=Path(__file__).resolve().parents[1]
PRIVATE=ROOT/'.private/archive'
PRIVATE.mkdir(parents=True,exist_ok=True)
ENV=os.environ.copy()
ENV.update(LARKSUITE_CLI_NO_UPDATE_NOTIFIER='1',LARKSUITE_CLI_NO_SKILLS_NOTIFIER='1')
nodes=json.loads((PRIVATE/'nodes.json').read_text())['data']['nodes']
def fetch(node):
    token=node['obj_token']; target=PRIVATE/(token+'.json')
    if target.exists() and not args.refresh:
        data=json.loads(target.read_text())
    else:
        result=subprocess.run(['lark-cli','docs','+fetch','--doc',token,'--as','user','--format','json'],capture_output=True,text=True,env=ENV,timeout=240)
        if result.returncode:
            (PRIVATE/(token+'.error')).write_text(result.stderr)
            return {'title':node['title'],'error':'fetch failed'}
        data=json.loads(result.stdout)
        if not data.get('ok'):return {'title':node['title'],'error':'not ok'}
        target.write_text(json.dumps(data,ensure_ascii=False));target.chmod(0o600)
    doc=data['data']['document'];xml=ET.fromstring('<root>'+doc['content']+'</root>')
    headings=[{'tag':e.tag,'text':''.join(e.itertext()).strip()[:130]} for e in xml.iter() if e.tag in ['h1','h2','h3','h4']]
    return {'title':node['title'],'token':token,'bytes':len(doc['content'].encode()),'images':len(list(xml.iter('img'))),'headings':len(headings),'samples':headings[:10],'tags':dict(__import__('collections').Counter(e.tag for e in xml.iter()))}
with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:
    results=[]
    for result in pool.map(fetch,nodes):
        results.append(result)
        print(json.dumps(result,ensure_ascii=False),flush=True)
(PRIVATE/'inventory.json').write_text(json.dumps(results,ensure_ascii=False,indent=2))

if any('error' in result for result in results):
    raise SystemExit('Source fetch incomplete. Stop before rebuilding or publishing.')
