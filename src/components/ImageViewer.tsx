'use client';
import {useEffect,useState} from 'react';
import {X,ZoomIn} from 'lucide-react';
export default function ImageViewer(){const [image,setImage]=useState<{src:string;alt:string}|null>(null);
 useEffect(()=>{const onClick=(e:MouseEvent)=>{const t=e.target as HTMLElement;if(t.tagName==='IMG'&&t.closest('.article-body')){const img=t as HTMLImageElement;setImage({src:img.currentSrc,alt:img.alt});}};document.addEventListener('click',onClick);return()=>document.removeEventListener('click',onClick);},[]);
 useEffect(()=>{if(!image)return;const key=(e:KeyboardEvent)=>{if(e.key==='Escape')setImage(null);};const previous=document.body.style.overflow;document.body.style.overflow='hidden';addEventListener('keydown',key);return()=>{removeEventListener('keydown',key);document.body.style.overflow=previous;};},[image]);
 return image&&<div className="image-viewer" role="dialog" aria-label="查看大图" aria-modal="true" onClick={()=>setImage(null)}><button autoFocus className="image-close" onClick={()=>setImage(null)} aria-label="关闭大图"><X size={24}/></button><img src={image.src} alt={image.alt}/><span><ZoomIn size={14}/> 点击空白或按 Esc 关闭</span></div>;
}
