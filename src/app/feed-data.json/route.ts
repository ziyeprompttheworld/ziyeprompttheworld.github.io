import {items} from '@/lib/content';
export const dynamic='force-static';
export async function GET(){return Response.json(items.map(({slug,title,excerpt,date,source,type})=>({slug,title,excerpt,date,source,type})));}
