// Browser-safe shared types; never import the server content loader into a client component.
export type { Item, Entry, Diary } from './content';
export const themes=['赚钱能力','选择战略','价值影响力'];
export function dateLabel(date:string){const [y,m,d]=date.split('-');return `${y}年${Number(m)}月${Number(d)}日`;}
