import Link from 'next/link';

export default function ProsConsComparatorPost() {
  return (
    <article className="prose prose-gray dark:prose-invert max-w-none">
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">재미/테스트 · 2026년 7월 25일 · 읽는 시간 3분</p>

      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        이직할지 말지 노트에 장단점 끄적이다가 결국 못 정하고 만든 비교 도구
      </h1>

      <p className="mb-4">
        <Link href="/tools/pros-cons-comparator" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 장단점 비교 도구 바로 가기
        </Link>
      </p>

      <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 dark:text-gray-400 mb-6">
        노트에 장점 5개, 단점 3개 적어놓고 "장점이 더 많으니까 해야겠다"고 결론 냈는데, 정작 단점 하나가 나머지 다를 압도하는 경우가 있음.
      </blockquote>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">언제 필요한지</h2>

      <p className="mb-3">이런 결정 앞에서 막히는 경우가 많다:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>이직 여부 → 연봉은 올라가는데 안정성은 낮아지고, 워라밸은 좋아지는데 성장은 애매</li>
        <li>프리랜서 전환 → 자유로운데 불안정함, 수입은 올라갈 수 있는데 복지 없음</li>
        <li>대학원 진학 → 스펙은 되는데 기회비용이 큼, 시간이 너무 많이 들어감</li>
        <li>이사 여부 → 집이 넓어지는데 출퇴근이 길어지고, 월세가 올라감</li>
        <li>사이드 프로젝트 시작 → 하고 싶은데 체력이 남을지 모르겠고, 수익화가 될지 모름</li>
        <li>제품/서비스 선택 → A가 기능은 많은데 비싸고, B는 싸지만 기능이 부족</li>
        <li>팀 내 방향 결정 → 여러 방법론 중에서 하나 골라야 할 때</li>
      </ul>

      <p className="mb-4">이런 결정을 그냥 머릿속에서 굴리면 생각이 맴돌기만 하고 결론이 안남. 노트에 적어도 비슷함. 뭔가 구조화된 방식으로 정리가 필요한데, 스프레드시트까지 열기엔 오버킬임.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">기존 방법의 문제</h2>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>노트에 끄적이기 → 장단점 개수만 세게 됨, 중요도 차이를 반영 못함</li>
        <li>엑셀 표 만들기 → 간단한 결정에 표 만들기엔 너무 무거움, 꾸미다가 시간 다 씀</li>
        <li>친구/동료한테 물어보기 → 상황 설명하다 보면 이미 결론 나 있는 경우 많음, 근본적인 도움이 안 될 때 있음</li>
        <li>직관으로 결정 → 나중에 후회했을 때 왜 그 선택을 했는지 근거가 없음</li>
        <li>그냥 안 결정하기 → 결국 타이밍 놓치는 경우 생김</li>
      </ul>

      <p className="mb-4">핵심 문제는 "장점 5개 vs 단점 3개"처럼 개수로만 비교하면 안 된다는 거임. "연봉 300만원 상승"이랑 "출퇴근 30분 증가"는 무게가 다른데, 같은 1개로 카운트 됨.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">그래서 직접 만들었음</h2>

      <p className="mb-3">장단점 입력하고 중요도까지 설정하면 점수로 비교해줌.</p>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">기본 기능:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>선택지 여러 개 설정 → A안/B안 뿐 아니라 3개 이상도 비교 가능</li>
        <li>장점/단점 항목 자유롭게 추가 → 항목마다 텍스트로 설명</li>
        <li>중요도 가중치 설정 → 각 항목이 얼마나 중요한지 1~5점으로 설정</li>
        <li>자동 점수 계산 → 가중치 반영한 총점 계산</li>
        <li>비주얼 비교 → 장단점 개수와 가중치 합계를 한눈에 보여줌</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">추가 기능:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>결과 공유 → 링크로 공유해서 다른 사람 의견 구하기</li>
        <li>항목 메모 → 각 장단점에 추가 설명 달기</li>
        <li>결과 복사 → 텍스트로 복사해서 메모나 메신저에 공유</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">실제로 써보니</h2>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">좋은 점:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>중요도 설정하면 생각이 정리됨 → "이게 나한테 얼마나 중요한가?" 를 스스로 수치화하면서 정리되는 효과</li>
        <li>머릿속에서 맴돌던 게 정리됨 → 눈에 보이게 적으면 막연한 불안이 줄어드는 느낌</li>
        <li>다른 사람한테 공유하기 좋음 → "내가 이렇게 정리했는데 어떻게 생각해?"</li>
        <li>의사결정 근거 남김 → 나중에 왜 그 선택을 했는지 돌아볼 수 있음</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">한계:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>숫자가 전부는 아님 → 점수 높은 쪽이 꼭 맞는 선택은 아닐 수 있음, 참고 용도로 써야 함</li>
        <li>감정적 요소 반영 어려움 → "그냥 하기 싫다"는 느낌은 수치화가 안 됨</li>
        <li>저장 기능 없음 → 나중에 다시 보려면 직접 저장해둬야 함</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">이직 결정에 실제로 써본 예시</h2>

      <p className="mb-3">이런 식으로 구성해봤음:</p>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">현 직장 유지 장점:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>안정적인 수입 → 중요도 4</li>
        <li>익숙한 팀/환경 → 중요도 2</li>
        <li>재택근무 가능 → 중요도 3</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">현 직장 유지 단점:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>성장이 느림 → 중요도 5</li>
        <li>연봉 상승이 제한적 → 중요도 4</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">이직 장점:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>연봉 30% 상승 → 중요도 5</li>
        <li>기술적 성장 기회 → 중요도 5</li>
        <li>좋은 팀 분위기 → 중요도 3</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">이직 단점:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>스타트업 불안정성 → 중요도 4</li>
        <li>출퇴근 1시간 증가 → 중요도 3</li>
      </ul>

      <p className="mb-4">이렇게 정리하면 "장점 3개 vs 단점 2개"가 아니라 가중치 합계로 비교가 됨. 중요도를 설정하면서 "내가 지금 성장을 얼마나 중요하게 생각하는지"를 스스로 확인하는 효과도 있음.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">사용법</h2>

      <ol className="space-y-1 mb-4 text-gray-700 dark:text-gray-300 list-decimal list-inside">
        <li>선택지 이름 입력 (A안, B안 또는 구체적 이름)</li>
        <li>각 선택지별 장점/단점 항목 추가</li>
        <li>각 항목 중요도 설정 (1~5점)</li>
        <li>자동 계산된 점수 확인</li>
        <li>필요하면 링크로 공유</li>
      </ol>

      <p className="mb-4">5분 정도 걸림. 결론이 나든 안 나든, 정리가 되는 것만으로도 가치 있음.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">써보기</h2>

      <p className="mb-4">
        <Link href="/tools/pros-cons-comparator" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 장단점 비교 도구 바로 가기
        </Link>
      </p>

      <p className="text-gray-600 dark:text-gray-400">지금 결정 못 하고 있는 거 하나 꺼내서 써봐. 머릿속에서만 맴돌던 게 정리되는 경험 해볼 수 있음.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <p className="text-sm text-gray-500 dark:text-gray-400">
        #장단점비교 #의사결정도구 #이직고민 #선택장애해결 #프로콘리스트 #결정내리기
      </p>
    </article>
  );
}
