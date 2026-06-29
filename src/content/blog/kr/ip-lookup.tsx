import Link from 'next/link';

export default function IpLookupPost() {
  return (
    <article className="prose prose-gray dark:prose-invert max-w-none">
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">계산기 · 2026년 7월 19일 · 읽는 시간 4분</p>

      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        IP 주소 하나로 어디서 접속한 건지 알아내는 도구 만들었음
      </h1>

      <p className="mb-4">
        <Link href="/tools/ip-lookup" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 IP 주소 정보 조회 바로 가기
        </Link>
      </p>

      <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 dark:text-gray-400 mb-6">
        로그에서 이상한 IP 발견했는데, 이게 어디서 오는 건지 어떻게 확인하냐.
      </blockquote>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">IP 조회가 필요한 상황들</h2>

      <p className="mb-3">생각보다 자주 필요하다:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>서버 로그에서 수상한 IP 발견 → 어느 나라/지역에서 오는 트래픽인지 확인</li>
        <li>내 현재 IP 주소 확인 → VPN 연결 됐는지, 어느 지역으로 잡히는지</li>
        <li>웹사이트 방문자 분석 → 특정 IP가 어디서 오는 건지</li>
        <li>이메일 헤더에서 발신자 IP 추적 → 스팸/피싱 메일 출처 확인</li>
        <li>클라우드 인스턴스 IP 확인 → EC2, GCP 등 인스턴스 위치 파악</li>
        <li>CDN/DNS 디버깅 → 특정 IP가 어느 ISP에 속하는지</li>
        <li>보안 감사 → 접속 로그 IP별 위치 정보 파악</li>
      </ul>

      <p className="mb-4">
        개발자라면 서버 로그 보다가 이런 상황 한 번쯤은 겪는다.
        그리고 일반 사용자도 "내 IP 뭐야?" 궁금할 때 간단하게 확인하고 싶은 경우가 있다.
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">기존 방법들 문제</h2>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>"whatismyip" 구글 검색 → 내 IP만 나옴, 다른 IP 조회는 별도 작업</li>
        <li>WHOIS 조회 사이트 → 광고 많고, 결과 화면이 복잡하게 나옴</li>
        <li>커맨드라인 도구 → 개발자엔 편하지만 일반인이 쓰기 어려움</li>
        <li>복잡한 네트워크 분석 도구 → 단순히 위치 하나 보려고 쓰기엔 너무 복잡함</li>
        <li>IP 조회 API 직접 호출 → 코딩 필요, 빠른 확인엔 과함</li>
      </ul>

      <p className="mb-4">
        IP 입력하면 국가, 도시, ISP, 좌표가 깔끔하게 나오는 도구가 필요했다.
        그게 전부인데 왜 없냐 싶어서 직접 만들었음.
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">그래서 직접 만들었음</h2>

      <p className="mb-3">IP 입력하면 이런 정보가 나온다:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li><strong>위치 정보</strong> → 국가, 지역(주/도), 도시</li>
        <li><strong>ISP (인터넷 서비스 제공자)</strong> → KT, SKT, LGU+, AWS, Google Cloud 등</li>
        <li><strong>AS 번호 (ASN)</strong> → 네트워크 관리 기관 정보</li>
        <li><strong>타임존</strong> → 해당 IP 기준 시간대</li>
        <li><strong>좌표 (위도/경도)</strong> → 대략적인 위치, 지도 링크 제공</li>
        <li><strong>우편번호</strong> → 조회 가능한 경우</li>
        <li><strong>VPN/프록시/토르 감지</strong> → 익명화 도구 사용 여부</li>
        <li><strong>IPv4 / IPv6</strong> → 두 형식 모두 조회 지원</li>
      </ul>

      <p className="mb-3">추가 기능:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li><strong>내 IP 자동 감지</strong> → 버튼 하나로 현재 접속 IP 확인</li>
        <li><strong>결과 복사</strong> → 조회 결과 전체 클립보드 복사</li>
        <li><strong>지도 연결</strong> → 좌표 클릭하면 구글 지도로 이동</li>
        <li><strong>조회 기록</strong> → 최근 조회한 IP 목록 (탭 세션 내)</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">IP 위치 정보, 얼마나 정확한가</h2>

      <p className="mb-3">
        IP 위치 정보는 정확도에 한계가 있다. 알고 쓰면 도움이 됨:
      </p>

      <ul className="space-y-2 mb-4 text-gray-700 dark:text-gray-300">
        <li>
          <strong>국가 수준</strong> → 99% 이상 정확. 어느 나라에서 오는 트래픽인지는 거의 확실하게 알 수 있음.
        </li>
        <li>
          <strong>도시 수준</strong> → 60~80% 정도. 실제 위치랑 인근 도시로 나올 수 있음.
          ISP 서버 위치 기준으로 잡히는 경우도 있어서 오차 가능.
        </li>
        <li>
          <strong>VPN/프록시 사용 시</strong> → 실제 위치가 아닌 서버 위치로 나옴.
          VPN 사용 여부 자체는 감지 기능으로 확인 가능.
        </li>
        <li>
          <strong>기업/데이터센터 IP</strong> → 본사 위치나 데이터센터 위치로 나옴.
          클라우드 서비스(AWS, GCP, Azure 등)는 ASN 보면 파악 가능.
        </li>
      </ul>

      <p className="mb-4">
        법적 증거 용도로는 쓸 수 없지만, 대략적인 위치 파악이나 트래픽 분석, 수상한 접속 확인 용도로는 충분히 유용하다.
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">실제로 써보니</h2>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">좋은 점:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>광고 없이 바로 결과 나옴 → 기존 WHOIS 사이트들 대비 쾌적함</li>
        <li>내 IP 자동 감지 → VPN 연결 여부 빠르게 확인 가능</li>
        <li>VPN/프록시 감지 표시 → 수상한 트래픽 1차 필터링에 도움</li>
        <li>결과 복사 기능 → 여러 IP 조회하면서 결과 정리할 때 편함</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">한계:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>정확한 주소까지는 알 수 없음 → 도시 수준까지만</li>
        <li>배치 조회 (여러 IP 한꺼번에) 기능은 없음</li>
        <li>WHOIS 상세 도메인 정보 (도메인 소유자, 만료일 등)는 없음</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">사용법</h2>

      <ol className="space-y-2 mb-4 text-gray-700 dark:text-gray-300 list-decimal list-inside">
        <li>IP 주소 입력란에 조회할 IP 붙여넣기 (IPv4 또는 IPv6)</li>
        <li>조회 버튼 클릭</li>
        <li>국가, 도시, ISP, 타임존 등 결과 확인</li>
        <li>내 현재 IP 확인하려면 "내 IP 조회" 버튼 클릭</li>
        <li>결과 복사 필요하면 복사 버튼</li>
      </ol>

      <p className="mb-4">5초면 된다.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">써보기</h2>

      <p className="mb-4">
        <Link href="/tools/ip-lookup" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 IP 주소 정보 조회 바로 가기
        </Link>
      </p>

      <p className="text-gray-600 dark:text-gray-400">
        수상한 IP 발견하거나 내 IP 확인할 때 북마크해두면 편하다.
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <p className="text-sm text-gray-500 dark:text-gray-400">
        #IP조회 #IP위치확인 #네트워크도구 #개발자도구 #보안 #WHOIS
      </p>
    </article>
  );
}
