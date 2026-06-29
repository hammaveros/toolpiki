import Link from 'next/link';

export default function ImageRotatePost() {
  return (
    <article className="prose prose-gray dark:prose-invert max-w-none">
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">이미지 · 2026년 7월 11일 · 읽는 시간 3분</p>

      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        사진이 옆으로 누워 있는데, 회전 한 번 하려고 뭘 깔아야 하나
      </h1>

      <p className="mb-4">
        <Link href="/tools/image-rotate" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 이미지 회전/반전 바로 가기
        </Link>
      </p>

      <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 dark:text-gray-400 mb-6">
        스마트폰으로 찍은 사진이 컴퓨터에서 90도 돌아가 있다. 그냥 회전만 하면 되는데 뭘 설치해야 하나.
      </blockquote>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">이미지 회전/반전이 필요한 순간</h2>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>스마트폰 가로로 찍은 사진 → PC에서 세로로 보임 (EXIF 방향 정보 미반영 문제)</li>
        <li>스캔한 문서 → 스캐너 방향에 따라 뒤집혀서 나옴</li>
        <li>좌우 반전 → 텍스트가 포함된 이미지 반전, 셀카 보정</li>
        <li>수평/수직 보정 → 비뚤어진 사진 똑바로 맞추기</li>
        <li>워터마크 우회 방지용 → 원본 방향 복원</li>
      </ul>

      <p className="mb-4">특히 iPhone으로 찍은 사진을 윈도우로 옮기면 HEIC → JPEG 변환 과정에서 방향이 틀어지는 경우가 있다. 그럴 때 매번 포토샵 켜기 싫어서 만들었다.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">기존 방법의 문제</h2>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>윈도우 사진 앱 → 회전은 되는데 반전 기능이 없음</li>
        <li>macOS 미리보기 → 기능은 있지만 저장 시 재압축 발생</li>
        <li>그림판 → 회전 각도가 90도 단위로만 됨, 자유 각도 안 됨</li>
        <li>포토샵 → 단순 회전 하나에 과한 도구</li>
        <li>온라인 사이트 → 서버 업로드 필요, 광고 많음</li>
      </ul>

      <p className="mb-4">그냥 브라우저에서 이미지 올리고 90도 돌리고 다운로드하면 되잖아. 왜 없지?</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">간단하게 만든 것</h2>

      <p className="mb-3">서버 없이 Canvas API로 로컬 처리. 파일이 외부로 안 나간다.</p>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">지원 기능:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>시계방향 90도 회전</li>
        <li>반시계방향 90도 회전</li>
        <li>180도 회전</li>
        <li>좌우 반전 (수평 뒤집기)</li>
        <li>상하 반전 (수직 뒤집기)</li>
        <li>자유 각도 입력 (1~360도)</li>
        <li>출력 형식 선택 (JPEG/PNG)</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">지원 입력 형식:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>JPEG, PNG, GIF, WebP, BMP</li>
        <li>드래그 앤 드롭 가능</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">실제로 써보니</h2>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">좋은 점:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>빠르다 → 로컬 처리라 업로드 대기 없음</li>
        <li>좌우 반전이 가능 → 윈도우 기본 사진 앱에서 안 되는 기능</li>
        <li>자유 각도 → 비뚤어진 사진 미세 조정 가능</li>
        <li>파일이 서버로 안 감 → 개인 사진 써도 안심</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">한계:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>자유 각도 회전 시 배경 여백 생김 → 후처리로 자르기 필요할 수 있음</li>
        <li>GIF 애니메이션은 첫 프레임만 처리됨</li>
        <li>여러 장 배치 회전은 지원 안 됨</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">사용법</h2>

      <ol className="space-y-1 mb-4 text-gray-700 dark:text-gray-300 list-decimal list-inside">
        <li>이미지 드래그 앤 드롭 또는 클릭해서 올리기</li>
        <li>회전/반전 버튼 클릭</li>
        <li>미리보기 확인</li>
        <li>다운로드</li>
      </ol>

      <p className="mb-4">10초면 된다.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">써보기</h2>

      <p className="mb-4">
        <Link href="/tools/image-rotate" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 이미지 회전/반전 바로 가기
        </Link>
      </p>

      <p className="text-gray-600 dark:text-gray-400">설치 없이, 서버 없이, 10초 안에.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <p className="text-sm text-gray-500 dark:text-gray-400">
        #이미지회전 #사진회전 #이미지반전 #사진뒤집기 #무료이미지편집
      </p>
    </article>
  );
}
