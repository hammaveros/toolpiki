import Link from 'next/link';

export default function JasoWordCountGuidePost() {
  return (
    <article className="prose prose-gray dark:prose-invert max-w-none">
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">가이드 · 2026년 8월 20일 · 읽는 시간 8분</p>

      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        자소서 글자수 기준 총정리 — 공백 포함? 제외? 회사마다 다르다
      </h1>

      <p className="mb-4 text-gray-700 dark:text-gray-300">
        &ldquo;500자 이내로 작성하시오.&rdquo; 여기서 말하는 500자에 공백이 포함될까? 문단을 나누려고 넣은
        줄바꿈은? 결론부터 말하면 <strong>정답은 없고, 채용 시스템마다 다르다.</strong> 그리고 이 차이를
        모르고 제출 직전에 글자수가 초과되는 걸 발견하면, 마감 10분 전에 문장을 쳐내는 최악의 상황이 벌어진다.
        이 글은 글자수 산정 방식이 왜 제각각인지, 어떻게 미리 확인하는지, 분량을 기준에 맞추는 실전 요령까지
        정리한 것이다.
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">글자수를 세는 세 가지 방식</h2>

      <p className="mb-3 text-gray-700 dark:text-gray-300">
        채용 시스템이 &ldquo;글자수&rdquo;를 세는 방식은 크게 세 가지다. 같은 글을 넣어도 방식에 따라
        수치가 크게 달라진다.
      </p>

      <div className="overflow-x-auto mb-4">
        <table className="min-w-full text-sm border border-gray-200 dark:border-gray-700">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-800">
              <th className="px-3 py-2 text-left font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700">방식</th>
              <th className="px-3 py-2 text-left font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700">설명</th>
              <th className="px-3 py-2 text-left font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700">&ldquo;안녕 hi&rdquo;의 카운트</th>
            </tr>
          </thead>
          <tbody className="text-gray-700 dark:text-gray-300">
            <tr className="border-b border-gray-100 dark:border-gray-800">
              <td className="px-3 py-2 font-medium">공백 포함 글자수</td>
              <td className="px-3 py-2">눈에 보이는 모든 문자 + 띄어쓰기를 셈. 가장 흔한 방식.</td>
              <td className="px-3 py-2">5자</td>
            </tr>
            <tr className="border-b border-gray-100 dark:border-gray-800">
              <td className="px-3 py-2 font-medium">공백 제외 글자수</td>
              <td className="px-3 py-2">띄어쓰기·줄바꿈을 빼고 셈. 일부 공공기관·논술형 전형.</td>
              <td className="px-3 py-2">4자</td>
            </tr>
            <tr>
              <td className="px-3 py-2 font-medium">바이트(Byte) 기준</td>
              <td className="px-3 py-2">한글 2~3바이트, 영문·공백 1바이트로 셈. 오래된 채용 시스템에 남아 있음.</td>
              <td className="px-3 py-2">7~9바이트</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p className="mb-4 text-gray-700 dark:text-gray-300">
        특히 바이트 기준이 함정이다. 한글은 인코딩에 따라 1자가 2바이트(EUC-KR) 또는 3바이트(UTF-8)로
        계산되기 때문에, &ldquo;2,000바이트 이내&rdquo;라면 실제로 쓸 수 있는 한글은 700~1,000자 남짓이다.
        같은 제한처럼 보여도 체감 분량이 절반 이하로 줄어든다.
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">내가 지원하는 곳은 어떤 방식인지 확인하는 법</h2>

      <ol className="space-y-2 mb-4 text-gray-700 dark:text-gray-300 list-decimal list-inside">
        <li>
          <strong>입력창의 실시간 카운터를 먼저 본다.</strong> 대부분의 채용 사이트는 입력창 아래에
          &ldquo;123/500&rdquo; 같은 카운터를 띄운다. 띄어쓰기 몇 개를 넣었다 지워 보면 공백 포함 여부를
          10초 만에 확인할 수 있다.
        </li>
        <li>
          <strong>&ldquo;자&rdquo;와 &ldquo;Byte&rdquo; 표기를 구분한다.</strong> 제한 단위가
          &ldquo;OOO자&rdquo;가 아니라 &ldquo;OOOByte&rdquo;로 적혀 있으면 무조건 바이트 방식이다.
          이 경우 한글 기준 실제 가용 분량은 제한값의 1/2~1/3로 잡아야 한다.
        </li>
        <li>
          <strong>줄바꿈 처리를 테스트한다.</strong> 문단 구분용 엔터가 1~2자로 계산되는 시스템이 있다.
          문단을 많이 나누는 스타일이라면 이것만으로 수십 자가 날아간다.
        </li>
        <li>
          <strong>임시저장 후 다시 열어 본다.</strong> 일부 시스템은 저장 과정에서 연속 공백이나 특수문자를
          변환하는데, 이때 글자수가 미묘하게 달라질 수 있다. 마감 직전 제출이 아니라 미리 한 번 저장해 보는
          게 안전하다.
        </li>
      </ol>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">초과하면 어떻게 되나</h2>

      <p className="mb-3 text-gray-700 dark:text-gray-300">시스템에 따라 세 가지 처리 방식이 있다.</p>

      <ul className="space-y-2 mb-4 text-gray-700 dark:text-gray-300">
        <li>
          <strong>입력 차단형</strong> — 제한에 도달하면 더 이상 타이핑이 안 된다. 가장 흔하다. 문제는
          한글 입력기 특성상 마지막 글자의 받침이 잘리는 경우가 있다는 것. 제출 전에 마지막 문장을 꼭 확인하자.
        </li>
        <li>
          <strong>제출 차단형</strong> — 입력은 되지만 제출 버튼을 누르면 초과 경고가 뜬다. 다른 창에서 쓴 글을
          붙여넣는 스타일이라면 이 방식에서 초과분을 통째로 다듬어야 하는 상황이 온다.
        </li>
        <li>
          <strong>자동 절삭형</strong> — 드물지만 가장 위험하다. 초과분이 경고 없이 잘린 채 저장된다.
          붙여넣기 후에는 반드시 저장된 내용의 끝부분을 다시 확인해야 한다.
        </li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">분량 맞추기 실전 요령</h2>

      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">넘칠 때 — 문장 다이어트 순서</h3>

      <ol className="space-y-2 mb-4 text-gray-700 dark:text-gray-300 list-decimal list-inside">
        <li><strong>부사부터 지운다.</strong> &ldquo;정말&rdquo;, &ldquo;매우&rdquo;, &ldquo;적극적으로&rdquo;는 지워도 의미가 거의 안 변한다.</li>
        <li><strong>겹말을 찾는다.</strong> &ldquo;미리 예상하다&rdquo; → &ldquo;예상하다&rdquo;, &ldquo;다시 재검토&rdquo; → &ldquo;재검토&rdquo;처럼 중복 표현은 한국어 자소서의 단골 군살이다.</li>
        <li><strong>명사화된 문장을 동사로 되돌린다.</strong> &ldquo;개선을 진행하였습니다&rdquo; → &ldquo;개선했습니다&rdquo;. 문장당 3~5자씩 줄어든다.</li>
        <li><strong>마지막 수단이 에피소드 삭제다.</strong> 표현을 줄여서 안 되면 사례 하나를 통째로 빼는 게, 모든 문장을 어색하게 압축하는 것보다 낫다.</li>
      </ol>

      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">모자랄 때 — 늘리는 게 아니라 채우는 것</h3>

      <p className="mb-4 text-gray-700 dark:text-gray-300">
        제한의 70%를 못 채우면 성의 부족으로 읽히기 쉽다. 하지만 같은 말을 반복해 늘리면 더 나쁘다.
        분량이 남을 때는 <strong>수치와 맥락</strong>을 추가하는 게 정석이다. &ldquo;매출 증가에
        기여했습니다&rdquo;를 &ldquo;3개월간 A/B 테스트 12회를 돌려 전환율을 2.1%에서 3.4%로 올렸습니다&rdquo;로
        바꾸면 분량과 설득력이 같이 올라간다.
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">체크리스트</h2>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>☐ 제한 단위가 &ldquo;자&rdquo;인지 &ldquo;Byte&rdquo;인지 확인했다</li>
        <li>☐ 공백 포함 여부를 입력창에서 직접 테스트했다</li>
        <li>☐ 줄바꿈이 글자수에 포함되는지 확인했다</li>
        <li>☐ 제한의 90~95% 분량을 목표로 잡았다 (마지막 수정 여유분)</li>
        <li>☐ 붙여넣기 후 저장된 글의 끝부분이 잘리지 않았는지 확인했다</li>
      </ul>

      <p className="mb-4 text-gray-700 dark:text-gray-300">
        외부에서 초안을 쓸 때는 공백 포함/제외/바이트를 동시에 보여주는 카운터를 옆에 두면 편하다.
        {' '}
        <Link href="/tools/character-counter" className="text-blue-600 dark:text-blue-400 font-medium hover:underline">
          글자수 세기 도구
        </Link>
        는 세 수치를 한 화면에서 실시간으로 보여준다.
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <p className="text-sm text-gray-500 dark:text-gray-400">
        #자소서글자수 #공백포함 #공백제외 #바이트계산 #자기소개서
      </p>
    </article>
  );
}
