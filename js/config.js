/* config.js — 전역 설정 (브랜드·모션·입력 감도) */
window.DECK_CONFIG = {
  stageWidth: 1920,
  stageHeight: 1080,

  // Hero 배경영상 — 존재하는 파일만 지정 (null이면 해당 포맷 스킵)
  // 파일 없이 경로를 지정하면 콘솔에 리소스 로드 에러가 남는다
  heroVideo: {
    enabled: true,
    webm: null, // WebM 준비 시 './assets/videos/university-success-hero.webm'
    mp4: './assets/videos/university-success-hero.mp4'
  },

  // 휠 입력 정책 (관성 스크롤 오동작 방지)
  wheelThreshold: 80,
  wheelCooldownMs: 900,

  // 전환 입력 잠금 하한
  transitionLockMs: 900,

  // 상단 메뉴 자동 표시/숨김
  topHoverZonePx: 80,     // 1080p 논리 좌표 기준
  chromeAutoHideMs: 3000,

  // Glass UI 조작 안내
  guideDelayMs: 1200,

  // 숫자 점프 입력 대기
  jumpBufferMs: 2500,

  // localStorage 키
  storage: {
    lastSlide: 'tilon-usc.lastSlideId',
    guideSeen: 'tilon-usc.guideSeen',
    hidePageNo: 'tilon-usc.hidePageNumber'
  }
};
