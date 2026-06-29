import Link from 'next/link';

export default function AgeCalculatorPost() {
  return (
    <article className="prose prose-gray dark:prose-invert max-w-none">
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">계산기 · 2026년 7월 20일 · 읽는 시간 5분</p>

      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        2023년부터 만나이 쓴다고 했는데... 아직도 헷갈리는 사람 많음 — 나이 계산기 만든 이유
      </h1>

      <p className="mb-4">
        <Link href="/tools/age-calculator" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 나이 계산기 (만나이/한국나이/띠) 바로 가기
        </Link>
      </p>

      <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 dark:text-gray-400 mb-6">
        "몇 살이에요?" → "만으로요, 한국으로요?" → "아 그게..." 이 대화 아직도 매일 일어나고 있음
      </blockquote>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">언제 필요한지</h2>

      <p className="mb-3">나이 계산기, 생각보다 쓸 일이 많다:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>병원/공공기관 서류 작성 → 만나이 기재란에 뭘 써야 하는지</li>
        <li>보험 가입 → 보험은 만나이 기준인 경우가 대부분</li>
        <li>법적 기준 확인 → 청소년, 성인, 노인 기준이 만나이라 헷갈림</li>
        <li>취업/자격증 지원 자격 → "만 35세 미만" 같은 조건 확인</li>
        <li>군입대 → 병역 의무 나이 계산이 만나이 기준</li>
        <li>새해 대화 → "올해 몇 살이야?" → 한국나이 vs 만나이 혼용</li>
        <li>외국인 친구와 나이 얘기 → 한국나이 설명해야 할 때</li>
        <li>연말정산 부양가족 공제 → 나이 기준으로 공제 여부 달라짐</li>
        <li>띠 확인 → 갑자기 "너 무슨 띠야?" 물어볼 때</li>
      </ul>

      <p className="mb-4">
        2023년 6월에 만나이 통일법이 시행됐는데, 일상에서는 아직도 한국나이(세는나이)를 많이 씀. 공식 서류는 만나이, 일상 대화는 한국나이가 공존하는 상황. 그러다 보니 "나 올해 만으로 몇이지?" 헷갈리는 경우가 생각보다 자주 일어남.
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">기존 방법의 문제</h2>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>직접 계산 → 올해 연도 - 태어난 연도 = 만나이 (단, 생일 지났으면 -1) → 헷갈림</li>
        <li>포털 검색 "만나이 계산기" → 있긴 한데 UI 복잡하거나 광고 가득</li>
        <li>네이버 계산기 → 기능은 있는데 한국나이, 띠까지 한 번에 안 나옴</li>
        <li>그냥 기억 → "나 올해 생일 지났던가?" 항상 헷갈리는 사람들 많음</li>
        <li>엑셀 함수 → DATEDIF 함수 알아야 하고 설정 복잡함</li>
      </ul>

      <p className="mb-4">
        만나이 하나만 계산하는 건 그나마 괜찮은데, 한국나이랑 띠까지 한 페이지에서 한 번에 확인하는 게 없어서 직접 만들었음. 특히 띠 계산은 생년월일 입력하면 바로 나와야 하는데, 따로 찾으러 가기 귀찮음.
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">그래서 직접 만들었음</h2>

      <p className="mb-3">생년월일 입력하면 만나이, 한국나이, 띠를 한번에 다 보여줌.</p>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">기본 기능:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>만나이 계산 → 오늘 날짜 기준, 생일 지났는지 자동 반영</li>
        <li>한국나이 계산 → 올해 연도 - 출생 연도 + 1 방식</li>
        <li>연나이 계산 → 올해 연도 - 출생 연도 (일부 법적 기준에 쓰임)</li>
        <li>12간지 띠 계산 → 쥐~돼지, 년도에 따라 자동 계산</li>
        <li>다음 생일까지 D-Day → 생일이 며칠 남았는지</li>
        <li>총 살아온 일수 → 태어난 날부터 오늘까지 며칠인지</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">한국나이 vs 만나이 정리:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>한국나이 → 태어나면 1살, 매년 1월 1일에 나이 증가</li>
        <li>만나이 → 태어나면 0살, 생일에 나이 증가 (국제 표준)</li>
        <li>연나이 → 현재 연도 - 출생 연도 (한국나이보다 1~2살 적을 수 있음)</li>
        <li>예: 2000년 12월생이면 2026년 1월 기준 → 한국나이 27, 만나이 25, 연나이 26</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">실제로 써보니</h2>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">좋은 점:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>세 가지 나이 + 띠 한 페이지에서 확인 → 따로 계산할 필요 없음</li>
        <li>생일 지났는지 자동 반영 → 직접 계산할 때 자주 틀리는 부분</li>
        <li>D-Day도 같이 → "내 생일 얼마 남았나" 궁금할 때 추가 정보</li>
        <li>빠름 → 입력하자마자 바로 결과 나옴</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">한계:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>두 사람 나이 차이 계산은 없음 → 커플 나이 차이 확인하려면 각자 따로 해야 함</li>
        <li>음력 생일 지원 없음 → 음력으로 생일 기억하는 분들은 먼저 양력 변환 필요</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">만나이 통일 이후 달라진 것들</h2>

      <p className="mb-3">2023년 6월 28일부터 법적으로 만나이 통일. 이게 실생활에서 뭐가 바뀌었냐면:</p>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">공식적으로 만나이 쓰는 곳:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>모든 법령, 행정 문서 → 만나이 기준으로 통일</li>
        <li>병원 차트 → 만나이</li>
        <li>보험 계약서 → 만나이</li>
        <li>각종 자격·지원 기준 → "만 OO세 이하/이상"으로 표시</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">예외적으로 연나이 쓰는 곳:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>병역 → 입영 연도 기준 연나이 적용 유지</li>
        <li>학교 입학 → 취학 연령은 연나이(만 6세) 기준 유지</li>
        <li>청소년보호법 → 연나이 기준 (만 나이로 바꾸면 같은 학년 친구가 어떤 날 성인 되는 문제 생기니까)</li>
      </ul>

      <p className="mb-4">
        그래서 아직도 상황 따라 다른 나이를 써야 함. 계산기 하나 북마크해두면 편함.
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">12간지 띠 완전 정리</h2>

      <p className="mb-3">그냥 보너스로:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>쥐 (子) → 1960, 1972, 1984, 1996, 2008, 2020</li>
        <li>소 (丑) → 1961, 1973, 1985, 1997, 2009, 2021</li>
        <li>호랑이 (寅) → 1962, 1974, 1986, 1998, 2010, 2022</li>
        <li>토끼 (卯) → 1963, 1975, 1987, 1999, 2011, 2023</li>
        <li>용 (辰) → 1964, 1976, 1988, 2000, 2012, 2024</li>
        <li>뱀 (巳) → 1965, 1977, 1989, 2001, 2013, 2025</li>
        <li>말 (午) → 1966, 1978, 1990, 2002, 2014, 2026</li>
        <li>양 (未) → 1967, 1979, 1991, 2003, 2015, 2027</li>
        <li>원숭이 (申) → 1968, 1980, 1992, 2004, 2016, 2028</li>
        <li>닭 (酉) → 1969, 1981, 1993, 2005, 2017, 2029</li>
        <li>개 (戌) → 1970, 1982, 1994, 2006, 2018, 2030</li>
        <li>돼지 (亥) → 1971, 1983, 1995, 2007, 2019, 2031</li>
      </ul>

      <p className="mb-4">계산기 쓰는 게 더 빠르긴 함 ㅋㅋ</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">사용법</h2>

      <ol className="space-y-1 mb-4 text-gray-700 dark:text-gray-300 list-decimal list-inside">
        <li>생년월일 입력 (연도, 월, 일)</li>
        <li>계산 버튼 클릭</li>
        <li>만나이, 한국나이, 연나이, 띠 한번에 확인</li>
        <li>다음 생일 D-Day, 총 살아온 일수도 함께 확인</li>
      </ol>

      <p className="mb-4">서류 작성 전에 한 번만 확인해두면 "이게 맞나?" 고민 없이 바로 쓸 수 있음.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">써보기</h2>

      <p className="mb-4">
        <Link href="/tools/age-calculator" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 나이 계산기 (만나이/한국나이/띠) 바로 가기
        </Link>
      </p>

      <p className="text-gray-600 dark:text-gray-400">
        만나이 통일 됐다고 해서 한국나이가 사라진 게 아님. 두 가지 다 알아야 하는 상황이 계속 생김. 한 번에 다 보여주는 계산기 하나 북마크해두면 편함.
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <p className="text-sm text-gray-500 dark:text-gray-400">
        #나이계산기 #만나이 #한국나이 #띠계산 #만나이통일 #생년월일계산 #12간지
      </p>
    </article>
  );
}
