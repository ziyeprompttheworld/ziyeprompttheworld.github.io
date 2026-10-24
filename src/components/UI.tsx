import Link from 'next/link';
import { ArrowLeft, ArrowUpRight, Rss, ArrowRight } from 'lucide-react';
import { site } from '@/lib/content';
export function Back({href='/',label='返回'}:{href?:string;label?:string}) { return <Link href={href} className="back"><ArrowLeft size={15}/>{label}</Link>; }
export function PageHead({title,description,children}:{title:string;description?:string;children?:React.ReactNode}) { return <><Back/><header className="page-head"><div><h1>{title}</h1>{description&&<p>{description}</p>}</div>{children}</header></>; }
export function Footer() { return <footer className="footer"><nav><Link href="/">首页</Link><Link href="/content/">记录与作品</Link><Link href="/projects/">商业实践</Link><Link href="/strategy/">选择与判断</Link><Link href="/research/">研究与方法</Link><Link href="/newsletter/">每周进展</Link></nav><div><span>© 2026 Ziye</span><span>持续实践，持续更新。</span><a href="/rss.xml" aria-label="RSS 订阅"><Rss size={15}/></a></div></footer>; }
export function Page({children,wide=false}:{children:React.ReactNode;wide?:boolean}) { return <main className={wide?'page wide-page':'page'}>{children}<Footer/></main>; }
export function Subscribe({compact=false}:{compact?:boolean}) { return <div className={'subscribe '+(compact?'compact':'')}><span><Rss size={14}/> 订阅选择、实践与新作品</span><Link href="/newsletter/">订阅更新 <ArrowRight size={14}/></Link></div>; }
export function Topic({children}:{children:React.ReactNode}){return <span className="topic">{children}</span>;}
export function External({href,children}:{href:string;children:React.ReactNode}){return <a href={href} target="_blank" rel="noopener noreferrer">{children}<ArrowUpRight size={13}/></a>;}
export function Avatar({small=false}:{small?:boolean}){return <span className={small?'avatar avatar-small':'avatar'} aria-label="Ziye">Z<span>·</span></span>;}
export function Breadcrumbs({title,category='内容'}:{title:string;category?:string}){return <nav className="breadcrumbs" aria-label="面包屑"><Link href="/">首页</Link><span>/</span><Link href="/content/">{category}</Link><span>/</span><span>{title}</span></nav>;}
export function RssLink(){return <a href="/rss.xml" className="icon-button" aria-label="RSS 订阅"><Rss size={18}/></a>;}
export function Contact(){return <a href={site.github} target="_blank" rel="noopener noreferrer">通过 GitHub 联系 <ArrowUpRight size={14}/></a>;}
