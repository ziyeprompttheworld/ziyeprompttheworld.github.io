import fs from 'node:fs';
import path from 'node:path';
import imported from '@/data/imports.json';
import updateData from '@/data/updates.json';
import diaryIndexData from '@/data/diary-index.json';
import {continueDiary} from './diary';
import diarySeries from '@/data/diary-series.json';

export const site = { name: 'Ziye', title: 'Ziye · 选择、实践与价值', description: '记录我的选择、商业实践，以及创造的价值。', url: 'https://ziyeprompttheworld.github.io', github: 'https://github.com/ziyeprompttheworld' };
export const themes = ['赚钱能力', '选择战略', '价值影响力'];
export type Entry = { id: string; date: string; title: string; html: string; topics: string[]; series?:string; updatedAt?:string };
export type Diary = { year: number; updated: string; lastRecordDate?:string; updatedAt?:string; original?:boolean; sources?:string[]; notice: string; stages: { id: string; title: string; sourceTitle?:string; sourceUrl?:string; entries: Entry[] }[] };
export type Item = { slug: string; title: string; excerpt: string; date: string; year?:number; updatedAt?:string; importedAt?:string; originalDate?:string|null; type: string; source: string; topics: string[]; cover: string; minutes?: number; html?: string; originalUrl?: string; author?: string; originalAuthor?:string|null; ownership?: string; url?: string; series?: string };
type Update={contentSlug:string;entryId:string;entryDate:string;title:string;updatedAt:string};
export const updates=updateData as Update[];
export function activity(item:Item){const event=updates.filter(u=>u.contentSlug===item.slug).sort((a,b)=>b.updatedAt.localeCompare(a.updatedAt))[0];const rawTime=event?.updatedAt||item.updatedAt||item.importedAt||item.date;const date=rawTime.length===10?rawTime:new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Shanghai',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date(rawTime));const time=rawTime.length===10?rawTime+'T00:00:00+08:00':rawTime;return{time,date,href:'/content/'+item.slug+'/'+(event?'#'+event.entryId:''),title:event?item.title+' · '+event.title:item.title};}
export function recentItems(){return [...items].sort((a,b)=>Date.parse(activity(b).time)-Date.parse(activity(a).time));}
function storedDiary(year:number):Diary {
  const original=path.join(process.cwd(),'src/data/diaries',String(year)+'.json');
  if(fs.existsSync(original))return JSON.parse(fs.readFileSync(original,'utf8'));
  throw new Error('Annual diary is not registered: '+year);
}
const seriesMatch=(title:string,match:string)=>title.replace(/\s/g,'').includes(match);
const lastDate=(diary:Diary)=>diary.stages.flatMap(s=>s.entries).map(e=>e.date).filter(Boolean).sort().at(-1)||'';
export function getDiary(year=2026):Diary {
  const raw=storedDiary(year);
  const diary=continueDiary({...raw,sources:raw.sources?.filter(s=>!diarySeries.some(d=>seriesMatch(s,d.sourceMatch))),stages:raw.stages
    .filter(s=>!diarySeries.some(d=>seriesMatch(s.sourceTitle||'',d.sourceMatch)))
    .map(s=>s.id==='website-additions'?{...s,entries:s.entries.filter(e=>!e.series)}:s)
    .filter(s=>s.entries.length)});
  return {...diary,lastRecordDate:lastDate(diary)};
}
export const diaryIndex=diaryIndexData as {year:number;entries:number;images:number;sources:string[];lastRecordDate:string}[];
export function getDiaries(){return (diaryIndex.length?diaryIndex.map(d=>getDiary(d.year)):[getDiary()]).filter(d=>d.stages.length);}
export function getSeriesDiary(id:string):Diary|null {
  const definition=diarySeries.find(d=>d.id===id);if(!definition)return null;
  const stages:Diary['stages']=[],seen=new Set<string>(),sources=new Set<string>(),years:number[]=[];
  for(const {year} of diaryIndex){
    for(const source of storedDiary(year).stages){
      const imported=seriesMatch(source.sourceTitle||'',definition.sourceMatch);
      const entries=source.entries.filter(e=>(imported||(source.id==='website-additions'&&e.series===id))&&!seen.has(e.id));
      if(!entries.length)continue;
      entries.forEach(e=>seen.add(e.id));years.push(year);
      if(imported&&source.sourceTitle)sources.add(source.sourceTitle);
      let stage=stages.find(s=>s.id===source.id);
      if(!stage){stage={...source,entries:[]};stages.push(stage);}
      stage.entries.push(...entries);
    }
  }
  const updatedAt=[definition.updatedAt,...stages.flatMap(s=>s.entries).flatMap(e=>e.updatedAt?[e.updatedAt]:[])].sort((a,b)=>Date.parse(a)-Date.parse(b)).at(-1)!;
  const diary=continueDiary({year:years.length?Math.max(...years):new Date().getUTCFullYear(),updated:updatedAt.slice(0,10),updatedAt,original:true,sources:[...sources],notice:definition.title+'独立归档，保留来源原文、段落与图片。音视频及其他附件通过飞书原文查看。',stages});
  return {...diary,lastRecordDate:lastDate(diary)};
}
export function getDiaryView(slug:string):Diary|null {
  const annual=slug.match(/^diary-(\d{4})$/);if(annual)return getDiary(Number(annual[1]));
  const definition=diarySeries.find(d=>d.slug===slug);return definition?getSeriesDiary(definition.id):null;
}
export function getDiaryViews(){return [
  ...getDiaries().map(d=>({...d,slug:'diary-'+d.year,title:d.year+' 年日记'})),
  ...diarySeries.map(s=>({...getSeriesDiary(s.id)!,slug:s.slug,title:s.title}))
];}
export function getDiaryRedirects(year:number){
  const links:Record<string,string>={};
  for(const stage of storedDiary(year).stages){const series=diarySeries.find(d=>seriesMatch(stage.sourceTitle||'',d.sourceMatch));if(series)for(const id of [stage.id,...stage.entries.map(e=>e.id)])links[id]='/content/'+series.slug+'/#'+id;}
  return links;
}
const annualItems:Item[]=getDiaries().sort((a,b)=>b.year-a.year).map(d=>({slug:'diary-'+d.year,title:d.year+' 年日记',excerpt:d.sources?.length?d.sources.join(' · '):d.notice,date:d.lastRecordDate||String(d.year),year:d.year,updatedAt:d.updatedAt,type:'年度日记',source:'飞书原文',originalUrl:'https://nl7chapmxc.feishu.cn/wiki/OkskwgrdXiFmjekquIHcHhI9nFc',topics:themes,cover:'/media/year-'+d.year+'.svg'}));
const seriesItems:Item[]=diarySeries.map(s=>{const d=getSeriesDiary(s.id)!;return{slug:s.slug,title:s.title,excerpt:d.sources?.join(' · ')||d.notice,date:d.lastRecordDate||String(d.year),year:d.year,updatedAt:d.updatedAt,type:'独立日记',series:'独立日记 · 原文归档',source:'飞书原文',originalUrl:d.stages.find(s=>s.sourceUrl)?.sourceUrl,topics:s.topics,cover:s.cover};});
export const items: Item[] = [
  ...annualItems,
  ...seriesItems,
  { slug:'three-things',title:'我在乎的三件事：赚钱能力、选择战略、价值影响力',excerpt:'用这三个问题整理自己的记录：如何创造回报，如何做出选择，以及能给别人带来什么价值。',date:'2026-10-25',type:'思考',source:'本站',topics:themes,cover:'/media/strategy.svg',minutes:2,html:'<p>我比较在乎三件事：赚钱能力、选择战略、价值影响力。</p><h2>赚钱能力</h2><p>在实践中发现需求，做出东西，学习怎样交付和获得回报。把真实的行动、结果和复盘留下来。</p><h2>选择战略</h2><p>记录为什么做这个选择，当时看到了什么，又准备怎样验证。重要的判断值得在后来重新看一遍。</p><h2>价值影响力</h2><p>分享自己做过的、正在学习的东西，让作品、方法和真实反馈逐渐连接起来。</p><blockquote>记录我的选择、商业实践，以及创造的价值。</blockquote>' },
  { slug:'essentialism-day4',title:'用精要主义做选择，先从 MCP 开始',excerpt:'生财日记 Day 4。记录这次临时调整任务，以及从 MCP 开始 build agent 的实践。',date:'2026-10-22',type:'视频日记',source:'生财日记',topics:['赚钱能力','选择战略'],cover:'/media/diary-day4.webp',series:'生财日记 · Day 4',html:'<p>这期记录的主题是：临时换任务，用精要主义做选择，先从 MCP 开始 build agent。</p><p>每期讲清楚今天尝试什么、做出了什么、下一步怎么做。</p><figure><img src="/media/diary-day4.webp" alt="生财日记 Day 4 封面" width="900" height="1200"/><figcaption>2026 年 10 月 22 日 · 生财日记 Day 4</figcaption></figure><p>视频完整公开链接将在发布后补充。这里先保留封面与主题记录。</p><p><a href="/content/diary-2026/">阅读本年度的日记原文 →</a></p>' },
  { slug:'learning-french',title:'从零学法语，也试着做一个学习工具',excerpt:'TRC 视频日记的开始：用 AI 辅助学习法语，探索朗读、谐音与场景记忆。',date:'2026-10-12',type:'视频日记',source:'TRC 日记',topics:['价值影响力'],cover:'/media/learning.svg',series:'TRC · Day 2',html:'<p>TRC 视频日记记录学习成长。第一期尝试用 AI 辅助从零学习法语，制作学习工具；第二期继续探索朗读与谐音场景记忆。</p><p>我希望记录今天尝试什么、做出了什么、下一步怎么做，保留真实学习过程。</p><p>TRC 与生财日记分别计数，保留各自的系列记录。</p>' },
  { slug:'drawbook-practice',title:'把一次真实使用，讲成一条创作素材',excerpt:'Ancher 素材实践：从脚本、逐页插画到可翻页成品，记录制作过程与表达方法。',date:'2026-10-20',type:'实践',source:'创作记录',topics:['赚钱能力','价值影响力'],cover:'/media/project.svg',html:'<p>这次的素材来自真实使用：在网页侧栏里提出绘本需求，观察脚本、逐页插画和可翻页成品的生成过程。</p><h2>把过程讲清楚</h2><p>画面里有什么，文案就说什么。讲脚本时呈现脚本，讲成品时展示成品。</p><h2>把学习留下来</h2><p>制作经历了多次封面和表达方式调整。保留每次的做法与反馈，作为下一次实践的参考。</p><p>项目仍在迭代中；这里不对收入、转化或制作效果作未经验证的承诺。</p>' },
  ...(imported as Item[]),
];
export const projects = [
  {id:'personal-site',title:'个人网站与年度日记',en:'PERSONAL ARCHIVE',description:'把日记、作品、项目和研究连接起来，让一次记录可以持续积累。',status:'制作中',theme:'价值影响力',cover:'/media/year.svg',href:'/content/diary-2026/',next:'完成整站内容与年度记录的整理。',since:'2026.10'},
  {id:'creative-practice',title:'AI 创作与素材实践',en:'CREATIVE PRACTICE',description:'从真实使用出发，练习视频、封面、文案与可复用的表达。',status:'实践中',theme:'赚钱能力',cover:'/media/project.svg',href:'/content/drawbook-practice/',next:'用实际作品和反馈验证表达方式。',since:'2026.10'},
  {id:'atlas',title:'Atlas · 创意研究',en:'RESEARCH ATLAS',description:'整理广告创意原型与案例，给每一次创作和选择提供依据。',status:'持续研究',theme:'选择战略',cover:'/media/research.svg',href:'/research/',next:'把研究转为自己的判断与实践。',since:'2026.10'},
];
export function dateLabel(date: string) { if(/^\d{4}$/.test(date))return date+'年 · 原文未细分日期';const [y,m,d]=date.split('-'); return `${y}年${Number(m)}月${Number(d)}日`; }
