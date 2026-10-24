import type {Diary,Entry} from './content';

function continuedTitle(entry:Entry,day:number){
  const topic=entry.title.replace(/^Day\s*\d+\s*/i,'');
  const dated=topic.match(/^(20\d{2}\.\d{1,2}\.\d{1,2}(?:[-–]\d{1,2}(?:\.\d{1,2})?)?)\s+(.+)$/);
  const label=dated?.[1]||entry.date.split('-').map(Number).join('.');
  return `Day${day} ${label} ${dated?.[2]||topic}`;
}

/** Continue the main diary in both the article and its directory.
 * Source snapshots and website records stay separate on disk for safe refreshes.
 */
export function continueDiary(diary:Diary):Diary {
  const additions=diary.stages.filter(s=>s.id==='website-additions').flatMap(s=>s.entries);
  if(!additions.length)return diary;
  const stages=diary.stages.filter(s=>s.id!=='website-additions').map(s=>({...s,entries:[...s.entries]}));
  const sourceCounts=new Map<string,number>();
  for(const stage of stages){
    const source=stage.sourceTitle||stage.id;
    sourceCounts.set(source,(sourceCounts.get(source)||0)+stage.entries.filter(e=>e.date).length);
  }
  const mainSource=[...sourceCounts].sort((a,b)=>b[1]-a[1])[0]?.[0];
  const dated=stages.flatMap(stage=>(stage.sourceTitle||stage.id)===mainSource
    ?stage.entries.filter(e=>e.date).map(e=>({date:e.date,stage})):[])
    .sort((a,b)=>a.date.localeCompare(b.date));

  for(const entry of [...additions].sort((a,b)=>a.date.localeCompare(b.date))){
    // The closest preceding original record determines the phase, not the
    // unrelated TRC/reading-note sources that happen to follow the main diary.
    const preceding=dated.findLast(e=>e.date<=entry.date);
    let target:Diary['stages'][number]|undefined=(preceding||dated[0])?.stage;
    if(!target){
      target=stages.find(s=>s.id==='diary-records');
      if(!target){target={id:'diary-records',title:'日记',entries:[]};stages.push(target);}
    }
    const previous=target.entries.findLastIndex(e=>!!e.date&&e.date<=entry.date);
    const next=target.entries.findIndex(e=>!!e.date&&e.date>entry.date);
    const position=previous>=0?previous+1:next>=0?next:target.entries.length;
    const numbered=stages.filter(s=>s===target||(s.sourceTitle||s.id)===mainSource)
      .flatMap(s=>s.entries).filter(e=>e.date&&e.date<=entry.date&&/^Day\s*\d+/i.test(e.title))
      .sort((a,b)=>a.date.localeCompare(b.date)).at(-1);
    const previousDay=numbered?Number(numbered.title.match(/^Day\s*(\d+)/i)![1]):0;
    const day=numbered?.date===entry.date?previousDay:previousDay+1;
    target.entries.splice(position,0,{...entry,title:continuedTitle(entry,day)});
  }
  return {...diary,stages};
}
