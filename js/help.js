/* help.js — 조작 안내 Glass UI
   첫 접속: Hero에서 1.2초 지연 자동 표시 → 닫으면 guideSeen 저장
   재호출: H 키 또는 ? 버튼 (모든 슬라이드에서 가능) */
(function () {
  'use strict';

  var CFG = window.DECK_CONFIG;

  var els = {};
  var open = false;

  function show() {
    if (open) return;
    if (window.DeckOverview && window.DeckOverview.isOpen()) return;
    open = true;
    els.panel.classList.remove('guide-hidden');
  }

  function close() {
    if (!open) return;
    open = false;
    els.panel.classList.add('guide-hidden');
    window.DeckNav.storageSet(CFG.storage.guideSeen, 'true');
  }

  function toggle() {
    if (open) close();
    else show();
  }

  function init() {
    els.panel = document.getElementById('guide-panel');

    // 첫 접속 시 자동 표시 (영상/Hero 시작 1.2초 후)
    var seen = window.DeckNav.storageGet(CFG.storage.guideSeen) === 'true';
    if (!seen && window.DeckNav.getCurrent() === 0) {
      window.setTimeout(show, CFG.guideDelayMs);
    }

    document.getElementById('btn-help').addEventListener('click', toggle);

    document.getElementById('btn-guide-overview').addEventListener('click', function () {
      close();
      window.DeckOverview.show();
    });

    document.getElementById('btn-guide-start').addEventListener('click', function () {
      close();
      // 안내 패널 퇴장 모션과 겹치지 않게 잠깐 뒤 이동
      window.setTimeout(function () {
        window.DeckNav.navigateTo(1);
      }, 200);
    });

    // 슬라이드 이동 시 안내 패널 자동 닫기
    document.addEventListener('deck:beforetransition', function () {
      if (open) close();
    });
  }

  window.DeckHelp = {
    init: init,
    show: show,
    close: close,
    toggle: toggle,
    isOpen: function () { return open; }
  };
})();
