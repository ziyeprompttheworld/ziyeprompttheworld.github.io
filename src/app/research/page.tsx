import {Page,PageHead} from '@/components/UI';
import ResearchTable from '@/components/ResearchTable';
import patterns from '@/data/research.json';
export const metadata={title:'Atlas · 研究与方法'};
export default function Research(){return <Page wide><PageHead title="Atlas · 研究与方法" description="从案例中观察结构，为创作、商业实践与选择提供依据。"/><div className="data-note">这份索引收录 71 个创意原型。表中的结构来自对标研究，案例保留原始来源链接；其中的效果、价格与能力表述属于参考内容，应用到自己的作品时需要重新验证。</div><ResearchTable patterns={patterns}/></Page>;}
