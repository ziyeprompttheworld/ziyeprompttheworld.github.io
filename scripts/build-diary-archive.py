"""Publish original diary text and available media, without editorial rewriting.

Run only after the user's explicit request to publish the historical originals.
Raw API envelopes, resource tokens and download manifests stay in .private.
"""
import collections, datetime as dt, hashlib, html, json, re
import xml.etree.ElementTree as ET
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1];PRIVATE=ROOT/'.private/archive';OUT=ROOT/'src/data/diaries'
OUT.mkdir(parents=True,exist_ok=True)
retained_additions={}
for existing in OUT.glob('*.json'):
    old=json.loads(existing.read_text())
    additions=[s for s in old.get('stages',[]) if s.get('id')=='website-additions']
    if additions:retained_additions[old['year']]=additions
nodes=json.loads((PRIVATE/'nodes.json').read_text())['data']['nodes']
media=json.loads((PRIVATE/'media-manifest.json').read_text())
now=dt.datetime.now(dt.timezone.utc);today=now.astimezone(dt.timezone(dt.timedelta(hours=8))).date().isoformat()
esc=html.escape
diaries={};used_ids=collections.defaultdict(set);coverage=[]
# Reserve retained public anchors before assigning IDs to imported source entries.
for year,stages in retained_additions.items():
    used_ids[year].update(e['id'] for s in stages for e in s['entries'])
def get_year(year):
    if year not in diaries:diaries[year]={'year':year,'updated':today,'updatedAt':now.isoformat(),'lastRecordDate':'','original':True,'notice':'年度日记原文归档：保留原有文字、标题、段落与图片。跨年记录保留原日期范围；音视频及其他附件保留飞书原文入口。','sources':[],'stages':[]}
    return diaries[year]
def safe_link(url):return url if url.startswith(('https://','http://','mailto:')) else ''
def render(el,source_url):
    tag=el.tag
    if tag=='title':return ''
    if tag in ['img','whiteboard']:
        token=el.get('src') or el.get('token');m=media.get(token,{})
        if m.get('file'):
            caption=el.get('caption','');return '<figure><img src="/diary-media/'+m['file']+'" width="'+str(m['width'])+'" height="'+str(m['height'])+'" loading="lazy" decoding="async" alt="'+esc(caption or ('原文画板' if tag=='whiteboard' else '日记原文配图'),quote=True)+'"/>'+('<figcaption>'+esc(caption)+'</figcaption>' if caption else '')+'</figure>'
        return '<p class="source-note"><a href="'+esc(source_url,quote=True)+'" target="_blank" rel="noopener noreferrer">'+('画板' if tag=='whiteboard' else '图片')+'暂未能读取，可在飞书原文查看 ↗</a></p>'
    if tag in ['source','sheet','bitable']:
        name=el.get('name') or el.get('title') or {'sheet':'原文嵌入表格','bitable':'原文嵌入多维表格'}.get(tag,'原文附件')
        mime=el.get('mime','');size=el.get('size','');label=('视频附件' if mime.startswith('video/') else '音频附件' if mime.startswith('audio/') else '原文附件')
        if size.isdigit():label+=' · '+str(round(int(size)/2**20,1))+' MB'
        return '<div class="source-attachment"><a href="'+esc(source_url,quote=True)+'" target="_blank" rel="noopener noreferrer">'+esc(name)+' ↗</a><small>'+esc(label)+' · 在飞书原文查看</small></div>'
    inner=esc(el.text or '')+''.join(render(c,source_url)+esc(c.tail or '') for c in el)
    if tag=='a':
        href=safe_link(el.get('href',''))
        return '<a href="'+esc(href,quote=True)+'" target="_blank" rel="noopener noreferrer">'+inner+'</a>' if href else inner
    if tag=='cite':
        name=el.get('title','');docid=el.get('doc-id');kind=el.get('file-type','docx')
        if docid:
            route={'sheets':'sheets','sheet':'sheets','bitable':'base'}.get(kind,'docx');url='https://nl7chapmxc.feishu.cn/'+route+'/'+docid
            return '<a href="'+esc(url,quote=True)+'" target="_blank" rel="noopener noreferrer">'+esc(name or '原文引用文档')+' ↗</a>'+inner
        return inner or esc(name)
    if tag in ['grid','column']:return '<div class="'+('photo-grid' if tag=='grid' else 'photo-column')+'">'+inner+'</div>'
    if tag=='br':return '<br/>'
    if tag=='hr':return '<hr/>'
    if tag=='checkbox':return '<span class="original-checkbox">'+('☑ ' if el.get('done')=='true' or el.get('checked')=='true' else '☐ ')+inner+'</span>'
    if tag=='latex':return '<code>'+esc(el.get('content') or ''.join(el.itertext()))+'</code>'
    if tag in ['figure','readonly-block']:return inner
    if tag in ['p','b','strong','em','i','u','s','del','ol','ul','li','blockquote','pre','code','table','tbody','thead','tr','td','th','colgroup','h1','h2','h3','h4','h5','h6']:
        # Original h1 remains text inside the article, below the annual page title.
        actual='h2' if tag=='h1' else tag
        attrs=''.join(' '+k+'="'+esc(el.get(k),quote=True)+'"' for k in ['colspan','rowspan'] if el.get(k)) if tag in ['td','th'] else ''
        return '<'+actual+attrs+'>'+inner+'</'+actual+'>'
    return inner
def heading_dates(title,default):
    years=[int(y) for y in re.findall(r'(?<!\d)(20\d{2})(?=[.年/\-]\d)',title)]
    compact=re.search(r'(?<!\d)(20\d{2})(\d{2})(\d{2})(?!\d)',title)
    if compact and not years:years=[int(compact[1])]
    actual=sorted(set(y for y in years if 2010<=y<=2027)) or [default]
    # A cross-year date range belongs to both yearly views without inventing a split.
    if len(actual)>1 and not re.search(r'[—–～~\-]',title):actual=actual[:1]
    m=re.search(r'(?<!\d)(20\d{2})[.年/\-](\d{1,2})[.月/\-](\d{1,2})(?!\d)',title)
    date=''
    if m:
        try:date=dt.date(*map(int,m.groups())).isoformat()
        except ValueError:pass
    elif compact:
        try:date=dt.date(*map(int,compact.groups())).isoformat()
        except ValueError:pass
    return actual,date

for ni,node in enumerate(nodes):
    doc=json.loads((PRIVATE/(node['obj_token']+'.json')).read_text())['data']['document'];root=ET.fromstring('<root>'+doc['content']+'</root>')
    source_title=node['title'].strip();default=int(re.search(r'20\d{2}',source_title)[0]);source_id='source-'+hashlib.sha256(node['obj_token'].encode()).hexdigest()[:10];source_url='https://nl7chapmxc.feishu.cn/wiki/'+node['node_token']
    stage_title='原文导读';stage_number=0;current=None;sections=[]
    def flush():
        if current and (current['html'].strip() or current['originalHeading']):sections.append(current.copy())
    def begin(title='',years=None,date='',original=False):
        return {'title':title or '原文正文','years':years or [default],'date':date,'html':'','stage':stage_title,'stageNumber':stage_number,'originalHeading':original}
    current=begin()
    for index,el in enumerate(root):
        tag=el.tag;t=''.join(el.itertext()).strip()
        if tag=='title':continue
        dated_heading=re.fullmatch(r'h[1-6]',tag) and bool(re.search(r'(?<!\d)20\d{2}[.年/\-]\d|(?<!\d)20\d{6}(?!\d)',t))
        is_entry=tag in ['h3','h6'] and bool(t)
        if (is_entry or dated_heading) and t:
            # Phase headings are navigation parents, not dated daily entries.
            if tag in ['h2','h5'] and ('阶段' in t or not dated_heading):
                flush();stage_title=t;stage_number+=1;current=begin();continue
            flush();years,date=heading_dates(t,default);current=begin(t,years,date,True)
        elif tag in ['h2','h5'] and t:
            flush();stage_title=t;stage_number+=1;current=begin()
        else:current['html']+=render(el,source_url)
    flush()
    for si,section in enumerate(sections):
        for year in section['years']:
            data=get_year(year)
            if source_title not in data['sources']:data['sources'].append(source_title)
            sid=source_id+'-'+str(section['stageNumber'])
            stage=next((s for s in data['stages'] if s['id']==sid),None)
            if not stage:stage={'id':sid,'title':section['stage'],'sourceTitle':source_title,'sourceUrl':source_url,'entries':[]};data['stages'].append(stage)
            key='d-'+section['date'] if section['date'] else 'original-'+source_id+'-'+str(si)
            if key in used_ids[year]:key+='-'+source_id+'-'+str(si)
            used_ids[year].add(key)
            stage['entries'].append({'id':key,'date':section['date'],'title':section['title'],'html':section['html'],'topics':[],'originalHeading':section['originalHeading']})
    coverage.append({'source':source_title,'sections':len(sections),'images':len(list(root.iter('img'))),'revision':doc.get('revision_id')})

# Preserve future website records when refreshing the historical Feishu snapshot.
for year,stages in retained_additions.items():get_year(year)['stages'].extend(stages)
for year in range(2012,2027):get_year(year)
# The merged college source has no separately dated 2014 entries. Expose this fact rather than fabricate a diary.
for year,data in sorted(diaries.items()):
    if not data['stages']:
        data['notice']='现有飞书合并文档没有可明确归属到本年的独立条目。相关原文保留在已有明确日期的年度中，不补写不存在的经历。'
        data['stages']=[{'id':'original-index','title':'原文归档说明','entries':[{'id':'original-note','date':'','title':'合并文档中的历史记录','html':'<p>2012—2016 年的厦大日记原文保留在合并来源中。当前可确认的日期范围是 2012 年 9 月—2013 年 1 月，以及 2016 年 7 月的毕业材料。</p><p><a href="/content/diary-2012/">阅读 2012 年原文</a> · <a href="/content/diary-2013/">阅读跨年原文</a> · <a href="/content/diary-2016/">阅读 2016 年原文</a></p>','topics':[]}]}]
    dates=[e['date'] for s in data['stages'] for e in s['entries'] if e['date']]
    data['lastRecordDate']=max(dates) if dates else ''
    (OUT/(str(year)+'.json')).write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n')
    template=(ROOT/'public/media/year.svg').read_text().replace('>2026<','>'+str(year)+'<').replace('YEAR IN PROGRESS','ORIGINAL DIARY ARCHIVE')
    (ROOT/'public/media'/('year-'+str(year)+'.svg')).write_text(template)
index=[{'year':year,'entries':sum(len(s['entries']) for s in data['stages']),'images':sum(e['html'].count('<img ') for s in data['stages'] for e in s['entries']),'sources':data['sources'],'lastRecordDate':data['lastRecordDate']} for year,data in sorted(diaries.items())]
(ROOT/'src/data/diary-index.json').write_text(json.dumps(index,ensure_ascii=False,indent=2)+'\n')
(PRIVATE/'migration-coverage.json').write_text(json.dumps(coverage,ensure_ascii=False,indent=2)+'\n')
print(json.dumps({'years':index,'sources':len(coverage),'sourceImages':sum(c['images'] for c in coverage)},ensure_ascii=False,indent=2))
