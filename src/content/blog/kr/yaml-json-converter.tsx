import Link from 'next/link';

export default function YamlJsonConverterPost() {
  return (
    <article className="prose prose-gray dark:prose-invert max-w-none">
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">포맷터 · 2026년 6월 23일 · 읽는 시간 4분</p>

      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        YAML↔JSON 변환, 쿠버네티스 설정 파일 작업할 때 매번 손으로 하기 귀찮아서
      </h1>

      <p className="mb-4">
        <Link href="/tools/yaml-json-converter" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 YAML↔JSON 변환기 바로 가기
        </Link>
      </p>

      <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 dark:text-gray-400 mb-6">
        API는 JSON 받는데 쿠버네티스 매니페스트는 YAML이고, 둘이 계속 오가야 하는 상황.
      </blockquote>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">YAML↔JSON 변환이 필요한 상황</h2>

      <p className="mb-3">이런 경우들이 있다:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>쿠버네티스(K8s) 매니페스트 → YAML로 작성하는데 도구가 JSON 형식 요구할 때</li>
        <li>도커 컴포즈 파일 → docker-compose.yml을 JSON으로 변환해서 다른 시스템에 넘길 때</li>
        <li>GitHub Actions 워크플로우 → YAML 설정 참고해서 JSON 기반 도구에 맞게 변환</li>
        <li>API 응답 → JSON으로 오는 데이터를 YAML 설정 파일에 녹여야 할 때</li>
        <li>앤서블(Ansible) 플레이북 → YAML 기반이라 JSON 설정이랑 오가는 경우</li>
        <li>헬름 차트 values.yaml → 다른 형식의 설정 파일이랑 비교할 때</li>
        <li>AWS CloudFormation → JSON이나 YAML 둘 다 지원, 팀 컨벤션 통일할 때</li>
        <li>테라폼 → HCL 말고 JSON 형식도 지원해서 변환 필요한 경우</li>
      </ul>

      <p className="mb-4">
        DevOps/인프라 쪽 작업하다 보면 YAML이 기본이고,
        백엔드 API 쪽은 JSON이 기본이라 그 경계에서 변환이 자주 필요하다.
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">YAML이랑 JSON이 뭐가 다른가</h2>

      <p className="mb-3">
        둘 다 데이터를 구조화하는 형식인데 표현 방식이 다르다.
        JSON은 중괄호와 따옴표로 구조를 명시하고, YAML은 들여쓰기로 구조를 표현한다.
      </p>

      <p className="mb-3">같은 데이터를 두 형식으로 보면:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>JSON → 중괄호, 대괄호, 따옴표 필수 → 기계가 읽기 좋음</li>
        <li>YAML → 들여쓰기와 하이픈으로 구조 표현 → 사람이 읽기 좋음</li>
        <li>YAML이 JSON의 상위 호환 → 유효한 JSON은 유효한 YAML이기도 함</li>
        <li>주석 → YAML은 # 주석 가능, JSON은 주석 없음</li>
        <li>멀티라인 문자열 → YAML이 더 자연스럽게 표현 가능</li>
      </ul>

      <p className="mb-3">그래서 보통:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>설정 파일 → YAML (쿠버네티스, 도커 컴포즈, 깃허브 액션 등)</li>
        <li>API 통신 → JSON (REST API, 응답/요청 바디)</li>
        <li>데이터베이스 저장 → JSON (MongoDB 등 NoSQL)</li>
      </ul>

      <p className="mb-4">이 경계를 오가는 작업이 의외로 자주 생긴다.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">기존 방법의 문제</h2>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>파이썬 스크립트 직접 작성 → import yaml, json 해서 변환하면 되는데, 환경 있어야 하고 매번 만들기 귀찮음</li>
        <li>노드 스크립트 → js-yaml 패키지 설치하고 스크립트 짜면 되는데, 간단한 변환에 과함</li>
        <li>온라인 도구 검색 → 광고 많거나 UI가 이상한 것들이 많음</li>
        <li>Postman → API 테스트 도구인데 변환용으로 열기 무거움</li>
        <li>VS Code 익스텐션 → 에디터 열려 있어야 하고, 익스텐션 찾아 설치하는 것 자체가 일</li>
      </ul>

      <p className="mb-3">
        결국 변환 한 번 하려고 환경 세팅하거나 무거운 도구 여는 일이 반복됐다.
        그냥 붙여넣으면 바로 되는 게 없나 싶었다.
      </p>

      <p className="mb-4">
        특히 YAML 들여쓰기 오류가 JSON보다 찾기 어려운데,
        변환기에서 에러 메시지 보여주면 문제 위치 파악이 훨씬 빠르다.
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">그래서 만들었음</h2>

      <p className="mb-3">붙여넣으면 바로 변환된다:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>YAML → JSON 변환 → 들여쓰기 정리된 JSON으로 출력</li>
        <li>JSON → YAML 변환 → 읽기 좋은 YAML로 출력</li>
        <li>실시간 변환 → 입력하면서 바로 결과 확인</li>
        <li>에러 표시 → 잘못된 문법이면 어디가 문제인지 알려줌</li>
        <li>들여쓰기 옵션 → JSON 출력 시 2칸/4칸 선택 가능</li>
        <li>복사 버튼 → 변환 결과 클립보드로 바로</li>
      </ul>

      <p className="mb-3">실용적인 부분들:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>큰 파일도 가능 → 수백 줄 YAML도 처리</li>
        <li>중첩 구조 유지 → 복잡한 오브젝트 구조도 제대로 변환</li>
        <li>배열 처리 → YAML 리스트 ↔ JSON 배열 정확하게 변환</li>
        <li>null, boolean, 숫자 타입 → 타입 추론 정확하게 처리</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">실제로 써보니</h2>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">좋은 점:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>붙여넣자마자 바로 변환됨 → 버튼도 없음, 그냥 나옴</li>
        <li>에러 메시지가 친절함 → "3번째 줄 들여쓰기 오류" 이런 식으로</li>
        <li>환경 세팅 필요 없음 → 브라우저에서 그냥 씀</li>
        <li>양방향 변환 → YAML→JSON, JSON→YAML 한 페이지에서</li>
        <li>로컬 처리 → 설정 파일 내용이 서버로 안 감, 내부 인프라 정보도 안전</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">한계:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>YAML 앵커(&)와 별칭(*) → 일부 고급 YAML 기능은 변환 시 풀려버릴 수 있음</li>
        <li>주석 유지 → YAML 주석은 JSON 변환 시 사라짐 (JSON에 주석 없으니까)</li>
        <li>멀티 도큐먼트 YAML (---) → 한 번에 여러 도큐먼트 처리는 제한적</li>
      </ul>

      <p className="mb-4">
        일반적인 쿠버네티스 매니페스트나 도커 컴포즈, 깃허브 액션 파일 수준에서는 다 된다.
        YAML 앵커 같은 고급 기능 쓰는 복잡한 파일은 직접 확인이 필요하다.
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">쿠버네티스 작업할 때 구체적으로</h2>

      <p className="mb-3">K8s 작업하면서 이런 케이스에 자주 쓰게 됐다:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>kubectl 명령어 결과(JSON) → YAML로 변환해서 매니페스트 파일에 반영</li>
        <li>헬름 차트 디버깅 → values.yaml 구조 확인하면서 JSON으로 보기</li>
        <li>ArgoCD 설정 → YAML이 맞는지 JSON으로 변환해서 구조 확인</li>
        <li>Terraform 변수 → JSON 형식으로 받아서 YAML로 변환</li>
        <li>AWS ECS 태스크 정의 → JSON인데 YAML로 관리하고 싶을 때</li>
      </ul>

      <p className="mb-4">
        DevOps 작업 중 브라우저 탭 하나 열어두고 필요할 때 붙여넣는 식으로 쓰게 됐다.
        파이썬 환경 없는 서버에서도 브라우저만 있으면 쓸 수 있다는 것도 장점.
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">사용법</h2>

      <ol className="space-y-1 mb-4 text-gray-700 dark:text-gray-300 list-decimal list-inside">
        <li>변환할 YAML 또는 JSON 붙여넣기</li>
        <li>YAML→JSON 또는 JSON→YAML 방향 선택</li>
        <li>자동으로 변환 결과 나옴</li>
        <li>에러 있으면 어디가 문제인지 표시됨</li>
        <li>복사해서 사용</li>
        <li>끝</li>
      </ol>

      <p className="mb-4">스크립트 만들 필요 없다. 그냥 붙여넣으면 된다.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">써보기</h2>

      <p className="mb-4">
        <Link href="/tools/yaml-json-converter" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 YAML↔JSON 변환기 바로 가기
        </Link>
      </p>

      <p className="text-gray-600 dark:text-gray-400">
        YAML 들여쓰기 오류로 삽질 중이라면 여기 붙여넣어봐. 에러 위치 바로 잡아줌.
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <p className="text-sm text-gray-500 dark:text-gray-400">
        #YAML #JSON #YAML변환 #쿠버네티스 #개발도구 #무료도구
      </p>
    </article>
  );
}
