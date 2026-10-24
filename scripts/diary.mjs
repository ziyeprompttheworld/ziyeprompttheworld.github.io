import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {parseArgs} from 'node:util';
import {root,markdown,atomicJson} from './content-utils.mjs';
const {values}=parseArgs({options:{date:{type:'string'},title:{type:'string'},file:{type:'string'},topics:{type:'string'},publish:{type:'boolean',default:false},replace:{type:'boolean',default:false}}});
if(!values.date||!values.file||!values.title)throw Error('Usage: npm run diary -- --date YYYY-MM-DD --title TITLE --file prepared.md [--topics 选择战略,赚钱能力] [--publish] [--replace]');
const date=values.date;if(!/^\d{4}-\d{2}-\d{2}$/.test(date)||Number.isNaN(Date.parse(date+'T00:00:00Z'))||new Date(date+'T00:00:00Z').toISOString().slice(0,10)!==date)throw Error('Invalid calendar date.');
const text=fs.readFileSync(path.resolve(values.file),'utf8').trim();if(!text)throw Error('Empty input.');
const fingerprint=createHash('sha256').update(date+'\n'+text).digest('hex');const privateDir=path.join(root,'.private','inbox',date);fs.mkdirSync(privateDir,{recursive:true,mode:0o700});const raw=path.join(privateDir,fingerprint+'.md');if(!fs.existsSync(raw))fs.writeFileSync(raw,text,{mode:0o600});
if(!values.publish){console.log(`Saved privately: ${path.relative(root,raw)}. No public file changed.`);process.exit(0);}
if(/127\.0\.0\.1|localhost|feishu\.cn\/(?:wiki|docx)|access_token=|file:\/\//i.test(text))throw Error('Prepared public text contains a private/local source. Keep provenance private and use public media paths.');
const year=Number(date.slice(0,4));if(year!==2026)throw Error('This release currently publishes 2026. Add the new year to the site data/route registry before publishing another year. Your input is saved privately.');
const file=path.join(root,'src/data',`diary-${year}.json`),diary=JSON.parse(fs.readFileSync(file,'utf8'));
const receiptsFile=path.join(root,'.private','published-receipts.json');const receipts=fs.existsSync(receiptsFile)?JSON.parse(fs.readFileSync(receiptsFile,'utf8')):[];if(receipts.includes(fingerprint)){console.log('This exact input has already been recorded; no duplicate appended.');process.exit(0);}
const id='d-'+date;let entry=diary.stages.flatMap(s=>s.entries).find(e=>e.id===id);const html=markdown(text);const topics=(values.topics||'').split(',').map(s=>s.trim()).filter(s=>['赚钱能力','选择战略','价值影响力'].includes(s));
if(entry){entry.html=values.replace?html:entry.html+'\n'+html;entry.title=values.title;entry.topics=[...new Set([...entry.topics,...topics])];}else{entry={id,date,title:values.title,html,topics};diary.stages.at(-1).entries.push(entry);diary.stages.at(-1).entries.sort((a,b)=>a.date.localeCompare(b.date));}
diary.updated=diary.stages.flatMap(s=>s.entries).map(e=>e.date).sort().at(-1);atomicJson(file,diary);receipts.push(fingerprint);atomicJson(receiptsFile,receipts);console.log(`Updated one annual article: /content/diary-${year}/#${id}. Run npm run build before publishing.`);
