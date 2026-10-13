(() => {
  'use strict';

  // ---------- Config ----------
  const EVENTS = [
    'copy', 'cut', 'paste',
    'contextmenu', 'selectstart',
    'dragstart', 'drop',
    'keydown', 'mousedown'
  ];
  const TOAST_MS = 2500;
  // ----------------------------

  const unblock = e => {
    if (e.target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) return;
    e.stopImmediatePropagation();
    return true;
  };

  const attach = root => {
    EVENTS.forEach(ev => root.addEventListener(ev, unblock, true));
  };

  // document + window + Shadow DOMs
  attach(document);
  attach(window);

  new MutationObserver(muts => {
    for (const m of muts) {
      m.addedNodes.forEach(node => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          if (node.shadowRoot) attach(node.shadowRoot);
          node.querySelectorAll('*').forEach(el => {
            if (el.shadowRoot) attach(el.shadowRoot);
          });
        }
      });
    }
  }).observe(document.documentElement, { childList: true, subtree: true });

  // Remove inline handlers
  const cleanInline = () => {
    ['oncopy','oncut','onpaste','oncontextmenu','onselectstart','ondragstart','ondrop'].forEach(attr => {
      document.querySelectorAll(`[${attr}]`).forEach(el => el.removeAttribute(attr));
    });
  };
  cleanInline();

  new MutationObserver(cleanInline)
    .observe(document.body || document.documentElement, {
      attributes: true,
      subtree: true,
      attributeFilter: ['oncopy','oncut','onpaste','oncontextmenu','onselectstart','ondragstart','ondrop']
    });

  // CSS override
  const style = document.createElement('style');
  style.textContent = `
    * { -webkit-user-select: text !important; user-select: text !important; }
    input, textarea, select, [contenteditable] { -webkit-user-select: auto !important; user-select: auto !important; }
  `;
  (document.head || document.documentElement).appendChild(style);

  // Toast
  const toast = Object.assign(document.createElement('div'), {
    textContent: '🟢 Copy/Paste/ContextMenu liberados',
    style: `
      position:fixed;bottom:20px;right:20px;z-index:2147483647;
      background:#111;color:#0ff;padding:10px 16px;border-radius:8px;
      font:600 13px/1.4 system-ui,sans-serif;box-shadow:0 4px 16px #0008;
      opacity:0;transform:translateY(10px);transition:opacity .3s,transform .3s;
    `
  });
  document.body.appendChild(toast);
  requestAnimationFrame(() => { toast.style.opacity = '1'; toast.style.transform = 'none'; });
  setTimeout(() => {
    toast.style.opacity = '0'; toast.style.transform = 'translateY(10px)';
    setTimeout(() => toast.remove(), 300);
  }, TOAST_MS);

  console.log('%c✔ Liberado · Unblock Scripts', 'color:#0ff;background:#111;padding:4px 8px;border-radius:4px;font-size:13px;');
})();
