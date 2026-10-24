import Link from 'next/link';
import {Page,PageHead} from '@/components/UI';
import {items} from '@/lib/content';
export const metadata={title:'选择与判断'};
export default function Strategy(){return <Page><PageHead title="选择与判断" description="把当时的信息和判断留下来，在行动之后回来验证。"/><div className="theme-cards">{[{name:'赚钱能力',text:'发现需求、交付价值、获得回报，练习把事情做成。'},{name:'选择战略',text:'选择方向、配置时间与资源，留下判断的依据。'},{name:'价值影响力',text:'让作品和方法被使用，用真实反馈理解价值。'}].map((t,i)=><article className="theme-card" key={t.name}><span className="index">0{i+1}</span><h2>{t.name}</h2><p>{t.text}</p></article>)}</div><h2 className="subsection-title">正在思考与实践</h2>{items.filter(i=>i.topics.includes('选择战略')).map(i=><Link className="letter-card" href={'/content/'+i.slug+'/'} key={i.slug}><time>{i.date} · {i.type}</time><h2>{i.title}</h2><p>{i.excerpt}</p><span>阅读记录 →</span></Link>)}<div className="data-note" style={{marginTop:28}}>我希望重要的选择能留下四件事：当时的信息、选择的理由、接下来的验证，以及事后的复盘。</div></Page>;}
