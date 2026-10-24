import type { Metadata } from 'next';
import './globals.css';
import { site } from '@/lib/content';
export const metadata: Metadata = { metadataBase: new URL(site.url), title: { default: site.title, template:'%s | Ziye' }, description: site.description, openGraph: { title:site.title,description:site.description,type:'website',locale:'zh_CN' }, alternates:{types:{'application/rss+xml':'/rss.xml'}} };
export default function RootLayout({children}:{children:React.ReactNode}) { return <html lang="zh-CN"><body>{children}</body></html>; }
