import Link from 'next/link';

export default function ProtobufDecoderPost() {
  return (
    <article className="prose prose-gray dark:prose-invert max-w-none">
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">인코딩 · 2026년 7월 12일 · 읽는 시간 5분</p>

      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        Protobuf 바이너리 데이터, 눈으로 읽어야 할 때
      </h1>

      <p className="mb-4">
        <Link href="/tools/protobuf-decoder" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 Protobuf 디코더 바로 가기
        </Link>
      </p>

      <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 dark:text-gray-400 mb-6">
        gRPC API 응답값을 로그로 찍어봤는데 바이너리라 읽을 수가 없다. proto 파일 없이 빠르게 확인할 방법이 없나.
      </blockquote>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Protobuf 디코딩이 필요한 상황</h2>

      <p className="mb-3">주로 개발 중 디버깅할 때 필요하다.</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>gRPC 응답값 확인 → 바이너리라 그냥 보면 알 수 없음</li>
        <li>API 로그 분석 → Protobuf로 직렬화된 데이터 파싱</li>
        <li>네트워크 패킷 분석 → Wireshark 캡처에서 Protobuf 페이로드</li>
        <li>레거시 코드 분석 → .proto 파일 없이 기존 데이터 구조 파악</li>
        <li>모바일 앱 디버깅 → 클라이언트 ↔ 서버 Protobuf 메시지 확인</li>
      </ul>

      <p className="mb-4">Protobuf는 JSON보다 작고 빠르지만, 그냥 눈으로 읽으면 깨진 문자만 보인다. 로컬에서 빠르게 확인하고 싶을 때마다 protoc 설치하거나 코드 짜기 귀찮았다.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">기존 방법의 문제</h2>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>protoc 명령줄 → 설치 필요, proto 파일도 있어야 함</li>
        <li>Python protobuf 라이브러리 → 코드 짜야 함</li>
        <li>gRPC GUI 툴 (Postman, Insomnia) → 무거움, 설정 많음</li>
        <li>온라인 Protobuf 사이트 → proto 스키마 입력 필요한 경우가 많음</li>
        <li>Wireshark → 네트워크 분석 전용, Protobuf 내부 보기 불편</li>
      </ul>

      <p className="mb-4">그냥 바이너리 붙여넣으면 필드별로 파싱해주는 게 필요했다. proto 파일 없이도 best-effort로.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">proto 파일 없이 디코딩하는 방법</h2>

      <p className="mb-3">Protobuf의 와이어 포맷은 타입 정보가 일부 포함되어 있어서 스키마 없이도 field number와 wire type을 파악할 수 있다.</p>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">지원 입력 형식:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>Base64 인코딩된 Protobuf 바이너리</li>
        <li>Hex 문자열 (0A 1B 2C ...)</li>
        <li>바이너리 직접 붙여넣기</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">디코딩 결과:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>필드 번호 (field number)</li>
        <li>와이어 타입 (varint, 64-bit, length-delimited, 32-bit)</li>
        <li>파싱된 값 (정수, 문자열, 중첩 메시지 등)</li>
        <li>JSON 형태로 보기 쉽게 표시</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">인코딩 기능도 있음:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>JSON → Protobuf 바이너리 변환</li>
        <li>proto 스키마 정의 입력 → 정확한 타입 변환</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Protobuf 와이어 타입 간단 설명</h2>

      <p className="mb-3">Protobuf는 각 필드에 타입 힌트가 포함되어 있어서 스키마 없이도 어느 정도 파싱이 된다.</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>Type 0 (Varint) → int32, int64, bool, enum</li>
        <li>Type 1 (64-bit) → fixed64, double</li>
        <li>Type 2 (Length-delimited) → string, bytes, embedded messages, packed arrays</li>
        <li>Type 5 (32-bit) → fixed32, float</li>
      </ul>

      <p className="mb-4">다만 스키마 없이는 string과 bytes를 구분하기 어렵고, 숫자형 타입도 정확한 타입을 알기 어렵다. 그래서 "best-effort" 파싱이라고 보면 된다.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">실제로 써보니</h2>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">좋은 점:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>proto 파일 없이도 필드 구조 파악 가능 → 빠른 디버깅에 유용</li>
        <li>브라우저에서 바로 → 설치 없음</li>
        <li>Base64/Hex 입력 모두 지원 → gRPC 응답값 그대로 붙여넣기 가능</li>
        <li>JSON 뷰로 보기 좋음</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">한계:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>스키마 없이는 타입 추론이 완벽하지 않음 → 문자열/바이트 혼동 가능</li>
        <li>복잡한 중첩 메시지는 수동 확인 필요할 수 있음</li>
        <li>oneof, map 같은 고급 기능은 스키마 필요</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">사용법</h2>

      <ol className="space-y-1 mb-4 text-gray-700 dark:text-gray-300 list-decimal list-inside">
        <li>Protobuf 바이너리 (Base64 또는 Hex) 붙여넣기</li>
        <li>입력 형식 선택</li>
        <li>디코드 버튼 클릭</li>
        <li>필드별 파싱 결과 확인</li>
      </ol>

      <p className="mb-4">proto 파일 없어도 필드 구조 파악하는 데 충분하다.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">써보기</h2>

      <p className="mb-4">
        <Link href="/tools/protobuf-decoder" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 Protobuf 디코더 바로 가기
        </Link>
      </p>

      <p className="text-gray-600 dark:text-gray-400">gRPC 디버깅, 이제 브라우저에서 바로.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <p className="text-sm text-gray-500 dark:text-gray-400">
        #Protobuf #gRPC #바이너리디코딩 #API디버깅 #개발도구 #네트워크분석
      </p>
    </article>
  );
}
