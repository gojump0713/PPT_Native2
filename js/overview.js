/* overview.js — Overview Mode: 5×2 카드 그리드, 키보드/마우스 탐색 */
(function () {
  'use strict';

  var SLIDES = window.DECK_SLIDES;
  var COLS = 5;

  var els = {};
  var open = false;
  var focusIndex = 0;

  function pad2(n) { return (n < 10 ? '0' : '') + n; }

  function buildCards() {
    var frag = document.createDocumentFragment();

    SLIDES.forEach(function (slide, i) {
      var card = document.createElement('button');
      card.type = 'button';
      card.className = 'ov-card';
      card.setAttribute('data-index', String(i));
      card.setAttribute('aria-label', pad2(slide.num) + ' ' + slide.title);

      var img = document.createElement('img');
      img.className = 'ov-thumb';
      img.src = slide.thumb;
      img.alt = '';
      img.draggable = false;

      var meta = document.createElement('div');
      meta.className = 'ov-meta';

      var num = document.createElement('span');
      num.className = 'ov-num';
      num.textContent = pad2(slide.num);

      var info = document.createElement('div');
      info.className = 'ov-info';

      var group = document.createElement('p');
      group.className = 'ov-group';
      group.textContent = slide.group;

      var title = document.createElement('p');
      title.className = 'ov-title';
      title.textContent = slide.title;

      info.appendChild(group);
      info.appendChild(title);
      meta.appendChild(num);
      meta.appendChild(info);
      card.appendChild(img);
      card.appendChild(meta);

      card.addEventListener('click', function () {
        select(i);
      });

      frag.appendChild(card);
    });

    els.grid.appendChild(frag);
    els.cards = Array.prototype.slice.call(els.grid.children);
  }

  function markCurrent() {
    var current = window.DeckNav.getCurrent();
    els.cards.forEach(function (card, i) {
      card.classList.toggle('current', i === current);
    });
  }

  function show() {
    if (open) return;
    if (window.DeckHelp && window.DeckHelp.isOpen()) window.DeckHelp.close();

    open = true;
    markCurrent();
    els.overlay.hidden = false;
    els.slidesWrap.classList.add('dimmed');

    // 트랜지션 발동을 위한 리플로우
    void els.overlay.offsetWidth;
    els.overlay.classList.add('open');

    focusIndex = window.DeckNav.getCurrent();
    els.cards[focusIndex].focus();

    document.addEventListener('keydown', onKeyDown, true);
  }

  function close() {
    if (!open) return;
    open = false;
    els.overlay.classList.remove('open');
    els.slidesWrap.classList.remove('dimmed');
    document.removeEventListener('keydown', onKeyDown, true);

    window.setTimeout(function () {
      if (!open) els.overlay.hidden = true;
    }, 320);
  }

  function toggle() {
    if (open) close();
    else show();
  }

  function select(index) {
    close();
    window.DeckNav.navigateTo(index);
  }

  function moveFocus(delta) {
    var nextIdx = focusIndex + delta;
    if (nextIdx < 0 || nextIdx >= SLIDES.length) return;
    focusIndex = nextIdx;
    els.cards[focusIndex].focus();
  }

  function onKeyDown(e) {
    switch (e.key) {
      case 'Escape':
        e.preventDefault();
        e.stopPropagation();
        close();
        return;
      case 'ArrowRight':
        e.preventDefault(); e.stopPropagation();
        moveFocus(1);
        return;
      case 'ArrowLeft':
        e.preventDefault(); e.stopPropagation();
        moveFocus(-1);
        return;
      case 'ArrowDown':
        e.preventDefault(); e.stopPropagation();
        moveFocus(COLS);
        return;
      case 'ArrowUp':
        e.preventDefault(); e.stopPropagation();
        moveFocus(-COLS);
        return;
      case 'Enter':
        e.preventDefault(); e.stopPropagation();
        select(focusIndex);
        return;
    }
    var k = e.key.toLowerCase();
    if (k === 'o') {
      e.preventDefault(); e.stopPropagation();
      close();
    }
  }

  function init() {
    els.overlay = document.getElementById('overview');
    els.grid = document.getElementById('overview-grid');
    els.slidesWrap = document.getElementById('slides');

    buildCards();

    document.getElementById('btn-overview').addEventListener('click', toggle);

    // 카드 포커스 추적 (마우스 hover → 포커스 위치 동기화)
    els.cards.forEach(function (card, i) {
      card.addEventListener('mouseenter', function () { focusIndex = i; });
    });
  }

  window.DeckOverview = {
    init: init,
    show: show,
    close: close,
    toggle: toggle,
    isOpen: function () { return open; }
  };
})();
