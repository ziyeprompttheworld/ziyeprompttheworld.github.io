'use client';
import dynamic from 'next/dynamic';
import type {Work} from './Museum';
const Museum=dynamic(()=>import('./Museum'),{ssr:false,loading:()=> <div className="museum-loading"><span>Z</span><p>正在布置展馆…</p></div>});
export default function MuseumLoader({works}:{works:Work[]}){return <Museum works={works}/>;}
