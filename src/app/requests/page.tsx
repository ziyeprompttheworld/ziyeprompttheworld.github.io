import {Page,PageHead} from '@/components/UI';
import Requests from '@/components/Requests';
export const metadata={title:'一起做点事'};
export default function RequestsPage(){return <Page><PageHead title="一起做点事" description="具体的问题、真实的反馈，也许就是下一次实践的开始。"/><Requests/></Page>;}
