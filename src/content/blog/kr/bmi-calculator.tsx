import Link from 'next/link';

export default function BmiCalculatorPost() {
  return (
    <article className="prose prose-gray dark:prose-invert max-w-none">
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">계산기 · 2026년 7월 20일 · 읽는 시간 5분</p>

      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        헬스장 등록하기 전에 내 BMI부터 확인하는 게 맞는 순서 아닌가
      </h1>

      <p className="mb-4">
        <Link href="/tools/bmi-calculator" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 BMI 체질량지수 계산기 바로 가기
        </Link>
      </p>

      <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 dark:text-gray-400 mb-6">
        살 빼야 하는 건 아는데, 정확히 얼마나? 목표 몸무게가 뭔지도 모르고 운동 시작하는 사람들 꽤 많음.
      </blockquote>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">언제 필요한지</h2>

      <p className="mb-3">BMI 계산기, 생각보다 쓸 일 많다:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>다이어트 시작 전 → 현재 상태 파악, 목표 몸무게 설정</li>
        <li>건강검진 앞두고 → 의사한테 "비만인가요?" 묻기 전 미리 확인</li>
        <li>헬스 PT 상담 → 트레이너가 첫 상담 때 항상 BMI 물어봄</li>
        <li>다이어트 목표 계산 → "정상 체중 되려면 몇 kg 빼야 하나"</li>
        <li>가족/친구 걱정될 때 → 상대방 체형 보고 "너 괜찮아?" 싶을 때</li>
        <li>보험 가입 시 → 일부 건강보험에서 BMI 30 이상이면 조건 달라짐</li>
        <li>임신 중 체중 관리 → 산부인과에서 BMI 기반으로 체중 증가 권고량 안내함</li>
        <li>군입대 전 → 현역 판정 기준에 BMI 포함</li>
      </ul>

      <p className="mb-4">
        결국 "내 몸 상태 숫자로 파악"하는 첫 걸음임. 체중계에 올라가서 숫자 보는 것보다, 키와 몸무게를 같이 계산해야 의미 있는 수치가 나옴. 170cm에 70kg이면 과체중인지 정상인지 감이 오는가? BMI 계산기 없이는 판단 어려움.
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">기존 방법의 문제</h2>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>직접 계산 → BMI = 체중(kg) ÷ 키(m)² 공식은 아는데, 계산기 꺼내서 하기 귀찮음</li>
        <li>네이버/구글 검색 → "BMI 계산기" 치면 나오긴 함, 근데 광고 가득하고 UI 복잡</li>
        <li>헬스장 인바디 → 정확하지만 비용 들고 헬스장 가야 함</li>
        <li>건강관리 앱 → 회원가입, 개인정보 입력, 알림 허용... 너무 많은 걸 요구함</li>
        <li>그냥 감 → "나 좀 통통한 편" 이라고 자체 판단하는데 정확하지 않음</li>
      </ul>

      <p className="mb-4">
        단순히 키랑 몸무게 넣으면 숫자 나오는 거 하나 있으면 되는데, 생각보다 그게 깔끔하게 있는 곳이 없음. 광고 없이, 회원가입 없이, 바로 나오는 게 필요했음.
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">그래서 직접 만들었음</h2>

      <p className="mb-3">키, 몸무게 입력하면 BMI 수치 + 상태 판정 + 이상 체중 범위 한번에 나옴.</p>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">기본 기능:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>BMI 수치 계산 → 소수점까지 정확하게</li>
        <li>체중 상태 판정 → 저체중 / 정상 / 과체중 / 비만 1단계~3단계</li>
        <li>정상 체중 범위 표시 → 내 키 기준으로 정상 범위가 몇 kg ~ 몇 kg인지</li>
        <li>목표 체중 도달까지 → 정상 범위까지 몇 kg 빼야/늘려야 하는지</li>
        <li>WHO 기준 적용 → 아시아인 기준도 같이 표시 (아시아인은 기준이 조금 다름)</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">BMI 판정 기준 (WHO):</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>18.5 미만 → 저체중</li>
        <li>18.5~24.9 → 정상</li>
        <li>25~29.9 → 과체중</li>
        <li>30~34.9 → 비만 1단계</li>
        <li>35~39.9 → 비만 2단계</li>
        <li>40 이상 → 고도비만</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">아시아인 기준 (대한비만학회):</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>23~24.9 → 과체중 (서양 기준보다 엄격)</li>
        <li>25 이상 → 비만</li>
        <li>아시아인은 같은 BMI에서 서양인보다 체지방 비율이 높아서 기준이 낮음</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">실제로 써보니</h2>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">좋은 점:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>두 값 입력하면 결과 즉시 → 진짜 5초면 확인 됨</li>
        <li>정상 체중 범위도 같이 나와서 목표 설정에 도움됨</li>
        <li>아시아인 기준 따로 표시 → 한국 사람한테 실질적으로 더 맞는 기준 확인 가능</li>
        <li>광고 없고 회원가입 없음 → 진입 장벽 없이 바로 사용</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">한계:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>근육량 미반영 → 근육이 많은 운동선수는 BMI 높게 나와도 건강할 수 있음</li>
        <li>체지방률 미반영 → 같은 BMI여도 체지방 분포가 다를 수 있음</li>
        <li>의료적 판단 아님 → 정확한 건강 상태는 의사 상담 필요</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">BMI 이것만 알면 됨</h2>

      <p className="mb-3">자주 헷갈리는 내용 정리:</p>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">BMI가 전부가 아님</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>보디빌더는 근육 때문에 BMI 30 넘는 경우도 있음 → 비만 아님</li>
        <li>말랐지만 체지방률 높은 "마른 비만"은 BMI 정상 나옴 → 안심 금물</li>
        <li>BMI는 스크리닝 도구, 정밀 진단 도구가 아님</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">목표 체중 잡을 때</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>정상 범위 상단을 목표로 → 무리없이 현실적인 목표</li>
        <li>정상 범위 하단까지 가겠다면 서두르지 말기 → 급격한 감량은 근육 손실 큼</li>
        <li>한 달에 2~3kg 감량이 건강한 페이스 (1kg = 약 7700kcal 적자)</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">저체중도 문제</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>BMI 18.5 미만은 영양 부족 신호일 수 있음</li>
        <li>여성은 체지방이 너무 낮으면 호르몬 문제 생길 수 있음</li>
        <li>무조건 마른 게 좋은 게 아님</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">사용법</h2>

      <ol className="space-y-1 mb-4 text-gray-700 dark:text-gray-300 list-decimal list-inside">
        <li>키 입력 (cm 단위, 예: 170)</li>
        <li>몸무게 입력 (kg 단위, 예: 68)</li>
        <li>계산 버튼 클릭 또는 자동 계산</li>
        <li>BMI 수치 + 상태 판정 확인</li>
        <li>정상 체중 범위와 목표 체중 차이 확인</li>
      </ol>

      <p className="mb-4">입력하는 데 5초, 결과 보는 데 10초. 총 15초면 됨.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">써보기</h2>

      <p className="mb-4">
        <Link href="/tools/bmi-calculator" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 BMI 체질량지수 계산기 바로 가기
        </Link>
      </p>

      <p className="text-gray-600 dark:text-gray-400">
        다이어트 시작 전, 건강검진 전, 헬스 상담 전에 한 번씩 확인해두면 좋음. 숫자 알고 있으면 목표가 더 명확해짐.
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <p className="text-sm text-gray-500 dark:text-gray-400">
        #BMI계산기 #체질량지수 #다이어트 #정상체중 #비만판정 #체중관리 #건강관리
      </p>
    </article>
  );
}
