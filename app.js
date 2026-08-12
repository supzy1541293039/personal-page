/* ============================================================
   app.js —— 全站唯一脚本
   ------------------------------------------------------------
   做三件事：
     1. 把 content.js 的数据渲染成页面（HTML 里只留挂载点）
     2. 修原版的功能硬伤：移动端导航、键盘可达、弹窗无障碍、时长写死
     3. 交互：延迟预览、光标跟随、方向键翻片、滚动进场、数字滚动
   ============================================================ */
(function () {
  'use strict';

  const S = window.SITE;
  if (!S) { console.error('content.js 没有加载'); return; }

  /* ---------- 小工具 ---------- */
  const $  = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const esc = (v) => String(v == null ? '' : v)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
  // headline / title 允许写 <em>，所以只挡尖括号以外的注入面
  const rich = (v) => String(v == null ? '' : v);
  // 媒体资源路径解析：支持本地相对路径与腾讯云 COS 外链两种模式。
  // 见 content.js 顶部 assetBase 说明。
  const BASE = String(S.assetBase || '').replace(/\/+$/, '');
  const media = (v) => {
    if (!v) return '';
    if (/^(https?:)?\/\//i.test(v)) return v;      // 已是完整/协议相对外链
    return BASE ? BASE + '/' + v.replace(/^\/+/, '') : v;
  };
  const mmss = (sec) => {
    if (!isFinite(sec) || sec <= 0) return '--:--';
    const m = Math.floor(sec / 60), s = Math.round(sec % 60);
    return String(m).padStart(2, '0') + ':' + String(s === 60 ? 59 : s).padStart(2, '0');
  };
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const coarse = window.matchMedia('(hover: none), (pointer: coarse)').matches;

  const ICON = {
    arrow: '<svg class="icon arr" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>',
    diag:  '<svg class="icon arr" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M7 7h10v10"/><path d="M7 17 17 7"/></svg>',
    copy:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect width="13" height="13" x="9" y="9" rx="2"/><path d="M5 15a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>',
    close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>',
    left:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>',
    right: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>',
    up:    '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="m18 15-6-6-6 6"/></svg>',
    play:  '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.5v13l11-6.5z"/></svg>',
    sound: '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M11 5 6 9H2v6h4l5 4z"/><path class="wave" d="M15.5 8.5a5 5 0 0 1 0 7"/><path class="wave" d="M18.5 5.5a9 9 0 0 1 0 13"/><path class="mute" d="m22 9-6 6M16 9l6 6"/></svg>',
  };

  const CAT = {};
  (S.categories || []).forEach(c => { CAT[c.id] = c; });
  const catLabel = (id) => (CAT[id] && CAT[id].label) || id;

  /* =========================================================
     渲染：页眉 / 页脚
     ========================================================= */
  function renderHeader(mount) {
    const page = document.body.dataset.page || '';
    const light = mount.dataset.light === 'true';
    const links = [
      { href: 'index.html',  key: 'home',   label: '首页', no: '01' },
      { href: 'works.html',  key: 'works',  label: '作品', no: '02' },
      { href: 'resume.html', key: 'resume', label: '简历', no: '03' },
      { href: page === 'home' ? '#contact' : 'index.html#contact', key: 'contact', label: '联系', no: '04' },
    ];
    const navHTML = links.map(l =>
      `<a href="${l.href}"${l.key === page ? ' class="active" aria-current="page"' : ''}>${esc(l.label)}</a>`
    ).join('');

    mount.innerHTML = `
      <div class="container header-inner${light ? ' header-hero-light' : ''}">
        <a class="brand" href="index.html" aria-label="返回首页">
          <span class="brand-mark" aria-hidden="true">${esc(S.profile.mark)}</span>
          <span>
            <span class="brand-name">${esc(S.profile.name)}</span>
            <span class="brand-sub" style="display:block">${esc(S.profile.positioning)}</span>
          </span>
        </a>
        <nav class="nav" aria-label="主导航">${navHTML}</nav>
        <button class="nav-toggle" aria-expanded="false" aria-controls="mobile-nav" aria-label="打开菜单">
          <span aria-hidden="true"></span>
        </button>
      </div>
      <div class="mobile-nav" id="mobile-nav" hidden>
        ${links.map(l => `<a href="${l.href}"${l.key === page ? ' class="active"' : ''}><span>${l.no}</span>${esc(l.label)}</a>`).join('')}
      </div>`;

    // 页眉滚动态
    const header = mount.closest('.site-header') || mount;
    const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // 移动端导航（原版这里是空的，手机上根本没法跳页）
    const toggle = $('.nav-toggle', mount);
    const panel = $('.mobile-nav', mount);
    const setOpen = (open) => {
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? '关闭菜单' : '打开菜单');
      if (open) { panel.hidden = false; requestAnimationFrame(() => panel.classList.add('is-open')); }
      else {
        panel.classList.remove('is-open');
        setTimeout(() => { if (!panel.classList.contains('is-open')) panel.hidden = true; }, 340);
      }
    };
    toggle.addEventListener('click', () => setOpen(toggle.getAttribute('aria-expanded') !== 'true'));
    $$('a', panel).forEach(a => a.addEventListener('click', () => setOpen(false)));
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') { setOpen(false); toggle.focus(); }
    });
  }

  function renderFooter(mount) {
    mount.innerHTML = `
      <div class="container footer-inner">
        <p>&copy; ${new Date().getFullYear()} ${esc(S.profile.name)} · ${esc(S.profile.positioning)}</p>
        <a class="to-top" href="#top" aria-label="返回顶部">${ICON.up}</a>
      </div>`;
  }

  /* =========================================================
     渲染：首屏
     ========================================================= */
  function renderHero(mount) {
    const variant = mount.dataset.variant || 'home';
    const frame = `<div class="film-frame" aria-hidden="true"><span></span><span></span><span></span><span></span></div>`;

    if (variant === 'page') {
      mount.classList.add('hero-page');
      mount.innerHTML = `
        ${frame}
        <div class="container hero-body">
          <p class="eyebrow" style="color:#fff">${esc(mount.dataset.eyebrow || '')}</p>
          <h1 class="display" style="margin-top:20px">${rich(mount.dataset.title || '')}</h1>
          <p class="hero-sub" style="margin-top:22px">${esc(mount.dataset.sub || '')}</p>
        </div>`;
      return;
    }

    const p = S.profile;
    const slides = (p.heroSlides || []).length
      ? p.heroSlides
      : ['assets/images/hero-poster.jpg'];

    mount.innerHTML = `
      <div class="hero-media" aria-hidden="true">
        ${slides.map((s, i) => `
          <div class="hero-slide${i === 0 ? ' is-active' : ''}"
               style="background-image:url('${esc(media(s))}')"></div>`).join('')}
      </div>
      ${frame}
      <div class="container hero-body">
        <p class="hero-name">${esc(p.name)}</p>
        <h1 class="display">${rich(p.headline)}</h1>
        <div class="hero-rule" aria-hidden="true"></div>
        <p class="hero-sub">${esc(p.subline)}</p>
        <div class="hero-actions">
          <a class="btn" href="works.html">看作品${ICON.arrow}</a>
          <a class="link" href="resume.html" style="color:#fff;border-color:rgba(255,255,255,.4)">在线简历${ICON.diag}</a>
        </div>
        <div class="hero-keywords">${(p.keywords || []).map(k => `<span>${esc(k)}</span>`).join('')}</div>
      </div>
      <div class="container hero-foot">
        <span class="hero-foot-left">
          <span>REEL ${new Date().getFullYear()}</span>
          <span class="hero-dots" role="tablist" aria-label="首屏轮播">
            ${slides.map((_, i) => `
              <button class="hero-dot${i === 0 ? ' is-active' : ''}" data-slide="${i}"
                      aria-label="切换到第 ${i + 1} 张"></button>`).join('')}
          </span>
        </span>
        <span class="scroll-cue">向下<i aria-hidden="true"></i></span>
      </div>`;

    // 封面轮播：交叉淡入淡出 + Ken Burns 缓慢缩放
    const slideEls = $$('.hero-slide', mount);
    const dotEls = $$('.hero-dot', mount);
    if (slideEls.length > 1) {
      let cur = 0, timer = null;
      const show = (n) => {
        cur = (n + slideEls.length) % slideEls.length;
        slideEls.forEach((el, i) => el.classList.toggle('is-active', i === cur));
        dotEls.forEach((el, i) => el.classList.toggle('is-active', i === cur));
      };
      const start = () => {
        if (reduceMotion) return;               // 动效敏感用户只看第一张
        clearInterval(timer);
        timer = setInterval(() => show(cur + 1), 5000);
      };
      dotEls.forEach(d => d.addEventListener('click', () => {
        show(parseInt(d.dataset.slide, 10)); start();
      }));
      // 页面切到后台时暂停，省电
      document.addEventListener('visibilitychange', () => {
        document.hidden ? clearInterval(timer) : start();
      });
      start();
    }
  }

  /* =========================================================
     渲染：数据条 / 自述 / 工作流
     ========================================================= */
  function renderStats(mount) {
    mount.innerHTML = `<div class="container stats-grid">` + (S.stats || []).map((s, i) => `
      <div class="stat reveal" style="--d:${i * 70}ms">
        <span class="stat-value"><span data-count="${esc(s.value)}">0</span><i>${esc(s.unit)}</i></span>
        <span class="stat-label">${esc(s.label)}</span>
        <span class="stat-note">${esc(s.note)}</span>
      </div>`).join('') + `</div>`;
  }

  function renderStatement(mount) {
    const t = S.statement;
    mount.innerHTML = `
      <div class="container statement-grid">
        <div class="reveal">
          <p class="eyebrow">${esc(t.eyebrow)}</p>
          <h2 class="display" style="margin-top:20px">${rich(t.title)}</h2>
        </div>
        <div class="reveal" style="--d:120ms">
          <p class="statement-body">${esc(t.body)}</p>
          <p class="statement-quote">${esc(t.quote)}</p>
          <p class="statement-meta"><span>邮箱</span><a href="mailto:${esc(t.email)}">${esc(t.email)}</a></p>
        </div>
      </div>`;
  }

  function renderWorkflow(mount) {
    const w = S.workflow;
    mount.innerHTML = `
      <div class="container">
        <div class="sec-head reveal">
          <div>
            <p class="eyebrow">${esc(w.eyebrow)}</p>
            <h2 class="display">${rich(w.title)}</h2>
          </div>
          <p class="sec-head-aside">${esc(w.aside)}</p>
        </div>
        <div class="track">` + (w.steps || []).map((s, i) => `
          <div class="track-step reveal" style="--d:${i * 60}ms">
            <span class="track-no">${esc(s.no)}</span>
            <h3>${esc(s.title)}</h3>
            <p class="track-out">${esc(s.out)}</p>
            <p class="track-tool">${esc(s.tool)}</p>
          </div>`).join('') + `</div>
      </div>`;
  }

  /* =========================================================
     渲染：作品栅格
     ========================================================= */
  function cardHTML(w, idx) {
    const featured = !!w.featured;
    const aspect = w.aspect || '16:9';
    // 封面：优先用显式 poster，否则按 slug 自动推导 assets/works/{slug}/cover.jpg
    // 文件不存在时浏览器会自然回退显示视频首帧，不会报错
    const poster = w.poster || (w.slug ? `assets/works/${w.slug}/cover.jpg` : '');
    return `
      <article class="card reveal${featured ? ' is-featured' : ''}" style="--d:${idx * 70}ms"
               role="button" tabindex="0" data-id="${esc(w.id)}" data-cat="${esc(w.category)}"
               data-aspect="${esc(aspect)}"
               aria-label="${esc(w.title)}，打开作品详情">
        <div class="card-visual">
          <span class="card-badge${featured ? ' is-featured' : ''}">${featured ? '代表作 · ' : ''}${esc(catLabel(w.category))}</span>
          <video muted loop playsinline preload="metadata"${poster ? ` poster="${esc(media(poster))}"` : ''}>
            <source src="${esc(media(w.video))}" type="video/mp4">
          </video>
          <span class="card-time" data-time>${w.duration ? esc(w.duration) : '--:--'}</span>
          <span class="card-progress" aria-hidden="true"><i></i></span>
        </div>
        <div class="card-info">
          <div class="card-meta"><span>${esc(w.year)}</span><i></i><span>${esc(w.client)}</span></div>
          <h3>${esc(w.title)}</h3>
          <p class="card-desc">${esc(w.summary)}</p>
          <div class="card-tools">${(w.tools || []).map(t => `<span>${esc(t)}</span>`).join('')}</div>
        </div>
      </article>`;
  }

  function renderWorks(mount) {
    const limit = parseInt(mount.dataset.limit || '0', 10);
    const withFilters = mount.dataset.filters === 'true';
    const pick = (mount.dataset.pick || '').split(',').map(s => s.trim()).filter(Boolean);
    let list = (S.works || []).slice();

    if (pick.length) {
      // 精确挑选并保持 data-pick 里的顺序（首页凑方块用）
      list = pick.map(id => list.find(w => w.id === id)).filter(Boolean);
    } else {
      list.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
      if (limit > 0) list = list.slice(0, limit);
    }

    const head = mount.dataset.heading === 'false' ? '' : `
      <div class="sec-head reveal">
        <div>
          <p class="eyebrow">精选作品</p>
          <h2 class="display">先看片子，<em>再看简历。</em></h2>
        </div>
        <p class="sec-head-aside">点开任意一支可以看到完整成片、创作 brief 和制作链路，包括真实用过的提示词。</p>
      </div>`;

    const filters = withFilters ? `
      <div class="filters">
        ${(S.categories || []).map(c => `
          <button class="filter" data-filter="${esc(c.id)}" aria-pressed="${c.id === 'all'}">${esc(c.label)}</button>`).join('')}
        <span class="filter-note" data-filter-note></span>
      </div>` : '';

    const foot = mount.dataset.footer === 'false' ? '' : `
      <div class="works-foot reveal">
        <p>全部作品与制作过程</p>
        <a class="link" href="works.html">进入作品页${ICON.diag}</a>
      </div>`;

    const layout = mount.dataset.layout === 'featured' ? ' featured-layout' : '';
    mount.innerHTML = `<div class="container">${head}${filters}
      <div class="works-grid${layout}">${list.map(cardHTML).join('')}</div>${foot}</div>`;

    initCards(mount, list);
    if (withFilters) initFilters(mount, list);
  }

  /* =========================================================
     渲染：简历
     ========================================================= */
  function renderResume(mount) {
    const r = S.resume;
    const levelText = { 1: '熟练', 2: '掌握', 3: '了解' };
    mount.innerHTML = `
      <div class="container resume-grid">
        <div class="resume-side reveal">
          <p class="eyebrow">基本信息</p>
          <dl class="facts">
            ${(r.facts || []).map(f => `<div class="fact"><dt>${esc(f.k)}</dt><dd>${esc(f.v)}</dd></div>`).join('')}
          </dl>
          ${r.pdf ? `<a class="btn" style="margin-top:26px" href="${esc(media(r.pdf))}" download>下载 PDF 简历${ICON.arrow}</a>` : ''}
          <div class="matrix">
            <p class="eyebrow">工具矩阵</p>
            ${(r.toolMatrix || []).map(g => `
              <div class="matrix-group">
                <p>${esc(g.group)}</p>
                ${g.items.map(it => `
                  <div class="tool">
                    <span class="tool-name">${esc(it.name)}</span>
                    <span class="tool-level" role="img" aria-label="${esc(levelText[it.level] || '')}">
                      ${[1, 2, 3].map(n => `<i class="${n <= (4 - it.level) ? 'on' : ''}"></i>`).join('')}
                    </span>
                  </div>`).join('')}
              </div>`).join('')}
            <p class="matrix-legend">■■■ 熟练：能独立出活<br>■■ 掌握：能配合流程<br>■ 了解：能快速上手</p>
          </div>
        </div>
        <div>
          <p class="eyebrow">项目经历</p>
          <h2 class="display" style="margin-top:20px">做过的片子，<em>和怎么做的。</em></h2>
          <div class="exp">
            ${(r.experience || []).map((e, i) => `
              <div class="exp-item reveal" style="--d:${i * 80}ms">
                <div class="exp-period">${esc(e.period)}</div>
                <div>
                  <h3>${esc(e.title)}</h3>
                  <p class="exp-role">${esc(e.role)}</p>
                  <p class="exp-body">${esc(e.body)}</p>
                  <div class="exp-tags">${(e.tags || []).map(t => `<span>${esc(t)}</span>`).join('')}</div>
                </div>
              </div>`).join('')}
          </div>
        </div>
      </div>`;
  }

  /* =========================================================
     渲染：联系
     ========================================================= */
  function renderContact(mount) {
    const c = S.contact;
    mount.innerHTML = `
      <div class="container contact-grid">
        <div class="reveal">
          <p class="eyebrow">${esc(c.eyebrow)}</p>
          <h2 class="display">${rich(c.title)}</h2>
        </div>
        <div class="reveal" style="--d:120ms">
          <p class="contact-avail"><i aria-hidden="true"></i>${esc(S.profile.availability)}</p>
          <p class="contact-body">${esc(c.body)}</p>
          <div class="methods">
            ${(c.methods || []).map(m => `
              <div class="method">
                <span class="method-label">${esc(m.label)}</span>
                <span class="method-value">${esc(m.value)}</span>
                <button class="copy-btn" data-copy="${esc(m.copy)}" aria-label="复制${esc(m.label)}">${ICON.copy}</button>
              </div>`).join('')}
          </div>
        </div>
      </div>`;
    initCopy(mount);
  }

  /* =========================================================
     卡片：延迟预览 + 真实时长 + 键盘可达 + 光标提示
     ========================================================= */
  let visibleList = [];

  function initCards(scope, list) {
    visibleList = list.slice();

    $$('.card', scope).forEach(card => {
      const video = $('video', card);
      const bar = $('.card-progress i', card);
      const timeEl = $('[data-time]', card);
      let timer = null, raf = null;

      // 时长不再写死在 HTML 里，直接读视频元数据
      if (video && timeEl && !timeEl.textContent.trim().match(/\d/)) {
        const setTime = () => { timeEl.textContent = mmss(video.duration); };
        if (video.readyState >= 1) setTime();
        else video.addEventListener('loadedmetadata', setTime, { once: true });
      }

      const tick = () => {
        if (video && video.duration) bar.style.width = (video.currentTime / video.duration * 100) + '%';
        raf = requestAnimationFrame(tick);
      };
      const start = () => {
        if (!video || reduceMotion) return;
        // 延迟 120ms 再播：鼠标扫过一排卡片时不会同时炸开一堆视频
        timer = setTimeout(() => {
          $$('.card video').forEach(v => { if (v !== video) { v.pause(); } });
          video.currentTime = 0;
          video.play().catch(() => {});
          raf = requestAnimationFrame(tick);
        }, 120);
      };
      const stop = () => {
        clearTimeout(timer);
        cancelAnimationFrame(raf);
        if (video) { video.pause(); video.currentTime = 0; }
        if (bar) bar.style.width = '0%';
      };

      card.addEventListener('mouseenter', start);
      card.addEventListener('mouseleave', stop);
      card.addEventListener('click', () => openModal(card.dataset.id));
      // 原版有 tabindex 但没绑键盘，焦点进去打不开也出不来
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
          e.preventDefault();
          openModal(card.dataset.id);
        }
      });
    });

    initCursorHint(scope);

    // 触屏没有 hover，改成滚到视口中间自动播
    if (coarse && !reduceMotion && 'IntersectionObserver' in window) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach(en => {
          const v = $('video', en.target);
          if (!v) return;
          if (en.isIntersecting) v.play().catch(() => {});
          else { v.pause(); v.currentTime = 0; }
        });
      }, { threshold: .62 });
      $$('.card', scope).forEach(c => io.observe(c));
    }
  }

  function initCursorHint(scope) {
    if (coarse || reduceMotion) return;
    let hint = $('.cursor-hint');
    if (!hint) {
      hint = document.createElement('div');
      hint.className = 'cursor-hint';
      hint.setAttribute('aria-hidden', 'true');
      hint.innerHTML = ICON.play + '<span>播放</span>';
      document.body.appendChild(hint);
    }
    const move = (e) => { hint.style.left = e.clientX + 'px'; hint.style.top = e.clientY + 'px'; };
    $$('.card', scope).forEach(card => {
      card.addEventListener('mouseenter', () => { hint.classList.add('is-on'); });
      card.addEventListener('mouseleave', () => { hint.classList.remove('is-on'); });
      card.addEventListener('mousemove', move);
    });
  }

  /* =========================================================
     筛选
     ========================================================= */
  function initFilters(scope, list) {
    const btns = $$('.filter', scope);
    const note = $('[data-filter-note]', scope);
    const apply = (cat, push) => {
      btns.forEach(b => b.setAttribute('aria-pressed', String(b.dataset.filter === cat)));
      let shown = 0;
      $$('.card', scope).forEach(card => {
        const hit = cat === 'all' || card.dataset.cat === cat;
        card.classList.toggle('is-hidden', !hit);
        if (hit) shown++;
      });
      visibleList = list.filter(w => cat === 'all' || w.category === cat);
      const meta = CAT[cat];
      note.textContent = `${shown} 支${meta && meta.note ? ' · ' + meta.note : ''}`;
      if (push) history.replaceState(null, '', cat === 'all' ? location.pathname : '#' + cat);
    };
    btns.forEach(b => b.addEventListener('click', () => apply(b.dataset.filter, true)));
    const initial = (location.hash || '').replace('#', '');
    apply(CAT[initial] ? initial : 'all', false);
  }

  /* =========================================================
     弹窗：看片器
     ------------------------------------------------------------
     补齐原版缺的：role/aria、焦点陷阱、背景锁滚动、进出动画、
     关闭后焦点归位、左右方向键翻上一支/下一支
     ========================================================= */
  let modal, mShell, mScroll, mVideo, opener = null, curIndex = -1;

  function buildModal() {
    if (modal) return;
    modal = document.createElement('div');
    modal.className = 'modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-labelledby', 'modal-title');
    modal.innerHTML = `
      <div class="modal-shell">
        <div class="modal-bar">
          <span class="modal-counter" data-counter></span>
          <div class="modal-nav">
            <button class="modal-btn" data-prev aria-label="上一支作品（左方向键）">${ICON.left}</button>
            <button class="modal-btn" data-next aria-label="下一支作品（右方向键）">${ICON.right}</button>
            <button class="modal-btn" data-close aria-label="关闭（Esc）">${ICON.close}</button>
          </div>
        </div>
        <div class="modal-scroll">
          <div class="modal-video"><video controls playsinline preload="metadata"></video></div>
          <div class="modal-body" data-body></div>
        </div>
      </div>`;
    document.body.appendChild(modal);
    mShell = $('.modal-shell', modal);
    mScroll = $('.modal-scroll', modal);
    mVideo = $('video', modal);

    $('[data-close]', modal).addEventListener('click', closeModal);
    $('[data-prev]', modal).addEventListener('click', () => step(-1));
    $('[data-next]', modal).addEventListener('click', () => step(1));
    modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });

    document.addEventListener('keydown', (e) => {
      if (!modal.classList.contains('is-mounted')) return;
      if (e.key === 'Escape') { closeModal(); }
      else if (e.key === 'ArrowLeft') { step(-1); }
      else if (e.key === 'ArrowRight') { step(1); }
      else if (e.key === 'Tab') { trapFocus(e); }
    });
  }

  function trapFocus(e) {
    const f = $$('button, [href], video, [tabindex]:not([tabindex="-1"])', mShell)
      .filter(n => !n.disabled && n.offsetParent !== null);
    if (!f.length) return;
    const first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }

  function fillModal(w) {
    const kv = [];
    if (w.brief)  kv.push({ t: '创作 brief', v: w.brief });
    if (w.result) kv.push({ t: '结果', v: w.result });

    const steps = (w.process || []).length ? `
      <div class="modal-sec">
        <h3>制作链路</h3>
        <div class="steps">
          ${w.process.map(s => `
            <div class="step">
              <span class="step-no">${esc(s.no)}</span>
              <div><h4>${esc(s.title)}</h4><p>${esc(s.body)}</p></div>
            </div>`).join('')}
        </div>
        ${(w.prompts || []).map(p => `
          <div class="prompt">
            <div class="prompt-head">
              <span>关键提示词 · ${esc(p.model)}</span>
              <button class="prompt-copy" data-copy="${esc(p.text)}">${ICON.copy}复制</button>
            </div>
            <pre>${esc(p.text)}</pre>
          </div>`).join('')}
      </div>` : '';

    const gallery = (w.gallery || []).length ? `
      <div class="modal-sec">
        <h3>分镜与过程</h3>
        <div class="gallery">
          ${w.gallery.map(g => `
            <figure>
              <img src="${esc(media(g.src))}" alt="${esc(g.caption)}" loading="lazy">
              <figcaption>${esc(g.caption)}</figcaption>
            </figure>`).join('')}
        </div>
      </div>` : '';

    // 完整工作流原图：assets/works/{slug}/workflow.png 存在就展示
    const wfPath = w.slug ? `assets/works/${w.slug}/workflow.png` : '';
    const workflow = wfPath ? `
      <div class="modal-sec">
        <h3>完整工作流</h3>
        <p class="workflow-diagram-hint">这是本片从 brief 到成片的真实生产流程图。点击可查看原图。</p>
        <div class="workflow-diagram">
          <a href="${esc(media(wfPath))}" target="_blank" rel="noopener" aria-label="查看完整工作流原图">
            <img src="${esc(media(wfPath))}" alt="${esc(w.title)} 工作流" loading="lazy"
                 onerror="this.parentElement.parentElement.style.display='none'">
          </a>
        </div>
      </div>` : '';

    $('[data-body]', modal).innerHTML = `
      <div class="modal-head">
        <span>${esc(catLabel(w.category))}</span><i></i>
        <span>${esc(w.year)}</span><i></i>
        <span>${esc(w.client)}</span><i></i>
        <span data-mtime>${w.duration ? esc(w.duration) : '--:--'}</span>
      </div>
      <h2 class="display" id="modal-title">${esc(w.title)}</h2>
      <p class="modal-summary">${esc(w.summary)}</p>
      ${kv.length ? `<dl class="modal-kv">${kv.map(x => `<div><dt>${esc(x.t)}</dt><dd>${esc(x.v)}</dd></div>`).join('')}</dl>` : ''}
      ${steps}${gallery}${workflow}
      <div class="modal-foot">
        <span class="modal-role">${esc(w.role)}</span>
        <div class="modal-tools">${(w.tools || []).map(t => `<span>${esc(t)}</span>`).join('')}</div>
      </div>`;

    mVideo.src = media(w.video);
    // 视频按作品实际比例显示（竖屏短剧不被压成 16:9 黑边）
    mVideo.style.aspectRatio = (w.aspect === '9:16') ? '9 / 16' : '16 / 9';
    mVideo.load();
    const mt = $('[data-mtime]', modal);
    mVideo.addEventListener('loadedmetadata', () => { mt.textContent = mmss(mVideo.duration); }, { once: true });

    const idx = visibleList.findIndex(x => x.id === w.id);
    $('[data-counter]', modal).textContent =
      String(idx + 1).padStart(2, '0') + ' / ' + String(visibleList.length).padStart(2, '0');
    $('[data-prev]', modal).disabled = idx <= 0;
    $('[data-next]', modal).disabled = idx >= visibleList.length - 1;
    curIndex = idx;

    initCopy($('[data-body]', modal));
  }

  function openModal(id) {
    buildModal();
    const w = (S.works || []).find(x => x.id === id);
    if (!w) return;
    opener = document.activeElement;
    fillModal(w);

    // 锁背景滚动，同时补偿滚动条宽度，避免布局跳动
    const sbw = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.paddingRight = sbw > 0 ? sbw + 'px' : '';
    document.body.classList.add('is-locked');

    modal.classList.add('is-mounted');
    requestAnimationFrame(() => {
      modal.classList.add('is-open');
      mScroll.scrollTop = 0;
      $('[data-close]', modal).focus();
    });
    if (!reduceMotion) setTimeout(() => mVideo.play().catch(() => {}), 260);
  }

  function step(dir) {
    const next = visibleList[curIndex + dir];
    if (!next) return;
    mVideo.pause();
    fillModal(next);
    mScroll.scrollTop = 0;
    if (!reduceMotion) setTimeout(() => mVideo.play().catch(() => {}), 120);
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.remove('is-open');
    mVideo.pause();
    setTimeout(() => {
      modal.classList.remove('is-mounted');
      mVideo.removeAttribute('src');
      mVideo.load();
      document.body.classList.remove('is-locked');
      document.body.style.paddingRight = '';
      if (opener && opener.focus) opener.focus();   // 焦点归位
    }, 260);
  }

  /* =========================================================
     复制 / Toast
     ========================================================= */
  let toastEl, toastTimer;
  function toast(msg) {
    if (!toastEl) {
      toastEl = document.createElement('div');
      toastEl.className = 'toast';
      toastEl.setAttribute('role', 'status');
      document.body.appendChild(toastEl);
    }
    toastEl.textContent = msg;
    toastEl.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove('is-visible'), 1900);
  }

  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text);
    }
    // file:// 或旧 Safari 下 clipboard API 不可用，降级
    return new Promise((res, rej) => {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.cssText = 'position:fixed;top:-9999px;opacity:0';
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand && document.execCommand('copy');
      ta.remove();
      ok ? res() : rej();
    });
  }

  function initCopy(scope) {
    $$('[data-copy]', scope).forEach(btn => {
      if (btn.dataset.bound) return;
      btn.dataset.bound = '1';
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const text = btn.dataset.copy;
        copyText(text).then(() => {
          toast('已复制 · ' + (text.length > 34 ? text.slice(0, 34) + '…' : text));
          if (btn.classList.contains('copy-btn')) {
            const old = btn.innerHTML;
            btn.classList.add('is-done');
            btn.innerHTML = ICON.check;
            setTimeout(() => { btn.classList.remove('is-done'); btn.innerHTML = old; }, 1600);
          }
        }).catch(() => toast('复制失败，请手动选取'));
      });
    });
  }

  /* =========================================================
     滚动进场 + 数字滚动
     ========================================================= */
  function initReveal() {
    let pending = $$('.reveal');
    const light = (n) => {
      n.classList.add('is-in');
      $$('[data-count]', n).forEach(countUp);
    };

    if (reduceMotion) {
      pending.forEach(light);
      return;
    }

    // 用滚动帧检测而不是 IntersectionObserver：
    // IO 在跳跃式滚动（滚轮连滚、锚点直达、刷新后恢复位置）时可能一帧都没命中，
    // 元素会永久停在 opacity:0。这里每帧只算剩余元素，成本可忽略。
    let queued = false;
    const check = () => {
      queued = false;
      const vh = window.innerHeight;
      pending = pending.filter(n => {
        const r = n.getBoundingClientRect();
        if (r.top < vh - 40 && r.bottom > 0) { light(n); return false; }
        if (r.bottom <= 0) { n.classList.add('is-in'); $$('[data-count]', n).forEach(countUp); return false; }
        return true;
      });
      if (!pending.length) {
        window.removeEventListener('scroll', onScroll);
        window.removeEventListener('resize', onScroll);
      }
    };
    const onScroll = () => { if (!queued) { queued = true; requestAnimationFrame(check); } };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    check();
  }

  function countUp(node) {
    if (node.dataset.done) return;
    node.dataset.done = '1';
    const target = parseFloat(node.dataset.count) || 0;
    const dur = 1100, t0 = performance.now();
    const run = (t) => {
      const p = Math.min(1, (t - t0) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      node.textContent = Math.round(target * eased);
      if (p < 1) requestAnimationFrame(run);
      else node.textContent = target;
    };
    requestAnimationFrame(run);
  }

  /* =========================================================
     启动
     ========================================================= */
  function boot() {
    const R = {
      header: renderHeader, hero: renderHero, stats: renderStats,
      statement: renderStatement, workflow: renderWorkflow, works: renderWorks,
      resume: renderResume, contact: renderContact, footer: renderFooter,
    };
    $$('[data-mount]').forEach(m => {
      const fn = R[m.dataset.mount];
      if (fn) { try { fn(m); } catch (err) { console.error('渲染失败:', m.dataset.mount, err); } }
    });
    initReveal();

    // 内容是 JS 渲染的，浏览器处理 URL 锚点时目标元素还不存在，
    // 导致 index.html#contact 这类分享链接会落在页面顶部。这里补一次定位。
    // 作品页的分类 hash（#ad / #drama / #lab）交给筛选逻辑，不参与滚动。
    const hash = (location.hash || '').replace('#', '');
    if (hash && !CAT[hash]) {
      const target = document.getElementById(hash);
      if (target) {
        // 必须绕过 CSS 的 scroll-behavior: smooth：
        // 平滑滚动会被进场动画引起的滚动锚定打断，实测只能滚到起点附近。
        const jump = () => {
          const root = document.documentElement;
          const prev = root.style.scrollBehavior;
          root.style.scrollBehavior = 'auto';
          target.scrollIntoView({ behavior: 'instant', block: 'start' });
          root.style.scrollBehavior = prev;
        };
        requestAnimationFrame(jump);
        // 视频和图片加载完会让目标位置漂移，校正一次；用户已手动滚动则不干扰
        let touched = false;
        const mark = () => { touched = true; };
        ['wheel', 'touchstart', 'keydown'].forEach(e =>
          window.addEventListener(e, mark, { once: true, passive: true }));
        window.addEventListener('load', () => {
          setTimeout(() => { if (!touched) jump(); window.removeEventListener('wheel', mark); }, 60);
        }, { once: true });
      }
    }
  }

  document.readyState === 'loading'
    ? document.addEventListener('DOMContentLoaded', boot)
    : boot();
})();
