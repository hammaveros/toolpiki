import Link from 'next/link';

export default function OgPreviewPost() {
  return (
    <article className="prose prose-gray dark:prose-invert max-w-none">
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">SEO · 2026년 7월 10일 · 읽는 시간 4분</p>

      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        SNS 공유했을 때 어떻게 보이는지 미리 확인하는 OG 미리보기
      </h1>

      <p className="mb-4">
        <Link href="/tools/og-preview" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 OG 태그 미리보기 바로 가기
        </Link>
      </p>

      <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 dark:text-gray-400 mb-6">
        카카오톡이나 슬랙에 링크 붙였을 때 미리보기가 이상하게 나와서 실제 배포 전에 확인하고 싶었다.
      </blockquote>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">OG 태그 미리보기가 필요한 상황</h2>

      <p className="mb-3">이런 경우들:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>새 페이지 배포 전 → SNS 공유 미리보기 모양 확인</li>
        <li>OG 이미지 비율 확인 → 1200×630px 맞는지</li>
        <li>제목/설명 길이 확인 → 잘리는 부분 없는지</li>
        <li>트위터 카드 설정 확인 → summary vs summary_large_image</li>
        <li>카카오톡 링크 공유 → 썸네일이 제대로 나오는지</li>
        <li>슬랙 Unfurl 미리보기 → 팀 채널 링크 공유 시</li>
      </ul>

      <p className="mb-4">
        실제로 공유해보기 전까지 어떻게 보이는지 모르는 게 불편했다.
        카카오톡 캐시 날리는 방법도 찾아봐야 하고.
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">OG 태그란</h2>

      <p className="mb-3">Open Graph 프로토콜 - 링크 공유 시 미리보기를 제어하는 메타태그:</p>

      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-4 overflow-x-auto">
        <pre className="text-sm text-gray-700 dark:text-gray-300">
{`<head>
  <!-- 기본 OG 태그 -->
  <meta property="og:title" content="페이지 제목" />
  <meta property="og:description" content="페이지 설명 (160자 이내)" />
  <meta property="og:image" content="https://example.com/og-image.png" />
  <meta property="og:url" content="https://example.com/page" />
  <meta property="og:type" content="website" />

  <!-- 트위터 카드 -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="페이지 제목" />
  <meta name="twitter:description" content="페이지 설명" />
  <meta name="twitter:image" content="https://example.com/og-image.png" />
</head>`}
        </pre>
      </div>

      <p className="mb-4">
        og:image 없으면 공유 시 이미지 없이 텍스트만 나온다.
        있어도 비율이 맞지 않으면 이상하게 잘려서 나올 수 있다.
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">플랫폼별 OG 이미지 권장 크기</h2>

      <ul className="space-y-2 mb-4 text-gray-700 dark:text-gray-300">
        <li><strong>Facebook/일반 OG</strong> → 1200×630px (1.91:1 비율)</li>
        <li><strong>Twitter Summary Large Image</strong> → 1200×628px (2:1 비율)</li>
        <li><strong>Twitter Summary</strong> → 144×144px (정사각형)</li>
        <li><strong>Kakao</strong> → 800×400px (2:1 비율)</li>
        <li><strong>Slack Unfurl</strong> → 1200×630px (Facebook과 동일)</li>
        <li><strong>LinkedIn</strong> → 1200×627px</li>
      </ul>

      <p className="mb-4">
        플랫폼마다 조금씩 달라서, 1200×630px을 기준으로 만들면 대부분 커버된다.
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">기존 방법의 문제</h2>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>실제 공유해보기 → 결과 보려면 직접 공유해야 함</li>
        <li>Facebook Sharing Debugger → 공개 URL만 됨, 로컬 환경 불가</li>
        <li>Twitter Card Validator → Twitter 계정 필요, 느림</li>
        <li>각 플랫폼 캐시 → 수정 후에도 이전 미리보기가 나옴</li>
      </ul>

      <p className="mb-4">
        로컬 개발 환경에서 테스트하기 어렵고, 공개 URL도 캐시 때문에 수정 후 확인이 귀찮다.
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">그래서 만들었음</h2>

      <p className="mb-3">주요 기능:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>URL 입력 → OG 태그 자동 파싱 및 미리보기</li>
        <li>OG 태그 직접 입력 → 배포 전 미리 확인</li>
        <li>Facebook, Twitter, Slack, KakaoTalk 미리보기 시뮬레이션</li>
        <li>OG 이미지 크기/비율 확인</li>
        <li>누락된 태그 알림</li>
        <li>title/description 길이 확인 (잘림 여부)</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">자주 발생하는 OG 문제들</h2>

      <ul className="space-y-2 mb-4 text-gray-700 dark:text-gray-300">
        <li>
          <strong>이미지가 안 나옴</strong> → og:image 누락, 또는 상대 URL 사용 (절대 URL 써야 함)
        </li>
        <li>
          <strong>이상하게 잘림</strong> → og:image 비율이 1.91:1이 아님
        </li>
        <li>
          <strong>예전 미리보기가 나옴</strong> → 각 플랫폼 캐시 때문 (강제 갱신 필요)
        </li>
        <li>
          <strong>설명 텍스트가 잘림</strong> → og:description이 160자 이상
        </li>
        <li>
          <strong>제목 잘림</strong> → og:title이 60자 이상 (플랫폼별 다름)
        </li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">캐시 강제 갱신 방법</h2>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li><strong>Facebook</strong> → developers.facebook.com/tools/debug/ 에서 URL 입력 후 "Scrape Again"</li>
        <li><strong>Twitter</strong> → cards-dev.twitter.com/validator 에서 확인</li>
        <li><strong>카카오톡</strong> → 링크 뒤에 파라미터 추가 (예: ?v=2)</li>
        <li><strong>Slack</strong> → /unfurl 명령어 또는 링크 재전송</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">실제로 써보니</h2>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">좋은 점:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>배포 전에 미리 확인 가능</li>
        <li>여러 플랫폼 미리보기 동시에 비교</li>
        <li>누락된 태그 자동 감지</li>
        <li>이미지 크기/비율 체크</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">한계:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>실제 플랫폼 렌더링과 100% 동일하지 않을 수 있음</li>
        <li>CORS 제한으로 일부 URL은 파싱 안 될 수 있음</li>
        <li>로컬호스트 URL은 직접 입력 방식 사용해야 함</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">사용법</h2>

      <ol className="space-y-1 mb-4 text-gray-700 dark:text-gray-300 list-decimal list-inside">
        <li>URL 입력 또는 OG 태그 직접 입력</li>
        <li>각 플랫폼별 미리보기 확인</li>
        <li>문제 있으면 HTML의 OG 태그 수정</li>
        <li>다시 확인</li>
      </ol>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">써보기</h2>

      <p className="mb-4">
        <Link href="/tools/og-preview" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 OG 태그 미리보기 바로 가기
        </Link>
      </p>

      <p className="text-gray-600 dark:text-gray-400">
        새 페이지 배포 전에 SNS 공유 미리보기 확인용으로 써보면 편함.
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <p className="text-sm text-gray-500 dark:text-gray-400">
        #OG태그 #OpenGraph #SNS공유 #SEO #메타태그
      </p>
    </article>
  );
}
