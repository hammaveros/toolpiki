import Link from 'next/link';

export default function InvoiceGeneratorPost() {
  return (
    <article className="prose prose-gray dark:prose-invert max-w-none">
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">계산기 · 2026년 7월 25일 · 읽는 시간 4분</p>

      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        프리랜서 첫 달 인보이스를 워드로 만들다가 포맷 다 틀렸던 썰
      </h1>

      <p className="mb-4">
        <Link href="/tools/invoice-generator" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 인보이스/청구서 생성기 바로 가기
        </Link>
      </p>

      <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 dark:text-gray-400 mb-6">
        프리랜서 시작하면서 가장 막막한 게 인보이스였음. 어떻게 생겨야 하는지조차 몰랐고, 그냥 워드로 만들었다가 거래처에서 다시 보내달라는 연락 받았음.
      </blockquote>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">언제 필요한지</h2>

      <p className="mb-3">생각보다 인보이스 발행이 필요한 상황이 많다:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>프리랜서 첫 계약 완료 → 돈 받으려면 청구서가 필요한데 양식을 모름</li>
        <li>외주 단발 작업 → 세금계산서 발행하기엔 규모가 애매할 때</li>
        <li>소규모 스튜디오 → 거래처마다 요구하는 양식이 달라서 헷갈릴 때</li>
        <li>해외 클라이언트 → 영문 인보이스가 필요한데 형식을 잘 모를 때</li>
        <li>스타트업 창업 초기 → 회계 시스템 세팅 전에 일단 청구서 보내야 할 때</li>
        <li>강의/컨설팅 수수료 → 정기 청구를 빠르게 처리하고 싶을 때</li>
        <li>리셀러/위탁 판매 → 거래 내역을 정리한 청구서 필요</li>
        <li>이벤트/용역 → 행사 끝나고 비용 정산서 발행</li>
      </ul>

      <p className="mb-4">특히 프리랜서를 막 시작한 사람들은 인보이스 형식 자체가 낯설다. 무슨 항목이 들어가야 하는지, 번호를 어떻게 매기는지, 세금은 어떻게 표시하는지 하나도 모르는 상태에서 첫 청구를 해야 하는 상황이 옴.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">기존 방법의 문제</h2>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>워드/한글로 직접 만들기 → 표 정렬 맞추는 데 30분, 계산 직접 해야 함, 오류 생기기 쉬움</li>
        <li>엑셀 양식 다운로드 → 버전마다 레이아웃이 다 다름, 수식이 깨져 있는 경우 많음</li>
        <li>유료 인보이스 서비스 → 월정액 내야 하는데 한 달에 1~2건밖에 안 씀</li>
        <li>회계 프로그램 → 세팅이 복잡하고 인보이스 하나 발행하는 데 학습 비용이 큼</li>
        <li>무료 온라인 서비스 → 영어 인터페이스라 불편하거나, 워터마크 붙거나, 이메일 가입 요구</li>
        <li>거래처 양식 요청 → 매번 다른 형식 쓰다 보면 내가 발행한 청구서 관리가 안 됨</li>
      </ul>

      <p className="mb-4">결국 처음엔 그냥 워드로 만들었다가 항목 누락, 합계 오류 때문에 거래처에서 다시 보내달라는 연락 받는 경우가 생김. 한 번 겪고 나면 제대로 된 도구 쓰고 싶어짐.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">그래서 직접 만들었음</h2>

      <p className="mb-3">항목 입력하면 자동으로 계산해서 바로 PDF로 뽑을 수 있게.</p>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">기본 정보 입력:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>발행인 정보 → 이름/상호, 주소, 연락처, 사업자번호 (선택)</li>
        <li>수신인 정보 → 거래처명, 담당자, 주소</li>
        <li>인보이스 번호 → 자동 생성 또는 직접 입력</li>
        <li>발행일/지급기한 → 캘린더로 선택</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">항목 입력:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>품목명, 수량, 단가 입력 → 금액 자동 계산</li>
        <li>항목 여러 개 추가 가능 → 복잡한 청구도 한 번에</li>
        <li>할인 적용 → 금액 또는 퍼센트로</li>
        <li>세금 설정 → VAT 10%, 원천세 등 선택 가능</li>
        <li>합계 자동 계산 → 소계, 세금, 최종 금액 실시간 반영</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">출력/공유:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>PDF 다운로드 → 거래처에 파일로 전달</li>
        <li>인쇄 → 종이 청구서 필요할 때</li>
        <li>이메일 발송 → 직접 발송 가능 (일부 기능)</li>
        <li>링크 공유 → 온라인으로 바로 전달</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">실제로 써보니</h2>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">좋은 점:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>합계 자동 계산 → 수동 계산 실수 없음, 신뢰도 올라감</li>
        <li>VAT 자동 반영 → 10% 버튼 하나로 세금 포함 금액 바로 계산</li>
        <li>PDF 출력 깔끔함 → 워드로 만든 것보다 훨씬 전문적으로 보임</li>
        <li>빠름 → 항목 3~4개짜리 인보이스는 5분 안에 완성</li>
        <li>가입 불필요 → 바로 쓸 수 있음</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">한계:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>발행 이력 저장 없음 → 매번 새로 작성해야 함, 과거 청구 기록 관리 불가</li>
        <li>반복 청구 자동화 없음 → 고정 거래처에 매달 같은 양식 보내려면 매번 입력</li>
        <li>회계 연동 없음 → 전문 회계 소프트웨어와 연결은 안 됨</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">인보이스에 꼭 들어가야 하는 항목</h2>

      <p className="mb-3">처음 만들 때 뭘 넣어야 하는지 몰랐던 것들 정리:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li><strong>인보이스 번호</strong> → 고유 번호, 나중에 추적/관리용. 연도-월-순번 형식 많이 씀 (예: 2026-07-001)</li>
        <li><strong>발행일 & 지급기한</strong> → 언제 발행했고 언제까지 입금해야 하는지. 지급기한 안 쓰면 늦게 줘도 할 말 없음</li>
        <li><strong>발행인 정보</strong> → 내 이름(상호), 주소, 연락처. 사업자면 사업자번호도</li>
        <li><strong>수신인 정보</strong> → 거래처명, 담당자 이름</li>
        <li><strong>품목 내역</strong> → 무슨 작업인지, 수량, 단가, 금액</li>
        <li><strong>소계 / 세금 / 최종 합계</strong> → 세금 별도인지 포함인지 명확하게</li>
        <li><strong>입금 계좌</strong> → 은행명, 계좌번호, 예금주</li>
      </ul>

      <p className="mb-4">이거 하나라도 빠지면 거래처에서 다시 요청하는 경우 있음. 특히 지급기한이랑 계좌번호는 진짜 자주 빠뜨림.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">세금 관련 헷갈리는 부분</h2>

      <p className="mb-3">프리랜서/프리에이전서가 가장 많이 헷갈려 하는 게 세금 부분:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li><strong>부가세 (VAT) 10%</strong> → 일반과세자면 공급가액에 10% 추가. "공급가액 100만원 + VAT 10만원 = 110만원" 형태</li>
        <li><strong>면세 사업자</strong> → 부가세 없음. 인적용역(작가, 강사 등) 일부 해당</li>
        <li><strong>원천세</strong> → 거래처가 대신 납부하는 세금. 사업소득이면 3.3% 원천징수됨. 이 경우 "110만원 청구 → 원천세 3.63만원 차감 → 106.37만원 수령"</li>
        <li><strong>간이과세자</strong> → 부가세가 다름. 간이과세자면 따로 확인 필요</li>
      </ul>

      <p className="mb-4">헷갈리면 거래처 담당자한테 "세금계산서 필요한지, 원천세 적용인지" 먼저 물어보는 게 제일 확실함.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">사용법</h2>

      <ol className="space-y-1 mb-4 text-gray-700 dark:text-gray-300 list-decimal list-inside">
        <li>발행인 정보 입력 (내 이름, 연락처)</li>
        <li>수신인 정보 입력 (거래처)</li>
        <li>발행일, 지급기한 선택</li>
        <li>품목 항목 추가 (품목명, 수량, 단가)</li>
        <li>세금 설정 (VAT 포함 여부)</li>
        <li>입금 계좌 입력</li>
        <li>PDF 다운로드 또는 인쇄</li>
      </ol>

      <p className="mb-4">처음 쓰면 5~10분, 익숙해지면 3분이면 됨.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">써보기</h2>

      <p className="mb-4">
        <Link href="/tools/invoice-generator" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 인보이스/청구서 생성기 바로 가기
        </Link>
      </p>

      <p className="text-gray-600 dark:text-gray-400">워드 표 씨름하는 시간에 인보이스 세 장 뽑을 수 있다. 가입 없이 바로 쓰면 됨.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <p className="text-sm text-gray-500 dark:text-gray-400">
        #인보이스생성기 #청구서만들기 #프리랜서도구 #세금계산서 #VAT계산 #프리랜서정산
      </p>
    </article>
  );
}
