# Claude 설정

## 말투
- 반말 사용 (커뮤 말투)
- 편하게 대화
- ㅋㅋ, ㅇㅇ 등 사용 가능

---

## 커밋 규칙
- 한글 커밋 메시지
- `Co-Authored-By` 없이 (내가 한 것처럼)
- feat/fix/docs/chore 접두사 사용

---

## 중요 규칙 (반드시 준수)

### 공유 URL slug 하드코딩 금지!
- 컴포넌트 내부에서 공유 URL 만들 때 slug을 직접 문자열로 쓰지 말 것
- **잘못된 예**: `${siteConfig.url}/tools/random-decision#share=...`
- **올바른 예**: props나 meta에서 slug을 받아서 사용
- EN 버전은 slug 뒤에 `-en` 붙어야 함 (예: `random-decision-maker-en`)
- 기존 코드에 하드코딩된 slug이 많으니 수정 시 확인 필요

### KR/EN 동시 적용 (필수!)
1. **수정 요청 시 항상 EN 확인**
   - `src/data/tools-en.ts` 검색해서 EN에도 있는지 확인
   - 있으면 KR/EN 둘 다 수정
   - 없으면 "EN에는 없는 도구" 라고 유저에게 알려주기

2. **EN 컴포넌트 찾는 방법**
   - KR 컴포넌트명 + `En` 접미사 (예: `LadderGame.tsx` → `LadderGameEn.tsx`)
   - 없으면 새로 만들어야 함

3. **EN 컴포넌트 한글 금지**
   - EN 버전에 한글 문구 절대 금지
   - 버튼 텍스트, 안내 문구, 결과 메시지 등 모두 영어로
   - 확신 없으면 직접 검색해서 확인

4. **문서 기반 판단 금지**
   - CLAUDE.md 목록만 보고 판단하지 말 것
   - 실제 파일/코드 검색해서 확인

---

## KR/EN 분리 운영

### 구조
- KR: `/`, `/tools/[slug]`
- EN: `/en`, `/en/tools/[slug]`
- 인기 카테고리: 각 12개 바로가기 (popular-* slug)

### 상세 분류표
👉 **`docs/tools-kr-en.md` 참조** (도구 추가/수정 시 항상 업데이트!)

### KR 전용 도구 (17개)
| 도구 | 제외 사유 |
|------|----------|
| korean-english-converter | 한국어 특화 |
| age-calculator | 한국나이/띠 |
| lotto-generator | → US Lotto 대체 |
| nickname-generator | 한글 특화 |
| fortune-cookie | 한글 문장 |
| daily-tarot | 한국 문화 |
| name-compatibility | 한국 문화 |
| birthday-compatibility | 한국 문화 |
| decision-style-test | 심리테스트 |
| focus-pattern-test | 심리테스트 |
| decision-fatigue-calculator | 심리분석 |
| focus-time-calculator | 심리분석 |
| menu-recommender | 한국 문화 |
| outfit-recommender | 한국 문화 |
| weekend-recommender | 한국 문화 |
| content-recommender | 한국 문화 |
| rest-recommender | 한국 문화 |

### EN 전용 도구 (8개)
| 도구 | 사유 |
|------|------|
| us-lotto-generator | Powerball, Mega Millions |
| love-calculator | 연애/궁합 (영어권 문화) |
| ship-name-generator | 커플 이름 합성 |
| tip-calculator | 미국 팁 문화 |
| gpa-calculator | 미국 학점 시스템 |
| daily-horoscope | 별자리 운세 |
| personality-color-quiz | 성격 테스트 |
| ai-content-detector | AI 글 탐지 (재미용) |

### 관련 파일
- KR 데이터: `src/data/tools.ts`, `src/data/categories.ts`
- EN 데이터: `src/data/tools-en.ts`, `src/data/categories-en.ts`
- **분류표: `docs/tools-kr-en.md`** (도구 현황 상세)
- 레지스트리: `src/tools/registry.ts`

---

## 새 도구 추가 시 체크리스트

### 1. 중복 검사 (필수)
새 도구 추가 전 반드시 확인:
- `src/data/tools.ts` - 기존 도구 slug/name 중복 체크
- `src/tools/registry.ts` - 컴포넌트 등록 여부
- **기능적 중복 판단**: 기존 도구 목록 훑어보고 비슷한 기능 있는지 체크
  - 예: "텍스트 비교" 추가 요청 → 이미 `text-diff` 있음 → 중복 알림
  - 예: "랜덤 숫자" 추가 요청 → 이미 `random-picker` 있음 → 중복 알림
  - 애매하면 유저한테 물어보기: "이미 비슷한 거 있는데 새로 만들까?"

### 2. SEO 최적화 (필수)
모든 도구는 다음 SEO 요소 포함:
- **slug**: 검색 친화적 URL (예: `character-counter`)
- **name**: 한글 도구명 (예: `글자수 세기`)
- **description**: 160자 이내 설명, 핵심 키워드 포함
- **keywords**: 검색 유입 키워드 배열
- **tags**: 관련 태그
- **faqs**: FAQ 구조화 데이터 (Google 검색 결과에 FAQ 드롭다운 표시)

### 2-1. FAQ 추가 규칙 (SEO 강화)
새 도구 추가 시 또는 기존 도구 수정 시 FAQ 추가:
- **위치**: `tools.ts` / `tools-en.ts`의 각 도구 메타데이터에 `faqs` 배열
- **형식**: `{ question: string; answer: string }[]`
- **개수**: 2~4개 (너무 많으면 안됨)
- **내용**: 사용자가 실제로 궁금해할 만한 질문
- **KR/EN 둘 다 추가**: EN에 있는 도구는 영어 FAQ도 추가
- **JSON-LD 자동 생성**: `ToolLayout.tsx`에서 자동으로 FAQPage 구조화 데이터 생성

```typescript
faqs: [
  { question: '공백도 글자수에 포함되나요?', answer: '네, 기본적으로 공백이 포함됩니다.' },
  { question: '한글과 영어 글자수가 다르게 계산되나요?', answer: '글자수는 동일하게 1자로 계산됩니다.' },
],
```

### 2-2. 컴포넌트 내 FAQ 스타일 (필수!)
도구 컴포넌트 SeoContent에서 FAQ를 표시할 때 **반드시 동일한 스타일** 사용:

**표준 FAQ 스타일 (복붙용)**:
```tsx
<h2 className="text-xl font-semibold mb-4">자주 묻는 질문</h2>
<div className="space-y-4">
  <details className="group bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
    <summary className="flex items-center justify-between p-4 cursor-pointer text-sm font-semibold text-gray-900 dark:text-white">
      질문 내용?
      <span className="ml-2 text-gray-400 group-open:rotate-180 transition-transform">▼</span>
    </summary>
    <p className="px-4 pb-4 text-sm text-gray-600 dark:text-gray-400">
      답변 내용
    </p>
  </details>
</div>
```

**또는 FaqSection 컴포넌트 사용**:
```tsx
import { FaqSection } from '@/components/ui/FaqItem';

<FaqSection
  title="자주 묻는 질문"
  faqs={[
    { question: '질문1', answer: '답변1' },
    { question: '질문2', answer: '답변2' },
  ]}
/>
```

- **금지**: 다른 스타일로 FAQ 만들지 말 것 (일관성 유지)
- **필수 클래스**: `group`, `bg-white dark:bg-gray-900`, `border border-gray-200 dark:border-gray-700`
- **이유**: 통일된 접이식(details) UI, 다크모드 대응

### 3. 파일 구조
```
src/tools/{category}/{ToolName}.tsx  # 도구 컴포넌트
src/data/tools.ts                     # KR 메타데이터
src/data/tools-en.ts                  # EN 메타데이터 (필요시)
src/tools/registry.ts                 # 컴포넌트 등록
```

### 4. 카테고리
- `popular`: 인기 도구 (바로가기)
- `text`: 텍스트 도구
- `encoding`: 인코딩/디코딩
- `formatter`: 포맷터/변환기
- `image`: 이미지 도구
- `color`: 색상 도구
- `calculator`: 계산기/생성기
- `fun`: 재미/테스트/추천

### 5. SEO 메타데이터 예시
```typescript
{
  slug: 'character-counter',
  name: '글자수 세기',
  description: '텍스트의 글자수, 단어수, 문장수를 실시간으로 계산합니다.',
  category: 'text',
  icon: '📝',
  keywords: ['글자수 세기', '글자수 계산기', '단어수 세기'],
  tags: ['텍스트', '글자수', '단어수'],
  relatedSlugs: ['word-frequency', 'text-diff'],
}
```

### 6. 빌드 확인
도구 추가 후 반드시:
```bash
npm run build
```
- 빌드 에러 없는지 확인
- 정적 페이지 생성 확인

### 7. SeoContent 컴포넌트 (필수, SEO 강화)
모든 도구 컴포넌트에 SeoContent 함수 포함 (도구 UI 아래):

**권장 기준: 800자 이상**

**필수 구조**:
```tsx
function SeoContent() {
  return (
    <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 space-y-8 text-gray-700 dark:text-gray-300">
      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          {이모지} {도구명}이란?
        </h2>
        <p className="text-sm leading-relaxed">소개 (3~4문장)</p>
      </section>

      <section>
        <h2>상세 설명/가이드/종류/팁 등</h2>
        <p>구체적 내용 (리스트, 표 등 활용)</p>
      </section>

      <FaqSection
        title="자주 묻는 질문"
        faqs={[
          { question: '질문1', answer: '답변1' },
          { question: '질문2', answer: '답변2' },
          { question: '질문3', answer: '답변3' },
        ]}
      />
    </div>
  );
}
```

**규칙**:
- 소개 섹션 + 상세 섹션 1~2개 + FAQ 3개 = 최소 구성
- EN 버전은 한글 절대 금지
- 진행 현황: `docs/seo-content-status.md` 참조

---

## SEO 구조화 데이터 (JSON-LD)

### 자동 적용되는 스키마
1. **Organization** - 사이트 전체 (`layout.tsx`)
2. **WebSite** + SearchAction - 사이트 전체 (`layout.tsx`)
3. **WebApplication** - 각 도구 페이지 (`ToolLayout.tsx`)
4. **BreadcrumbList** - 각 도구 페이지 (`ToolLayout.tsx`)
5. **FAQPage** - FAQ가 있는 도구 (`ToolLayout.tsx`)

### 관련 파일
- KR: `src/lib/seo/jsonld.ts`
- EN: `src/lib/seo/jsonld-en.ts`
- 메타데이터: `src/lib/seo/metadata.ts`

---

## 현재 도구 현황

| 구분 | KR | EN |
|------|:--:|:--:|
| 인기 (바로가기) | 12 | 12 |
| 텍스트 | 14 | 15 |
| 인코딩 | 9 | 9 |
| 포맷터 | 14 | 14 |
| 이미지 | 8 | 8 |
| 색상 | 8 | 8 |
| 계산기 | 23 | 24 |
| 재미/테스트 | 29 | 16 |
| **총합 (실제)** | **105** | **94** |
| **총합 (popular 포함)** | **117** | **106** |

> 상세 현황은 `docs/tools-kr-en.md` 참조
> 마지막 업데이트: 2026-01-16

---

## 인기 카테고리 관리

### 구조
- KR: `src/data/tools.ts`의 `popular-*` slug 12개
- EN: `src/data/tools-en.ts`의 `popular-*-en` slug 12개
- 실제 컴포넌트 재사용 (바로가기 역할)

### 인기 카테고리 자동 채우기 규칙
인기 카테고리가 비어있거나 12개 미만일 경우:

1. **우선순위 기준**으로 자동 선정:
   - `featured: true` 표시된 도구 우선
   - 카테고리별 대표 도구 (각 카테고리 1~2개씩)
   - 최근 추가/업데이트된 도구

2. **KR 인기 추천 (기본 12개)**
   ```
   character-counter, json-formatter, image-compress, qr-generator,
   reaction-time, color-converter, base64, random-picker,
   lotto-generator, image-convert, fortune-cookie, video-gif
   ```

3. **EN 인기 추천 (기본 12개)**
   ```
   character-counter-en, json-formatter-en, image-compress-en, qr-generator-en,
   reaction-time-en, color-converter-en, base64-en, random-picker-en,
   us-lotto-en, image-convert-en, video-gif-en, uuid-en
   ```

4. **변경 시 주의사항**
   - registry.ts의 popular-* 매핑도 함께 수정
   - tools.ts / tools-en.ts의 인기 도구 섹션 수정
   - 빌드 후 메인 페이지에서 확인

---

## 메인페이지 콘텐츠 가이드 (AdSense 승인용)

### 목적
- Google AdSense 승인을 위한 "콘텐츠 가치가 있는 사이트"로 보이도록 함
- 과장/허위 금지, 실제 서비스 기능과 정확히 일치해야 함

### 콘텐츠 파일 위치
- KR: `src/components/home/HomeContent.tsx`
- EN: `src/components/home/HomeContentEn.tsx`

### 필수 구성 (6개 섹션)
1. **사이트 소개** (250~400자)
   - 무엇을 제공하는지, 어떤 문제를 해결하는지
2. **대표 카테고리 소개** (3~6개, 각 80~150자)
   - 실제 카테고리/도구 기반으로 작성
3. **사용 방법** (200~300자)
   - 공통 사용 흐름 설명
4. **결과 해석과 주의사항** (200~300자)
   - 정확성/책임 범위, 사용자 확인 사항
5. **개인정보/쿠키/광고 안내** (150~250자)
   - 개인정보처리방침, 쿠키, 광고 노출 가능성
6. **FAQ** (6개)
   - 짧은 Q/A 형식

### 작성 규칙
- H2/H3 헤딩 사용
- 과도한 키워드 나열(SEO 스팸) 금지
- 톤: 간결하지만 친절
- 불필요한 마케팅 문구 금지
- EN 버전은 한글 금지

---

## 메인페이지 검색 기능

### 구조
- KR: `src/components/tools/ToolsClientPage.tsx`
- EN: `src/components/tools/ToolsClientPageEn.tsx`

### 검색 대상 필드
검색어는 다음 필드에서 일치 여부 확인:
- `name` - 도구명
- `description` - 설명
- `keywords` - 검색 키워드 배열
- `tags` - 태그 배열

### 동작
- 실시간 검색 (입력과 동시에 필터링)
- 검색 중에는 즐겨찾기/최근 사용 섹션 숨김
- 검색 결과 없으면 빈 카테고리 섹션 자동 숨김
- X 버튼으로 검색어 초기화

---

## 다크모드

### 설정
- `next-themes` 라이브러리 사용
- 옵션: Light / Dark / System (OS 설정 따름)
- 저장: localStorage에 자동 저장

### 스타일링 규칙
- Tailwind `dark:` prefix 사용
- 예: `bg-white dark:bg-gray-900`, `text-gray-900 dark:text-white`
- 섹션 배경: `bg-gray-50 dark:bg-gray-800/50`
- 카드 배경: `bg-white dark:bg-gray-900`

### 관련 파일
- Provider: `src/components/ThemeProvider.tsx`
- Toggle: `src/components/ThemeToggle.tsx` (isEnglish prop으로 KR/EN 분기)

---

## 게임 개발 가이드 (js-playground)

### 폴더 구조
```
src/games/{GameName}.tsx           # 게임 컴포넌트
src/games/index.ts                 # 게임 export
src/app/games/[slug]/client.tsx    # 게임 컴포넌트 매핑
src/lib/games.ts                   # 게임 메타데이터
```

### 필수 Props (isEnglish 포함!)
모든 게임 컴포넌트는 반드시 `isEnglish` prop을 받아야 함:
```typescript
interface GameProps {
  onGameOver?: (score: number) => void;
  onStart?: () => void;
  onScoreChange?: (score: number) => void;
  isEnglish?: boolean;  // 필수!
}

export function MyGame({ onGameOver, onStart, onScoreChange, isEnglish = false }: GameProps) {
  // ...
}
```

### 한/영 텍스트 처리
모든 UI 텍스트는 `isEnglish`로 분기:
```tsx
<h2>{isEnglish ? 'Game Over' : '게임 오버'}</h2>
<button>{isEnglish ? 'Start' : '시작'}</button>
<p>{isEnglish ? 'Press Space to jump' : 'Space로 점프'}</p>
```

### 게임 등록 체크리스트
1. **게임 컴포넌트 생성**: `src/games/{GameName}.tsx`
2. **export 추가**: `src/games/index.ts`
3. **컴포넌트 매핑**: `src/app/games/[slug]/client.tsx`
4. **메타데이터 등록**: `src/lib/games.ts`
   - slug, icon, gradient, tags, status, featured
   - title, tagline, controls (KR)
   - titleEn, taglineEn, controlsEn (EN)

### 메타데이터 예시
```typescript
{
  slug: 'my-game',
  icon: '🎮',
  gradient: 'linear-gradient(135deg, #6366f1, #312e81)',
  tags: ['arcade', 'casual'],
  status: 'live',
  featured: true,  // 메인에 표시 여부
  // KR
  title: '내 게임',
  tagline: '게임 설명 한 줄',
  controls: {
    mobile: '화면 터치',
    desktop: '방향키 또는 WASD',
  },
  // EN
  titleEn: 'My Game',
  taglineEn: 'One line description',
  controlsEn: {
    mobile: 'Touch screen',
    desktop: 'Arrow keys or WASD',
  },
}
```

### 주의사항
- **저작권**: 테트리스, 팩맨 등 상표 사용 금지 (블록 퍼즐, 먹기 게임 등으로 대체)
- **featured: false**: 메인 페이지에 안 나옴 (게임 목록에서만 보임)
- **사이트맵**: `getAllSlugs()` 함수로 자동 생성됨

### 반응형 캔버스 UX (중요!)
게임은 최대한 큰 화면에서 플레이할 수 있도록 해야 함:

**PC (데스크톱) - 전체화면 버튼 없음!**
- 전체화면 버튼 절대 표시 금지 (PC는 이미 화면이 큼)
- 빈 공간 최소화: 게임 영역이 화면의 80% 이상 차지
- GameLayout의 game-container 안에서 `absolute inset-0`으로 채우기
- 캔버스 크기: 600x300 ~ 800x600 권장

**모바일 - 가로형 게임만 전체화면!**
- **가로 비율이 큰 게임** (러너, 슈팅 등): 전체화면 버튼 제공, 가로 모드로 전환
- **세로/정사각형 게임** (보드게임, 퍼즐 등): 전체화면 버튼 불필요, 세로 모드에서 꽉 채우기
- 빈 공간 최소화: 화면에 맞게 크기 조절
- 스크롤 절대 발생 금지

**전체화면이 필요한 게임 (가로형)**
- 엔드리스 러너, 플랩 게임, 슈팅 게임, 레이싱 게임 등
- 가로:세로 비율이 1.5:1 이상인 게임

**전체화면이 불필요한 게임 (세로/정사각형)**
- 보드게임 (체스, 체커, 오델로, 해전게임)
- 퍼즐 (2048, 지뢰찾기, 스도쿠)
- 카드게임, 매칭게임

**전체화면 구현 패턴 (가로형 게임에만 적용)**
```typescript
const [isMobile, setIsMobile] = useState(false);
const [isFullscreen, setIsFullscreen] = useState(false);

// 모바일 감지
useEffect(() => {
  const checkMobile = () => setIsMobile(window.innerWidth < 768);
  checkMobile();
  window.addEventListener('resize', checkMobile);
  return () => window.removeEventListener('resize', checkMobile);
}, []);

// 전체화면 토글 (모바일 + 가로형 게임에만!)
const toggleFullscreen = useCallback(() => {
  if (!containerRef.current) return;
  if (!document.fullscreenElement) {
    containerRef.current.requestFullscreen().then(() => {
      setIsFullscreen(true);
      // 가로 모드 강제
      if (screen.orientation && 'lock' in screen.orientation) {
        (screen.orientation as any).lock('landscape').catch(() => {});
      }
    }).catch(() => {});
  } else {
    document.exitFullscreen().then(() => {
      setIsFullscreen(false);
      if (screen.orientation && 'unlock' in screen.orientation) {
        (screen.orientation as any).unlock();
      }
    }).catch(() => {});
  }
}, []);

// 전체화면 버튼은 isMobile && 가로형게임 조건에서만 렌더링
{isMobile && isLandscapeGame && (
  <button onClick={toggleFullscreen}>전체화면</button>
)}
```

**참고 파일**: `EndlessRunnerGame.tsx` (가로형 전체화면 예시)

### 게임 UI 크기 규칙 (필수!)
**PC 화면의 최소 80% 이상 사용해야 함**

**그리드형 게임 (보드 게임, 퍼즐 등)**
- **3x3 → 5x5 → 8x8 → 10x10 등 난이도별 크기가 있으면 가장 큰 크기 기준으로 셀 크기 결정**
- 셀 크기 기준값:
  - 모바일: 최소 `w-10 h-10` ~ `w-12 h-12`
  - PC(md): 최소 `w-12 h-12` ~ `w-14 h-14`
  - PC(lg): 최소 `w-14 h-14` ~ `w-16 h-16`
- 10x10 이상 그리드는 셀을 줄여서 한 화면에 맞추되, 스크롤 발생 금지

**캔버스형 게임**
- PC: 가로 600~800px, 세로 300~600px (최소)
- 게임 컨테이너 `absolute inset-0`으로 공간 최대 활용

**모바일**
- 스크롤 절대 발생 금지 (한 화면에 다 보이게)
- 필요시 모바일 전용 컴팩트 레이아웃 적용
- 전체화면 모드 권장

**롱프레스 방지 (iOS Safari 등)**
모든 터치 게임은 롱프레스 컨텍스트 메뉴 방지:
```tsx
<div
  className="select-none"
  style={{ WebkitTouchCallout: 'none', WebkitUserSelect: 'none', userSelect: 'none' }}
  onContextMenu={(e) => e.preventDefault()}
>
  {/* 게임 영역 */}
</div>
```

### 게임 순서 규칙 (games.ts)
- **배열 순서 = 표시 순서** (가장 먼저 오는 게임이 맨 앞에 표시)
- **새 게임 추가 시 배열 맨 앞(인덱스 0)에 추가** (최신 게임이 항상 앞에)
- `// GameName (YYYY-MM-DD)` 형식으로 날짜 주석 권장
- 인기 게임 = 전체 게임 (별도 분리 없음, 같은 순서 사용)

---

## 블로그 글 작성 가이드 (SEO 유입용)

### 핵심 원칙
**홍보글처럼 쓰지 마!**

| ❌ 안 됨 | ✅ 좋음 |
|---------|--------|
| "제가 만든 사이트 소개합니다" | 문제 상황 설명 |
| "이 툴 써보세요" | 해결 과정 서술 |
| 직접적인 광고 톤 | 자연스럽게 링크 연결 |

**이상적인 톤**: "귀찮아서 이런 거 직접 만들었는데…"

### 필수 구성 요소
블로그 글에 반드시 포함:
1. **왜 필요했는지** - 문제 상황, 불편함
2. **기존 방법의 문제** - 다른 사이트 광고 많음, 회원가입 필요 등
3. **직접 써본 느낌** - 실제 사용 경험, 장단점

### 링크 전략
- ❌ 홈페이지 링크만 달랑
- ❌ 관련 없는 도구 링크
- ✅ **해당 글에서 다루는 도구 링크** (글 주제와 일치하는 도구)

예시:
- 글자수 세기 글 → `character-counter` 링크
- JSON 포맷터 글 → `json-formatter` 링크

이유: 글 내용과 링크가 일관되어야 구글이 신뢰함

### 파일 위치
```
docs/blog/YYYY-MM-DD_순번_slug_언어.md
```
예시:
- `2026-01-25_01_site-intro_kr.md`
- `2026-01-25_02_character-counter_en.md`

### 블로그 글 스타일 (필수!)
```markdown
# 제목 - 간결하게


👉 [도구명 바로가기](https://toolpiki.com/tools/slug)

> 한줄 설명 (문제 상황)

---

## 언제 필요한지

생각보다 많음:

- 상황1 → 이유
- 상황2 → 이유
- 상황3 → 이유

짧은 마무리 문장.

---

## 기존 방법 문제

- 방법1 → 단점
- 방법2 → 단점
- 방법3 → 단점

그냥 OO하면 바로 나왔으면.

---

## 그래서 만들었음

한줄 설명.

**보여주는 것:**
- 기능1
- 기능2
- 기능3

**추가 기능:**
- 부가기능1
- 부가기능2

---

## 실제로 써보니

**장점:**
- 장점1
- 장점2
- 장점3

**한계:**
- 한계1
- 한계2

짧은 후기.

---

## 사용법

1. 단계1
2. 단계2
3. 끝

N초면 됨.

---

## 써보기

👉 [도구명 바로가기](https://toolpiki.com/tools/slug)

짧은 마무리~

---

### 태그
#태그1 #태그2 #태그3
```

**스타일 규칙:**
- 제목 아래 빈 줄 2개 후 👉 링크
- > 인용문으로 한줄 훅
- --- 구분선으로 섹션 분리
- 문장은 짧게 (한줄에 하나)
- 리스트는 → 로 연결
- 마지막에 태그
- **태그 형식:** KR은 `#태그` (백틱 없이), EN은 `` `#tag` `` (백틱 있이)

