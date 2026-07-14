# DECISIONS

PRD(ScrollDeck Pro v3.0)와 UI 기능명세서(v1.0) 사이의 해석·미기재 사항에 대한 결정 기록.
형식: **결정 — 이유**

## D-01. UI 기능명세서를 우선 적용
- **결정**: 두 문서가 충돌하는 부분(샘플 12장 인터랙티브 씬 vs 이미지 전용 슬라이드 2~10)은 UI 기능명세서 v1.0을 따른다.
- **이유**: UI 기능명세서가 본 산출물("국내 대학 성공 사례") 전용의 더 구체적이고 최신(2026.07) 명세이며, 명세서 스스로 "기준 자료: ScrollDeck Pro PRD"로 PRD를 상위 참고 문서로 규정한다.

## D-02. 외부 라이브러리(GSAP·Lenis·Three.js) 미사용, Vanilla JS로 구현
- **결정**: npm 라이브러리를 번들하지 않고 순수 HTML/CSS/JS로 구현한다.
- **이유**: 최종 명세의 슬라이드 2~10은 "원본 이미지 + 화면전환만"으로, 필요한 모션(Fade/Blur/Slide/Wipe)이 모두 CSS transition으로 60fps 달성 가능하다. 라이브러리 제거로 초기 로딩·오프라인 안정성·콘솔 무오류 보장이 쉬워진다. PRD 10.2의 "단순 실행성·배포성을 위해 Vanilla JS 우선" 원칙과도 일치한다.

## D-03. 클래식 스크립트(비모듈) + 전역 네임스페이스
- **결정**: ES Module 대신 `<script>` 순차 로드와 `window.Deck*` 네임스페이스를 사용한다.
- **이유**: ES Module은 `file://` 프로토콜(더블클릭 실행)에서 CORS로 차단된다. "index.html을 브라우저로 열면 동작"하는 요구사항을 서버 없이 충족하기 위함이다.

## D-04. Hero 배경영상은 기본 비활성(포스터+그라디언트 폴백으로 시작)
- **결정**: `config.js`의 `heroVideo.enabled=false`가 기본값. 영상 파일 배치 후 플래그만 켜면 WebM→MP4→Poster 폴백 체인이 동작한다.
- **이유**: 영상 에셋은 AI 생성이 필요한 외부 산출물로 아직 없다. 존재하지 않는 파일을 `<video>`에 연결하면 콘솔에 리소스 로드 에러가 남아 "Console Error 0건" 수용 기준을 위반한다. 명세 7.1이 "모든 영상 실패 시 Poster + Animated Gradient"를 공식 폴백으로 규정하므로 이를 기본 상태로 채택했다.
- **영상 생성 프롬프트** (명세서 3.3): modern Korean university campuses + AI infrastructure, blue hour aerial fly-through, emerald green light streams, deep navy, no text/logo/faces, 16:9 4K seamless 12s loop.

## D-05. 원본 PPT에서 1920×1080으로 슬라이드 재추출
- **결정**: 제공된 `Source/구축사례/슬라이드N.PNG`(1280×720) 대신 PowerPoint COM 자동화로 `구축사례.pptx`에서 1920×1080 PNG를 재추출해 WebP(q92)로 변환했다.
- **이유**: 명세 8.2 "PPT 각 페이지를 1920×1080 또는 그 이상의 WebP로 추출". 1280×720 원본은 FHD 전체 화면에서 텍스트 선명도가 떨어진다.

## D-06. 폰트는 시스템 폴백 스택 사용
- **결정**: Pretendard를 번들하지 않고 `"Pretendard Variable", Pretendard, "Malgun Gothic", "Apple SD Gothic Neo", sans-serif` 폴백 스택을 사용한다. `assets/fonts/`는 추후 배치용으로 유지.
- **이유**: UI 텍스트는 Hero 타이틀·안내 패널·Overview 라벨 정도로 제한적이고(본문은 전부 이미지), 시스템 한글 폰트로 가독성이 충분하다. 오프라인 zero-dependency 원칙 유지.

## D-07. 점프 이동(Overview·숫자·해시)은 Soft Crossfade로 통일
- **결정**: 인접 이동은 명세 5.2의 구간별 전환을, 2페이지 이상 점프는 0.65s Soft Crossfade를 적용한다.
- **이유**: 구간 전환(예: Horizontal Slide)은 인접 페이지의 공간 관계를 표현하는 효과라 점프에는 부적합하다. 명세에 점프 전환 정의가 없어 가장 중립적인 효과로 통일했다.

## D-08. env-gate는 로드 시점 1회 평가
- **결정**: 모바일 UA·협소 뷰포트·세로 화면 판정은 페이지 로드 시 1회만 수행한다.
- **이유**: 발표 중 PC 창 크기를 일시적으로 줄였다가 되돌릴 때 발표 화면이 파괴되는 것을 방지. 명세 0.3은 "접근 시 처리"로 로드 시점 판정으로 충분하다.

## D-09. 페이지 번호 숨김은 P 키 토글
- **결정**: 명세 4.4 "페이지 번호 자동 숨김 옵션"을 `P` 키 토글 + localStorage 저장으로 구현했다.
- **이유**: 이미지와 UI의 충돌 여부는 발표자가 판단하는 것이 가장 정확하다. 자동 감지(이미지 픽셀 분석)는 복잡도 대비 이득이 없다.

## D-10. 전환 잠금은 per-transition 동적 계산
- **결정**: 입력 잠금 시간을 `max(900ms, 전환시간 + 60ms)`로 계산한다.
- **이유**: 명세의 고정 상수 900ms는 1.0s Cinematic Fade보다 짧아 전환 중 입력이 뚫릴 수 있다. 하한 900ms는 유지하면서 긴 전환도 안전하게 잠근다.
