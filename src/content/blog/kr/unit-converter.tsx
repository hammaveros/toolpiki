import Link from 'next/link';

export default function UnitConverterPost() {
  return (
    <article className="prose prose-gray dark:prose-invert max-w-none">
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">계산기 · 2026년 6월 15일 · 읽는 시간 4분</p>

      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        단위 변환, 구글에서 계산하다 결국 직접 만들었음
      </h1>

      <p className="mb-4">
        <Link href="/tools/unit-converter" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 단위 변환기 바로 가기
        </Link>
      </p>

      <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 dark:text-gray-400 mb-6">
        해외 쇼핑몰에서 사이즈 표 보는데 인치라고만 나와있음. 머릿속으로 계산이 안 됨.
      </blockquote>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">언제 필요한지</h2>

      <p className="mb-3">생각보다 자주 생긴다:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>해외 쇼핑 → 인치, 파운드, 온스 단위가 섞여서 나옴</li>
        <li>레시피 따라 하기 → 컵, 온스, 그램 변환 필요</li>
        <li>운동 기록 앱 → 마일, km 혼용 문제</li>
        <li>해외 날씨 앱 → 화씨(°F)로 나와서 체감 안 됨</li>
        <li>건설·인테리어 → 피트, 인치, 미터 단위 혼용</li>
        <li>수출입 서류 → 무게 단위 통일 필요</li>
        <li>여행 준비 → 마일리지, 거리, 무게 전부 단위가 다름</li>
      </ul>

      <p className="mb-4">특히 미국 관련 작업이 하나라도 끼면 무조건 단위 변환이 발생한다. 미터법이 표준인 나라에 사는데 파운드, 마일, 화씨는 정말 직관적으로 안 잡힘.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">기존 방법의 문제</h2>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>구글 검색 → "180cm to feet" 치면 나오긴 하는데, 다른 단위로 전환하려면 또 검색해야 함</li>
        <li>검색창에서 계산식 직접 치기 → "5.9 * 30.48" 이런 거 매번 기억 안 남</li>
        <li>스마트폰 기본 계산기 → 단위 변환 기능 없거나 숨겨져 있음</li>
        <li>단위 변환 앱 따로 설치 → 용량 아까움, 로딩 느림, 광고 많음</li>
        <li>환산표 이미지 저장해두기 → 값이 딱 맞아 떨어지지 않으면 소용없음</li>
      </ul>

      <p className="mb-4">결국 구글에서 매번 검색하는 게 제일 빠른 방법인데, 그것도 여러 단위 동시에 볼 수가 없어서 불편했다.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">그래서 직접 만들었음</h2>

      <p className="mb-3">숫자 하나 넣으면 관련 단위 전부 한 번에 나온다.</p>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">지원 단위 카테고리:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>길이 → 미터, 센티미터, 킬로미터, 인치, 피트, 야드, 마일, 해리</li>
        <li>무게 → 킬로그램, 그램, 파운드, 온스, 톤, 밀리그램</li>
        <li>온도 → 섭씨, 화씨, 켈빈</li>
        <li>넓이 → 제곱미터, 제곱킬로미터, 평, 헥타르, 에이커, 제곱피트</li>
        <li>부피 → 리터, 밀리리터, 갤런, 온스(액체), 컵, 파인트, 쿼트</li>
        <li>속도 → km/h, m/s, mph, 노트</li>
        <li>데이터 → 바이트, 킬로바이트, 메가바이트, 기가바이트, 테라바이트</li>
        <li>압력 → 파스칼, 기압, PSI, mmHg, bar</li>
      </ul>

      <p className="mb-4">예를 들어 길이 카테고리에서 180을 입력하면 cm, feet, inches, m 전부 동시에 나온다. 단위를 바꿔가며 다시 입력할 필요 없음.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">실제로 써보니</h2>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">좋은 점:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>숫자 입력하는 즉시 전체 단위가 동시에 갱신됨 → 계산 버튼 없음</li>
        <li>어느 단위로든 입력 가능 → 피트에 넣어도 되고 미터에 넣어도 됨</li>
        <li>온도 변환이 특히 편함 → 화씨 90도면 섭씨 몇도인지 바로 나옴</li>
        <li>데이터 단위도 있어서 개발할 때도 가끔 씀 → GB를 MB로 얼마나 되는지</li>
        <li>광고 없고 반응 빠름 → 스트레스 없음</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">한계:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>환율 변환은 없음 → 실시간 데이터 필요한 건 제외했음</li>
        <li>단위 즐겨찾기 기능 없음 → 매번 카테고리 탭 직접 클릭해야 함</li>
        <li>변환 히스토리 없음 → 이전 계산 기록 안 남음</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">단위 변환 자주 헷갈리는 것들</h2>

      <p className="mb-3">쓰다 보면 이것들이 제일 많이 쓰임:</p>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">길이</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>1 인치 = 2.54 cm → 키 170cm는 약 5피트 7인치</li>
        <li>1 마일 = 1.609 km → 마라톤 42.195km = 약 26.2마일</li>
        <li>1 피트 = 30.48 cm → 6피트 남자 = 182.88cm</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">무게</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>1 파운드 = 0.4536 kg → 체중 150 lbs = 약 68kg</li>
        <li>1 온스 = 28.35 g → 스테이크 8oz = 약 227g</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">온도</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>°C → °F: (°C × 9/5) + 32</li>
        <li>화씨 98.6°F = 체온 37°C (외울 만함)</li>
        <li>화씨 32°F = 0°C (물 어는 점)</li>
        <li>화씨 212°F = 100°C (물 끓는 점)</li>
      </ul>

      <p className="mb-3">온도 공식은 머릿속에 없어도 됨. 그냥 넣으면 나옴.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">이런 상황에서 진짜 편함</h2>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>해외 직구 → 사이즈 인치→cm, 무게 파운드→kg, 길이 피트→m 한 번에</li>
        <li>해외 레시피 → 컵 단위 → mL, oz → g 변환</li>
        <li>아마존·이베이 상품 스펙 → 치수가 인치로만 나올 때</li>
        <li>넷플릭스 해외 다큐 보다가 → "화씨 104도면 몇 도야?" 이런 순간</li>
        <li>맥북 용량 계산 → GB, MB 빠르게 체크</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">사용법</h2>

      <ol className="space-y-1 mb-4 text-gray-700 dark:text-gray-300 list-decimal list-inside">
        <li>단위 카테고리 탭 선택 (길이, 무게, 온도 등)</li>
        <li>원하는 단위 입력창에 숫자 입력</li>
        <li>다른 단위 결과가 전부 자동으로 나옴</li>
        <li>끝</li>
      </ol>

      <p className="mb-4">클릭 몇 번이면 된다.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">써보기</h2>

      <p className="mb-4">
        <Link href="/tools/unit-converter" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 단위 변환기 바로 가기
        </Link>
      </p>

      <p className="text-gray-600 dark:text-gray-400">설치 없이 브라우저에서 바로 쓸 수 있다. 해외 쇼핑하다 사이즈 헷갈릴 때 북마크해두면 편함.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <p className="text-sm text-gray-500 dark:text-gray-400">
        #단위변환기 #인치cm변환 #파운드kg변환 #화씨섭씨변환 #무료계산기
      </p>
    </article>
  );
}
