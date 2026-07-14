/* main.js — 부트스트랩: 스테이지 스케일링 + 모듈 초기화
   Progressive Enhancement: 일부 모듈 실패 시에도 나머지는 계속 동작 */
(function () {
  'use strict';

  if (window.ENV_BLOCKED) return; // env-gate가 안내 화면 표시

  var CFG = window.DECK_CONFIG;

  /* ---------- 고정 스테이지 레터박스 스케일링 ---------- */
  function fitStage() {
    var scale = Math.min(
      window.innerWidth / CFG.stageWidth,
      window.innerHeight / CFG.stageHeight
    );
    document.getElementById('stage').style.setProperty('--stage-scale', String(scale));
  }

  function safeInit(name, fn) {
    try {
      fn();
    } catch (err) {
      // 오류가 나도 기본 슬라이드 표시는 유지 (KNOWN_ISSUES 정책)
      if (window.console && console.warn) {
        console.warn('[deck] module "' + name + '" init failed:', err);
      }
    }
  }

  function boot() {
    fitStage();
    window.addEventListener('resize', fitStage);

    safeInit('navigation', window.DeckNav.init);
    safeInit('overview', window.DeckOverview.init);
    safeInit('help', window.DeckHelp.init);
    safeInit('performance', window.DeckPerformance.init);

    // Hero 진입 모션 시작 (Poster → 로고 → 타이틀 → 서브 → 안내)
    var hero = document.getElementById('slide-opening');
    if (hero) hero.classList.add('hero-enter');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
