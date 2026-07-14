/* transitions.js — 화면전환 실행기
   CSS 클래스(t-*) 부여로 모션을 구동하고, 완료 후 모든 클래스를 제거하여
   opacity:1 / filter:none / transform:none 정지 상태를 보장한다. */
(function () {
  'use strict';

  var reducedMotion = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var CLASS_BY_TYPE = {
    cinematic: 't-cinematic',
    depth: 't-depth',
    hslide: 't-hslide',
    soft: 't-soft',
    wipe: 't-wipe'
  };

  /**
   * 슬라이드 전환 실행
   * @param {HTMLElement} fromEl 현재 슬라이드
   * @param {HTMLElement} toEl   다음 슬라이드
   * @param {{type:string, duration:number}} segment 전환 정의
   * @param {boolean} forward   진행 방향
   * @param {Function} done     완료 콜백
   */
  function run(fromEl, toEl, segment, forward, done) {
    var type = segment.type;
    var duration = segment.duration;

    // 접근성: 모션 축소 환경에서는 0.25s Crossfade로 단순화
    if (reducedMotion) {
      type = 'soft';
      duration = 250;
    }

    var cls = CLASS_BY_TYPE[type] || 't-soft';
    var dirCls = forward ? 't-fwd' : 't-back';
    var durSec = (duration / 1000) + 's';

    fromEl.style.setProperty('--t-dur', durSec);
    toEl.style.setProperty('--t-dur', durSec);

    fromEl.classList.add(cls, dirCls, 't-from');
    toEl.classList.add(cls, dirCls, 't-to');

    // 초기 상태 적용을 위한 강제 리플로우
    void toEl.offsetWidth;

    fromEl.classList.add('t-run');
    toEl.classList.add('t-run');

    var finished = false;
    function cleanup() {
      if (finished) return;
      finished = true;

      fromEl.classList.remove(cls, dirCls, 't-from', 't-run', 'active');
      toEl.classList.remove(cls, dirCls, 't-to', 't-run');
      toEl.classList.add('active');
      fromEl.style.removeProperty('--t-dur');
      toEl.style.removeProperty('--t-dur');

      if (typeof done === 'function') done();
    }

    // transitionend는 요소·속성별로 다발 발생 → 타이머를 단일 완료 기준으로 사용
    window.setTimeout(cleanup, duration + 60);
  }

  window.DeckTransitions = { run: run, isReducedMotion: reducedMotion };
})();
