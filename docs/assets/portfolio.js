'use strict';
// Public catalog only. Never put drafts or unapproved paintings in this file.
(() => {
  const root = new URL(document.body.dataset.root, window.location.href);
  const byId = id => document.getElementById(id);
  const show = (id, visible) => { const el = byId(id); if (el) el.hidden = !visible; };
  const element = (tag, text, className) => {
    const node = document.createElement(tag);
    if (text) node.textContent = text;
    if (className) node.className = className;
    return node;
  };
  function assetURL(path) {
    if (typeof path !== 'string' || !path.startsWith('assets/artwork/')) throw new Error('Artwork must use the local approved asset folder.');
    const url = new URL(path, root);
    if (url.origin !== root.origin || !url.pathname.startsWith(new URL('assets/artwork/', root).pathname)) throw new Error('Invalid artwork path.');
    return url.href;
  }
  function validateCatalog(data) {
    if (!Array.isArray(data)) throw new Error('Invalid catalog.');
    const ids = new Set();
    for (const work of data) {
      if (!work || work.portfolioApproved !== true || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(work.id) || ids.has(work.id)) throw new Error('Catalog contains an unapproved or invalid entry.');
      for (const key of ['title', 'category', 'alt']) if (typeof work[key] !== 'string' || !work[key].trim()) throw new Error('Missing artwork metadata.');
      for (const key of ['description', 'caption']) if (work[key] !== undefined && typeof work[key] !== 'string') throw new Error('Invalid optional artwork metadata.');
      assetURL(work.image); assetURL(work.thumbnail); ids.add(work.id);
    }
    return data;
  }
  function gallery(works) {
    const target = byId('gallery');
    if (!target) return;
    const categories = [...new Set(works.map(work => work.category))].sort();
    const filters = byId('filters');
    function render(category) {
      const selected = category === null ? works : works.filter(work => work.category === category);
      target.replaceChildren();
      for (const work of selected) {
        const card = element('article', '', 'work-card');
        const link = element('a');
        const url = new URL('artwork/', root); url.searchParams.set('id', work.id); link.href = url.href;
        const img = element('img'); img.src = assetURL(work.thumbnail); img.alt = work.alt; img.loading = 'lazy'; img.decoding = 'async';
        img.addEventListener('error', () => { img.hidden = true; link.prepend(element('p', 'Image unavailable', 'notice')); }, { once: true });
        link.append(img, element('h3', work.title), element('p', work.category)); card.append(link); target.append(card);
      }
      show('empty-gallery', works.length === 0);
      byId('gallery-status').textContent = `${selected.length} painting${selected.length === 1 ? '' : 's'}${category === null ? '' : ` in ${category}`}.`;
    }
    if (categories.length > 1) {
      for (const category of [null, ...categories]) {
        const button = element('button', category === null ? 'All work' : category);
        button.type = 'button'; button.setAttribute('aria-pressed', String(category === null));
        button.addEventListener('click', () => {
          for (const item of filters.children) item.setAttribute('aria-pressed', String(item === button));
          render(category);
        });
        filters.append(button);
      }
      filters.hidden = false;
    }
    render(null);
  }
  function artwork(works) {
    if (!byId('artwork-detail')) return;
    const id = new URLSearchParams(location.search).get('id');
    const work = works.find(item => item.id === id);
    if (!work) {
      if (id) { byId('artwork-missing').querySelector('h1').textContent = 'Painting not found.'; byId('artwork-missing').querySelector('p:not(.eyebrow)').textContent = 'This painting is not in the current portfolio. Explore the selected work below.'; }
      return;
    }
    document.title = `${work.title} — Tanner Kimbell`;
    byId('artwork-title').textContent = work.title;
    byId('artwork-category').textContent = work.category;
    const image = byId('artwork-image'); image.alt = work.alt; image.decoding = 'async';
    image.addEventListener('error', () => { image.hidden = true; show('artwork-error', true); byId('artwork-error').textContent = 'The artwork image could not be loaded. Please refresh to try again.'; }, { once: true });
    image.src = assetURL(work.image);
    for (const field of ['description', 'caption']) { byId(`artwork-${field}`).textContent = work[field] || ''; show(`artwork-${field}`, Boolean(work[field])); }
    show('artwork-missing', false); show('artwork-detail', true);
  }
  fetch(new URL('data/works.json', root))
    .then(response => { if (!response.ok) throw new Error('Catalog unavailable.'); return response.json(); })
    .then(validateCatalog)
    .then(works => { gallery(works); artwork(works); })
    .catch(() => {
      show('empty-gallery', false); show('gallery-error', true);
      show('artwork-missing', false); show('artwork-detail', false); show('artwork-error', true);
    });
})();
