(function () {
  'use strict';

  const allowNormalBehavior = function (e) {
    e.stopImmediatePropagation();
    return true;
  };

  const events = ['copy', 'paste', 'cut', 'contextmenu', 'selectstart', 'dragstart'];
  events.forEach((eventType) => {
    document.addEventListener(eventType, allowNormalBehavior, true);
  });

  const showToast = () => {
    const toast = document.createElement('div');
    toast.textContent = 'PERMITIDO Ctrl v';
    Object.assign(toast.style, {
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      zIndex: '2147483647',
      background: '#111',
      color: '#0ff',
      padding: '10px 18px',
      borderRadius: '8px',
      fontFamily: 'Arial, sans-serif',
      fontSize: '14px',
      fontWeight: 'bold',
      boxShadow: '0 2px 10px rgba(0,0,0,0.4)',
      opacity: '0',
      transition: 'opacity 0.3s ease',
      pointerEvents: 'none'
    });

    document.body.appendChild(toast);

    requestAnimationFrame(() => {
      toast.style.opacity = '1';
    });

    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  };

  if (document.body) {
    showToast();
  } else {
    document.addEventListener('DOMContentLoaded', showToast);
  }
})();
