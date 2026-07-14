/* performance.js — Hero 영상 제어(폴백 체인), 이미지 프리로드/디코드 */
(function () {
  'use strict';

  var CFG = window.DECK_CONFIG;
  var SLIDES = window.DECK_SLIDES;

  var heroVideo = null;

  /* ---------- Hero 배경영상: WebM → MP4 → Poster + Animated Gradient ---------- */
  function setupHeroVideo() {
    if (!CFG.heroVideo.enabled) return; // 폴백(포스터+그라디언트)은 CSS로 상시 표시

    var holder = document.getElementById('hero-video-holder');
    var video = document.createElement('video');
    video.autoplay = true;
    video.muted = true;
    video.loop = true;
    video.setAttribute('playsinline', '');
    video.preload = 'auto';

    // 존재하는 포맷만 source로 추가 (WebM 우선 → MP4 폴백)
    var sources = [];
    if (CFG.heroVideo.webm) sources.push({ src: CFG.heroVideo.webm, type: 'video/webm' });
    if (CFG.heroVideo.mp4) sources.push({ src: CFG.heroVideo.mp4, type: 'video/mp4' });
    if (!sources.length) return;

    var lastSource = null;
    sources.forEach(function (s) {
      var el = document.createElement('source');
      el.src = s.src;
      el.type = s.type;
      video.appendChild(el);
      lastSource = el;
    });

    // 마지막 source까지 실패 → 영상 제거, 포스터 폴백 유지
    lastSource.addEventListener('error', function () {
      if (video.parentNode) video.parentNode.removeChild(video);
      heroVideo = null;
    });

    video.addEventListener('playing', function () {
      video.classList.add('playing');
    });

    holder.appendChild(video);
    heroVideo = video;

    video.play().catch(function () { /* 자동재생 차단 시 포스터 유지 */ });
  }

  function controlHeroVideo(index) {
    if (!heroVideo) return;
    if (index === 0) {
      heroVideo.play().catch(function () { /* no-op */ });
    } else {
      heroVideo.pause(); // 이탈 시 저부하 유지
    }
  }

  /* ---------- 현재·다음 이미지 우선 디코드 ---------- */
  function decodeAround(index) {
    [index, index + 1, index - 1].forEach(function (i) {
      if (i < 0 || i >= SLIDES.length) return;
      var el = document.querySelectorAll('#slides .slide')[i];
      if (!el) return;
      var img = el.querySelector('img');
      if (img && img.decode) {
        img.decode().catch(function () { /* 디코드 실패는 브라우저 렌더에 위임 */ });
      }
    });
  }

  function init() {
    setupHeroVideo();
    decodeAround(window.DeckNav.getCurrent());

    document.addEventListener('deck:slidechange', function (e) {
      controlHeroVideo(e.detail.index);
      decodeAround(e.detail.index);
    });
  }

  window.DeckPerformance = { init: init };
})();
