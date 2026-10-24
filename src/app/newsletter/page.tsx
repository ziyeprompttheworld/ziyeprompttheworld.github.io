import Link from 'next/link';
import {Rss,ArrowRight} from 'lucide-react';
import {Page,Back} from '@/components/UI';
export const metadata={title:'Ziye 的每周进展'};
export default function Newsletter(){return <Page><Back/><header className="newsletter-hero"><div className="eyebrow">LETTERS FROM ZIYE</div><h1>Ziye 的每周进展</h1><p>这周做了什么选择，实践有什么进展，留下了什么有用的作品。慢慢积累，定期回看。</p><a className="button black" href="/rss.xml"><Rss size={15}/>通过 RSS 订阅更新</a><p style={{fontSize:10,marginTop:15,marginBottom:0}}>邮件来信尚未开放，可以先通过 RSS 订阅。</p></header><div className="box-heading"><span>进展归档</span><span style={{color:'#aaa',fontSize:11}}>起步记录</span></div><Link href="/newsletter/2026-10-25/" className="letter-card"><time>2026 年 10 月 25 日 · 网站起步记录</time><h2>把选择、实践与作品，放在一起</h2><p>从年度日记、创作实践到 Atlas 研究，建立一个可以持续积累的个人网站。</p><span>阅读这一期 <ArrowRight size={13}/></span></Link></Page>;}
