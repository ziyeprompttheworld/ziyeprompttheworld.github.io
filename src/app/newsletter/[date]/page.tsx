import Link from 'next/link';
import {Avatar,Breadcrumbs,Footer} from '@/components/UI';
import {items} from '@/lib/content';
export const dynamicParams=false;
export function generateStaticParams(){return[{date:'2026-10-25'}];}
export const metadata={title:'把选择、实践与作品，放在一起 · 每周进展'};
export default function Letter(){return <main className="article-page"><Breadcrumbs title="每周进展 · 2026.10.25"/><article className="article-card"><div className="eyebrow">ZIYE 的每周进展 · 网站起步记录</div><h1>把选择、实践与作品，放在一起</h1><div className="byline"><Avatar small/><strong>Ziye</strong><span>· 2026 年 10 月 25 日</span></div><div className="article-body"><p>我比较在乎三件事：赚钱能力、选择战略、价值影响力。</p><p>我希望把日记、创作和项目放在一起，留下自己的选择与实践，也让过去的记录能够被重新找到。</p><h2>把长期记录留下来</h2><p>一年日记放在一篇持续更新的文章里，按日期整理，用目录找到当时的主题。</p><h2>把实践变成作品</h2><p>从学习法语到创作素材，保留尝试的过程，也保留下一步的问题。</p><h2>把研究变成依据</h2><p>Atlas 的原型与案例提供一个观察入口，再把其中的方法带回自己的实践。</p><p className="source-note">本期为网站起步时的公开内容整理；尚未向订阅者发送邮件。</p></div>{items.slice(0,3).map(i=><Link className="letter-card" href={'/content/'+i.slug+'/'} key={i.slug}><time>{i.type} · {i.date}</time><h2>{i.title}</h2><p>{i.excerpt}</p></Link>)}<div style={{marginTop:30}}><a className="button black" href="/rss.xml">通过 RSS 订阅</a></div></article><Footer/></main>;}
