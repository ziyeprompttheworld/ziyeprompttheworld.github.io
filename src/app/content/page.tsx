import {Page,PageHead,RssLink} from '@/components/UI';
import ContentBrowser from '@/components/ContentBrowser';
import {getDiary,items} from '@/lib/content';
export const metadata={title:'记录与作品'};
export default function Content(){const diary=getDiary();const toc={...diary,stages:diary.stages.map(s=>({...s,entries:s.entries.map(({id,title,date,html})=>({id,title,date,searchText:html.replace(/<[^>]*>/g,' ').replace(/\s+/g,' ')}))}))};return <Page><PageHead title="Ziye 的记录与作品" description="日记、思考、视频与实践的统一归档 · 赚钱能力 · 选择战略 · 价值影响力"><RssLink/></PageHead><ContentBrowser items={items} diary={toc}/></Page>;}
