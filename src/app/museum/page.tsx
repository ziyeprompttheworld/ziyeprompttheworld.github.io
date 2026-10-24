import MuseumLoader from '@/components/MuseumLoader';
import {items} from '@/lib/content';
export const metadata={title:'Ziye 的实践与作品展馆',description:'走进记录、选择与作品之间。'};
export default function MuseumPage(){return <MuseumLoader works={items.map(({slug,title,excerpt,date,topics,cover})=>({slug,title,excerpt,date,topics,cover}))}/>;}
