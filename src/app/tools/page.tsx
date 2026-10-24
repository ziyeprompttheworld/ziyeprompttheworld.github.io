import {Page,PageHead} from '@/components/UI';
import Tools from '@/components/Tools';
export const metadata={title:'实践小工具'};
export default function ToolsPage(){return <Page><PageHead title="实践小工具" description="用简单的工具，把假设、投入和研究线索整理清楚。"/><Tools/><h2 className="subsection-title">日记与内容的工作流</h2><ol className="workflow-list"><li><div><strong>随时记录</strong>把当日的想法、链接和图片交给 Codex，保留日期与来源。</div></li><li><div><strong>整理与聚合</strong>同一天的内容按主题汇总，区分公开记录与私人素材。</div></li><li><div><strong>积累与发布</strong>进入年度文章、项目与研究，持续更新已有内容。</div></li></ol></Page>;}
