/* env-gate.js — PC 전용 정책: 모바일 UA / 협소 뷰포트 / 세로 화면 감지 시
   발표 본편 대신 정적 안내 화면만 표시 (추가 모바일 대응 없음) */
(function () {
  'use strict';

  var MOBILE_UA = /Android|iPhone|iPad|iPod|Windows Phone|IEMobile|Opera Mini|Mobile/i;

  function isBlockedEnv() {
    var ua = navigator.userAgent || '';
    if (MOBILE_UA.test(ua)) return true;
    if (window.innerWidth < 1024) return true;
    if (window.innerHeight > window.innerWidth) return true; // 세로 화면
    return false;
  }

  window.ENV_BLOCKED = isBlockedEnv();

  if (window.ENV_BLOCKED) {
    document.getElementById('env-gate').hidden = false;
    document.getElementById('letterbox').style.display = 'none';
  }
})();
