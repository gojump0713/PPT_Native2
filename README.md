# TILON University Success Cases — Interactive Reference Deck

**국내 대학 성공 사례** · AI·VDI 기반 미래교육 인프라 구축 레퍼런스

PC 전용(Desktop-Only) HTML 기반 인터랙티브 발표 슬라이드입니다.
슬라이드 1은 시네마틱 Hero(배경영상/포스터 + 조작 안내), 슬라이드 2~10은
원본 구축사례 이미지를 한 장씩 정적으로 표시하며 페이지 전환 효과만 적용합니다.

## 실행 방법

1. `index.html`을 Chrome 또는 Edge 최신 버전으로 엽니다. (더블클릭 실행 지원 — 서버 불필요)
2. 인터넷 연결이 없어도 모든 기능이 동작합니다. (외부 CDN·API 의존 0건)
3. 발표 시 `F` 키로 전체 화면 전환을 권장합니다.

> 로컬 서버로 띄우려면: `npx serve .` 또는 `python -m http.server`

## 조작 방법

| 입력 | 기능 |
|---|---|
| `→` `Space` `PageDown` | 다음 슬라이드 |
| `←` `PageUp` | 이전 슬라이드 |
| 마우스 휠 / 터치패드 스크롤 | 다음·이전 슬라이드 |
| `Home` / `End` | 첫 / 마지막 슬라이드 |
| `O` 또는 우측 상단 ▦ | Overview Mode (전체 페이지) 열기·닫기 |
| `ESC` | 열린 오버레이 닫기 (닫기 전용) |
| `H` 또는 `?` | 조작 안내 열기·닫기 |
| `F` | 전체 화면 |
| `B` | 블랙아웃 |
| `P` | 페이지 번호 표시·숨김 |
| 숫자 + `Enter` | 해당 번호 슬라이드로 이동 |

프레젠터 리모컨은 PageUp/PageDown 신호로 동작합니다.

## PC 전용 정책

- 실행 기준: **1920×1080 논리 좌표계 고정 스테이지**, 창 크기에는 `transform: scale()` 레터박스로 대응 (요소 재배치 없음)
- 지원: Windows/macOS · Chrome/Edge 최신 · 1366×768 ~ 4K(16:9 계열)
- 모바일·태블릿 미지원: 모바일 UA / 가로 1024px 미만 / 세로 화면 접근 시 PC 안내 화면만 표시

## 파일 구조

```
/index.html                  실행 파일
/css                         tokens · layout · slides · overview · transitions
/js                          config · content · env-gate · transitions · navigation
                             · overview · help · performance · main
/assets/source               slide-02.webp ~ slide-10.webp (본편 이미지, 1920×1080)
/assets/thumbnails           Overview용 썸네일 (480×270)
/assets/images               Hero 포스터
/assets/videos               Hero 배경영상 위치 (아래 참고)
/assets/fonts                (선택) Pretendard 폰트 배치 위치
/Source                      원본 PPT 및 추출 PNG
/tools                       에셋 변환 스크립트 (개발용, 배포와 무관)
```

## 콘텐츠 교체 방법

- **사례 이미지 교체**: 같은 파일명으로 `assets/source/slide-XX.webp` 를 덮어쓰면 코드 수정 없이 반영됩니다.
  (PPT에서 1920×1080 이상 PNG로 추출 후 WebP 변환: `cd tools && node convert.mjs`
  — `assets/source_png/`에 PNG를 두면 WebP·썸네일이 자동 생성됩니다)
- **제목·대학명·alt 텍스트**: `js/content.js` 에서 관리합니다.
- **전환 효과**: `js/content.js` 의 `DECK_SEGMENT_TRANSITIONS` 에서 구간별로 변경합니다.

## Hero 배경영상 추가

현재는 포스터 + Animated Gradient 폴백으로 동작합니다. 영상을 적용하려면:

1. `assets/videos/university-success-hero.webm` (권장) 및 `.mp4` 파일 배치
   - 12~15초 Seamless Loop, 1080p 이상, 무음
   - 생성 프롬프트는 `DECISIONS.md` 참고 (UI 기능명세서 3.3 AI VIDEO PROMPT)
2. `js/config.js` 에서 `heroVideo.enabled: true` 로 변경

영상 재생 실패 시 WebM → MP4 → Poster + Gradient 순으로 자동 폴백됩니다.

## 발표 전 체크리스트

- [ ] Chrome/Edge 최신 버전에서 `index.html` 실행 확인
- [ ] 인터넷 연결을 끊고 전체 페이지 이동 확인
- [ ] 전체 화면(`F`) / 블랙아웃(`B`) 확인
- [ ] 방향키·Space·PageUp/PageDown·리모컨 확인
- [ ] 마우스 휠·터치패드 이동 감도 확인
- [ ] Overview(`O`)에서 10개 썸네일과 이동 확인
- [ ] 각 Source 이미지 글자 선명도·잘림 여부 확인
- [ ] 빔프로젝터 연결 후 16:9 및 레터박스 확인
- [ ] 예비용 정적 PDF 또는 이미지 백업 준비
