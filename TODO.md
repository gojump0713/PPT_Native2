# TODO

## M1. 기본 발표 시스템 (MVP)
- [x] 1920×1080 고정 스테이지 + transform: scale() 레터박스
- [x] 슬라이드 DOM 구조 (Hero 1장 + 이미지 전용 9장, Progressive Enhancement)
- [x] 키보드 내비게이션 (→/←/Space/PageUp/PageDown/Home/End) + 프레젠터 리모컨
- [x] 마우스 휠·터치패드 wheel 이동 (threshold 80 / cooldown 900ms)
- [x] 전환 중 입력 잠금 (연타 안정성)
- [x] 진행률 바(3px) + 페이지 번호(04 / 10) + P 토글
- [x] env-gate: 모바일 UA·협소 뷰포트 안내 화면

## M2. Hero / 조작 안내
- [x] 포스터 + Animated Gradient 배경 (영상 폴백 체인 포함)
- [x] Hero 진입 모션 (0.3s 로고 → 0.6s 타이틀 Mask Reveal → 0.9s 서브 → 1.2s 안내)
- [x] Glass UI 조작 안내 (1540×230, 첫 접속 자동 표시, guideSeen 저장)
- [x] 전체 사례 보기 / 발표 시작 버튼
- [x] H·? 재호출, ESC 닫기 전용

## M3. 화면전환 / Overview
- [x] 구간별 전환 매핑 (Cinematic/Depth Blur/H-Slide/Soft/Wipe)
- [x] 이전 이동 시 방향 반전 (H-Slide, Wipe)
- [x] 전환 완료 후 opacity:1 / filter:none / transform:none 보장
- [x] prefers-reduced-motion → 0.25s Crossfade
- [x] Overview Mode 5×2 그리드 (썸네일·번호·대학명·CURRENT 강조)
- [x] Overview 키보드 탐색 (방향키/Enter/ESC) + hover 1.07 확대
- [x] 배경 Blur 16px + Dim

## M4. 상태·안정성·문서
- [x] URL 해시 딥링크 (#/opening 등) + 뒤로가기/앞으로가기
- [x] localStorage 마지막 위치 복구
- [x] 현재·다음 이미지 우선 디코드
- [x] F 전체화면 / B 블랙아웃 / 숫자+Enter 점프
- [x] README / DECISIONS / KNOWN_ISSUES
- [x] 자가 QA (1366×768 / 1920×1080 / 2560×1440 / 4K, 콘솔 에러 0건)

## 후속 (선택)
- [x] Hero 배경영상 생성·배치 (Kling v3.0 Pro, 12s 1080p MP4)
- [ ] Hero 영상 WebM 변환본 추가 (선택 — MP4로 충분)
- [ ] Pretendard 폰트 번들 (D-06)
- [ ] GitHub Pages 배포 확인 (gojump0713.github.io/PPT_Native2)
