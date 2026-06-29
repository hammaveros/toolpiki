import Link from 'next/link';

export default function MinifierPost() {
  return (
    <article className="prose prose-gray dark:prose-invert max-w-none">
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">최적화 · 2026년 7월 8일 · 읽는 시간 4분</p>

      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        HTML/CSS/JS 코드 압축, 빌드 없이 빠르게 하고 싶을 때
      </h1>

      <p className="mb-4">
        <Link href="/tools/minifier" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 코드 압축기(Minifier) 바로 가기
        </Link>
      </p>

      <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 dark:text-gray-400 mb-6">
        인라인 스크립트 파일 크기 줄이려고 webpack 설정 건드리는 건 오버다.
      </blockquote>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">코드 압축이 필요한 상황</h2>

      <p className="mb-3">이런 경우들:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>CDN에 올릴 정적 파일 → 용량 줄여서 로딩 속도 개선</li>
        <li>이메일 템플릿 HTML → 인라인 스타일 포함 압축</li>
        <li>빠른 프로토타입 → 빌드 파이프라인 없는 환경에서 최적화</li>
        <li>WordPress 플러그인 → PHP 안에 인라인 JS/CSS 압축</li>
        <li>Google Tag Manager → 커스텀 HTML/JS 태그 용량 제한</li>
        <li>레거시 프로젝트 → 빌드 도구 없는 옛날 프로젝트 파일 최적화</li>
      </ul>

      <p className="mb-4">
        Webpack, Vite 같은 빌드 도구가 있으면 자동으로 압축되지만, 없는 환경에서 수동으로 압축해야 할 때가 생긴다.
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Minification이 하는 것</h2>

      <p className="mb-3">코드 동작은 유지하면서 파일 크기를 줄이는 과정이다:</p>

      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-4 overflow-x-auto">
        <pre className="text-sm text-gray-700 dark:text-gray-300">
{`// 원본 JavaScript
function calculateTotal(items) {
  // 총 가격 계산
  let total = 0;
  for (let item of items) {
    total += item.price * item.quantity;
  }
  return total;
}

// 압축 후
function calculateTotal(e){let t=0;for(let l of e)t+=l.price*l.quantity;return t;}`}
        </pre>
      </div>

      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-4 overflow-x-auto">
        <pre className="text-sm text-gray-700 dark:text-gray-300">
{`/* 원본 CSS */
.button {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px 24px;
  background-color: #3b82f6;
  color: white;
  border-radius: 8px;
}

/* 압축 후 */
.button{display:flex;align-items:center;justify-content:center;padding:12px 24px;background-color:#3b82f6;color:#fff;border-radius:8px}`}
        </pre>
      </div>

      <p className="mb-3">Minification이 제거하는 것:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>주석</li>
        <li>불필요한 공백, 줄바꿈, 들여쓰기</li>
        <li>JavaScript: 변수명 단축 (선택적)</li>
        <li>CSS: 색상 단축형 변환 (#ffffff → #fff)</li>
        <li>중복 세미콜론, 마지막 세미콜론</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">기존 방법의 문제</h2>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>Webpack/Vite → 프로젝트 설정 필요, 한 파일 압축에 너무 무거움</li>
        <li>UglifyJS/Terser CLI → npm 전역 설치 필요</li>
        <li>온라인 압축 사이트 → 광고 많고 코드 데이터 보안 불안</li>
        <li>직접 공백 제거 → 주석만 지워도 실수 위험</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">그래서 만들었음</h2>

      <p className="mb-3">주요 기능:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>HTML, CSS, JavaScript 각각 압축 지원</li>
        <li>압축 전/후 파일 크기 비교 표시</li>
        <li>압축률(%) 표시</li>
        <li>결과 복사 버튼</li>
        <li>원본 ↔ 압축 토글 보기</li>
      </ul>

      <p className="mb-3">HTML 압축 옵션:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>주석 제거</li>
        <li>공백 제거</li>
        <li>인라인 CSS/JS 압축</li>
      </ul>

      <p className="mb-3">JS 압축 옵션:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>변수명 단축 (Mangle)</li>
        <li>사용 안 되는 코드 제거 (Dead code)</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">압축률 기대치</h2>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>HTML: 보통 10~30% 절감</li>
        <li>CSS: 보통 20~40% 절감</li>
        <li>JavaScript: 보통 30~60% 절감 (변수명 단축 포함 시)</li>
      </ul>

      <p className="mb-4">
        여기에 gzip/brotli 압축까지 하면 추가로 60~80%가 더 줄어든다.
        서버 설정에서 압축 전송을 활성화하면 실제 전송 크기는 훨씬 작아진다.
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">실제로 써보니</h2>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">좋은 점:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>빌드 도구 없어도 바로 압축 가능</li>
        <li>압축률 수치로 바로 확인</li>
        <li>브라우저에서만 처리 → 코드 유출 없음</li>
        <li>HTML/CSS/JS 모두 한 곳에서</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">한계:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>TypeScript, JSX는 처리 불가 (일반 JS만)</li>
        <li>모듈 번들링은 안 됨 (파일 하나씩만)</li>
        <li>Source map 생성 안 됨</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">사용법</h2>

      <ol className="space-y-1 mb-4 text-gray-700 dark:text-gray-300 list-decimal list-inside">
        <li>HTML, CSS, JavaScript 중 종류 선택</li>
        <li>코드 붙여넣기</li>
        <li>압축 결과 확인</li>
        <li>복사해서 사용</li>
      </ol>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">써보기</h2>

      <p className="mb-4">
        <Link href="/tools/minifier" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 코드 압축기(Minifier) 바로 가기
        </Link>
      </p>

      <p className="text-gray-600 dark:text-gray-400">
        빠르게 인라인 코드 압축해야 할 때 유용하다.
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <p className="text-sm text-gray-500 dark:text-gray-400">
        #코드압축 #Minifier #HTML압축 #CSS압축 #JS최적화
      </p>
    </article>
  );
}
