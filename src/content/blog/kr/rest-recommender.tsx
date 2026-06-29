import Link from 'next/link';

export default function RestRecommenderPost() {
  return (
    <article className="prose prose-gray dark:prose-invert max-w-none">
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">재미/테스트 · 2026년 7월 31일 · 읽는 시간 4분</p>

      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        오늘 어떻게 쉬어야 할지 모르겠을 때, 그냥 추천 받아버리기
      </h1>

      <p className="mb-4">
        <Link href="/tools/rest-recommender" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 오늘의 휴식 추천 바로 가기
        </Link>
      </p>

      <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 dark:text-gray-400 mb-6">
        퇴근 후 소파에 누웠는데 뭘 해야 할지 몰라서 그냥 폰만 들여다보다가 잠들었다.
      </blockquote>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">쉬는데도 왜 이렇게 피곤하냐</h2>

      <p className="mb-3">퇴근하고 집에 왔는데 막상 뭘 해야 할지 모르는 상황, 생각보다 자주 온다:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>넷플릭스 켰는데 뭘 볼지 고르다가 30분 → 그냥 끔</li>
        <li>유튜브 알고리즘 따라가다 보면 2시간 → 뭘 봤는지도 모름</li>
        <li>게임 하려다가 어떤 게임 할지 고민만 → 결국 안 함</li>
        <li>산책 가려다가 귀찮아서 → 누워만 있다가 더 피곤</li>
        <li>친구 만날까 → 연락하기 귀찮음 → 혼자 집에서 뒹굴</li>
      </ul>

      <p className="mb-4">결국 쉬는 시간을 "어떻게 쉴지 고민하는 시간"으로 다 써버리는 거다. 이게 진짜 피로감의 원인 중 하나인 것 같았다.</p>

      <p className="mb-4">선택 자체가 에너지를 소모한다. 퇴근 후에 의사결정을 또 해야 한다는 게 생각보다 힘든 일이다. 그래서 그냥 누가 정해줬으면 싶었다.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">기존에 찾아봤던 방법들</h2>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>유튜브 "퇴근 후 루틴" 검색 → 갓생 유튜버 영상만 나옴 → 현실감 없음</li>
        <li>블로그 "직장인 취미 추천" → 요가, 독서, 악기... 다 알고 있는데 실천이 문제</li>
        <li>친구한테 물어보기 → "그냥 쉬어" → 그게 어렵다고</li>
        <li>계획표 짜기 → 만드는 데 에너지 다 씀 → 본말전도</li>
      </ul>

      <p className="mb-4">뭔가 내 상태에 맞게 즉각적으로 제안해주는 게 없었다. 지금 내가 얼마나 피곤한지, 혼자 있고 싶은지 밖에 나가고 싶은지 같은 걸 고려해서 딱 맞는 걸 골라주는 게 필요했다.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">그래서 만들었음</h2>

      <p className="mb-3">지금 내 상태 몇 가지 물어보고 거기에 맞는 휴식 방법 추천해주는 도구다.</p>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">물어보는 것들:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>오늘 피로도 → 완전 방전 / 살짝 피곤 / 에너지 있음</li>
        <li>선호 장소 → 집에서 / 밖에 나가고 싶음</li>
        <li>혼자 vs 같이 → 혼자 있고 싶음 / 누군가랑 같이</li>
        <li>가능한 시간 → 30분 이내 / 1~2시간 / 여유 있음</li>
        <li>지금 기분 → 멍하고 싶음 / 뭔가 하고 싶음 / 기분 전환 필요</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">추천 예시:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>완전 방전 + 집 + 30분 → "그냥 누워있어. 유튜브도 끄고. 10분만."</li>
        <li>살짝 피곤 + 밖 + 1시간 → "편의점 가서 좋아하는 음료 사고 동네 한 바퀴"</li>
        <li>에너지 있음 + 집 + 여유 → "새로운 레시피 하나 따라 해보기"</li>
        <li>기분 전환 필요 + 밖 + 2시간 → "카페 바꿔가기. 평소 안 가던 동네로."</li>
      </ul>

      <p className="mb-4">거창한 거 없다. 막상 추천받으면 "이거면 되겠다" 싶은 것들이다.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">실제로 써보니</h2>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">좋은 점:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>선택지가 너무 많지 않음 → 하나 딱 나와서 부담 없음</li>
        <li>내 상태 맞춤이라서 현실적임 → "요가 배워라" 같은 거 안 나옴</li>
        <li>추천 받고 나면 그냥 하게 됨 → 결정 피로 해소</li>
        <li>30초면 끝남 → 진짜 귀찮을 때도 할 수 있음</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">한계:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>내 취향 데이터 학습하는 기능은 없음 → 매번 처음부터</li>
        <li>날씨 연동 안 됨 → 비 오는 날 야외 추천 나올 수 있음 (참고만 할 것)</li>
      </ul>

      <p className="mb-4">그래도 "뭐 할까" 고민하는 시간을 없애준다는 것만으로 충분했다.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">왜 이게 필요한지 조금 더 얘기하자면</h2>

      <p className="mb-4">요즘 번아웃 얘기가 많은데, 사실 쉬는 방법을 모르는 사람이 생각보다 많다. 일은 어떻게 하는지 훈련되어 있는데, 쉬는 건 아무도 알려준 적이 없다.</p>

      <p className="mb-4">특히 스마트폰 이후로 쉬는 것처럼 보이는 행동(SNS 스크롤, 유튜브 시청)이 실제로는 뇌를 쉬게 하지 않는다는 걸 많이들 느끼고 있다. 그러면서도 다른 대안을 선택하기가 귀찮으니까 계속 폰만 들여다보게 된다.</p>

      <p className="mb-4">이 도구가 그 결정을 대신해준다는 게 핵심이다. 완벽한 휴식을 찾아주는 게 아니라, 지금 당장 실행 가능한 것 하나를 골라주는 것. 그 작은 차이가 실제로 저녁을 다르게 만든다.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">사용법</h2>

      <ol className="space-y-1 mb-4 text-gray-700 dark:text-gray-300 list-decimal list-inside">
        <li>지금 상태 질문 5개에 답변</li>
        <li>추천 결과 확인</li>
        <li>그냥 해보기</li>
      </ol>

      <p className="mb-4">30초면 된다. 고민하는 시간보다 훨씬 짧다.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">써보기</h2>

      <p className="mb-4">
        <Link href="/tools/rest-recommender" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 오늘의 휴식 추천 바로 가기
        </Link>
      </p>

      <p className="text-gray-600 dark:text-gray-400">로그인 없이 바로 쓸 수 있다. 추천 받고 나서 할지 말지는 본인이 결정하면 된다.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <p className="text-sm text-gray-500 dark:text-gray-400">
        #휴식추천 #퇴근후 #결정피로 #번아웃 #오늘뭐할까 #무료도구
      </p>
    </article>
  );
}
