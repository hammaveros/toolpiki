import Link from 'next/link';

export default function PasswordStrengthPost() {
  return (
    <article className="prose prose-gray dark:prose-invert max-w-none">
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">보안 · 2026-06-22 · 4분 읽기</p>

      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        "비밀번호 강도: 보통" 뜨는 거 보고 넘어갔다가, 나중에 후회하는 경우 생각보다 많음
      </h1>

      <p className="mb-4">
        <Link href="/tools/password-strength" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 비밀번호 강도 체크기 바로 가기
        </Link>
      </p>

      <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 dark:text-gray-400 mb-6">
        "Password1!" 이거 강함이라고 뜨는 사이트도 있음. 실제로는 해커들이 사전 공격으로 금방 뚫는 패턴인데.
      </blockquote>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">언제 필요한지</h2>

      <p className="mb-3">비밀번호 강도 확인이 필요한 상황들:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>새 계정 만들 때 → 내가 만든 비밀번호가 실제로 얼마나 안전한지 확인</li>
        <li>보안 점검 시 → 오래된 비밀번호들 강도 확인하고 교체 결정</li>
        <li>서비스 개발 중 → 비밀번호 정책 기준 결정할 때 참고용</li>
        <li>팀/회사 보안 교육 → 왜 복잡한 비밀번호가 필요한지 시각적으로 보여줄 때</li>
        <li>부모님/가족 도와줄 때 → 쉬운 비밀번호 쓰는 분들한테 위험성 보여주기</li>
        <li>랜덤 비밀번호 필요할 때 → 강한 비밀번호 직접 생성</li>
      </ul>

      <p className="mb-4">매일 쓸 일은 없지만, 한 번 제대로 체크해두면 나중에 마음 편함.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">사람들이 잘못 알고 있는 것들</h2>

      <p className="mb-3">흔한 오해들:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li><strong>"특수문자 넣으면 강한 거 아님?"</strong> → "Password1!"은 사전 공격 목록에 이미 있음. 패턴이 뻔하면 소용없음</li>
        <li><strong>"8자리면 충분하지 않나?"</strong> → GPU 사용하면 8자리 영숫자 조합 몇 시간이면 크랙 가능</li>
        <li><strong>"내 개인정보 포함하면 기억하기 쉬운데"</strong> → 생일, 이름, 전화번호는 소셜 엔지니어링 공격에 그대로 노출</li>
        <li><strong>"여러 사이트에 같은 비번 쓰면 편한데"</strong> → 사이트 하나 털리면 전부 털림. 크리덴셜 스터핑 공격이 바로 이걸 노림</li>
        <li><strong>"주기적으로 바꾸면 안전하지 않나?"</strong> → 강한 비번 오래 쓰는 게 약한 비번 자주 바꾸는 것보다 나음</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">강한 비밀번호의 조건</h2>

      <p className="mb-3">실제 보안 전문가들이 말하는 기준:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>길이 최소 12자 이상 → 12자가 8자보다 수십억 배 어려움. 16자 이상이면 더 좋음</li>
        <li>대소문자 + 숫자 + 특수문자 혼합 → 경우의 수가 기하급수적으로 늘어남</li>
        <li>사전에 있는 단어 사용 금지 → "dragon", "iloveyou" 이런 거 공격자가 먼저 시도함</li>
        <li>개인정보 사용 금지 → 이름, 생일, 전화번호, 학교 이름 등</li>
        <li>사이트마다 다른 비번 → 패스워드 매니저 쓰면 해결됨</li>
        <li>패스프레이즈 방식 → "correct horse battery staple" 처럼 무작위 단어 4개 이상 조합도 강함</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">기존 방법 문제</h2>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>사이트 자체 강도 표시 → 기준이 제각각. 어떤 곳은 "Password1" 을 강함이라고 함</li>
        <li>구글에서 "강한 비밀번호 체크" 검색 → 광고 많고, 입력한 비번이 서버로 전송되는지 알 수 없음</li>
        <li>비밀번호 관리 앱 내 생성기 → 비번 만들어주긴 하는데 강도 설명이 부족함</li>
        <li>내가 직접 판단 → 자기 비번이 약한지 강한지 객관적으로 보기 어려움</li>
      </ul>

      <p className="mb-4">특히 걱정되는 건 "비밀번호 강도 체크 사이트"에 내 비번 직접 입력하는 거임. 전송 여부를 모르니까.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">그래서 만들었음</h2>

      <p className="mb-3">브라우저에서만 동작하는 비밀번호 강도 체커:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>입력한 비밀번호 서버로 절대 안 전송 → 브라우저에서만 분석</li>
        <li>강도 점수 + 이유 설명 → 왜 약한지 구체적으로 알려줌</li>
        <li>엔트로피 계산 → 실제 크랙하는 데 얼마나 걸릴지 추정</li>
        <li>개선 제안 → "대문자 추가", "특수문자 필요" 등 구체적 피드백</li>
        <li>랜덤 비밀번호 생성기 → 강한 비번 바로 만들 수 있음</li>
        <li>길이, 포함 문자 종류 직접 설정 가능</li>
      </ul>

      <p className="mb-3">비밀번호 자체를 서버에 보내지 않는다는 게 제일 중요한 포인트. 체크하려다가 오히려 비번 유출되면 안 되니까.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">비밀번호 매니저 쓰는 게 답임</h2>

      <p className="mb-3">솔직히 말하면, 강한 비번 외우는 건 한계가 있음. 현실적인 해결책:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>1Password, Bitwarden, Dashlane 같은 비번 매니저 → 각 사이트마다 강한 랜덤 비번 자동 생성 + 저장</li>
        <li>브라우저 내장 비번 관리 → Chrome, Safari, Firefox 모두 있음. 무료이고 편함</li>
        <li>마스터 비번 하나만 기억 → 나머지는 매니저가 관리</li>
        <li>2FA(이중인증) 함께 쓰기 → 비번 뚫려도 계정 보호됨</li>
      </ul>

      <p className="mb-4">이 툴은 비번 매니저 쓰기 전에 "지금 쓰는 비번이 얼마나 위험한지" 확인하는 용도로도 쓸 수 있음.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">실제로 써보니</h2>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">좋은 점:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>브라우저 전용 처리 → 비번 외부 전송 없어서 안심</li>
        <li>단순 강도 표시가 아니라 이유 설명해줌 → 뭘 고쳐야 하는지 바로 앎</li>
        <li>랜덤 생성기 → 즉시 쓸 수 있는 강한 비번 뽑을 수 있음</li>
        <li>크랙 예상 시간 → "1000년 이상" 같은 표시로 체감 가능</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">한계:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>유출된 비번 데이터베이스 조회는 안 됨 → HaveIBeenPwned 같은 별도 서비스 필요</li>
        <li>비번 저장/관리 기능 없음 → 단순 강도 확인 용도</li>
        <li>완벽한 보안 보장은 아님 → 사회공학적 공격까지 막진 못함</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">사용법</h2>

      <ol className="space-y-1 mb-4 text-gray-700 dark:text-gray-300 list-decimal list-inside">
        <li>비밀번호 입력 (또는 랜덤 생성 버튼 클릭)</li>
        <li>강도 점수, 크랙 예상 시간 확인</li>
        <li>개선 제안 확인</li>
        <li>강한 비번 원하면 랜덤 생성기로 바로 뽑기</li>
      </ol>

      <p className="mb-4">30초 안에 확인 가능.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">써보기</h2>

      <p className="mb-4">
        <Link href="/tools/password-strength" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 비밀번호 강도 체크기 바로 가기
        </Link>
      </p>

      <p className="text-gray-600 dark:text-gray-400">지금 쓰는 비번 넣어보면 생각보다 충격적일 수 있음.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <p className="text-sm text-gray-500 dark:text-gray-400">
        #비밀번호강도 #비밀번호보안 #강한비밀번호 #비번생성기 #계정보안 #보안의식
      </p>
    </article>
  );
}
