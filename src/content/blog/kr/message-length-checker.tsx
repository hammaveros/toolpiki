import Link from 'next/link';

export default function MessageLengthCheckerPost() {
  return (
    <article className="prose prose-gray dark:prose-invert max-w-none">
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">텍스트 · 2026년 7월 2일 · 읽는 시간 4분</p>

      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        SMS 단문/장문 기준, 카카오톡 바이트 제한 매번 헷갈렸음
      </h1>

      <p className="mb-4">
        <Link href="/tools/message-length-checker" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 메시지 길이 확인기 바로 가기
        </Link>
      </p>

      <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 dark:text-gray-400 mb-6">
        문자 마케팅 메시지 작성 중인데, 단문으로 보내야 요금이 절약되는데 기준이 몇 바이트인지 헷갈린다.
      </blockquote>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">메시지 길이가 중요한 이유</h2>

      <p className="mb-3">SMS/MMS 발송 시 요금이 달라진다:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li><strong>단문(SMS)</strong> → 한글 45자 이하 (90바이트) → 저렴</li>
        <li><strong>장문(LMS)</strong> → 한글 46~2,000자 (91~4,000바이트) → 더 비쌈</li>
        <li><strong>MMS</strong> → 이미지/파일 첨부 → 가장 비쌈</li>
        <li>카카오톡 알림톡 → 1,000자 제한</li>
        <li>트위터/X → 280자 제한</li>
        <li>인스타그램 캡션 → 2,200자 제한</li>
      </ul>

      <p className="mb-4">한 글자 차이로 단문에서 장문으로 넘어가면 발송 비용이 올라간다. 대량 발송이면 차이가 꽤 크다.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">한글 바이트 계산이 복잡한 이유</h2>

      <p className="mb-3">한글은 영문과 바이트 수가 다르다:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li><strong>영문/숫자/기호</strong> → 1자 = 1바이트</li>
        <li><strong>한글</strong> → 1자 = 2바이트 (EUC-KR 기준) 또는 3바이트 (UTF-8 기준)</li>
        <li>SMS 표준에서는 EUC-KR 기준 → 한글 1자 = 2바이트</li>
        <li>한글 45자 = 90바이트 = 단문 상한선</li>
      </ul>

      <p className="mb-3">글자수와 바이트수가 다르기 때문에:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>한글만 있으면 → 45자 = 90바이트 (단문 한계)</li>
        <li>영문만 있으면 → 90자 = 90바이트 (단문 한계)</li>
        <li>혼합이면 → 계산이 복잡해짐</li>
      </ul>

      <p className="mb-4">글자수 세기로는 정확한 바이트 계산이 안 된다.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">그래서 만들었음</h2>

      <p className="mb-3">메시지 입력하면 바이트 수와 SMS 구분을 바로 보여준다:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>글자수 (공백 포함/제외)</li>
        <li>바이트수 (EUC-KR 기준)</li>
        <li>SMS/LMS/MMS 자동 판단</li>
        <li>단문 한도까지 남은 바이트 수</li>
        <li>플랫폼별 제한 비교 → 트위터, 인스타그램, 카카오 기준</li>
      </ul>

      <p className="mb-3">색상으로 상태 표시:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li><strong>초록</strong> → 단문 범위 내</li>
        <li><strong>노랑</strong> → 단문 한도 근접</li>
        <li><strong>빨강</strong> → 장문으로 넘어감</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">플랫폼별 메시지 제한 정리</h2>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li><strong>SMS 단문</strong> → 90바이트 (한글 45자, 영문 90자)</li>
        <li><strong>SMS 장문(LMS)</strong> → 최대 4,000바이트 (한글 약 2,000자)</li>
        <li><strong>카카오톡 알림톡</strong> → 1,000자</li>
        <li><strong>카카오톡 친구톡</strong> → 1,000자</li>
        <li><strong>트위터/X</strong> → 280자</li>
        <li><strong>인스타그램 캡션</strong> → 2,200자</li>
        <li><strong>네이버 블로그 제목</strong> → 100자</li>
        <li><strong>이메일 제목줄</strong> → 권장 60자 이하</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">실제로 써보니</h2>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">좋은 점:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>입력과 동시에 바이트 수 실시간 표시</li>
        <li>단문/장문 자동 판단 → 요금 예측 쉬움</li>
        <li>플랫폼별 한도와 비교 한 화면에서 확인</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">한계:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>통신사마다 실제 요금 기준이 미세하게 다를 수 있음</li>
        <li>이모지 바이트 계산은 상황에 따라 다름 → 참고용으로만</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">사용법</h2>

      <ol className="space-y-1 mb-4 text-gray-700 dark:text-gray-300 list-decimal list-inside">
        <li>메시지 입력하거나 붙여넣기</li>
        <li>바이트 수와 SMS 구분 확인</li>
        <li>필요하면 메시지 줄여서 단문 범위 맞추기</li>
        <li>끝</li>
      </ol>

      <p className="mb-4">실시간으로 반영된다.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">써보기</h2>

      <p className="mb-4">
        <Link href="/tools/message-length-checker" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 메시지 길이 확인기 바로 가기
        </Link>
      </p>

      <p className="text-gray-600 dark:text-gray-400">회원가입 없이 바로 쓸 수 있다.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <p className="text-sm text-gray-500 dark:text-gray-400">
        #SMS글자수 #문자바이트 #단문장문기준 #카카오톡글자수 #메시지길이 #문자발송
      </p>
    </article>
  );
}
