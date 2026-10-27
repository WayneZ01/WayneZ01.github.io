'use client';

import { useEffect, useRef } from 'react';

type Particle = { x: number; y: number; vx: number; vy: number; z: number; r: number; ox: number; oy: number };
export default function Atmosphere() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const aura = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = canvas.current;
    const ctx = el?.getContext('2d');
    if (!el || !ctx) return;
    const motion = matchMedia('(prefers-reduced-motion: reduce)');
    const fine = matchMedia('(hover: hover) and (pointer: fine)');
    let w = innerWidth, h = innerHeight, frame = 0, last = 0, running = true;
    let px = w / 2, py = h / 2, mx = px, my = py, active = false, strength = 0;
    let particles: Particle[] = [];
    let panels: { el: HTMLElement; rect: DOMRect }[] = [];
    const measurePanels = () => { panels = Array.from(document.querySelectorAll<HTMLElement>('.glass')).map(panel => ({ el: panel, rect: panel.getBoundingClientRect() })); };
    const resize = () => {
      w = innerWidth; h = innerHeight;
      const dpr = Math.min(devicePixelRatio || 1, 2);
      el.width = w * dpr; el.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.min(fine.matches ? 130 : 48, Math.max(38, Math.round(w * h / 12500)));
      particles = Array.from({ length: count }, (_, i) => ({
        x: ((i * 0.61803398875 + .09) % 1) * w,
        y: ((i * 0.41421356237 + .12) % 1) * h,
        vx: Math.sin(i * 7.3) * .115, vy: Math.cos(i * 3.7) * .1,
        z: .25 + (i % 7) / 9, r: i % 8 === 0 ? 1.9 : .6 + (i % 3) * .35, ox: 0, oy: 0,
      }));
      measurePanels();
    };
    const pointer = (event: PointerEvent) => { if (!fine.matches || event.pointerType === 'touch') return; px = event.clientX; py = event.clientY; active = true; };
    const leave = (event: PointerEvent) => { if (!event.relatedTarget) active = false; };
    const blur = () => { active = false; };
    const draw = (now: number) => {
      if (!running) return;
      frame = requestAnimationFrame(draw);
      if (now - last < 1000 / 60) return;
      const dt = Math.min((now - (last || now)) / 16.67, 2); last = now;
      const reduced = motion.matches;
      mx += (px - mx) * .12; my += (py - my) * .12;
      strength += ((active && !reduced ? 1 : 0) - strength) * .09;
      if (aura.current) {
        aura.current.style.transform = 'translate3d(' + mx + 'px,' + my + 'px,0)';
        aura.current.style.opacity = String(strength);
      }
      // Read geometry only on scroll/resize/content changes, never per pointer event.
      if (strength > .005) panels.forEach(panel => {
        if (panel.rect.bottom < -50 || panel.rect.top > h + 50) return;
        panel.el.style.setProperty('--glass-x', (mx - panel.rect.left) + 'px');
        panel.el.style.setProperty('--glass-y', (my - panel.rect.top) + 'px');
        panel.el.style.setProperty('--glass-light', String(strength));
      });
      ctx.clearRect(0, 0, w, h);
      const light = document.documentElement.dataset.theme === 'light';
      const parallaxX = reduced ? 0 : (mx / w - .5) * 52 * strength;
      const parallaxY = reduced ? 0 : (my / h - .5) * 42 * strength;
      const points = particles.map(p => {
        if (!reduced) {
          p.x = (p.x + p.vx * dt + w + 20) % (w + 20);
          p.y = (p.y + p.vy * dt + h + 20) % (h + 20);
        }
        const dx = p.x + parallaxX * p.z - mx, dy = p.y + parallaxY * p.z - my;
        const distance = Math.hypot(dx, dy);
        const force = Math.max(0, 1 - distance / 195) * 42 * strength;
        const targetX = distance > 0 ? dx / distance * force : 0;
        const targetY = distance > 0 ? dy / distance * force : 0;
        p.ox += (targetX - p.ox) * .065; p.oy += (targetY - p.oy) * .065;
        return { x: p.x + parallaxX * p.z + p.ox, y: p.y + parallaxY * p.z + p.oy, r: p.r, near: Math.max(0, 1 - distance / 260) * strength };
      });
      const linkDistance = fine.matches ? 158 : 110;
      points.forEach((p, i) => {
        for (let j = i + 1; j < points.length; j++) {
          const q = points[j], d = Math.hypot(p.x - q.x, p.y - q.y);
          if (d > linkDistance) continue;
          const alpha = (1 - d / linkDistance) * (light ? .15 : .18) + Math.min(p.near, q.near) * .12;
          ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = light ? 'rgba(65,88,84,' + alpha + ')' : 'rgba(195,217,213,' + alpha + ')';
          ctx.lineWidth = .55; ctx.stroke();
        }
        if (p.near > .05 && !light) {
          const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, 7 + p.near * 6);
          glow.addColorStop(0, 'rgba(211,239,231,' + (.16 * p.near) + ')'); glow.addColorStop(1, 'rgba(211,239,231,0)');
          ctx.fillStyle = glow; ctx.beginPath(); ctx.arc(p.x, p.y, 7 + p.near * 6, 0, Math.PI * 2); ctx.fill();
        }
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r + p.near * .7, 0, Math.PI * 2);
        ctx.fillStyle = light ? 'rgba(68,91,85,' + (.3 + p.near * .35) + ')' : 'rgba(211,226,220,' + (.38 + p.near * .55) + ')'; ctx.fill();
        if (p.near > .1) {
          ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(mx, my);
          ctx.strokeStyle = light ? 'rgba(76,107,94,' + (p.near * .13) + ')' : 'rgba(211,232,222,' + (p.near * .13) + ')';
          ctx.lineWidth = .5; ctx.stroke();
        }
      });
    };
    const visibility = () => { running = !document.hidden; cancelAnimationFrame(frame); if (running) { last = 0; frame = requestAnimationFrame(draw); } };
    const observer = new MutationObserver(measurePanels);
    observer.observe(document.querySelector('main') || document.body, { childList: true, subtree: true });
    resize(); frame = requestAnimationFrame(draw);
    addEventListener('resize', resize); addEventListener('scroll', measurePanels, { passive: true });
    addEventListener('pointermove', pointer, { passive: true }); addEventListener('pointerout', leave); addEventListener('blur', blur);
    document.addEventListener('visibilitychange', visibility);
    return () => {
      cancelAnimationFrame(frame); observer.disconnect();
      removeEventListener('resize', resize); removeEventListener('scroll', measurePanels);
      removeEventListener('pointermove', pointer); removeEventListener('pointerout', leave); removeEventListener('blur', blur);
      document.removeEventListener('visibilitychange', visibility);
      panels.forEach(panel => panel.el.style.setProperty('--glass-light', '0'));
    };
  }, []);
  return <><canvas className="constellation interactive-constellation" ref={canvas} aria-hidden="true" /><div className="mouse-aura" ref={aura} aria-hidden="true"><div /></div></>;
}
