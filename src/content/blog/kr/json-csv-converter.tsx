import Link from 'next/link';

export default function JsonCsvConverterPost() {
  return (
    <article className="prose prose-gray dark:prose-invert max-w-none">
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">변환기 · 2026년 7월 7일 · 읽는 시간 4분</p>

      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        API 데이터를 엑셀로 넘길 때마다 귀찮아서 만든 변환기
      </h1>

      <p className="mb-4">
        <Link href="/tools/json-csv-converter" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 JSON↔CSV 변환기 바로 가기
        </Link>
      </p>

      <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 dark:text-gray-400 mb-6">
        API에서 JSON으로 가져온 데이터를 기획팀에서 엑셀로 달라고 한다.
      </blockquote>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">JSON↔CSV 변환이 필요한 상황</h2>

      <p className="mb-3">개발하다 보면 꽤 자주 나온다:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>API 응답 데이터 → 기획/마케팅팀에 엑셀로 공유</li>
        <li>DB 쿼리 결과 JSON → CSV로 변환 후 분석</li>
        <li>엑셀 데이터(CSV) → 백엔드 API에 올릴 JSON으로</li>
        <li>테스트 데이터 만들기 → CSV로 작성 후 JSON으로 변환해서 시드</li>
        <li>로그 데이터 → CSV로 내보내서 스프레드시트에서 필터링</li>
      </ul>

      <p className="mb-4">
        특히 "이 데이터 엑셀로 줄 수 있어요?" 요청이 갑자기 들어올 때, 빠르게 변환할 방법이 필요하다.
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">JSON 배열과 CSV 구조 비교</h2>

      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-4 overflow-x-auto">
        <pre className="text-sm text-gray-700 dark:text-gray-300">
{`// JSON 배열
[
  {"name": "철수", "age": 30, "city": "서울"},
  {"name": "영희", "age": 25, "city": "부산"},
  {"name": "민수", "age": 28, "city": "대전"}
]

// → CSV로 변환
name,age,city
철수,30,서울
영희,25,부산
민수,28,대전`}
        </pre>
      </div>

      <p className="mb-4">
        구조가 단순할 때는 직관적이다. 문제는 중첩된 객체나 배열 값이 있을 때인데,
        이럴 때는 어떻게 처리할지 결정해야 한다.
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">기존 방법의 문제</h2>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>Python pandas → 라이브러리 설치, 코드 짜기, 실행 환경 필요</li>
        <li>Node.js 스크립트 → json2csv 같은 패키지 써야 함</li>
        <li>Excel 직접 → JSON 붙여넣기 불가, 일일이 입력</li>
        <li>온라인 사이트 → 데이터 보안 걱정, 광고 범벅</li>
      </ul>

      <p className="mb-4">
        JSON 100줄짜리 변환하려고 파이썬 환경 세팅하는 건 너무 오버다.
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">그래서 만들었음</h2>

      <p className="mb-3">주요 기능:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>JSON 배열 → CSV 변환 (헤더 자동 생성)</li>
        <li>CSV → JSON 배열 변환</li>
        <li>중첩 객체 → 점 표기법으로 평탄화 (user.name 같은 형태)</li>
        <li>쉼표 포함된 값 자동으로 따옴표 처리</li>
        <li>결과 복사 / 다운로드</li>
        <li>구분자 선택 (쉼표, 탭, 세미콜론)</li>
      </ul>

      <p className="mb-3">CSV → JSON 변환도 됨:</p>

      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-4 overflow-x-auto">
        <pre className="text-sm text-gray-700 dark:text-gray-300">
{`// CSV 입력
id,product,price,in_stock
1,노트북,1500000,true
2,마우스,35000,true
3,키보드,89000,false

// → JSON 변환
[
  {"id": "1", "product": "노트북", "price": "1500000", "in_stock": "true"},
  {"id": "2", "product": "마우스", "price": "35000", "in_stock": "true"},
  {"id": "3", "product": "키보드", "price": "89000", "in_stock": "false"}
]`}
        </pre>
      </div>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">주의사항</h2>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>CSV는 타입 정보가 없음 → 숫자도 문자열로 변환됨</li>
        <li>중첩이 깊은 JSON → 평탄화 후 컬럼 수가 많아질 수 있음</li>
        <li>배열 값 (예: tags: [&quot;a&quot;, &quot;b&quot;]) → 단순 변환 시 문자열로 직렬화됨</li>
        <li>한글 포함 CSV → Excel에서 열 때 UTF-8 BOM 설정 필요할 수 있음</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">실제로 써보니</h2>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">좋은 점:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>브라우저에서만 처리 → 민감한 데이터도 업로드 걱정 없음</li>
        <li>양방향 변환 → JSON→CSV, CSV→JSON 모두</li>
        <li>헤더 자동 생성 → 첫 번째 객체의 키를 헤더로</li>
        <li>CSV 다운로드 버튼 → 바로 파일로 저장 가능</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">한계:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>복잡하게 중첩된 JSON 구조는 완벽하게 CSV로 표현 불가</li>
        <li>수백만 행 데이터는 느릴 수 있음</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">사용법</h2>

      <ol className="space-y-1 mb-4 text-gray-700 dark:text-gray-300 list-decimal list-inside">
        <li>JSON 또는 CSV 붙여넣기</li>
        <li>변환 방향 선택 (JSON→CSV 또는 CSV→JSON)</li>
        <li>결과 확인 후 복사 또는 다운로드</li>
      </ol>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">써보기</h2>

      <p className="mb-4">
        <Link href="/tools/json-csv-converter" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 JSON↔CSV 변환기 바로 가기
        </Link>
      </p>

      <p className="text-gray-600 dark:text-gray-400">
        기획팀 데이터 공유 요청 올 때 빠르게 처리할 수 있음.
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <p className="text-sm text-gray-500 dark:text-gray-400">
        #JSON변환 #CSV변환 #데이터변환 #엑셀변환 #개발도구
      </p>
    </article>
  );
}
