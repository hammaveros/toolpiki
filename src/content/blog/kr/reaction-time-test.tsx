import Link from 'next/link';

export default function ReactionTimeTestPost() {
  return (
    <article className="prose prose-gray dark:prose-invert max-w-none">
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">재미/테스트 · 2026년 7월 19일 · 읽는 시간 5분</p>

      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        내 반응속도가 얼마나 되는지 테스트해봤는데 생각보다 느려서 충격
      </h1>

      <p className="mb-4">
        <Link href="/tools/reaction-time-test" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 반응속도 측정 테스트 바로 가기
        </Link>
      </p>

      <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 dark:text-gray-400 mb-6">
        게임 잘 하는데 반응속도 측정해보니까 평균이라서 현타 왔음ㅋㅋ
      </blockquote>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">반응속도 테스트 왜 해보냐면</h2>

      <p className="mb-3">생각보다 많은 사람이 궁금해하는 주제다:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>FPS 게임 하면서 "내 반응속도가 얼마나 되나" 궁금할 때</li>
        <li>커피 마신 후랑 전이랑 반응속도 차이 비교해볼 때</li>
        <li>잠 안 자고 작업하다가 "지금 반응속도가 많이 떨어졌나" 체크할 때</li>
        <li>친구들이랑 누가 빠른지 내기할 때</li>
        <li>운동 전후로 집중력/반응성 변화 확인</li>
        <li>피로도가 높을 때 업무 시작 전 워밍업 겸 체크</li>
        <li>그냥 오늘 내 컨디션이 어떤지 수치로 확인하고 싶을 때</li>
      </ul>

      <p className="mb-4">
        측정 자체가 재미있기도 하고, 반복하다 보면 실제로 기록이 좋아지는 걸 느낄 수 있어서 계속 하게 되는 도구다.
        게임 커뮤니티에선 반응속도 기록 자랑하는 게 하나의 문화가 됐을 정도ㅋㅋ
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">기존 방법들 문제</h2>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>Humanbenchmark.com → 유명하긴 한데 영어고, 광고 있고, 가끔 로딩 느림</li>
        <li>게임 내 반응속도 측정 → 그 게임 설치되어 있어야 하고, 조건이 다름</li>
        <li>모바일 반응속도 앱 → 앱 설치해야 하고, 결과 공유 불편함</li>
        <li>그냥 직접 스톱워치 눌러보기 → 기준도 없고 정확한 측정 불가</li>
      </ul>

      <p className="mb-4">
        한국어로 깔끔하게, 바로 테스트하고 통계도 볼 수 있는 도구가 없어서 만들었다.
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">그래서 직접 만들었음</h2>

      <p className="mb-3">테스트 방식:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>화면이 빨간색(대기) → 초록색(클릭!)으로 바뀌는 순간 클릭</li>
        <li>클릭 시간 밀리초(ms) 단위로 측정</li>
        <li>연속 5회 측정 후 결과 통계 제공</li>
        <li>초록색 되기 전에 클릭하면 "너무 일찍 클릭!" 경고 → 재시작</li>
      </ul>

      <p className="mb-3">결과 통계:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li><strong>평균 반응속도</strong> → 5회 측정 평균값</li>
        <li><strong>최고 기록</strong> → 5회 중 가장 빠른 반응</li>
        <li><strong>최저 기록</strong> → 5회 중 가장 느린 반응</li>
        <li><strong>표준편차</strong> → 기록 일관성 수치화</li>
        <li><strong>등급 표시</strong> → 평균 대비 내 기록 위치 (느림 / 평균 / 빠름 / 매우 빠름)</li>
        <li><strong>히스토리 차트</strong> → 회차별 기록 변화 그래프</li>
      </ul>

      <p className="mb-3">추가 기능:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>세션 내 누적 기록 트래킹 → 여러 번 도전하면 평균이 어떻게 변하는지</li>
        <li>결과 공유 → 기록 스크린샷 저장 또는 텍스트 복사</li>
        <li>모바일 터치 지원 → 폰에서도 테스트 가능</li>
        <li>대기 시간 랜덤화 → 패턴 외워서 치팅 방지</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">반응속도 평균이 얼마나 되어야 빠른 건가</h2>

      <p className="mb-3">일반적인 인간 반응속도 기준:</p>

      <ul className="space-y-2 mb-4 text-gray-700 dark:text-gray-300">
        <li>
          <strong>150ms 이하</strong> → 매우 빠름 (상위 5% 수준)
          프로 e스포츠 선수, 격투기/농구 선수 등 반응 훈련된 사람들
        </li>
        <li>
          <strong>150~200ms</strong> → 빠름 (상위 20%)
          게임을 꽤 많이 하거나 반응이 빠른 편인 사람들
        </li>
        <li>
          <strong>200~250ms</strong> → 평균 (상위 50%)
          일반 성인 대부분이 이 범위에 들어감
        </li>
        <li>
          <strong>250~300ms</strong> → 보통
          컴퓨터/게임을 자주 안 하는 사람들
        </li>
        <li>
          <strong>300ms 이상</strong> → 느린 편
          피로, 수면 부족, 나이 등 영향받는 경우
        </li>
      </ul>

      <p className="mb-3">
        참고로 이건 <strong>시각 자극에 대한 반응</strong> 기준이다.
        실제 게임이나 스포츠에서는 상황 판단 시간까지 더해지기 때문에 이 수치보다 느리게 나올 수 있음.
      </p>

      <p className="mb-4">
        또 재미있는 점은, 처음엔 250ms대이던 기록이 몇 번 테스트 반복하면 200ms 초반까지 나오는 경우가 많다.
        워밍업 효과가 확실히 있어서 게임 전에 이걸로 몇 번 해두는 사람들도 있음.
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">반응속도에 영향 주는 것들</h2>

      <p className="mb-3">기록이 좋게 나오려면 이런 것들이 도움된다:</p>

      <ul className="space-y-2 mb-4 text-gray-700 dark:text-gray-300">
        <li>
          <strong>충분한 수면</strong> → 수면 부족하면 반응속도 20~30ms 이상 떨어진다는 연구가 있음.
          밤새고 테스트해보면 확실히 느리게 나옴.
        </li>
        <li>
          <strong>카페인</strong> → 커피 마신 후 30분~1시간 후 최고 효과. 실제로 기록 좋게 나오는 경우 많음.
        </li>
        <li>
          <strong>워밍업</strong> → 첫 번째 측정보다 2~3번째가 보통 빠름. 뇌가 준비되는 시간이 필요.
        </li>
        <li>
          <strong>화면 응답 속도</strong> → 모니터 응답 속도나 프레임률이 낮으면 표시되는 시간에 지연이 생길 수 있음.
        </li>
        <li>
          <strong>입력 장치</strong> → 마우스 폴링 레이트, 키보드 응답 속도도 미세하게 영향.
        </li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">실제로 써보니</h2>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">좋은 점:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>대기 시간 랜덤이라 패턴 외워서 치팅 못 함 → 측정이 신뢰됨</li>
        <li>5회 통계 + 등급 → 내 기록이 어느 수준인지 바로 알 수 있음</li>
        <li>히스토리 차트 → 세션 중 기록 변화 추이 보는 재미가 있음</li>
        <li>모바일도 됨 → 폰으로 친구랑 경쟁할 때 편함</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">한계:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>세션 기록이 탭 닫으면 사라짐 → 장기 트래킹 없음</li>
        <li>키보드 반응속도 전용 모드는 없음 → 마우스/터치 기준</li>
        <li>소리 자극 반응속도 테스트는 없음 → 시각 전용</li>
      </ul>

      <p className="mb-4">
        진지하게 측정하는 용도보다는, 잠깐 테스트해보고 싶거나 친구랑 비교하거나 컨디션 체크할 때 쓰기 딱 좋다.
        결과 등급 나오면 괜히 또 해보고 싶어지는 중독성 있음ㅋㅋ
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">사용법</h2>

      <ol className="space-y-2 mb-4 text-gray-700 dark:text-gray-300 list-decimal list-inside">
        <li>페이지 열면 빨간 화면 표시 → "준비" 상태</li>
        <li>화면이 초록색으로 바뀌는 순간 마우스 클릭 또는 화면 터치</li>
        <li>밀리초 단위 반응속도 즉시 표시</li>
        <li>5회 반복 후 평균/최고/최저/등급 통계 확인</li>
        <li>다시 도전 버튼으로 재시작</li>
      </ol>

      <p className="mb-4">1분이면 결과까지 볼 수 있다.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">써보기</h2>

      <p className="mb-4">
        <Link href="/tools/reaction-time-test" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 반응속도 측정 테스트 바로 가기
        </Link>
      </p>

      <p className="text-gray-600 dark:text-gray-400">
        지금 당장 테스트해봐. 생각보다 빠를 수도, 느릴 수도 있음ㅋㅋ
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <p className="text-sm text-gray-500 dark:text-gray-400">
        #반응속도측정 #반응속도테스트 #게임반응속도 #집중력테스트 #재미테스트 #무료게임
      </p>
    </article>
  );
}
