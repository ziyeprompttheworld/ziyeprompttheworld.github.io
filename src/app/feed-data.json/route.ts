import {items,activity} from '@/lib/content';
export const dynamic='force-static';
export async function GET(){return Response.json(items.map(i=>({slug:i.slug,title:i.title,excerpt:i.excerpt,date:i.date,source:i.source,type:i.type,updatedAt:activity(i).time,url:activity(i).href})));}
