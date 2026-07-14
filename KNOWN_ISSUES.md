# KNOWN_ISSUES

## K-01. Hero 배경영상 에셋 미포함
- **상태**: 폴백(포스터 + Animated Gradient)으로 정상 동작. 기능 결함 아님.
- **내용**: `assets/videos/university-success-hero.webm/.mp4`는 AI 영상 생성이 필요한 외부 산출물로 아직 리포지토리에 없다.
- **해결 방법**: README "Hero 배경영상 추가" 절차대로 파일 배치 후 `js/config.js`의 `heroVideo.enabled=true`.

## K-02. file:// 실행 시 localStorage가 Edge 일부 정책에서 비활성일 수 있음
- **상태**: try/catch 처리로 기능 저하 없이 동작 (마지막 위치 복구·가이드 표시 상태만 세션 한정).
- **해결 방법**: 조직 정책으로 차단된 PC에서는 로컬 서버(`npx serve .`) 실행 권장.

## K-03. 전체 화면(F)은 브라우저 정책상 사용자 입력 직후에만 진입 가능
- **상태**: 정상 동작. 페이지 로드 직후 자동 전체 화면은 브라우저가 차단하므로 미구현(의도된 제약).

## K-04. backdrop-filter(Glass UI)는 저사양 내장 그래픽에서 미세한 프레임 저하 가능
- **상태**: Glass UI는 Hero·안내 패널·Overview에만 사용되어 본편(슬라이드 2~10) 발표 품질에는 영향 없음.
- **해결 방법**: 문제가 될 경우 `css/tokens.css`의 `--glass-blur` 값을 낮춘다 (예: 20px → 8px).
