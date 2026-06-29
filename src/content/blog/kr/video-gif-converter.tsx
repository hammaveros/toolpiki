import Link from 'next/link';

export default function VideoGifPost() {
  return (
    <article className="prose prose-gray dark:prose-invert max-w-none">
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">이미지 · 2026-06-18 · 4분 읽기</p>

      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        동영상을 GIF로 만들어야 하는데, 슬랙에 올리려고 변환 사이트 세 군데나 뒤짐
      </h1>

      <p className="mb-4">
        <Link href="/tools/video-gif-converter" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 동영상 → GIF 변환기 바로 가기
        </Link>
      </p>

      <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 dark:text-gray-400 mb-6">
        화면 녹화로 버그 상황 캡처했는데, MP4를 노션에 그냥 올리면 재생이 안 되고, 슬랙에 올리면 용량 제한 걸림. GIF로 바꿔야 함.
      </blockquote>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">언제 필요한지</h2>

      <p className="mb-3">개발자, 디자이너, 콘텐츠 작성자 모두 겪는 상황들:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>버그 리포트 → 재현 영상을 GIF로 만들어서 GitHub Issue에 첨부</li>
        <li>UI 애니메이션 시연 → 디자이너가 목업 영상을 GIF로 변환해서 피그마 코멘트에 삽입</li>
        <li>슬랙 공유 → 짧은 화면 녹화를 GIF로 올리면 인라인으로 바로 보임</li>
        <li>노션 문서 → 동영상은 임베드가 복잡하지만 GIF는 그냥 드래그로 넣으면 됨</li>
        <li>깃헙 README → 프로젝트 데모 GIF 넣으면 훨씬 직관적으로 보임</li>
        <li>블로그, 소셜 미디어 → 자동재생 영상처럼 쓸 수 있음</li>
        <li>내부 문서 → 반복 작업 과정이나 튜토리얼을 짧게 GIF로 정리</li>
      </ul>

      <p className="mb-4">동영상 파일 자체를 공유하면 재생 환경, 코덱, 용량 문제가 생김. GIF는 그냥 이미지처럼 어디서든 열림.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">기존 방법 문제</h2>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>EZGIF, gifski 같은 온라인 툴 → 오래된 UI, 광고 범벅, 업로드 용량 제한 있음</li>
        <li>FFmpeg 명령어 변환 → <code>ffmpeg -i input.mp4 -vf "fps=10,scale=480:-1" output.gif</code> 이거 외우는 사람 거의 없음</li>
        <li>After Effects, Premiere → 포맷 변환 하나 하려고 무거운 소프트웨어 켜는 건 오버</li>
        <li>Gifox, GIPHY Capture (맥 전용 앱) → 설치해야 함, 무료 버전엔 워터마크</li>
        <li>QuickTime → GIF 직접 내보내기 안 됨</li>
        <li>윈도우 앱들 → 광고 없는 무료 앱 찾기가 생각보다 어려움</li>
      </ul>

      <p className="mb-4">결국 매번 검색해서 그나마 나은 사이트 찾고, 광고 닫고, 업로드하고, 기다리고… 단순한 변환인데 괜히 시간 씀.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">그래서 만들었음</h2>

      <p className="mb-3">브라우저에서 바로 동작하는 변환 툴. 기능 정리:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>MP4, WebM, AVI, MOV 등 주요 포맷 지원</li>
        <li>시작/종료 시간 지정 → 원하는 구간만 잘라서 GIF로 만들 수 있음</li>
        <li>FPS 조절 → 낮추면 파일 크기 줄어듦 (15fps 정도면 대부분 충분)</li>
        <li>출력 너비 조절 → 화질과 용량 사이 밸런스 맞추기</li>
        <li>변환 중 미리보기 → 실시간으로 결과 확인</li>
        <li>완성된 GIF 즉시 다운로드</li>
        <li>브라우저 내 처리 → 영상 파일 서버에 안 올라감</li>
      </ul>

      <p className="mb-3">핵심은 구간 지정과 FPS 조절임. 30초짜리 화면 녹화에서 핵심 5초만 뽑아서 낮은 FPS로 저장하면 슬랙 올리기 딱 좋은 크기로 나옴.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">GIF 용량 줄이는 팁</h2>

      <p className="mb-3">GIF가 예상보다 크게 나오는 경우가 많음. 줄이는 방법:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>구간 최소화 → 필요한 부분만 잘라내기. 3~5초가 이상적</li>
        <li>FPS 낮추기 → 10~15fps면 대부분 충분. 24fps는 GIF에서 오버임</li>
        <li>너비 줄이기 → 480px 정도면 슬랙/노션에서 보기 충분</li>
        <li>색상 단순한 부분 캡처 → 색이 많을수록 GIF 용량이 커짐</li>
        <li>배경 움직임 줄이기 → 정적인 화면에서 특정 부분만 움직이는 화면이 GIF에 유리</li>
      </ul>

      <p className="mb-4">슬랙 무료 플랜은 파일 1개당 1GB 제한이라 크게 신경 안 써도 되지만, GitHub Issue는 10MB 제한이 있어서 잘 최적화해야 함.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">어디에 올리면 좋은가</h2>

      <p className="mb-3">각 플랫폼별 GIF 활용 방법:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>GitHub Issues / PR → 재현 버그, 기능 시연. 10MB 이하면 바로 임베드됨</li>
        <li>슬랙 → 팀 채널에 올리면 인라인으로 자동 표시. 채팅처럼 공유 가능</li>
        <li>노션 → 이미지처럼 드래그 앤 드롭으로 삽입. GIF 자동 재생됨</li>
        <li>README.md → 프로젝트 데모, 설치 과정, 기능 소개에 효과적</li>
        <li>지라 티켓 → 이슈 설명에 첨부하면 말로 설명하는 것보다 훨씬 명확</li>
        <li>트위터/X → 자동 재생되는 GIF로 활용 가능 (용량 제한 있음)</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">실제로 써보니</h2>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">좋은 점:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>구간 지정 + FPS 조절 → 원하는 결과 바로 뽑을 수 있음</li>
        <li>브라우저에서 처리 → 영상 파일 외부로 안 나감</li>
        <li>설치 없음 → 즉시 사용</li>
        <li>슬랙/노션/깃헙 올릴 용도로는 충분한 품질</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">한계:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>영상 파일이 크면 브라우저에서 처리 시간 걸릴 수 있음</li>
        <li>GIF 특성상 색상 수 제한이 있어서 사진처럼 색이 풍부한 영상은 품질 차이 있음</li>
        <li>자막, 텍스트 합성 같은 편집 기능은 없음</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">사용법</h2>

      <ol className="space-y-1 mb-4 text-gray-700 dark:text-gray-300 list-decimal list-inside">
        <li>동영상 파일 업로드 (드래그 또는 클릭)</li>
        <li>시작/종료 시간 지정 (기본은 전체 구간)</li>
        <li>FPS 설정 (10~15 권장)</li>
        <li>출력 너비 조절 (480px 권장)</li>
        <li>변환 버튼 클릭 → 미리보기 확인</li>
        <li>다운로드</li>
      </ol>

      <p className="mb-4">짧은 영상이면 1분 안에 끝남.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">써보기</h2>

      <p className="mb-4">
        <Link href="/tools/video-gif-converter" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 동영상 → GIF 변환기 바로 가기
        </Link>
      </p>

      <p className="text-gray-600 dark:text-gray-400">설치 없이, 회원가입 없이. 그냥 파일 올리면 됨.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <p className="text-sm text-gray-500 dark:text-gray-400">
        #GIF변환 #동영상GIF #MP4GIF #슬랙공유 #깃헙이슈 #노션GIF #개발자툴
      </p>
    </article>
  );
}
