import Link from 'next/link';

export default function FakeDataGeneratorPost() {
  return (
    <article className="prose prose-gray dark:prose-invert max-w-none">
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">계산기 · 2026년 7월 24일 · 읽는 시간 4분</p>

      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        API 테스트할 때마다 가짜 이름 100개 직접 치다가 결국 만든 더미 데이터 생성기
      </h1>

      <p className="mb-4">
        <Link href="/tools/fake-data-generator" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 가짜 더미 데이터 생성기 바로 가기
        </Link>
      </p>

      <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 dark:text-gray-400 mb-6">
        개발 서버에 테스트 데이터 넣어야 하는데 진짜 이름/이메일 쓰기엔 좀 찜찜하고, 매번 "홍길동1", "홍길동2" 치기엔 너무 비효율적.
      </blockquote>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">언제 필요한지</h2>

      <p className="mb-3">개발하다 보면 생각보다 자주 이런 상황이 온다:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>회원 목록 UI 개발 → 더미 유저 50명 필요한데 손으로 입력하기 귀찮음</li>
        <li>API 부하 테스트 → 실제처럼 보이는 데이터 1000건 필요</li>
        <li>DB 시딩 → 로컬 환경에 테스트 데이터 채워야 할 때</li>
        <li>프론트 목업 → 디자인 검토용 화면에 의미 있는 데이터 넣고 싶을 때</li>
        <li>스크린샷, 데모 → "홍길동", "테스트유저" 같은 이름 쓰기 민망한 발표 자료</li>
        <li>이메일 발송 테스트 → 존재하지 않는 이메일 주소가 필요할 때</li>
        <li>주소 유효성 검증 → 그럴듯한 주소 형식의 데이터 여러 개 필요</li>
        <li>개인정보 마스킹 테스트 → 실제 개인정보 대신 쓸 수 있는 가짜 데이터</li>
      </ul>

      <p className="mb-4">특히 개인정보 처리 기능 개발할 때 진짜 사람 이름이나 전화번호 쓰는 건 GDPR, 개인정보보호법 관점에서도 좋지 않음. 그렇다고 "홍길동01", "홍길동02" 식으로 쓰면 UI가 너무 가짜처럼 보여서 실제 검토가 어렵고.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">기존 방법의 문제</h2>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>Faker.js 직접 설치 → 라이브러리 설치에 스크립트 작성까지 해야 함, 간단한 테스트에 오버스펙</li>
        <li>외국 사이트 (generatedata.com 등) → 영어 데이터만 나옴, 한국 이름/주소/전화번호 형식이 아님</li>
        <li>ChatGPT한테 부탁 → "김민준, 이서연, 박지훈..." 20개 나오면 끝, 100개 달라 하면 질 떨어짐</li>
        <li>엑셀 함수로 만들기 → RANDBETWEEN 조합해서 만들 순 있는데 세팅이 진짜 귀찮음</li>
        <li>직접 타이핑 → 이건 말도 안 됨, 20개만 넘어가도 손목이 반란을 일으킴</li>
        <li>실제 데이터 복붙 → 개인정보 문제 있고, 팀원한테 공유도 못함</li>
      </ul>

      <p className="mb-4">결국 매번 "홍길동1~홍길동50" 같은 말도 안 되는 데이터로 개발하게 됨. 나중에 스크린샷 공유하면 항상 "왜 이름이 다 홍길동이에요?" 소리 들음.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">그래서 직접 만들었음</h2>

      <p className="mb-3">원하는 필드 선택하고 개수 입력하면 바로 생성.</p>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">생성 가능한 데이터 종류:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>이름 → 한국식 성+이름, 자연스러운 조합으로 생성</li>
        <li>이메일 → example.com, test.com 등 테스트용 도메인</li>
        <li>전화번호 → 010-XXXX-XXXX 형식</li>
        <li>주소 → 서울, 경기, 부산 등 실제 지역명 기반</li>
        <li>생년월일 → 연령대 범위 지정 가능</li>
        <li>UUID → 고유 식별자 필요할 때</li>
        <li>숫자 → 범위 지정해서 랜덤 정수/실수 생성</li>
        <li>텍스트 → 로렘 입숨 스타일 더미 문장</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">출력 형식:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>JSON 배열 → API 응답 형식 그대로 복붙 가능</li>
        <li>CSV → 엑셀이나 DB import에 바로 사용</li>
        <li>SQL INSERT → DB에 직접 넣을 쿼리 형태로 출력</li>
        <li>텍스트 목록 → 줄바꿈 구분, 가장 단순한 형태</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">편의 기능:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>생성 개수 설정 → 1~1000개 범위에서 자유롭게</li>
        <li>필드 조합 → 이름+이메일+전화번호 같이 여러 필드 동시 생성</li>
        <li>결과 복사 → 버튼 하나로 클립보드에 전체 복사</li>
        <li>재생성 → 같은 설정으로 다른 데이터 다시 뽑기</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">실제로 써보니</h2>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">좋은 점:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>설치 없이 브라우저에서 바로 실행 → 작업 환경 안 가림</li>
        <li>한국어 데이터 → 이름, 주소가 실제처럼 보임, 데모나 발표에도 쓸 만함</li>
        <li>JSON 출력 → 코드에 그냥 복붙 가능, 파싱 따로 안 해도 됨</li>
        <li>대량 생성 → 1000건도 1~2초면 끝남</li>
        <li>필드 조합 자유 → 필요한 것만 선택해서 맞춤 구성 가능</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">한계:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>커스텀 스키마 없음 → 특수한 데이터 구조는 직접 가공 필요</li>
        <li>관계형 데이터 없음 → 유저-주문 같은 연결된 데이터는 못 만듦</li>
        <li>저장 기능 없음 → 매번 재생성하거나 로컬에 복붙해서 저장해야 함</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">실전 활용 패턴</h2>

      <p className="mb-3">이렇게 쓰면 편함:</p>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">회원 목록 UI 개발할 때</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>이름 + 이메일 + 전화번호 필드 선택</li>
        <li>50개 생성, JSON 형식으로 출력</li>
        <li>코드에 붙여넣기 → 바로 렌더링 확인 가능</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">DB 초기 세팅할 때</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>필요한 컬럼 필드 선택</li>
        <li>SQL INSERT 형식으로 출력</li>
        <li>복붙해서 DB 클라이언트에서 바로 실행</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">발표 자료 스크린샷 찍을 때</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>이름 10~20개 생성</li>
        <li>자연스러워 보이는 한국 이름으로 화면 채우기</li>
        <li>"홍길동" 반복 없이 실제처럼 보이는 데모 화면 완성</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">개인정보 걱정 없는 이유</h2>

      <p className="mb-3">이 도구가 생성하는 데이터는 완전히 랜덤으로 만들어진 가짜다. 실존하는 사람의 정보가 아님.</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>이름 → 성씨 풀 + 이름 풀에서 조합, 실존 인물 아님</li>
        <li>이메일 → @example.com, @test.kr 같은 예약된 테스트 도메인 사용</li>
        <li>전화번호 → 010 번호 형식이지만 실제 개통된 번호가 아님</li>
        <li>주소 → 실제 지역명 + 더미 번지수 조합</li>
      </ul>

      <p className="mb-4">개발 중 로그에 찍히거나 팀원이 보게 되더라도 개인정보 유출 걱정이 없음. 테스트 환경에서 안전하게 쓸 수 있는 이유.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">사용법</h2>

      <ol className="space-y-1 mb-4 text-gray-700 dark:text-gray-300 list-decimal list-inside">
        <li>필요한 데이터 필드 선택 (이름, 이메일, 전화번호 등)</li>
        <li>생성 개수 입력</li>
        <li>출력 형식 선택 (JSON, CSV, SQL 등)</li>
        <li>생성 버튼 클릭</li>
        <li>결과 복사해서 코드/DB에 붙여넣기</li>
      </ol>

      <p className="mb-4">30초면 더미 데이터 100건 준비 끝난다.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">써보기</h2>

      <p className="mb-4">
        <Link href="/tools/fake-data-generator" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 가짜 더미 데이터 생성기 바로 가기
        </Link>
      </p>

      <p className="text-gray-600 dark:text-gray-400">다음에 "홍길동1~홍길동100" 치고 있는 자신을 발견하면 이거 쓰면 됨. 설치 없이 브라우저에서 바로 된다.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <p className="text-sm text-gray-500 dark:text-gray-400">
        #더미데이터생성기 #가짜데이터 #테스트데이터 #개발도구 #API테스트 #DB시딩 #목업데이터
      </p>
    </article>
  );
}
