import Link from 'next/link';

export default function HexViewerPost() {
  return (
    <article className="prose prose-gray dark:prose-invert max-w-none">
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">인코딩 · 2026년 7월 5일 · 읽는 시간 4분</p>

      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        16진수로 텍스트 보기, 바이트 단위로 뭔가 확인해야 할 때 썼음
      </h1>

      <p className="mb-4">
        <Link href="/tools/hex-viewer" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 HEX 뷰어 바로 가기
        </Link>
      </p>

      <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 dark:text-gray-400 mb-6">
        파일 헤더를 확인하려는데, 텍스트 에디터로는 안 보이고 HEX 에디터를 설치하기는 귀찮다.
      </blockquote>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">HEX 뷰어가 필요한 상황</h2>

      <p className="mb-3">개발이나 디버깅할 때 바이트 단위 확인이 필요할 때:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>파일 시그니처(magic bytes) 확인 → 파일 형식 판별</li>
        <li>인코딩 문제 디버깅 → 깨진 문자의 실제 바이트 확인</li>
        <li>네트워크 패킷 내용 → 바이트 단위 분석</li>
        <li>바이너리 프로토콜 → 데이터 구조 파악</li>
        <li>텍스트 파일 BOM 확인 → UTF-8 BOM 여부</li>
        <li>해시/암호화 → 원시 바이트 값 확인</li>
      </ul>

      <p className="mb-4">HEX 에디터는 설치형이라 간단한 확인에는 과하다. 그냥 붙여넣기로 확인하고 싶었다.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">HEX 뷰가 뭔지</h2>

      <p className="mb-3">전통적인 HEX 덤프 형식이다:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li><strong>왼쪽</strong> → 오프셋(주소, 16진수)</li>
        <li><strong>가운데</strong> → 16진수 바이트 값 (보통 16바이트씩 한 줄)</li>
        <li><strong>오른쪽</strong> → ASCII 표현 (출력 불가능한 문자는 . 으로)</li>
      </ul>

      <p className="mb-3">예시:</p>

      <p className="mb-3 font-mono text-sm bg-gray-100 dark:bg-gray-800 p-3 rounded">
        00000000: 4865 6c6c 6f20 576f 726c 6421 0a    Hello World!.
      </p>

      <p className="mb-4">왼쪽이 오프셋(00000000), 가운데가 HEX값, 오른쪽이 ASCII 문자다. 줄바꿈(0A)은 출력 불가능해서 점(.)으로 표시된다.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">그래서 만들었음</h2>

      <p className="mb-3">텍스트 붙여넣으면 HEX 형식으로 보여준다:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>오프셋 + HEX값 + ASCII 3단 표시</li>
        <li>줄당 바이트 수 설정 → 8, 16, 32바이트</li>
        <li>인코딩 선택 → UTF-8, EUC-KR, ASCII 등</li>
        <li>오프셋 표시 형식 → 10진수/16진수</li>
        <li>특정 HEX값 검색 → 위치 하이라이트</li>
        <li>HEX → 텍스트 역방향 변환</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">파일 시그니처 (매직 바이트)</h2>

      <p className="mb-3">파일 첫 몇 바이트로 형식을 알 수 있다:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li><strong>FF D8 FF</strong> → JPEG 이미지</li>
        <li><strong>89 50 4E 47</strong> → PNG 이미지 (‰PNG)</li>
        <li><strong>47 49 46 38</strong> → GIF 이미지 (GIF8)</li>
        <li><strong>25 50 44 46</strong> → PDF 파일 (%PDF)</li>
        <li><strong>50 4B 03 04</strong> → ZIP/DOCX/XLSX 등 (PK..)</li>
        <li><strong>EF BB BF</strong> → UTF-8 BOM (바이트 순서 표시)</li>
        <li><strong>FF FE</strong> → UTF-16 LE BOM</li>
      </ul>

      <p className="mb-4">파일 확장자를 바꿔도 이 시그니처는 바뀌지 않아서 실제 파일 형식 확인에 쓴다.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">UTF-8 BOM 문제</h2>

      <p className="mb-3">실제로 꽤 자주 만나는 문제다:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>Windows 메모장 저장 → UTF-8 BOM(EF BB BF) 자동 추가</li>
        <li>이 파일을 Linux 서버에 올리면 → 첫 줄에 이상한 문자 보임</li>
        <li>셸 스크립트 첫 줄에 BOM → 스크립트 실행 안 됨</li>
        <li>CSV 파일에 BOM → 엑셀에서는 괜찮은데 파이썬 파싱 문제</li>
      </ul>

      <p className="mb-4">HEX 뷰어로 파일 시작 부분 확인하면 BOM 여부를 바로 알 수 있다.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">실제로 써보니</h2>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">좋은 점:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>설치 없이 바로 확인 → 간단한 디버깅에 충분</li>
        <li>오프셋 + HEX + ASCII 3단 표시 → 전통적인 HEX 뷰 형식</li>
        <li>인코딩 선택 → 한글 처리 방식 확인 가능</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">한계:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>실제 바이너리 파일 분석 → 바이너리 직접 입력이 어렵고 텍스트 입력이 기본</li>
        <li>대용량 데이터는 느릴 수 있음</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">사용법</h2>

      <ol className="space-y-1 mb-4 text-gray-700 dark:text-gray-300 list-decimal list-inside">
        <li>텍스트 또는 HEX 값 붙여넣기</li>
        <li>인코딩, 줄당 바이트 수 설정</li>
        <li>HEX 뷰 확인</li>
        <li>끝</li>
      </ol>

      <p className="mb-4">즉시 변환된다.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">써보기</h2>

      <p className="mb-4">
        <Link href="/tools/hex-viewer" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 HEX 뷰어 바로 가기
        </Link>
      </p>

      <p className="text-gray-600 dark:text-gray-400">회원가입 없이 바로 쓸 수 있다.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <p className="text-sm text-gray-500 dark:text-gray-400">
        #HEX뷰어 #16진수뷰 #바이트분석 #파일시그니처 #인코딩디버깅 #개발도구
      </p>
    </article>
  );
}
