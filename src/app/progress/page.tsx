import Link from 'next/link';
import {Page,PageHead} from '@/components/UI';
import {items,projects,recentItems,activity} from '@/lib/content';
export const metadata={title:'实践结果与进展'};
export default function Progress(){return <Page><PageHead title="实践结果与进展" description="留下行动与反馈，观察赚钱能力、判断和交付如何积累。"/><div className="metric-grid"><div className="metric"><span>正在推进</span><strong>{projects.length}</strong><small>个实践方向</small></div><div className="metric"><span>公开归档</span><strong>{items.length}</strong><small>条记录与作品</small></div><div className="metric"><span>商业验证</span><strong>进行中</strong><small>收入数据暂未公开</small></div></div><h2 className="subsection-title">最近进展</h2><div className="timeline">{recentItems().map(i=><article className="timeline-item" key={i.slug}><time>{activity(i).date} · {i.type}</time><Link href={activity(i).href}><h3>{activity(i).title}</h3></Link><p>{i.excerpt}</p></article>)}</div><div className="data-note">记录数量来自本站归档。收入、成本、客户和使用效果将在取得可验证数据后按公开范围补充。</div></Page>;}
