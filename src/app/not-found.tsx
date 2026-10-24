import Link from 'next/link';
import {Page} from '@/components/UI';
export default function NotFound(){return <Page><div className="empty-state"><small>404</small><h1 style={{fontFamily:'var(--serif)',marginTop:20}}>这条路还没有记录</h1><p>可以从首页或内容归档继续浏览。</p><Link className="button" href="/content/">回到记录与作品 →</Link></div></Page>;}
