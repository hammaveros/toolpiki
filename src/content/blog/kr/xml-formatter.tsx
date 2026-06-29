import Link from 'next/link';

export default function XmlFormatterPost() {
  return (
    <article className="prose prose-gray dark:prose-invert max-w-none">
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">포맷터 · 2026년 7월 7일 · 읽는 시간 4분</p>

      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        한 줄로 뭉쳐진 XML 보기 싫어서 만든 포맷터
      </h1>

      <p className="mb-4">
        <Link href="/tools/xml-formatter" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 XML 포맷터 바로 가기
        </Link>
      </p>

      <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 dark:text-gray-400 mb-6">
        SOAP API 응답이 한 줄로 날라오면 뭐가 뭔지 파악하는 데만 시간이 걸린다.
      </blockquote>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">XML 포맷팅이 필요한 상황</h2>

      <p className="mb-3">생각보다 XML은 아직도 많이 쓰인다:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>SOAP API 응답 디버깅 → 레거시 시스템 연동 시 자주 마주침</li>
        <li>Maven/Gradle pom.xml 편집 → 들여쓰기 망가진 거 정리</li>
        <li>Android 리소스 파일 → AndroidManifest.xml, layout 파일</li>
        <li>RSS/Atom 피드 → 구조 확인</li>
        <li>SVG 파일 편집 → SVG는 XML 기반</li>
        <li>Office Open XML → docx, xlsx 언패킹 후 내부 XML</li>
        <li>Spring 설정 파일 → applicationContext.xml 등</li>
      </ul>

      <p className="mb-4">
        JSON이 대세가 됐지만 XML은 여전히 살아있다. 특히 금융권, 공공기관, 레거시 연동할 때.
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">XML vs JSON 구조 비교</h2>

      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-4 overflow-x-auto">
        <pre className="text-sm text-gray-700 dark:text-gray-300">
{`<!-- 포맷팅 전 (압축된 XML) -->
<root><user id="1"><name>철수</name><age>30</age><address><city>서울</city><district>강남구</district></address></user></root>

<!-- 포맷팅 후 -->
<root>
  <user id="1">
    <name>철수</name>
    <age>30</age>
    <address>
      <city>서울</city>
      <district>강남구</district>
    </address>
  </user>
</root>`}
        </pre>
      </div>

      <p className="mb-4">
        한눈에 구조가 들어오는 차이가 있다.
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">기존 방법의 문제</h2>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>VS Code → XML 파일로 저장 후 포맷팅, 매번 파일 만들기 귀찮음</li>
        <li>IntelliJ IDEA → XML 전용 편집기 있지만 IDE 켜야 함</li>
        <li>온라인 사이트 → 광고 많고, 민감한 XML 데이터 올리기 불안</li>
        <li>xmllint 명령어 → 터미널에서 옵션 외워야 함</li>
      </ul>

      <p className="mb-4">그냥 붙여넣고 정리된 XML 바로 복사할 수 있었으면.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">그래서 만들었음</h2>

      <p className="mb-3">주요 기능:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>XML 자동 들여쓰기 포맷팅</li>
        <li>문법 오류 감지 및 위치 표시</li>
        <li>XML 압축 (공백 제거, 배포용)</li>
        <li>들여쓰기 크기 선택 (2칸, 4칸)</li>
        <li>결과 복사 버튼</li>
        <li>XML 구조 트리 뷰 (옵션)</li>
      </ul>

      <p className="mb-3">추가 기능:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>XML 문법 검증 (Well-formed 체크)</li>
        <li>네임스페이스 있는 XML도 처리</li>
        <li>CDATA 섹션 유지</li>
        <li>주석 유지 옵션</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">SOAP API 디버깅 예시</h2>

      <p className="mb-3">실제로 자주 보이는 SOAP 응답 형태:</p>

      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-4 overflow-x-auto">
        <pre className="text-sm text-gray-700 dark:text-gray-300">
{`<?xml version="1.0" encoding="UTF-8"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <GetUserResponse>
      <User>
        <UserId>12345</UserId>
        <UserName>홍길동</UserName>
        <Email>hong@example.com</Email>
      </User>
    </GetUserResponse>
  </soap:Body>
</soap:Envelope>`}
        </pre>
      </div>

      <p className="mb-4">
        압축된 채로 오면 soap:Body 안에 뭐가 들어있는지 한눈에 안 보인다.
        포맷팅하면 구조가 바로 파악된다.
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">실제로 써보니</h2>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">좋은 점:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>붙여넣자마자 포맷팅 → 버튼 누를 필요 없음</li>
        <li>XML 문법 오류 있으면 어디서 틀렸는지 바로 알려줌</li>
        <li>SOAP, Maven, Android 등 다양한 XML 형식 모두 됨</li>
        <li>압축 기능도 있어서 배포 전 minify할 때도 활용</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">한계:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>스키마 검증(XSD)은 없음</li>
        <li>XSLT 변환 기능은 없음</li>
        <li>XPath 쿼리 기능은 별도 도구 필요</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">사용법</h2>

      <ol className="space-y-1 mb-4 text-gray-700 dark:text-gray-300 list-decimal list-inside">
        <li>XML 붙여넣기</li>
        <li>자동으로 포맷팅됨</li>
        <li>복사 버튼으로 가져가기</li>
      </ol>

      <p className="mb-4">5초면 됨.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">써보기</h2>

      <p className="mb-4">
        <Link href="/tools/xml-formatter" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 XML 포맷터 바로 가기
        </Link>
      </p>

      <p className="text-gray-600 dark:text-gray-400">
        SOAP API 연동하거나 레거시 시스템 디버깅할 때 유용하다.
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <p className="text-sm text-gray-500 dark:text-gray-400">
        #XML포맷터 #SOAPAPI #XML정리 #개발도구 #레거시연동
      </p>
    </article>
  );
}
