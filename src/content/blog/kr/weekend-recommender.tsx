import Link from 'next/link';

export default function WeekendRecommenderPost() {
  return (
    <article className="prose prose-gray dark:prose-invert max-w-none">
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">재미/테스트 · 2026년 7월 31일 · 읽는 시간 4분</p>

      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        이번 주말 뭐 할지 금요일 밤에도 못 정하는 사람들을 위해
      </h1>

      <p className="mb-4">
        <Link href="/tools/weekend-recommender" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 이번 주말 활동 추천 바로 가기
        </Link>
      </p>

      <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 dark:text-gray-400 mb-6">
        금요일 밤 11시. 내일 뭐 할지 아직도 모름. 그러다 토요일 오후에 겨우 일어나서 결국 집에서 유튜브만 봤다.
      </blockquote>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">주말이 어디로 사라지는 건지</h2>

      <p className="mb-3">주말을 "알차게" 보내고 싶다는 생각은 항상 있는데, 막상 토요일 아침이 되면:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>일어났는데 뭐 할지 모름 → 폰 보다가 점심</li>
        <li>어디 가볼까 → 검색하다가 지침 → 그냥 집에 있기로</li>
        <li>친구 연락 → "나도 몰라" → 각자 집에서 뒹굴</li>
        <li>계획 세우려고 노트 꺼냄 → 적다가 귀찮아짐 → 유튜브</li>
        <li>저녁 먹고 "내일은 진짜 뭔가 하자" → 일요일도 똑같음</li>
      </ul>

      <p className="mb-4">주말이 지나고 나면 뭔가 아쉽다. 뭔가를 했는데 아무것도 안 한 것 같은 느낌. 쉬긴 했는데 충전된 것 같지 않은 그 기분.</p>

      <p className="mb-4">문제는 주말 계획을 세우는 것 자체가 귀찮다는 거다. 평일에 이미 충분히 결정하고 고민했는데, 주말에도 또 "어디 갈까, 뭐 먹을까, 누구랑 할까"를 결정해야 한다는 게 생각보다 피곤하다.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">인스타그램, 유튜브로 찾아보면 안 되나</h2>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>인스타 "주말 나들이" 검색 → 갓생 계정들 → 이미 준비된 사람들 이야기</li>
        <li>유튜브 "주말 브이로그" → 내 상황이랑 다름 → 오히려 더 뭐 할지 모름</li>
        <li>카카오맵 근처 장소 → 리스트는 나오는데 뭘 골라야 할지 모름</li>
        <li>여행 앱들 → 숙박 예약 기준이지 가볍게 주말 보내는 용도가 아님</li>
      </ul>

      <p className="mb-4">나한테 맞는 걸 골라주는 게 없었다. 정보는 넘치는데 선택이 어렵다는 게 문제였다.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">그래서 만들었음</h2>

      <p className="mb-3">이번 주 상태랑 기분 몇 가지 물어보고, 거기에 맞는 주말 활동 추천해주는 도구다.</p>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">물어보는 것들:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>이번 주 컨디션 → 완전 방전 / 보통 / 에너지 남음</li>
        <li>혼자 vs 같이 → 혼자 / 친구랑 / 가족이랑 / 연인이랑</li>
        <li>활동 반경 → 집 근처 / 동네 나들이 / 한 시간 이내 거리</li>
        <li>예산 → 최대한 적게 / 적당히 / 좀 써도 됨</li>
        <li>원하는 분위기 → 조용히 / 활동적으로 / 새로운 경험 / 맛있는 거</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">추천 예시:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>방전 + 혼자 + 집 근처 + 조용히 → "동네 카페 한 군데 새로 찾아서 책 들고 가기"</li>
        <li>에너지 남음 + 친구랑 + 한 시간 거리 + 활동적으로 → "도보 여행 코스 하나 잡아서 걸어다니기"</li>
        <li>보통 + 연인이랑 + 동네 나들이 + 맛있는 거 → "점심 맛집 예약하고 오후에 공원 산책"</li>
        <li>방전 + 가족이랑 + 집 → "집에서 같이 요리해 먹기. 새 레시피 하나로."</li>
      </ul>

      <p className="mb-4">거창하지 않다. 막상 실행하면 "이거 나쁘지 않은데" 싶은 것들이다.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">실제로 써보니</h2>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">좋은 점:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>추천이 하나만 나와서 고민이 없음 → 할지 말지만 결정하면 됨</li>
        <li>내 상태에 맞게 나옴 → 방전됐는데 등산 추천 같은 거 안 나옴</li>
        <li>금요일 밤에 미리 봐두면 좋음 → 다음날 바로 실행 가능</li>
        <li>무료이고 로그인 없음 → 진짜 30초면 끝</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">한계:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>지역 기반 장소 추천은 아님 → "홍대 카페 추천" 이런 건 카카오맵 써야 함</li>
        <li>날씨 연동 없음 → 비 오는 날에도 야외 추천 나올 수 있으니 참고만</li>
        <li>매주 쓰면 비슷한 추천 나올 수 있음 → 가끔씩 쓰는 용도</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">주말을 잘 보내는 게 왜 중요한지</h2>

      <p className="mb-4">번아웃 관련 얘기들 보면 항상 나오는 말이 "제대로 쉬어야 한다"는 건데, 막상 어떻게 쉬어야 하는지 아무도 구체적으로 알려주지 않는다.</p>

      <p className="mb-4">연구들 보면 수동적 휴식(스크롤, 넷플릭스)보다 능동적 휴식(가벼운 활동, 새로운 경험, 사람 만나기)이 실제 회복에 더 효과적이라고 한다. 그런데 능동적 휴식은 계획이 필요하고, 계획을 세우는 게 또 귀찮으니까 결국 수동적 휴식으로 돌아간다.</p>

      <p className="mb-4">이 도구가 그 계획 수립의 귀찮음을 대신해주는 거다. 추천받은 걸 그냥 따라가면 되니까, 능동적 휴식을 선택하는 장벽이 낮아진다.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">사용법</h2>

      <ol className="space-y-1 mb-4 text-gray-700 dark:text-gray-300 list-decimal list-inside">
        <li>현재 상태 질문에 답변 (5가지)</li>
        <li>주말 활동 추천 결과 확인</li>
        <li>마음에 들면 그냥 실행</li>
      </ol>

      <p className="mb-4">금요일 퇴근길에 해두면 토요일 아침에 바로 실행할 수 있다.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">써보기</h2>

      <p className="mb-4">
        <Link href="/tools/weekend-recommender" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 이번 주말 활동 추천 바로 가기
        </Link>
      </p>

      <p className="text-gray-600 dark:text-gray-400">로그인 없이 바로 쓸 수 있다. 주말을 어떻게 보낼지 잠깐만 고민해봐도 달라질 수 있다.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <p className="text-sm text-gray-500 dark:text-gray-400">
        #주말추천 #주말뭐할까 #주말계획 #결정피로 #주말활동 #무료도구
      </p>
    </article>
  );
}
