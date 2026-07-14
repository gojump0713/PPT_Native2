/* navigation.js — 슬라이드 이동, 키보드/휠/프레젠터 입력, URL 해시, 상태 저장 */
(function () {
  'use strict';

  var CFG = window.DECK_CONFIG;
  var SLIDES = window.DECK_SLIDES;
  var SEGMENTS = window.DECK_SEGMENT_TRANSITIONS;

  var state = {
    current: 0,
    isTransitioning: false,
    wheelAccum: 0,
    wheelLastNav: 0,
    jumpBuffer: '',
    jumpTimer: null,
    suppressHashChange: false
  };

  var els = {};

  /* ---------- storage (file:// 등 예외 안전) ---------- */
  function storageGet(key) {
    try { return window.localStorage.getItem(key); } catch (e) { return null; }
  }
  function storageSet(key, value) {
    try { window.localStorage.setItem(key, value); } catch (e) { /* no-op */ }
  }

  /* ---------- helpers ---------- */
  function indexById(id) {
    for (var i = 0; i < SLIDES.length; i++) {
      if (SLIDES[i].id === id) return i;
    }
    return -1;
  }

  function slideEl(index) {
    return els.slideEls[index];
  }

  function pad2(n) {
    return (n < 10 ? '0' : '') + n;
  }

  function updateChromeState(index) {
    // 페이지 번호 / 진행률
    els.pageIndicator.textContent = pad2(index + 1) + ' / ' + pad2(SLIDES.length);
    els.progressFill.style.width = (((index + 1) / SLIDES.length) * 100) + '%';

    // Hero에서는 상단 메뉴 상시 표시, 이미지 슬라이드는 자동 숨김 대상
    if (index === 0) {
      els.chromeTop.classList.add('visible');
    } else {
      els.chromeTop.classList.remove('visible');
    }

    document.dispatchEvent(new CustomEvent('deck:slidechange', {
      detail: { index: index, slide: SLIDES[index] }
    }));
  }

  function updateHash(index) {
    var target = '#/' + SLIDES[index].id;
    if (window.location.hash === target) return;
    state.suppressHashChange = true;
    window.location.hash = target;
  }

  /* ---------- core navigation ---------- */
  function navigateTo(nextIndex, opts) {
    opts = opts || {};
    if (nextIndex < 0 || nextIndex >= SLIDES.length) return;
    if (nextIndex === state.current) return;
    if (state.isTransitioning) return;

    var fromIndex = state.current;
    var forward = nextIndex > fromIndex;

    // 인접 이동은 해당 구간 효과, 점프(Overview·해시·숫자)는 Soft Crossfade
    var segment;
    if (Math.abs(nextIndex - fromIndex) === 1) {
      segment = SEGMENTS[Math.min(fromIndex, nextIndex)];
    } else {
      segment = { type: 'soft', duration: 650 };
    }

    state.isTransitioning = true;
    state.current = nextIndex;

    var fromEl = slideEl(fromIndex);
    var toEl = slideEl(nextIndex);

    document.dispatchEvent(new CustomEvent('deck:beforetransition', {
      detail: { fromIndex: fromIndex, toIndex: nextIndex }
    }));

    var lockMs = Math.max(CFG.transitionLockMs, segment.duration + 60);

    window.DeckTransitions.run(fromEl, toEl, segment, forward, function () {
      // 완료 시점과 잠금 해제 시점을 일치시키되 하한(900ms)을 보장
    });

    window.setTimeout(function () {
      state.isTransitioning = false;
    }, lockMs);

    updateChromeState(nextIndex);
    if (!opts.fromHash) updateHash(nextIndex);
    storageSet(CFG.storage.lastSlide, SLIDES[nextIndex].id);
  }

  function next() { navigateTo(state.current + 1); }
  function prev() { navigateTo(state.current - 1); }

  /* ---------- keyboard ---------- */
  function onKeyDown(e) {
    // 오버레이가 열려 있으면 오버레이 모듈이 우선 처리
    if (window.DeckOverview && window.DeckOverview.isOpen()) return;

    switch (e.key) {
      case 'ArrowRight':
      case ' ':
      case 'PageDown':
        e.preventDefault();
        next();
        return;
      case 'ArrowLeft':
      case 'PageUp':
        e.preventDefault();
        prev();
        return;
      case 'Home':
        e.preventDefault();
        navigateTo(0);
        return;
      case 'End':
        e.preventDefault();
        navigateTo(SLIDES.length - 1);
        return;
      case 'Escape':
        // 닫기 전용: 열린 오버레이만 닫고 슬라이드 이동 없음
        if (window.DeckHelp && window.DeckHelp.isOpen()) { window.DeckHelp.close(); }
        else if (!els.blackout.hidden) { toggleBlackout(false); }
        return;
    }

    var k = e.key.toLowerCase();
    if (k === 'o') {
      if (window.DeckOverview) window.DeckOverview.toggle();
      return;
    }
    if (k === 'h' || e.key === '?') {
      if (window.DeckHelp) window.DeckHelp.toggle();
      return;
    }
    if (k === 'f') {
      toggleFullscreen();
      return;
    }
    if (k === 'b') {
      toggleBlackout();
      return;
    }
    if (k === 'p') {
      togglePageNumber();
      return;
    }

    // 숫자 + Enter: 특정 슬라이드 이동
    if (/^[0-9]$/.test(e.key)) {
      state.jumpBuffer += e.key;
      showJumpIndicator();
      return;
    }
    if (e.key === 'Enter' && state.jumpBuffer) {
      var n = parseInt(state.jumpBuffer, 10);
      clearJumpBuffer();
      if (n >= 1 && n <= SLIDES.length) navigateTo(n - 1);
    }
  }

  function showJumpIndicator() {
    els.jumpIndicator.textContent = state.jumpBuffer + ' + Enter';
    els.jumpIndicator.hidden = false;
    if (state.jumpTimer) window.clearTimeout(state.jumpTimer);
    state.jumpTimer = window.setTimeout(clearJumpBuffer, CFG.jumpBufferMs);
  }

  function clearJumpBuffer() {
    state.jumpBuffer = '';
    els.jumpIndicator.hidden = true;
    if (state.jumpTimer) {
      window.clearTimeout(state.jumpTimer);
      state.jumpTimer = null;
    }
  }

  /* ---------- wheel (마우스 휠 + 노트북 터치패드) ---------- */
  function onWheel(e) {
    if (window.DeckOverview && window.DeckOverview.isOpen()) return;
    e.preventDefault();

    var now = Date.now();
    if (now - state.wheelLastNav < CFG.wheelCooldownMs) return;

    state.wheelAccum += e.deltaY;

    if (Math.abs(state.wheelAccum) >= CFG.wheelThreshold) {
      var dir = state.wheelAccum > 0 ? 1 : -1;
      state.wheelAccum = 0;
      state.wheelLastNav = now;
      navigateTo(state.current + dir);
    }
  }

  /* ---------- presenter aids ---------- */
  function toggleFullscreen() {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      document.documentElement.requestFullscreen().catch(function () { /* 사용자 제스처 필요 시 무시 */ });
    }
  }

  function toggleBlackout(force) {
    var show = typeof force === 'boolean' ? force : els.blackout.hidden;
    els.blackout.hidden = !show;
  }

  function togglePageNumber() {
    var hidden = els.pageIndicator.classList.toggle('hidden');
    storageSet(CFG.storage.hidePageNo, hidden ? '1' : '0');
  }

  /* ---------- chrome auto show/hide (상단 80px 진입 시) ---------- */
  var chromeHideTimer = null;

  function onMouseMove(e) {
    if (state.current === 0) return; // Hero는 상시 표시

    var rect = els.stage.getBoundingClientRect();
    var scale = rect.height / CFG.stageHeight;
    var zonePx = CFG.topHoverZonePx * scale;

    if (e.clientY >= rect.top && e.clientY <= rect.top + zonePx) {
      els.chromeTop.classList.add('visible');
      if (chromeHideTimer) window.clearTimeout(chromeHideTimer);
      chromeHideTimer = window.setTimeout(function () {
        if (state.current !== 0) els.chromeTop.classList.remove('visible');
      }, CFG.chromeAutoHideMs);
    }
  }

  /* ---------- hash / history ---------- */
  function onHashChange() {
    if (state.suppressHashChange) {
      state.suppressHashChange = false;
      return;
    }
    var idx = indexFromHash();
    if (idx >= 0 && idx !== state.current) navigateTo(idx, { fromHash: true });
  }

  function indexFromHash() {
    var m = /^#\/(.+)$/.exec(window.location.hash || '');
    return m ? indexById(m[1]) : -1;
  }

  /* ---------- init ---------- */
  function init() {
    els.stage = document.getElementById('stage');
    els.slidesWrap = document.getElementById('slides');
    els.slideEls = Array.prototype.slice.call(document.querySelectorAll('#slides .slide'));
    els.chromeTop = document.getElementById('chrome-top');
    els.pageIndicator = document.getElementById('page-indicator');
    els.progressFill = document.getElementById('progress-fill');
    els.jumpIndicator = document.getElementById('jump-indicator');
    els.blackout = document.getElementById('blackout');

    // 시작 위치: URL 해시 > localStorage > 첫 슬라이드
    var startIndex = indexFromHash();
    if (startIndex < 0) {
      var savedId = storageGet(CFG.storage.lastSlide);
      if (savedId) startIndex = indexById(savedId);
    }
    if (startIndex < 0) startIndex = 0;

    // 전환 없이 시작 슬라이드 활성화
    els.slideEls.forEach(function (el, i) {
      el.classList.toggle('active', i === startIndex);
    });
    state.current = startIndex;
    updateChromeState(startIndex);
    updateHash(startIndex);

    // 페이지 번호 숨김 설정 복구
    if (storageGet(CFG.storage.hidePageNo) === '1') {
      els.pageIndicator.classList.add('hidden');
    }

    document.addEventListener('keydown', onKeyDown);
    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('hashchange', onHashChange);

    document.getElementById('btn-fullscreen').addEventListener('click', toggleFullscreen);
  }

  window.DeckNav = {
    init: init,
    navigateTo: navigateTo,
    next: next,
    prev: prev,
    getCurrent: function () { return state.current; },
    isTransitioning: function () { return state.isTransitioning; },
    storageGet: storageGet,
    storageSet: storageSet
  };
})();
