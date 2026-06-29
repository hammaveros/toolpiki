import Link from 'next/link';

export default function EmojiPickerPost() {
  return (
    <article className="prose prose-gray dark:prose-invert max-w-none">
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">텍스트 · 2026년 7월 3일 · 읽는 시간 3분</p>

      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        이모지 검색, OS 내장 기능이 생각보다 불편해서 따로 만들었음
      </h1>

      <p className="mb-4">
        <Link href="/tools/emoji-picker" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 이모지 검색/복사 바로 가기
        </Link>
      </p>

      <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 dark:text-gray-400 mb-6">
        슬랙 메시지에 이모지 달려고 하는데, 원하는 이모지가 있는지 없는지 찾기가 너무 불편하다.
      </blockquote>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">이모지가 필요한 상황</h2>

      <p className="mb-3">생각보다 다양한 곳에서 쓴다:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>슬랙/노션 문서 → 섹션 구분, 아이콘 역할</li>
        <li>블로그 제목 → 시선을 끌기 위해</li>
        <li>SNS 포스트 → 감정 표현, 포인트 강조</li>
        <li>마케팅 문자/이메일 → 눈에 띄게</li>
        <li>프레젠테이션 → 텍스트 설명 보조</li>
        <li>깃허브 README → 섹션 구분, 상태 표시</li>
      </ul>

      <p className="mb-4">PC에서 이모지 쓰려면 방법이 제한적이다. 윈도우는 Win+마침표, 맥은 Ctrl+Cmd+Space인데 검색이 한글로 안 되거나 느릴 때가 있다.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">OS 기본 이모지 선택기의 불편함</h2>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>한글 검색 안 됨 → 영어로 입력해야 함 ("heart", "fire" 등)</li>
        <li>검색 결과가 적음 → 특정 이모지 찾기 어려움</li>
        <li>카테고리가 너무 세분화 → 원하는 이모지 카테고리 찾기 번거로움</li>
        <li>복사 후 창이 닫힘 → 여러 개 복사하려면 계속 열어야 함</li>
        <li>앱마다 이모지 패널 없는 경우도 있음 → VS Code, 터미널 등</li>
      </ul>

      <p className="mb-4">결국 구글에서 "이모지 복사" 검색하고 사이트에서 복붙하게 된다.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">그래서 만들었음</h2>

      <p className="mb-3">이모지 검색하고 바로 복사하는 기능만 집중했다:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li><strong>한글 검색</strong> → "하트", "불꽃", "체크" 등으로 검색 가능</li>
        <li><strong>영어 검색</strong> → heart, fire, check 등</li>
        <li><strong>카테고리 필터</strong> → 얼굴, 음식, 여행, 사물 등</li>
        <li><strong>이모지 클릭 → 바로 복사</strong> → 클립보드에 즉시</li>
        <li><strong>최근 사용 이모지</strong> → 자주 쓰는 것 빠르게 접근</li>
        <li><strong>유니코드 포인트 표시</strong> → 개발용으로 코드값 확인</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">이모지 버전과 호환성</h2>

      <p className="mb-3">이모지도 버전이 있고 플랫폼마다 다르게 보일 수 있다:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li><strong>Emoji 15.1 (2023)</strong> → 최신 버전, 지원 안 하는 OS도 있음</li>
        <li><strong>Emoji 14.0 (2021)</strong> → 대부분의 현대 OS 지원</li>
        <li>카카오톡, 슬랙, 트위터 → 자체 이모지 이미지 사용 (다르게 보임)</li>
        <li>Windows, macOS, Android → 같은 이모지도 디자인이 다름</li>
      </ul>

      <p className="mb-4">유니코드 자체는 같아서 텍스트로는 전달되지만, 렌더링 모습이 다를 수 있다는 점 알아두면 좋다.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">개발자에게 유용한 기능</h2>

      <p className="mb-3">이모지를 코드에서 쓸 때:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>유니코드 코드포인트 → U+1F525 형식으로 표시</li>
        <li>HTML 엔티티 → &#128293; 형식</li>
        <li>JavaScript 유니코드 이스케이프 → \u{"{1F525}"} 형식</li>
        <li>바이트 수 → UTF-8 기준 (이모지는 보통 4바이트)</li>
      </ul>

      <p className="mb-4">데이터베이스에 이모지 저장할 때 utf8mb4 지원 여부 확인도 필요한 상황에서 참고가 된다.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">실제로 써보니</h2>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">좋은 점:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>한글 검색 가능 → "하트 눈" 같은 표현으로 찾기</li>
        <li>클릭 한 번에 복사 → 창 닫히지 않음</li>
        <li>여러 개 연속 복사 → 이모지 목록 모아서 한꺼번에 복사</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">한계:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>최신 이모지는 검색 데이터 업데이트가 늦을 수 있음</li>
        <li>각 플랫폼에서 실제 어떻게 보이는지 미리보기는 없음</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">사용법</h2>

      <ol className="space-y-1 mb-4 text-gray-700 dark:text-gray-300 list-decimal list-inside">
        <li>원하는 이모지 검색 (한글/영어)</li>
        <li>이모지 클릭 → 복사</li>
        <li>끝</li>
      </ol>

      <p className="mb-4">2초면 된다.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">써보기</h2>

      <p className="mb-4">
        <Link href="/tools/emoji-picker" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 이모지 검색/복사 바로 가기
        </Link>
      </p>

      <p className="text-gray-600 dark:text-gray-400">회원가입 없이 바로 쓸 수 있다.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <p className="text-sm text-gray-500 dark:text-gray-400">
        #이모지검색 #이모지복사 #이모지찾기 #한글이모지검색 #이모지피커 #무료도구
      </p>
    </article>
  );
}
