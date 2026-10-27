'use client';

import { useEffect, useRef, type ReactNode } from 'react';

export function PortraitMotion({ children }: { children: ReactNode }) {
  const scene = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = scene.current;
    if (!el) return;
    const fine = matchMedia('(hover: hover) and (pointer: fine)');
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    let rect = el.getBoundingClientRect(), frame = 0;
    let x = 0, y = 0, tx = 0, ty = 0, light = 0, targetLight = 0;
    const measure = () => { rect = el.getBoundingClientRect(); };
    const render = () => {
      x += (tx - x) * .1; y += (ty - y) * .1; light += (targetLight - light) * .1;
      el.style.setProperty('--tilt-x', (-y * 11).toFixed(3) + 'deg');
      el.style.setProperty('--tilt-y', (x * 14).toFixed(3) + 'deg');
      el.style.setProperty('--depth-x', (x * 12).toFixed(3) + 'px');
      el.style.setProperty('--depth-y', (y * 9).toFixed(3) + 'px');
      el.style.setProperty('--shine-x', (50 + x * 45).toFixed(2) + '%');
      el.style.setProperty('--shine-y', (50 + y * 45).toFixed(2) + '%');
      el.style.setProperty('--portrait-light', light.toFixed(3));
      if (Math.abs(tx - x) + Math.abs(ty - y) + Math.abs(targetLight - light) > .001) frame = requestAnimationFrame(render);
      else frame = 0;
    };
    const start = () => { if (!frame) frame = requestAnimationFrame(render); };
    const move = (event: PointerEvent) => {
      if (!fine.matches || reduced.matches || event.pointerType === 'touch') return;
      tx = Math.max(-1, Math.min(1, (event.clientX - rect.left) / rect.width * 2 - 1));
      ty = Math.max(-1, Math.min(1, (event.clientY - rect.top) / rect.height * 2 - 1));
      targetLight = 1; start();
    };
    const reset = () => { tx = 0; ty = 0; targetLight = 0; start(); };
    el.addEventListener('pointerenter', measure);
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerleave', reset);
    addEventListener('blur', reset);
    addEventListener('resize', measure);
    addEventListener('scroll', measure, { passive: true });
    const preference = () => { if (reduced.matches || !fine.matches) reset(); };
    reduced.addEventListener('change', preference); fine.addEventListener('change', preference);
    return () => {
      cancelAnimationFrame(frame);
      el.removeEventListener('pointerenter', measure); el.removeEventListener('pointermove', move); el.removeEventListener('pointerleave', reset);
      removeEventListener('blur', reset); removeEventListener('resize', measure); removeEventListener('scroll', measure);
      reduced.removeEventListener('change', preference); fine.removeEventListener('change', preference);
    };
  }, []);
  return <div className="portrait-scene portrait-interactive" ref={scene}>{children}</div>;
}

export function ShiningName() {
  return <h1 className="shining-name"><span className="name-metal" data-text="Wayne">Wayne</span><span className="name-dot">.</span></h1>;
}
