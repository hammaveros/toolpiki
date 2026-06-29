import Link from 'next/link';

export default function CronParserPost() {
  return (
    <article className="prose prose-gray dark:prose-invert max-w-none">
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">개발도구 · 2026년 7월 6일 · 읽는 시간 4분</p>

      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        Cron 표현식 읽기 귀찮아서 만든 파서
      </h1>

      <p className="mb-4">
        <Link href="/tools/cron-parser" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 Cron 파서 바로 가기
        </Link>
      </p>

      <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 dark:text-gray-400 mb-6">
        <code>0 9 * * 1-5</code> 이게 언제 실행되는 건지 머릿속에서 바로 안 그려진다.
      </blockquote>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Cron 표현식이 헷갈리는 상황</h2>

      <p className="mb-3">백엔드 개발하다 보면 자주 마주침:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>배치 작업 스케줄 설정 → 언제 돌아가는지 한눈에 안 들어옴</li>
        <li>기존 cron 설정 파악 → 누가 짜놓은 표현식 해석해야 할 때</li>
        <li>AWS CloudWatch Events / EventBridge → cron 문법 조금 달라서 헷갈림</li>
        <li>Jenkins / GitLab CI 파이프라인 → 빌드 스케줄 설정</li>
        <li>Spring @Scheduled → cron 속성값 맞게 썼는지 확인</li>
        <li>Kubernetes CronJob → 스펙 파일에 cron 표현식 넣을 때</li>
      </ul>

      <p className="mb-4">
        특히 <code className="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded">*/15 * * * *</code> 같은 건 그나마 읽히는데,
        <code className="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded">0 0 1,15 * *</code> 같은 건 바로 안 읽힌다.
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Cron 표현식 기본 구조</h2>

      <p className="mb-3">표준 cron은 5개 필드:</p>

      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-4 overflow-x-auto">
        <pre className="text-sm text-gray-700 dark:text-gray-300">
{`분(0-59) 시(0-23) 일(1-31) 월(1-12) 요일(0-7, 0/7=일요일)

# 예시들
0 9 * * 1-5      → 평일 오전 9시
*/15 * * * *     → 15분마다
0 0 1 * *        → 매월 1일 자정
0 9,18 * * 1-5   → 평일 오전 9시, 오후 6시
30 23 * * 5      → 매주 금요일 오후 11시 30분`}
        </pre>
      </div>

      <p className="mb-3">자주 쓰는 특수문자:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li><code className="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded">*</code> → 모든 값</li>
        <li><code className="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded">*/n</code> → n마다 (예: */5 = 5분마다)</li>
        <li><code className="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded">a-b</code> → a부터 b 범위</li>
        <li><code className="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded">a,b,c</code> → a, b, c 각각</li>
        <li><code className="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded">L</code> → 마지막 (일부 구현체만)</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">기존 방법의 문제</h2>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>crontab.guru → 영어라서 한국어로 설명 안 해줌, 사이트 무거움</li>
        <li>직접 계산 → 자꾸 헷갈림, 요일 0이 일요일인지 1이 일요일인지</li>
        <li>Stack Overflow 검색 → 비슷한 예제 찾아서 수동으로 변형</li>
        <li>다음 실행 시간이 언제인지 바로 확인 불가</li>
      </ul>

      <p className="mb-4">
        특히 요일 숫자 표기가 시스템마다 달라서 (0=일요일인지 1=일요일인지) 매번 확인하게 된다.
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">그래서 만들었음</h2>

      <p className="mb-3">주요 기능:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>Cron 표현식 입력 → 한국어로 풀어서 설명</li>
        <li>다음 실행 예정 시간 목록 (5~10개)</li>
        <li>각 필드별 상세 설명</li>
        <li>자주 쓰는 표현식 예제 모음</li>
        <li>문법 오류 감지 및 안내</li>
      </ul>

      <p className="mb-3">출력 예시:</p>

      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-4">
        <p className="text-sm text-gray-700 dark:text-gray-300">
          입력: <code>0 9 * * 1-5</code><br />
          설명: 월요일부터 금요일까지, 매일 오전 9시 0분에 실행<br />
          다음 실행: 2026-07-07 (월) 09:00, 2026-07-08 (화) 09:00, ...
        </p>
      </div>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">자주 쓰는 Cron 패턴 모음</h2>

      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-4 overflow-x-auto">
        <pre className="text-sm text-gray-700 dark:text-gray-300">
{`# 매분
* * * * *

# 매시간 정각
0 * * * *

# 매일 자정
0 0 * * *

# 매일 오전 9시
0 9 * * *

# 평일 오전 9시
0 9 * * 1-5

# 30분마다
*/30 * * * *

# 매월 1일 자정
0 0 1 * *

# 매주 월요일 오전 8시
0 8 * * 1

# 매 6시간마다
0 */6 * * *

# 매주 일요일 오후 11시 (주간 리포트)
0 23 * * 0`}
        </pre>
      </div>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">실제로 써보니</h2>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">좋은 점:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>한국어 설명 → 영어 사이트보다 훨씬 빠르게 파악</li>
        <li>다음 실행 시간 목록 → 스케줄이 의도한 대로 맞는지 바로 확인</li>
        <li>오류 메시지 → 틀린 필드 위치까지 알려줌</li>
        <li>예제 클릭 → 바로 파싱 결과 확인</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">한계:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>6필드 cron (초 포함) 지원 여부는 도구에서 확인 필요</li>
        <li>AWS EventBridge cron 문법(? L W 등)은 다를 수 있음</li>
        <li>타임존 설정에 따라 실행 시간이 달라지는 건 직접 고려해야 함</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">사용법</h2>

      <ol className="space-y-1 mb-4 text-gray-700 dark:text-gray-300 list-decimal list-inside">
        <li>Cron 표현식 입력 (예: <code className="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded">0 9 * * 1-5</code>)</li>
        <li>한국어 설명과 다음 실행 시간 확인</li>
        <li>의도한 스케줄과 맞는지 검증</li>
      </ol>

      <p className="mb-4">설정 파일에 붙여넣기 전에 한 번만 확인해도 실수를 줄일 수 있음.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">써보기</h2>

      <p className="mb-4">
        <Link href="/tools/cron-parser" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 Cron 파서 바로 가기
        </Link>
      </p>

      <p className="text-gray-600 dark:text-gray-400">
        스케줄 배치 작업 짤 때 옆에 띄워두면 편함.
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <p className="text-sm text-gray-500 dark:text-gray-400">
        #Cron표현식 #스케줄러 #배치작업 #크론파서 #백엔드개발
      </p>
    </article>
  );
}
