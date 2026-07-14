/* content.js — 슬라이드 데이터 (콘텐츠와 코드 분리)
   이미지 교체: 동일 파일명으로 assets/source/*.webp 덮어쓰기 (코드 수정 불필요) */
window.DECK_SLIDES = [
  {
    id: 'opening',
    num: 1,
    title: '국내 대학 성공 사례',
    group: 'Opening',
    type: 'video-hero',
    thumb: './assets/images/university-success-poster.webp',
    transition: null
  },
  {
    id: 'sogang-01',
    num: 2,
    title: '서강대학교 도입 성공사례',
    group: '서강대학교',
    type: 'image-only',
    image: './assets/source/slide-02.webp',
    thumb: './assets/thumbnails/slide-02.webp'
  },
  {
    id: 'sogang-02',
    num: 3,
    title: '서강대학교 AI+VDI',
    group: '서강대학교',
    type: 'image-only',
    image: './assets/source/slide-03.webp',
    thumb: './assets/thumbnails/slide-03.webp'
  },
  {
    id: 'jeju-01',
    num: 4,
    title: '제주대학교 3A 학습환경',
    group: '제주대학교',
    type: 'image-only',
    image: './assets/source/slide-04.webp',
    thumb: './assets/thumbnails/slide-04.webp'
  },
  {
    id: 'jeju-02',
    num: 5,
    title: '제주대학교 공용 VDI',
    group: '제주대학교',
    type: 'image-only',
    image: './assets/source/slide-05.webp',
    thumb: './assets/thumbnails/slide-05.webp'
  },
  {
    id: 'donga-01',
    num: 6,
    title: '동아대학교 현황',
    group: '동아대학교',
    type: 'image-only',
    image: './assets/source/slide-06.webp',
    thumb: './assets/thumbnails/slide-06.webp'
  },
  {
    id: 'donga-02',
    num: 7,
    title: '동아대학교 ISMS-P·VDI',
    group: '동아대학교',
    type: 'image-only',
    image: './assets/source/slide-07.webp',
    thumb: './assets/thumbnails/slide-07.webp'
  },
  {
    id: 'baekseok-01',
    num: 8,
    title: '백석대학교 AX 플랫폼',
    group: '백석대학교',
    type: 'image-only',
    image: './assets/source/slide-08.webp',
    thumb: './assets/thumbnails/slide-08.webp'
  },
  {
    id: 'sangmyung-01',
    num: 9,
    title: '상명대학교 AI·SW 학습환경',
    group: '상명대학교',
    type: 'image-only',
    image: './assets/source/slide-09.webp',
    thumb: './assets/thumbnails/slide-09.webp'
  },
  {
    id: 'kcu-01',
    num: 10,
    title: '고려사이버대학교 Virtual Lab',
    group: '고려사이버대학교',
    type: 'image-only',
    image: './assets/source/slide-10.webp',
    thumb: './assets/thumbnails/slide-10.webp'
  }
];

/* 구간별 전환 매핑 — index i: 슬라이드 (i+1) → (i+2) 이동 시 사용
   이전 이동(n → n-1)은 같은 구간 효과를 방향 반전으로 사용 */
window.DECK_SEGMENT_TRANSITIONS = [
  { type: 'cinematic', duration: 1000 }, // 01→02 영상 Hero에서 첫 사례로
  { type: 'depth',     duration: 800  }, // 02→03 동일 대학 연속
  { type: 'hslide',    duration: 750  }, // 03→04 서강→제주
  { type: 'soft',      duration: 650  }, // 04→05 동일 대학
  { type: 'hslide',    duration: 750  }, // 05→06 제주→동아
  { type: 'depth',     duration: 800  }, // 06→07 동일 대학
  { type: 'wipe',      duration: 850  }, // 07→08 동아→백석
  { type: 'soft',      duration: 650  }, // 08→09 백석→상명
  { type: 'cinematic', duration: 900  }  // 09→10 마지막 사례
];
