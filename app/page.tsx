'use client';

/* eslint-disable @next/next/no-img-element */
import { useEffect, useMemo, useRef, useState } from 'react';
import repoSnapshot from './repos.json';
type Lang = 'en' | 'zh';
type Repo = { id: number; name: string; description: string | null; html_url: string; homepage: string | null; language: string | null; stargazers_count: number; fork: boolean; archived: boolean };
const GITHUB = 'https://github.com/WayneZ01';
const seed: Repo[] = [
  { id: 94405445, name: 'Android_open_project', description: 'A curated map of Android open source: classic libraries, Compose, Kotlin Multiplatform and on-device AI.', html_url: GITHUB + '/Android_open_project', homepage: null, language: 'Android', stargazers_count: 19, fork: false, archived: false },
  { id: 2, name: 'WayneZ01.github.io', description: 'My personal corner of the internet. Projects, writing and a little curiosity.', html_url: GITHUB + '/WayneZ01.github.io', homepage: 'https://waynez01.github.io', language: 'TypeScript', stargazers_count: 0, fork: false, archived: false },
  { id: 3, name: 'BloodSugarApp', description: 'An exploration of health tracking with Kotlin and Jetpack Compose.', html_url: GITHUB + '/BloodSugarApp', homepage: null, language: 'Kotlin', stargazers_count: 0, fork: true, archived: false },
  { id: 4, name: 'Snapzy', description: 'Native macOS screenshots and screen recording. Part of my open-source radar.', html_url: GITHUB + '/Snapzy', homepage: null, language: 'Swift', stargazers_count: 0, fork: true, archived: false },
  { id: 5, name: 'SmartisanWeather-Revived', description: 'A familiar weather experience revisited with modern Android tools.', html_url: GITHUB + '/SmartisanWeather-Revived', homepage: null, language: 'Kotlin', stargazers_count: 0, fork: true, archived: false },
  { id: 6, name: 'zhuzhiliao', description: 'A traditional bamboo toy, reimagined as a playful experiment on the web.', html_url: GITHUB + '/zhuzhiliao', homepage: null, language: 'JavaScript', stargazers_count: 0, fork: true, archived: false },
];
const copy = {
  en: {
    nav: ['About', 'Focus', 'Journey', 'Projects', 'Writing', 'Links'], role: 'DEVELOPER · BEIJING, CN', hello: 'Hello, I’m', headline: 'A curious mind.', headline2: 'A builder at heart.', sub: 'Building thoughtful experiences across Android, iOS, AI and the Web.', explore: 'Explore my work', github: 'Find me on GitHub', scroll: 'SCROLL TO EXPLORE', about: 'A little about me', aboutSide: 'Beijing → the open web', aboutText: 'I’m Wayne, a developer based in Beijing. I’m drawn to the space where thoughtful design meets useful technology — from native mobile experiences to intelligent tools and small experiments on the web.', aboutMore: 'Since joining GitHub in 2016, I’ve kept a growing collection of projects, ideas and open-source discoveries. This is my little corner of the internet: a place to connect the dots and share what comes next.', quote: 'Observe the world. Then write a little change.', focuses: 'Things I’m drawn to', focusSide: 'Four directions. One curiosity.', journey: 'Building, learning, sharing', journeySide: 'A journey in public', projects: 'Code & curiosity', projectsSide: 'Selected work & open-source discoveries', filters: ['All projects', 'Original', 'Forks & discoveries'], search: 'Find a project…', source: 'View source', live: 'Live site', more: 'Show more projects', none: 'No projects found. Try another search.', synced: 'Synced with GitHub', snapshot: 'Curated selection · live sync unavailable', loading: 'Connecting to GitHub', writing: 'Notes along the way', writingSide: 'Ideas worth writing down', writingTitle: 'From solving a problem\nto sharing a perspective.', writingText: 'Technical notes, development discoveries and thoughts about building things. My writing lives on CSDN.', read: 'Read my articles', connect: 'Let’s connect', connectSide: 'Good things start with a conversation.', connectTitle: 'Have something\nin mind?', connectText: 'An interesting project, an open-source idea, or just a hello — find me where the code lives.', back: 'Back to top', footer: 'Made with curiosity. Always evolving.', originalTag: 'Original project', forkTag: 'Fork · exploring', noDesc: 'An open-source discovery. Explore the repository to learn more.', theme: 'Toggle color theme', menu: 'Open navigation', featured: 'Open source, since 2017',
  },
  zh: {
    nav: ['关于', '领域', '历程', '项目', '文章', '联系'], role: '开发者 · 中国，北京', hello: '你好，我是', headline: '保持好奇。', headline2: '认真创造。', sub: '在 Android、iOS、AI 与 Web 之间，构建有温度的数字体验。', explore: '探索我的作品', github: '在 GitHub 找到我', scroll: '向下探索', about: '关于我的一点介绍', aboutSide: '立足北京，连接开放世界', aboutText: '我是 Wayne，一名来自北京的开发者。喜欢设计与技术相遇的地方，从原生移动应用、智能工具，到 Web 上的小实验，让复杂的事情变得简单而好用。', aboutMore: '2016 年加入 GitHub 以来，我持续记录项目、想法与值得关注的开源发现。这里是我的一小片互联网：串联探索的线索，也分享下一段旅程。', quote: '洞察世界，然后写下一点改变。', focuses: '我的兴趣所在', focusSide: '四个方向，同一份好奇心', journey: '构建，学习，分享', journeySide: '公开记录的探索轨迹', projects: '代码与好奇心', projectsSide: '个人作品与开源发现', filters: ['全部项目', '原创项目', 'Fork 与探索'], search: '搜索一个项目…', source: '查看源码', live: '访问网站', more: '查看更多项目', none: '没有找到匹配的项目，请换个关键词。', synced: '已与 GitHub 同步', snapshot: '精选项目 · 实时同步暂不可用', loading: '正在连接 GitHub', writing: '沿途的笔记', writingSide: '把有价值的想法写下来', writingTitle: '从解决一个问题，\n到分享一种思考。', writingText: '技术笔记、开发发现，以及关于创造的思考。我的文章发布在 CSDN。', read: '阅读我的文章', connect: '保持联系', connectSide: '好的故事，往往从交流开始', connectTitle: '有一个想法，\n想一起聊聊？', connectText: '一个有趣的项目、一个开源想法，或者只是打声招呼——从代码开始，找到我。', back: '回到顶部', footer: '因好奇而创造，持续生长。', originalTag: '原创项目', forkTag: 'Fork · 探索中', noDesc: '一个值得探索的开源项目，前往仓库了解更多。', theme: '切换明暗主题', menu: '打开导航', featured: '始于 2017 的开源整理',
  },
};
const focuses = [
  { name: 'Android', icon: '◫', color: 'green', tags: 'Kotlin · Compose · Architecture', en: 'Native experiences, from the smallest interaction to the systems behind it.', zh: '从细微交互，到背后的工程系统，探索可靠而流畅的原生体验。' },
  { name: 'iOS', icon: '◎', color: 'blue', tags: 'Swift · SwiftUI · Apple', en: 'A fascination with the details that make software feel natural.', zh: '关注让软件自然、细腻、恰到好处的每一个细节。' },
  { name: 'AI', icon: '✳', color: 'purple', tags: 'Agents · Automation · Workflows', en: 'Exploring intelligent tools that help turn a good idea into something real.', zh: '探索智能工具与工作流，让好的想法更快成为现实。' },
  { name: 'Web', icon: '⌘', color: 'orange', tags: 'React · TypeScript · Open source', en: 'An open canvas for useful products and unexpected little experiments.', zh: '一块开放的画布，用来构建实用产品，也容纳意料之外的小实验。' },
];
const journey = [
  { date: '2016', title: 'Hello, GitHub', en: 'A first step into building and learning in the open.', zh: '加入 GitHub，开始在开放的世界里学习与构建。', icon: '⌘' },
  { date: '2017', title: 'Android Open Project', en: 'Started a curated collection of Android libraries, tools and references.', zh: '建立 Android 开源项目导航，整理开发中值得复用的资源。', icon: '◫' },
  { date: 'NOW', title: 'Across the boundaries', en: 'Connecting mobile, AI and the web. Exploring what comes next.', zh: '连接移动端、AI 与 Web，持续探索下一个可能。', icon: '✳' },
];
function Arrow({ diagonal = false }: { diagonal?: boolean }) { return <span aria-hidden="true">{diagonal ? '↗' : '→'}</span>; }
function Stars() {
  const canvas = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const el = canvas.current; if (!el || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const ctx = el.getContext('2d'); if (!ctx) return;
    let frame = 0, w = 0, h = 0, active = true;
    const dots = Array.from({ length: 52 }, (_, i) => ({ x: ((i * 73.37) % 100) / 100, y: ((i * 31.79) % 100) / 100, r: i % 4 === 0 ? 1.7 : 1, s: (i % 2 ? 1 : -1) * 0.000015 }));
    const resize = () => { w = innerWidth; h = innerHeight; const d = Math.min(devicePixelRatio, 2); el.width = w * d; el.height = h * d; ctx.setTransform(d, 0, 0, d, 0, 0); };
    const draw = () => {
      if (!active) return; ctx.clearRect(0, 0, w, h);
      const light = document.documentElement.dataset.theme === 'light';
      dots.forEach((p, i) => {
        p.y = (p.y + p.s + 1) % 1; ctx.beginPath(); ctx.arc(p.x * w, p.y * h, p.r, 0, Math.PI * 2); ctx.fillStyle = light ? 'rgba(60,80,90,.3)' : 'rgba(204,218,213,.4)'; ctx.fill();
        dots.slice(i + 1).forEach(q => { const distance = Math.hypot((p.x - q.x) * w, (p.y - q.y) * h); if (distance < 145) { ctx.beginPath(); ctx.moveTo(p.x * w, p.y * h); ctx.lineTo(q.x * w, q.y * h); ctx.strokeStyle = 'rgba(140,160,155,' + ((1 - distance / 145) * .13) + ')'; ctx.lineWidth = .6; ctx.stroke(); } });
      }); frame = requestAnimationFrame(draw);
    };
    resize(); draw(); addEventListener('resize', resize);
    const visibility = () => { active = !document.hidden; if (active) draw(); else cancelAnimationFrame(frame); };
    document.addEventListener('visibilitychange', visibility);
    return () => { cancelAnimationFrame(frame); removeEventListener('resize', resize); document.removeEventListener('visibilitychange', visibility); };
  }, []);
  return <canvas className="constellation" ref={canvas} aria-hidden="true" />;
}
export default function Home() {
  const [lang, setLang] = useState<Lang>('en');
  const [theme, setTheme] = useState('dark');
  const [menu, setMenu] = useState(false);
  const [repos, setRepos] = useState<Repo[]>(repoSnapshot.length ? repoSnapshot : seed);
  const [status, setStatus] = useState<'loading' | 'live' | 'snapshot'>('loading');
  const [filter, setFilter] = useState('all');
  const [query, setQuery] = useState('');
  const [limit, setLimit] = useState(6);
  const t = copy[lang];
  const navIds = ['about', 'focus', 'journey', 'projects', 'writing', 'links'];
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      try {
        const saved = localStorage.getItem('wayne-language'); if (saved === 'zh' || saved === 'en') setLang(saved);
        if (localStorage.getItem('wayne-theme') === 'light') setTheme('light');
      } catch { /* Private browsing may disable storage. */ }
    });
    return () => cancelAnimationFrame(frame);
  }, []);
  useEffect(() => { document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en'; }, [lang]);
  useEffect(() => { document.documentElement.dataset.theme = theme; }, [theme]);
  useEffect(() => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 15000);
    (async () => {
      try {
        const cached = await fetch('/data/repos.json', { signal: controller.signal }).catch(() => null);
        if (cached?.ok) { const data = await cached.json(); if (Array.isArray(data.repos) && data.repos.length) { setRepos(data.repos); setStatus('live'); return; } }
        const result: Repo[] = [];
        for (let page = 1; page <= 20; page++) {
          const response = await fetch('https://api.github.com/users/WayneZ01/repos?per_page=100&sort=updated&page=' + page, { signal: controller.signal });
          if (!response.ok) throw new Error('GitHub unavailable');
          const list: Repo[] = await response.json(); result.push(...list); if (list.length < 100) break;
        }
        if (result.length) { setRepos(result); setStatus('live'); } else setStatus('snapshot');
      } catch { setStatus('snapshot'); } finally { clearTimeout(timer); }
    })();
    return () => { clearTimeout(timer); controller.abort(); };
  }, []);
  const filtered = useMemo(() => repos.filter(r => !r.archived && (filter === 'all' || (filter === 'original' ? !r.fork : r.fork)) && (r.name + ' ' + (r.description || '') + ' ' + (r.language || '')).toLowerCase().includes(query.toLowerCase())).sort((a, b) => (a.name === 'Android_open_project' ? -1 : b.name === 'Android_open_project' ? 1 : Number(a.fork) - Number(b.fork))), [repos, filter, query]);
  function language(value: Lang) { setLang(value); try { localStorage.setItem('wayne-language', value); } catch {} }
  function toggleTheme() { const next = theme === 'dark' ? 'light' : 'dark'; setTheme(next); try { localStorage.setItem('wayne-theme', next); } catch {} }
  return <main id="top">
    <Stars />
    <a className="skip" href="#about">{lang === 'en' ? 'Skip to content' : '跳到正文'}</a>
    <header className="header">
      <a href="#top" className="wordmark" aria-label="Wayne home">w<span>.</span></a>
      <nav className={'nav glass ' + (menu ? 'expanded' : '')} aria-label={lang === 'en' ? 'Main navigation' : '主导航'}>
        {t.nav.map((label, i) => <a href={'#' + navIds[i]} key={label} onClick={() => setMenu(false)}>{label}</a>)}
        <span className="nav-divider" /><button className="theme" onClick={toggleTheme} aria-label={t.theme}>{theme === 'dark' ? '☾' : '☀'}</button>
      </nav>
      <div className="header-right"><div className="language" aria-label="Language"><button aria-pressed={lang === 'en'} onClick={() => language('en')}>EN</button><span>/</span><button aria-pressed={lang === 'zh'} onClick={() => language('zh')}>中</button></div><button className="menu-button" aria-label={t.menu} aria-expanded={menu} onClick={() => setMenu(!menu)}>☰</button></div>
    </header>
    <section className="hero shell">
      <div className="hero-panel glass">
        <div className="hero-copy"><p className="eyebrow"><span className="status-dot" />{t.role}</p><p className="hello">{t.hello}</p><h1>Wayne<span className="name-dot">.</span></h1><h2>{t.headline}<br /><span>{t.headline2}</span></h2><p className="hero-description">{t.sub}</p><div className="hero-pills"><span>⌖ Beijing, China <span className="utc">UTC +08</span></span><a href={GITHUB} target="_blank" rel="noreferrer">⌘ @WayneZ01 <Arrow diagonal /></a></div><a href="#projects" className="button primary">{t.explore}<Arrow /></a></div>
        <div className="portrait-scene"><div className="portrait-halo" /><div className="portrait-frame"><img src="/avatar.png" width="420" height="420" alt="Wayne’s original GitHub avatar" fetchPriority="high" /><span className="portrait-caption">WAYNE / DIGITAL EXPLORER</span></div><a className="floating-badge badge-top glass" href={GITHUB + '/Android_open_project'} target="_blank" rel="noreferrer"><span className="badge-icon green">◫</span><span><strong>Android & beyond</strong><small>{t.featured}</small></span><Arrow diagonal /></a><div className="floating-badge badge-bottom glass"><span className="badge-icon purple">✳</span><span><strong>Always curious.</strong><small>Mobile · AI · Web</small></span><span className="status-dot" /></div><span className="orbit-label">⌁&nbsp; A WORK IN PROGRESS</span></div>
      </div>
      <a href="#about" className="scroll-cue">{t.scroll}<span>↓</span></a>
    </section>
    <section className="section shell" id="about"><SectionTitle title={t.about} side={t.aboutSide} number="01" /><div className="about-grid"><div className="about-art glass"><span className="art-coordinates">39.90° N / 116.40° E</span><div className="art-orbits"><span>W</span></div><div className="art-bottom"><span className="status-dot" />BEIJING ↔ EVERYWHERE<Arrow diagonal /></div></div><div className="about-text"><span className="section-kicker">HELLO AGAIN.</span><p>{t.aboutText}</p><p className="muted">{t.aboutMore}</p><blockquote>“{t.quote}”</blockquote><a className="text-link" href={GITHUB} target="_blank" rel="noreferrer">{t.github}<Arrow diagonal /></a></div></div></section>
    <section className="section shell" id="focus"><SectionTitle title={t.focuses} side={t.focusSide} number="02" /><div className="focus-grid">{focuses.map((f, i) => <article className={'focus-card glass ' + f.color} key={f.name}><div className="focus-top"><span className="focus-icon">{f.icon}</span><span>0{i + 1}</span></div><h3>{f.name}</h3><p>{f[lang]}</p><small>{f.tags}</small></article>)}</div></section>
    <section className="section shell" id="journey"><SectionTitle title={t.journey} side={t.journeySide} number="03" /><div className="timeline">{journey.map(j => <article className="timeline-row" key={j.date}><span className="timeline-date">{j.date}</span><span className="timeline-icon glass">{j.icon}</span><div><h3>{j.title}</h3><p>{j[lang]}</p></div><span className="timeline-end">↗</span></article>)}</div></section>
    <section className="section shell" id="projects"><SectionTitle title={t.projects} side={t.projectsSide} number="04" /><div className="project-tools"><div className="filters" aria-label={lang === 'en' ? 'Filter projects' : '筛选项目'}>{['all', 'original', 'forks'].map((f, i) => <button key={f} aria-pressed={filter === f} onClick={() => { setFilter(f); setLimit(6); }}>{t.filters[i]}</button>)}</div><label className="search"><span aria-hidden="true">⌕</span><input value={query} onChange={e => { setQuery(e.target.value); setLimit(6); }} placeholder={t.search} aria-label={t.search} /></label></div><div className="project-grid">{filtered.slice(0, limit).map((r, i) => <article className="project-card glass" key={r.id}><div className="project-visual" data-color={i % 4}><span className="project-visual-number">0{(i % 9) + 1}</span><span className="project-symbol">{r.language === 'Swift' ? '⌘' : r.name.includes('Android') || r.language === 'Kotlin' ? '◫' : r.name.includes('AI') ? '✳' : '⌁'}</span><span className="project-visual-caption">{r.language || 'OPEN SOURCE'}<Arrow diagonal /></span></div><div className="project-body"><div className="project-type"><span>{r.fork ? t.forkTag : t.originalTag}</span>{r.stargazers_count > 0 && <span>☆ {r.stargazers_count}</span>}</div><h3>{r.name.replaceAll('_', ' ')}</h3><p>{r.description || t.noDesc}</p><div className="project-links"><a href={r.html_url} target="_blank" rel="noreferrer">{t.source}<Arrow diagonal /></a>{r.homepage && /^https?:\/\//i.test(r.homepage) && <a href={r.homepage} target="_blank" rel="noreferrer">{t.live}<Arrow diagonal /></a>}</div></div></article>)}</div>{!filtered.length && <p className="empty">{t.none}</p>}<div className="project-footer"><span><i className={'tiny-dot ' + status} />{status === 'live' ? t.synced + ' · ' + repos.length + (lang === 'en' ? ' public repositories' : ' 个公开仓库') : status === 'loading' ? t.loading : t.snapshot}</span>{limit < filtered.length && <button className="button subtle" onClick={() => setLimit(v => v + 6)}>{t.more}<span>+</span></button>}<a className="text-link" href={GITHUB + '?tab=repositories'} target="_blank" rel="noreferrer">GitHub<Arrow diagonal /></a></div></section>
    <div className="tech-ribbon" aria-hidden="true"><div>{Array.from({ length: 2 }, (_, i) => <span key={i}>Kotlin <b>✦</b> Swift <b>✦</b> Android <b>✦</b> React <b>✦</b> TypeScript <b>✦</b> AI Agents <b>✦</b> Open Source <b>✦</b></span>)}</div></div>
    <section className="section shell" id="writing"><SectionTitle title={t.writing} side={t.writingSide} number="05" /><a className="writing-panel glass" href="https://blog.csdn.net/zhanwei0102" target="_blank" rel="noreferrer"><div><span className="section-kicker">THE DIGITAL NOTEBOOK</span><h3>{t.writingTitle}</h3><p>{t.writingText}</p><span className="button subtle">{t.read}<Arrow diagonal /></span></div><div className="notebook" aria-hidden="true"><span>FIELD NOTES</span><strong>Ideas,<br />in motion<span>.</span></strong><div className="notebook-lines" /><small>WAYNE / CSDN</small></div></a></section>
    <section className="section shell connect" id="links"><SectionTitle title={t.connect} side={t.connectSide} number="06" /><div className="connect-panel glass"><span className="section-kicker"><span className="status-dot" /> OPEN TO GOOD IDEAS</span><h2>{t.connectTitle}</h2><p>{t.connectText}</p><div className="social-links"><a href={GITHUB} target="_blank" rel="noreferrer"><span>⌘</span><div><strong>GitHub</strong><small>@WayneZ01</small></div><Arrow diagonal /></a><a href="https://blog.csdn.net/zhanwei0102" target="_blank" rel="noreferrer"><span>✎</span><div><strong>CSDN</strong><small>Notes & articles</small></div><Arrow diagonal /></a><a href="https://gist.github.com/WayneZ01" target="_blank" rel="noreferrer"><span>⌁</span><div><strong>Gists</strong><small>Small pieces of code</small></div><Arrow diagonal /></a></div></div></section>
    <footer className="shell"><a className="footer-logo" href="#top">Wayne<span>.</span></a><p>{t.footer}<small>© {new Date().getFullYear()} Wayne</small></p><a className="text-link" href="#top">{t.back}<span>↑</span></a></footer>
  </main>;
}
function SectionTitle({ title, side, number }: { title: string; side: string; number: string }) { return <div className="section-heading"><div><span className="section-number">{number} /</span><h2>{title}<span>.</span></h2></div><p>{side}</p></div>; }
