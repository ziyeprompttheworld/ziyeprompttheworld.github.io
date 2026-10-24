import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {parseArgs} from 'node:util';
import {root,markdown,atomicJson} from './content-utils.mjs';

const {values}=parseArgs({options:{date:{type:'string'},title:{type:'string'},file:{type:'string'},topics:{type:'string'},publish:{type:'boolean',default:false},replace:{type:'boolean',default:false}}});
if(!values.date||!values.file||!values.title)throw Error('Usage: npm run diary -- --date YYYY-MM-DD --title TITLE --file prepared.md [--topics 选择战略,赚钱能力] [--publish] [--replace]');
const date=values.date;
if(!/^\d{4}-\d{2}-\d{2}$/.test(date)||Number.isNaN(Date.parse(date+'T00:00:00Z'))||new Date(date+'T00:00:00Z').toISOString().slice(0,10)!==date)throw Error('Invalid calendar date.');
const text=fs.readFileSync(path.resolve(values.file),'utf8').trim();
if(!text)throw Error('Empty input.');
const fingerprint=createHash('sha256').update(date+'\n'+text).digest('hex');
const privateDir=path.join(root,'.private/inbox',date);
fs.mkdirSync(privateDir,{recursive:true,mode:0o700});
const raw=path.join(privateDir,fingerprint+'.md');
if(!fs.existsSync(raw))fs.writeFileSync(raw,text,{mode:0o600});
if(!values.publish){console.log('Saved privately: '+path.relative(root,raw)+'. No public file changed.');process.exit(0);}
if(/127\.0\.0\.1|localhost|access_token=|file:\/\//i.test(text))throw Error('Prepared text contains a private/local resource. Use public media paths.');

const year=Number(date.slice(0,4)),file=path.join(root,'src/data/diaries',year+'.json');
const diary=fs.existsSync(file)?JSON.parse(fs.readFileSync(file,'utf8')):{year,updated:'',original:true,sources:[],notice:'本年度日记原文与新增记录。',stages:[]};
const additions=diary.stages.find(s=>s.id==='website-additions');
let entry=additions?.entries.find(e=>e.date===date&&e.origin==='website');
// Existing website records keep their anchors; all new records use a separate namespace.
const id=entry?.id||'d-'+date+'-added';
const html=markdown(text),topics=(values.topics||'').split(',').map(s=>s.trim()).filter(s=>['赚钱能力','选择战略','价值影响力'].includes(s));
if(entry&&!values.replace&&(entry.segmentIds||[]).includes(fingerprint)){console.log('This input already exists; no duplicate appended.');process.exit(0);}
const updatedAt=new Date().toISOString();
if(entry){
 const nextTopics=values.topics===undefined?entry.topics:values.replace?topics:[...new Set([...entry.topics,...topics])];
 if(values.replace&&entry.html===html&&entry.title===values.title&&JSON.stringify(entry.topics)===JSON.stringify(nextTopics)){console.log('The entry already matches this replacement.');process.exit(0);}
 entry.html=values.replace?html:entry.html+'\n'+html;entry.title=values.title;entry.topics=nextTopics;entry.segmentIds=values.replace?[fingerprint]:[...(entry.segmentIds||[]),fingerprint];entry.updatedAt=updatedAt;
}else{
 entry={id,date,title:values.title,html,topics,segmentIds:[fingerprint],updatedAt,originalHeading:false,origin:'website'};
 let stage=diary.stages.find(s=>s.id==='website-additions');
 if(!stage){stage={id:'website-additions',title:'网站新增记录',sourceTitle:'新增原文与补充',entries:[]};diary.stages.push(stage);}
 stage.entries.push(entry);stage.entries.sort((a,b)=>a.date.localeCompare(b.date));
}
diary.lastRecordDate=diary.stages.flatMap(s=>s.entries).map(e=>e.date).filter(Boolean).sort().at(-1)||'';
diary.updated=new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Shanghai',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date(updatedAt));
diary.updatedAt=updatedAt;atomicJson(file,diary);
const indexFile=path.join(root,'src/data/diary-index.json'),index=JSON.parse(fs.readFileSync(indexFile,'utf8')).filter(d=>d.year!==year);
index.push({year,entries:diary.stages.reduce((n,s)=>n+s.entries.length,0),images:diary.stages.flatMap(s=>s.entries).reduce((n,e)=>n+(e.html.match(/<img /g)||[]).length,0),sources:diary.sources||[],lastRecordDate:diary.lastRecordDate});
index.sort((a,b)=>a.year-b.year);atomicJson(indexFile,index);
const cover=path.join(root,'public/media/year-'+year+'.svg');
if(!fs.existsSync(cover))fs.writeFileSync(cover,fs.readFileSync(path.join(root,'public/media/year.svg'),'utf8').replace('>2026<','>'+year+'<'));
const updatesFile=path.join(root,'src/data/updates.json'),updates=JSON.parse(fs.readFileSync(updatesFile,'utf8'));
updates.push({contentSlug:'diary-'+year,entryId:id,entryDate:date,title:values.title,updatedAt});atomicJson(updatesFile,updates);
console.log('Updated one annual article: /content/diary-'+year+'/#'+id+'. Build before publishing.');
