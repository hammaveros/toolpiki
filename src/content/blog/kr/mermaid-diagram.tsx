import Link from 'next/link';

export default function MermaidDiagramPost() {
  return (
    <article className="prose prose-gray dark:prose-invert max-w-none">
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">개발도구 · 2026년 7월 9일 · 읽는 시간 5분</p>

      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        다이어그램 그리기 귀찮아서 텍스트로 짜는 Mermaid
      </h1>

      <p className="mb-4">
        <Link href="/tools/mermaid-diagram" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 Mermaid 다이어그램 에디터 바로 가기
        </Link>
      </p>

      <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 dark:text-gray-400 mb-6">
        Figma나 draw.io로 다이어그램 그리는 게 너무 손이 많이 가서, 텍스트로 빠르게 시각화할 수 없나 찾다가 Mermaid를 알게 됐다.
      </blockquote>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Mermaid가 유용한 상황</h2>

      <p className="mb-3">이런 경우들:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>시스템 아키텍처 문서화 → 코드와 함께 버전 관리 가능</li>
        <li>ERD (Entity Relationship Diagram) → DB 스키마 시각화</li>
        <li>플로우차트 → 비즈니스 로직, 결정 흐름</li>
        <li>시퀀스 다이어그램 → API 호출 흐름</li>
        <li>GitHub README → 마크다운에 바로 렌더링</li>
        <li>Notion, Confluence → Mermaid 코드 블록 지원</li>
      </ul>

      <p className="mb-4">
        GitHub Markdown에서 Mermaid를 공식 지원하면서 코드 주석이나 README에 다이어그램을 바로 넣는 문화가 생겼다.
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Mermaid 주요 다이어그램 타입</h2>

      <p className="mb-3"><strong>플로우차트:</strong></p>

      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-4 overflow-x-auto">
        <pre className="text-sm text-gray-700 dark:text-gray-300">
{`flowchart TD
  A[시작] --> B{로그인?}
  B -- 예 --> C[대시보드]
  B -- 아니오 --> D[로그인 페이지]
  D --> E[이메일/비밀번호 입력]
  E --> B`}
        </pre>
      </div>

      <p className="mb-3"><strong>시퀀스 다이어그램:</strong></p>

      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-4 overflow-x-auto">
        <pre className="text-sm text-gray-700 dark:text-gray-300">
{`sequenceDiagram
  participant 클라이언트
  participant API서버
  participant DB

  클라이언트->>API서버: POST /login
  API서버->>DB: 사용자 조회
  DB-->>API서버: 사용자 정보
  API서버-->>클라이언트: JWT 토큰 반환`}
        </pre>
      </div>

      <p className="mb-3"><strong>ERD:</strong></p>

      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-4 overflow-x-auto">
        <pre className="text-sm text-gray-700 dark:text-gray-300">
{`erDiagram
  USER {
    int id PK
    string email
    string name
    datetime created_at
  }
  ORDER {
    int id PK
    int user_id FK
    decimal total_amount
    string status
  }
  USER ||--o{ ORDER : "has"`}
        </pre>
      </div>

      <p className="mb-3"><strong>클래스 다이어그램:</strong></p>

      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-4 overflow-x-auto">
        <pre className="text-sm text-gray-700 dark:text-gray-300">
{`classDiagram
  class Animal {
    +String name
    +int age
    +makeSound() void
  }
  class Dog {
    +String breed
    +fetch() void
  }
  Animal <|-- Dog`}
        </pre>
      </div>

      <p className="mb-3"><strong>간트 차트:</strong></p>

      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-4 overflow-x-auto">
        <pre className="text-sm text-gray-700 dark:text-gray-300">
{`gantt
  title 프로젝트 일정
  dateFormat YYYY-MM-DD
  section 설계
    요구사항 분석    :2026-07-01, 5d
    DB 설계         :2026-07-06, 3d
  section 개발
    API 개발        :2026-07-09, 10d
    프론트엔드 개발  :2026-07-09, 10d`}
        </pre>
      </div>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">기존 방법의 문제</h2>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>draw.io → 박스 하나하나 드래그, 연결선 잡기 힘듦, 시간 많이 씀</li>
        <li>Figma → 디자이너 도구라 개발자에겐 과함</li>
        <li>PlantUML → 별도 Java 환경 필요</li>
        <li>Lucidchart → 유료, 무겁고 공유 불편</li>
        <li>PowerPoint/Keynote → 텍스트 기반 수정 불가, 버전 관리 안 됨</li>
      </ul>

      <p className="mb-4">
        코드처럼 텍스트로 다이어그램을 짜면 Git으로 버전 관리도 되고, 수정도 훨씬 빠르다.
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">그래서 만들었음</h2>

      <p className="mb-3">주요 기능:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>Mermaid 코드 입력 → 실시간 다이어그램 렌더링</li>
        <li>다이어그램 PNG/SVG 다운로드</li>
        <li>예제 다이어그램 모음 (플로우차트, 시퀀스, ERD 등)</li>
        <li>문법 오류 감지 및 안내</li>
        <li>다크/라이트 테마 선택</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">실제로 써보니</h2>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">좋은 점:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>텍스트 기반 → 빠른 수정, Git 버전 관리</li>
        <li>실시간 미리보기 → 오타 즉시 확인</li>
        <li>GitHub/Notion에서 바로 사용 가능한 코드 생성</li>
        <li>PNG/SVG 내보내기 → 문서에 바로 넣기</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">한계:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>복잡한 다이어그램은 레이아웃 자동 배치가 원하는 대로 안 될 수 있음</li>
        <li>노드 위치를 세밀하게 제어하기 어려움</li>
        <li>스타일링이 제한적 (draw.io처럼 자유롭지 않음)</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">사용법</h2>

      <ol className="space-y-1 mb-4 text-gray-700 dark:text-gray-300 list-decimal list-inside">
        <li>왼쪽에 Mermaid 코드 입력 (또는 예제 선택)</li>
        <li>오른쪽에서 실시간 렌더링 확인</li>
        <li>PNG/SVG로 내보내기 또는 코드 복사</li>
      </ol>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">써보기</h2>

      <p className="mb-4">
        <Link href="/tools/mermaid-diagram" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 Mermaid 다이어그램 에디터 바로 가기
        </Link>
      </p>

      <p className="text-gray-600 dark:text-gray-400">
        시스템 설계 문서화하거나 README에 다이어그램 넣을 때 써보면 편함.
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <p className="text-sm text-gray-500 dark:text-gray-400">
        #Mermaid #다이어그램 #플로우차트 #ERD #시퀀스다이어그램
      </p>
    </article>
  );
}
