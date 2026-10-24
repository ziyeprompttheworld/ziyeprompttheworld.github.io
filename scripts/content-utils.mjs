import fs from 'node:fs';
import path from 'node:path';
import sanitize from 'sanitize-html';
import {marked} from 'marked';
export const root=path.resolve(import.meta.dirname,'..');
export const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
export function markdown(text){return sanitize(marked.parse(text,{async:false}),{allowedTags:['p','br','h2','h3','h4','strong','em','ul','ol','li','blockquote','pre','code','a','figure','figcaption','img','hr'],allowedAttributes:{a:['href','title','target','rel'],img:['src','alt','width','height','loading']},allowedSchemes:['https','http','mailto'],allowProtocolRelative:false,transformTags:{a:(_tag,attrs)=>({tagName:'a',attribs:{...attrs,target:'_blank',rel:'noopener noreferrer'}})}});}
export function atomicJson(file,value){fs.mkdirSync(path.dirname(file),{recursive:true});const tmp=file+'.tmp';fs.writeFileSync(tmp,JSON.stringify(value,null,2)+'\n',{mode:0o600});fs.renameSync(tmp,file);}
export function canonical(raw){const u=new URL(raw);if(!['https:','http:'].includes(u.protocol))throw Error('Only http(s) links are supported.');if(u.username||u.password)throw Error('Credential-bearing URLs must remain private.');const h=u.hostname.toLowerCase();if(h==='localhost'||h==='::1'||h==='[::1]'||/^(127\.|10\.|192\.168\.|169\.254\.|172\.(1[6-9]|2\d|3[01])\.)/.test(h))throw Error('Local/private network links are not import sources.');for(const k of [...u.searchParams.keys()]){if(/^(utm_|spm$|fromScene$|fbclid$|gclid$)/i.test(k))u.searchParams.delete(k);if(/^(access_token|token|secret|password|key)$/i.test(k))throw Error('A credential-like query parameter was found; save this source privately.');}u.hash='';return u.href;}
