'use client';

import { useEffect, useRef, useState } from 'react';

const ids = ['about', 'focus', 'journey', 'projects', 'writing', 'links'];

export default function LiquidNav({ labels, lang, menu, theme, toggleTheme, closeMenu }: {
  labels: string[]; lang: 'en' | 'zh'; menu: boolean; theme: string; toggleTheme: () => void; closeMenu: () => void;
}) {
  const nav = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const hovering = useRef<string | null>(null);
  const [current, setCurrent] = useState('about');
  const [map, setMap] = useState('');
  function moveLens(id: string, animate = true) {
    const container = track.current;
    const link = container?.querySelector<HTMLElement>('[data-section="' + id + '"]');
    if (!container || !link) return;
    container.style.setProperty('--lens-x', link.offsetLeft + 'px');
    container.style.setProperty('--lens-width', link.offsetWidth + 'px');
    container.dataset.animate = String(animate);
    container.querySelectorAll('a').forEach(a => a.classList.toggle('is-lit', a.dataset.section === id));
  }
  useEffect(() => {
    const frame = requestAnimationFrame(() => moveLens(hovering.current || current));
    const resize = () => moveLens(hovering.current || current, false);
    addEventListener('resize', resize);
    return () => { cancelAnimationFrame(frame); removeEventListener('resize', resize); };
  }, [current, labels, menu]);
  useEffect(() => {
    let queued = 0;
    const spy = () => {
      cancelAnimationFrame(queued);
      queued = requestAnimationFrame(() => {
        let active = ids[0];
        ids.forEach(id => { const el = document.getElementById(id); if (el && el.getBoundingClientRect().top <= innerHeight * .4) active = id; });
        setCurrent(active);
      });
    };
    addEventListener('scroll', spy, { passive: true });
    return () => { cancelAnimationFrame(queued); removeEventListener('scroll', spy); };
  }, []);
  useEffect(() => {
    // A rounded-rectangle displacement map bends the backdrop only near the glass rim.
    const width = 240, height = 88, radius = 42, edge = 14;
    const canvas = document.createElement('canvas'); canvas.width = width; canvas.height = height;
    const ctx = canvas.getContext('2d'); if (!ctx) return;
    const image = ctx.createImageData(width, height);
    const sdf = (x: number, y: number) => {
      const qx = Math.abs(x - width / 2) - (width / 2 - radius), qy = Math.abs(y - height / 2) - (height / 2 - radius);
      return Math.hypot(Math.max(qx, 0), Math.max(qy, 0)) + Math.min(Math.max(qx, qy), 0) - radius;
    };
    for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
      const d = -sdf(x, y);
      const bend = d >= 0 && d < edge ? Math.pow(1 - d / edge, 2) : 0;
      const nx = sdf(x + .5, y) - sdf(x - .5, y), ny = sdf(x, y + .5) - sdf(x, y - .5);
      const i = (y * width + x) * 4;
      image.data[i] = 128 + nx * bend * 115; image.data[i + 1] = 128 + ny * bend * 115; image.data[i + 2] = 128; image.data[i + 3] = 255;
    }
    ctx.putImageData(image, 0, 0);
    const url = canvas.toDataURL();
    const frame = requestAnimationFrame(() => setMap(url));
    return () => cancelAnimationFrame(frame);
  }, []);
  return <>
    <svg className="glass-filter-defs" aria-hidden="true"><defs><filter id="nav-refraction" x="-15%" y="-40%" width="130%" height="180%" colorInterpolationFilters="sRGB">
      <feImage href={map || undefined} x="0" y="0" width="100%" height="100%" preserveAspectRatio="none" result="rim" />
      <feDisplacementMap in="SourceGraphic" in2="rim" scale="18" xChannelSelector="R" yChannelSelector="G" result="bent" />
      <feGaussianBlur in="bent" stdDeviation=".35" />
    </filter></defs></svg>
    <nav ref={nav} className={'nav glass liquid-nav ' + (menu ? 'expanded' : '')} aria-label={lang === 'en' ? 'Main navigation' : '主导航'}
      onPointerMove={event => {
        if (event.pointerType === 'touch') return;
        const rect = event.currentTarget.getBoundingClientRect();
        event.currentTarget.style.setProperty('--nav-mx', (event.clientX - rect.left) + 'px');
        event.currentTarget.style.setProperty('--nav-my', (event.clientY - rect.top) + 'px');
        event.currentTarget.style.setProperty('--nav-hover', '1');
      }}
      onPointerLeave={() => { hovering.current = null; nav.current?.style.setProperty('--nav-hover', '0'); moveLens(current); }}>
      <div className="nav-track" ref={track}>
        <span className="nav-lens" aria-hidden="true"><span /></span>
        {labels.map((label, i) => <a key={ids[i]} href={'#' + ids[i]} data-section={ids[i]} aria-current={current === ids[i] ? 'location' : undefined}
          onPointerEnter={event => { if (event.pointerType !== 'touch') { hovering.current = ids[i]; moveLens(ids[i]); } }}
          onFocus={() => moveLens(ids[i])}
          onBlur={() => { if (!hovering.current) moveLens(current); }}
          onClick={() => { setCurrent(ids[i]); closeMenu(); }}>{label}</a>)}
      </div>
      <span className="nav-divider" />
      <button className="theme" onClick={toggleTheme} aria-label={lang === 'en' ? 'Toggle color theme' : '切换明暗主题'}>{theme === 'dark' ? '☾' : '☀'}</button>
    </nav>
  </>;
}
