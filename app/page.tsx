'use client';

import { useEffect, useMemo, useState } from 'react';

type Repo = {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
  fork: boolean;
  archived: boolean;
};

type Lang = 'en' | 'zh';

const fallbackRepos: Repo[] = [
  { id: 1, name: 'Android_open_project', description: 'Android 开源项目雷达：记录工作中值得关注和复用的优秀项目。', html_url: 'https://github.com/WayneZ01/Android_open_project', homepage: '', language: 'Android', stargazers_count: 19, forks_count: 2, updated_at: '2025-09-18', fork: false, archived: false },
  { id: 2, name: 'zhuzhiliao', description: '竹知了——一转就哇哇叫的传统玩具 Web 模拟版。', html_url: 'https://github.com/WayneZ01/zhuzhiliao', homepage: 'https://zhuzhiliao.icu', language: 'Web', stargazers_count: 0, forks_count: 0, updated_at: '2026-08-07', fork: true, archived: false },
  { id: 3, name: 'BloodSugarApp', description: '基于 Kotlin 与 Jetpack Compose 的智能血糖管理 Android 应用。', html_url: 'https://github.com/WayneZ01/BloodSugarApp', homepage: '', language: 'Kotlin', stargazers_count: 0, forks_count: 0, updated_at: '2026-07-29', fork: true, archived: false },
  { id: 4, name: 'Snapzy', description: '开源原生 macOS 截图与录屏工具，轻量而专注。', html_url: 'https://github.com/WayneZ01/Snapzy', homepage: 'https://snapzy.app', language: 'Swift', stargazers_count: 0, forks_count: 0, updated_at: '2026-08-03', fork: true, archived: false },
  { id: 5, name: 'SmartisanWeather-Revived', description: '使用现代 Android 技术栈重写与复活锤子天气。', html_url: 'https://github.com/WayneZ01/SmartisanWeather-Revived', homepage: '', language: 'Kotlin', stargazers_count: 0, forks_count: 0, updated_at: '2026-07-29', fork: true, archived: false },
  { id: 6, name: 'dbx', description: '轻量级跨平台数据库客户端，覆盖多种主流数据库。', html_url: 'https://github.com/WayneZ01/dbx', homepage: 'https://dbxio.com', language: 'Desktop', stargazers_count: 0, forks_count: 0, updated_at: '2026-07-16', fork: true, archived: false },
];

const focusAreas = [
  { no: '01', title: 'ANDROID SYSTEMS', en: 'From interaction components to full products, crafting reliable Android experiences and efficient engineering systems.', zh: '从交互组件、工具链到完整应用，持续打磨 Android 体验与工程效率。', tags: ['KOTLIN', 'COMPOSE', 'ARCHITECTURE'], glyph: '◫' },
  { no: '02', title: 'iOS CRAFT', en: 'Native Apple experiences shaped through Swift, SwiftUI, thoughtful motion, and obsessive product polish.', zh: '用 Swift、SwiftUI、细腻动效与产品打磨，构建原生 Apple 体验。', tags: ['SWIFT', 'SWIFTUI', 'APPLE'], glyph: '◎' },
  { no: '03', title: 'AI NATIVE', en: 'Turning AI from a feature into a product capability through agents, automation, and intelligent interfaces.', zh: '把 AI 从功能点变成产品能力：Agents、自动化工作流与智能体验。', tags: ['AGENTS', 'AUTOMATION', 'PRODUCT'], glyph: '✦' },
  { no: '04', title: 'WEB / OPEN SOURCE', en: 'Building for the open web while tracking, testing, and sharing technology worth reusing.', zh: '为开放 Web 构建，同时追踪、验证并分享真正值得复用的技术。', tags: ['WEB', 'CURATION', 'SHARING'], glyph: '⌁' },
];

const copy = {
  en: {
    nav: ['PROJECTS', 'FOCUS', 'ABOUT'], heroLabel: 'HELLO, DIGITAL WORLD', hero: ['BUILD.', 'EXPLORE.', 'RESHAPE POSSIBILITY.'],
    metrics: ['PUBLIC REPOS', 'BUILDING IN PUBLIC', 'REPO STARS', 'BASED / WORLD BOUND'],
    intro: <>I&apos;m Wayne, a developer turning complex ideas into useful products across <em>Android, iOS, AI, and the Web</em>.</>,
    explore: 'EXPLORE PROJECTS', articles: 'READ MY WRITING', codeMode: "'insight into action'", projectsLabel: 'CODE IN THE WILD',
    projectsTitle: <>Projects aren&apos;t a list.<br /><i>They&apos;re a trail.</i></>, projectsIntro: 'A live wall connected directly to GitHub. Every new public repository becomes part of this evolving archive.',
    filters: ['ALL', 'ORIGINAL', 'FORK / RADAR'], search: 'Search 213 repositories…', noDescription: 'An open-source project still evolving. Visit GitHub to see what it is becoming.',
    empty: 'No matching project. Try another keyword.', load: 'LOAD MORE', allRepos: 'VIEW ALL 213 REPOSITORIES ON GITHUB ↗', connecting: 'CONNECTING TO GITHUB…', live: 'LIVE DATA', originals: 'ORIGINAL REPOS', fallback: 'SHOWING OFFLINE SELECTION',
    focusLabel: 'THE OPERATING SYSTEM', focusTitle: <>I care about more<br /><i>than the technology.</i></>, focusIntro: 'I care how technology is organized, felt, and turned into a better experience in the real world.',
    aboutLabel: 'BEHIND THE SCREEN', quote: <>“Observe the world.<br />Then write a little change.”</>, about: 'On GitHub since 2016, based in Beijing. I work across Android, iOS, AI-native workflows, the Web, product experience, and open-source craft. This site is my digital garden—projects, observations, and long-term thinking, always in motion.',
    idea: 'HAVE AN IDEA?', signal: <>Move it from “maybe”<br />to <span>“already live.”</span></>, back: 'BACK TO TOP ↑', avatar: 'Wayne’s GitHub avatar', mainNav: 'Main navigation', filtersLabel: 'Project filters', searchLabel: 'Search GitHub repositories',
  },
  zh: {
    nav: ['项目', '领域', '关于'], heroLabel: '你好，数字世界', hero: ['构建。', '探索。', '重塑可能。'],
    metrics: ['公开仓库', '持续公开构建', '仓库星标', '立足北京 / 面向世界'],
    intro: <>我是 Wayne，一名把复杂想法变成可用产品的开发者。长期行走在 <em>Android、iOS、AI 与 Web</em> 的交界处。</>,
    explore: '探索项目', articles: '阅读我的文章', codeMode: "'洞察世界'", projectsLabel: '代码，正在发生',
    projectsTitle: <>项目不是列表，<br /><i>是留下的轨迹。</i></>, projectsIntro: '直接连接 GitHub 的实时项目墙。新的公开仓库会自动进入这里，持续生长。',
    filters: ['全部', '原创', '收藏 / FORK'], search: '搜索 213 个仓库…', noDescription: '一个仍在演化中的开源项目，去 GitHub 看看它正在构建什么。',
    empty: '没有找到匹配的项目。换个关键词试试。', load: '加载更多', allRepos: '在 GitHub 查看全部 213 个仓库 ↗', connecting: '正在连接 GitHub…', live: '实时数据', originals: '个原创仓库', fallback: '当前展示离线精选',
    focusLabel: '我的运行系统', focusTitle: <>我关注的，<br /><i>不是技术本身。</i></>, focusIntro: '而是技术如何被组织、被感知，最后变成真实世界里更好的体验。',
    aboutLabel: '屏幕背后', quote: <>“洞察世界，<br />然后写下一点改变。”</>, about: '2016 年加入 GitHub，来自北京。关注 Android、iOS、AI 原生工作流、Web、产品体验与开源创造。这个站点是我的数字花园：项目、观察与长期思考都会在这里继续生长。',
    idea: '有个想法？', signal: <>让它从“也许”<br />变成<span>“已经上线”</span>。</>, back: '回到顶部 ↑', avatar: 'Wayne 的 GitHub 头像', mainNav: '主导航', filtersLabel: '项目筛选', searchLabel: '搜索 GitHub 仓库',
  },
} as const;

function formatDate(date: string, lang: Lang) {
  return new Intl.DateTimeFormat(lang === 'en' ? 'en-US' : 'zh-CN', { year: 'numeric', month: 'short' }).format(new Date(date));
}

export default function Home() {
  const [lang, setLang] = useState<Lang>('en');
  const [repos, setRepos] = useState<Repo[]>(fallbackRepos);
  const [repoStatus, setRepoStatus] = useState<'loading' | 'live' | 'fallback'>('loading');
  const [filter, setFilter] = useState<'all' | 'original' | 'forks'>('all');
  const [query, setQuery] = useState('');
  const [visible, setVisible] = useState(9);
  const t = copy[lang];

  useEffect(() => {
    document.documentElement.lang = lang === 'en' ? 'en' : 'zh-CN';
  }, [lang]);

  useEffect(() => {
    const onPointer = (event: PointerEvent) => {
      document.documentElement.style.setProperty('--pointer-x', `${event.clientX}px`);
      document.documentElement.style.setProperty('--pointer-y', `${event.clientY}px`);
    };
    window.addEventListener('pointermove', onPointer, { passive: true });
    return () => window.removeEventListener('pointermove', onPointer);
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    Promise.all([1, 2, 3].map(page => fetch(`https://api.github.com/users/WayneZ01/repos?per_page=100&sort=updated&page=${page}`, { signal: controller.signal }).then(response => {
      if (!response.ok) throw new Error('GitHub API unavailable');
      return response.json() as Promise<Repo[]>;
    }))).then(pages => {
      const next = pages.flat().filter(repo => !repo.archived && repo.name !== 'WayneZ01.github.io');
      setRepos(next);
      setRepoStatus('live');
    }).catch(error => {
      if (error.name !== 'AbortError') setRepoStatus('fallback');
    });
    return () => controller.abort();
  }, []);

  const filteredRepos = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return repos.filter(repo => {
      const matchesType = filter === 'all' || (filter === 'original' ? !repo.fork : repo.fork);
      const matchesQuery = !needle || `${repo.name} ${repo.description ?? ''} ${repo.language ?? ''}`.toLowerCase().includes(needle);
      return matchesType && matchesQuery;
    });
  }, [repos, query, filter]);

  const originals = repos.filter(repo => !repo.fork).length;
  const totalStars = repos.reduce((sum, repo) => sum + repo.stargazers_count, 0);

  return (
    <main>
      <div className="noise" aria-hidden="true" />
      <div className="pointer-glow" aria-hidden="true" />
      <div className="orb orb-one" aria-hidden="true" />
      <div className="orb orb-two" aria-hidden="true" />

      <nav className="nav shell" aria-label={t.mainNav}>
        <a className="brand" href="#top" aria-label="Wayne home"><span className="brand-mark">W</span><span>WAYNE<span className="accent-dot">.</span></span></a>
        <div className="nav-links">
          <a href="#projects">{t.nav[0]}</a><a href="#focus">{t.nav[1]}</a><a href="#about">{t.nav[2]}</a>
        </div>
        <div className="nav-actions">
          <div className="language-switch" aria-label="Language / 语言"><button className={lang === 'en' ? 'active' : ''} onClick={() => setLang('en')} aria-pressed={lang === 'en'}>EN</button><button className={lang === 'zh' ? 'active' : ''} onClick={() => setLang('zh')} aria-pressed={lang === 'zh'}>中文</button></div>
          <a className="github-pill" href="https://github.com/WayneZ01" target="_blank" rel="noreferrer"><span className="live-dot" aria-hidden="true" />GITHUB / WAYNEZ01 <span aria-hidden="true">↗</span></a>
        </div>
      </nav>

      <section className="hero shell" id="top">
        <div className="hero-copy">
          <p className="eyebrow"><span>01</span> {t.heroLabel}</p>
          <h1 className={lang === 'en' ? 'hero-en' : ''}><span>{t.hero[0]}</span><span>{t.hero[1]}</span><span className="gradient-text">{t.hero[2]}</span></h1>
          <p className="hero-intro">{t.intro}</p>
          <div className="hero-actions"><a className="primary-button" href="#projects">{t.explore} <span>↘</span></a><a className="text-link" href="https://blog.csdn.net/zhanwei0102" target="_blank" rel="noreferrer">{t.articles} <span>↗</span></a></div>
        </div>

        <div className="hero-visual" aria-label="Wayne developer card">
          <div className="orbit orbit-a" aria-hidden="true" /><div className="orbit orbit-b" aria-hidden="true" />
          <div className="code-card">
            <div className="code-topbar"><span /><span /><span /><small>wayne.profile.ts</small></div>
            <div className="code-body">
              <div className="code-line"><span>01</span><code><b>const</b> wayne = {'{'}</code></div>
              <div className="code-line"><span>02</span><code>  craft: <i>&apos;Android · iOS · AI · Web&apos;</i>,</code></div>
              <div className="code-line"><span>03</span><code>  mode: <i>{t.codeMode}</i>,</code></div>
              <div className="code-line"><span>04</span><code>  since: <em>2016</em>,</code></div>
              <div className="code-line"><span>05</span><code>{'}'};</code></div>
            </div>
            <div className="code-status"><span>●</span> BUILDING THE NEXT THING</div>
          </div>
          <span className="float-tag tag-kotlin">KOTLIN</span><span className="float-tag tag-ios">SWIFT / iOS</span><span className="float-tag tag-ai">AI / AGENTS</span><span className="float-tag tag-web">WEB</span>
        </div>
      </section>

      <section className="marquee" aria-label="Technology focus"><div>ANDROID <span>✦</span> iOS <span>✦</span> AI NATIVE <span>✦</span> WEB <span>✦</span> PRODUCT CRAFT <span>✦</span> ANDROID <span>✦</span> iOS <span>✦</span> AI NATIVE <span>✦</span> WEB <span>✦</span> PRODUCT CRAFT <span>✦</span></div></section>

      <section className="metrics shell reveal" aria-label="GitHub stats">
        <div><strong>213<sup>+</sup></strong><span>{t.metrics[0]}</span></div>
        <div><strong>10<sup>Y</sup></strong><span>{t.metrics[1]}</span></div>
        <div><strong>{repoStatus === 'live' ? totalStars : '29'}<sup>★</sup></strong><span>{t.metrics[2]}</span></div>
        <div><strong>BEIJING</strong><span>{t.metrics[3]}</span></div>
      </section>

      <section className="section shell" id="projects">
        <div className="section-head reveal">
          <div><p className="eyebrow"><span>02</span> {t.projectsLabel}</p><h2>{t.projectsTitle}</h2></div>
          <p>{t.projectsIntro}</p>
        </div>

        <div className="repo-toolbar reveal">
          <div className="filters" aria-label={t.filtersLabel}>
            {(['all', 'original', 'forks'] as const).map((key, index) => <button className={filter === key ? 'active' : ''} key={key} onClick={() => { setFilter(key); setVisible(9); }}>{t.filters[index]}</button>)}
          </div>
          <label className="search"><span aria-hidden="true">⌕</span><input value={query} onChange={event => { setQuery(event.target.value); setVisible(9); }} placeholder={t.search} aria-label={t.searchLabel} /></label>
        </div>

        <div className="repo-grid">
          {filteredRepos.slice(0, visible).map((repo, index) => (
            <article className="repo-card reveal" key={repo.id}>
              <div className="repo-card-top"><span className="repo-index">{String(index + 1).padStart(2, '0')}</span><span className={repo.fork ? 'repo-kind fork' : 'repo-kind'}>{repo.fork ? 'FORK / RADAR' : 'ORIGINAL'}</span></div>
              <h3>{repo.name}</h3>
              <p>{repo.description || t.noDescription}</p>
              <div className="repo-meta"><span className="language"><i />{repo.language || 'MULTI'}</span><span>★ {repo.stargazers_count}</span><span>⑂ {repo.forks_count}</span><span>{formatDate(repo.updated_at, lang)}</span></div>
              <div className="repo-links"><a href={repo.html_url} target="_blank" rel="noreferrer">SOURCE ↗</a>{repo.homepage && <a href={repo.homepage} target="_blank" rel="noreferrer">LIVE ↗</a>}</div>
            </article>
          ))}
        </div>
        {filteredRepos.length === 0 && <p className="empty-state">{t.empty}</p>}
        <div className="repo-footer reveal">
          {visible < filteredRepos.length && <button className="load-more" onClick={() => setVisible(value => value + 9)}>{t.load} <span>+09</span></button>}
          <a className="all-repos" href="https://github.com/WayneZ01?tab=repositories" target="_blank" rel="noreferrer">{t.allRepos}</a>
          <small><span className={repoStatus === 'live' ? 'live-dot' : ''} /> {repoStatus === 'loading' ? t.connecting : repoStatus === 'live' ? `${t.live} · ${originals} ${t.originals}` : t.fallback}</small>
        </div>
      </section>

      <section className="focus-section" id="focus">
        <div className="shell">
          <div className="section-head reveal"><div><p className="eyebrow"><span>03</span> {t.focusLabel}</p><h2>{t.focusTitle}</h2></div><p>{t.focusIntro}</p></div>
          <div className="focus-grid">
            {focusAreas.map(area => <article className="focus-card reveal" key={area.no}><span className="focus-no">{area.no}</span><span className="focus-glyph">{area.glyph}</span><h3>{area.title}</h3><p>{area[lang]}</p><div>{area.tags.map(tag => <span key={tag}>{tag}</span>)}</div></article>)}
          </div>
        </div>
      </section>

      <section className="about shell" id="about">
        <div className="avatar-wrap reveal"><img src="https://avatars.githubusercontent.com/u/18587756?v=4" alt={t.avatar} /><span>AVAILABLE<br />FOR THE<br />NEXT IDEA</span></div>
        <div className="about-copy reveal"><p className="eyebrow"><span>04</span> {t.aboutLabel}</p><blockquote>{t.quote}</blockquote><p>{t.about}</p><div className="social-row"><a href="https://github.com/WayneZ01" target="_blank" rel="noreferrer">GITHUB ↗</a><a href="https://blog.csdn.net/zhanwei0102" target="_blank" rel="noreferrer">CSDN ↗</a><a href="https://gist.github.com/WayneZ01" target="_blank" rel="noreferrer">GISTS ↗</a></div></div>
      </section>

      <section className="signal shell reveal">
        <p>{t.idea}</p><h2>{t.signal}</h2><a href="https://github.com/WayneZ01" target="_blank" rel="noreferrer">START FROM GITHUB <b>↗</b></a>
      </section>

      <footer><div className="shell"><a className="brand" href="#top"><span className="brand-mark">W</span><span>WAYNE<span className="accent-dot">.</span></span></a><p>DESIGNED TO EVOLVE · POWERED BY OPEN SOURCE</p><div><span>© {new Date().getFullYear()} WAYNE</span><a href="#top">{t.back}</a></div></div></footer>
    </main>
  );
}
