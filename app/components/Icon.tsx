import type { CSSProperties } from 'react';

export type IconName = 'arrow' | 'external' | 'up' | 'down' | 'moon' | 'sun' | 'android' | 'ios' | 'ai' | 'web' | 'github' | 'code' | 'pen' | 'pin' | 'search' | 'menu';
const paths: Record<IconName, React.ReactNode> = {
  arrow: <><path d="M4 12h16m-6-6 6 6-6 6" /></>,
  external: <><path d="M6 18 18 6M6 6h12v12" /></>,
  up: <><path d="M12 20V4m-6 6 6-6 6 6" /></>,
  down: <><path d="M12 4v16m-6-6 6 6 6-6" /></>,
  moon: <path d="M20.2 14.1A8.5 8.5 0 0 1 9.9 3.8a8.5 8.5 0 1 0 10.3 10.3Z" />,
  sun: <><circle cx="12" cy="12" r="4" /><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.4 1.4m11.2 11.2L19 19M5 19l1.4-1.4M17.6 6.4 19 5" /></>,
  android: <><path d="m7 5-2-3m12 3 2-3M4 12a8 8 0 0 1 16 0v6H4Z" /><path d="M8 18v3m8-3v3M1 12v5m22-5v5" /><circle cx="8" cy="9" r=".65" fill="currentColor" stroke="none" /><circle cx="16" cy="9" r=".65" fill="currentColor" stroke="none" /></>,
  ios: <><rect x="6" y="2" width="12" height="20" rx="3" /><path d="M10 5h4m-3 14h2" /><path d="m9 12 2 2 4-5" /></>,
  ai: <><rect x="5" y="5" width="14" height="14" rx="4" /><path d="M9 2v3m6-3v3M9 19v3m6-3v3M2 9h3m-3 6h3m14-6h3m-3 6h3m-12-3 3-3 3 3-3 3Z" /></>,
  web: <><circle cx="12" cy="12" r="9" /><ellipse cx="12" cy="12" rx="4" ry="9" /><path d="M3 12h18M5 7h14M5 17h14" /></>,
  github: <><path d="M9 21v-3.2c-4.2.9-4.2-2-6-2.5m14 5.7v-3.7a3.2 3.2 0 0 0-.9-2.4c3-.3 6.2-1.5 6.2-6.8A5.3 5.3 0 0 0 21 4.4 5 5 0 0 0 20.9 1S19.7.6 17 2.4a13 13 0 0 0-7 0C7.3.6 6.1 1 6.1 1A5 5 0 0 0 6 4.4a5.3 5.3 0 0 0-1.4 3.7c0 5.3 3.2 6.5 6.2 6.8a3.2 3.2 0 0 0-.8 2.4V21" transform="translate(-1 1) scale(.95)" /></>,
  code: <><path d="m8 7-5 5 5 5m8-10 5 5-5 5m-3-14-2 18" /></>,
  pen: <><path d="m15 4 5 5M4 20l5-1L21 7a2.1 2.1 0 0 0-4-4L5 15Z" /></>,
  pin: <><path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z" /><circle cx="12" cy="10" r="2" /></>,
  search: <><circle cx="10.5" cy="10.5" r="6.5" /><path d="m16 16 5 5" /></>,
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
};
export default function Icon({ name, className = '', style }: { name: IconName; className?: string; style?: CSSProperties }) {
  return <svg className={'icon ' + className} style={style} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}
