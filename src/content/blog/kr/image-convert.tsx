import Link from 'next/link';

export default function ImageConvertPost() {
  return (
    <article className="prose prose-gray dark:prose-invert max-w-none">
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">이미지 · 2026-06-15 · 4분 읽기</p>

      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        PNG를 JPEG나 WebP로 바꿔야 하는데, 툴 찾다가 더 피곤해짐
      </h1>

      <p className="mb-4">
        <Link href="/tools/image-convert" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 이미지 포맷 변환기 바로 가기
        </Link>
      </p>

      <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 dark:text-gray-400 mb-6">
        블로그에 올릴 이미지가 PNG인데, 용량이 너무 커서 WebP로 바꿔야 한다는 걸 알고 있음. 근데 어디서 어떻게 바꾸는지 매번 까먹음.
      </blockquote>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">언제 필요한지</h2>

      <p className="mb-3">생각보다 자주 있는 상황들:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>웹사이트에 이미지 올릴 때 → PNG 그대로 쓰면 로딩 느려짐</li>
        <li>디자이너한테 받은 파일이 PNG인데 → 웹 최적화 위해 JPEG이나 WebP로 바꿔야 함</li>
        <li>Next.js, Gatsby 같은 프레임워크 쓸 때 → WebP 쓰면 성능 점수 올라감</li>
        <li>노션/슬랙에 이미지 첨부할 때 → 용량 제한 걸려서 압축 필요</li>
        <li>스크린샷이 PNG인데 → 메일 첨부용으로 JPEG이 더 가벼움</li>
        <li>앱 개발 중 에셋 최적화 → 아이콘, 배너 이미지 포맷 통일</li>
        <li>구글 PageSpeed Insights에서 "이미지 최적화" 권고 받을 때 → WebP 변환이 대표적인 해결책</li>
      </ul>

      <p className="mb-4">매번 생기는 일은 아닌데, 막상 필요할 때마다 매번 찾게 됨.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">기존 방법 문제</h2>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>포토샵, GIMP → 설치 필요하고 오버스펙. 포맷 바꾸려고 앱 켜는 게 귀찮음</li>
        <li>맥북 미리보기 → JPEG, PNG는 되는데 WebP 내보내기는 안 됨</li>
        <li>온라인 툴 검색 → 광고 가득한 사이트들. "변환" 버튼 누르면 회원가입 팝업 뜸</li>
        <li>파이썬 Pillow로 직접 변환 → 할 줄 알긴 한데 매번 스크립트 꺼내는 게 번거로움</li>
        <li>Squoosh (Google) → 좋은데 한 번에 하나씩만 가능. 여러 장이면 반복 작업</li>
        <li>FFmpeg 명령어 → 이미지도 되긴 되는데 플래그 외우기 귀찮음</li>
      </ul>

      <p className="mb-4">결국 "그냥 PNG로 올리지 뭐"가 되는 경우가 많음. 근데 나중에 성능 최적화 할 때 후회함.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">그래서 만들었음</h2>

      <p className="mb-3">귀찮아서 직접 만든 변환 툴. 브라우저에서 바로 됨:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>PNG → JPEG / WebP / BMP / GIF 변환</li>
        <li>JPEG → PNG / WebP 변환</li>
        <li>WebP → PNG / JPEG 변환</li>
        <li>이미지 품질 슬라이더 → JPEG/WebP는 0~100 사이에서 조절 가능</li>
        <li>배경색 선택 → PNG 투명 영역을 원하는 색으로 채울 수 있음 (기본 흰색)</li>
        <li>변환 결과 미리보기 → 다운받기 전에 확인 가능</li>
        <li>원본 파일 서버 전송 없음 → 브라우저에서만 처리됨</li>
      </ul>

      <p className="mb-3">특히 PNG에서 JPEG로 바꿀 때 배경색 지정이 중요함. 투명 배경이 있는 PNG를 그냥 JPEG로 변환하면 원래 검은색으로 깔려버리는 경우가 많음. 이 툴은 직접 배경색을 선택할 수 있어서 그 문제를 피할 수 있음.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">WebP가 왜 좋은가</h2>

      <p className="mb-3">간단히 정리하면:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>JPEG 대비 25~35% 더 작은 파일 크기 → 같은 화질인데 용량이 줄어듦</li>
        <li>PNG처럼 투명 배경 지원 → JPEG는 투명 불가, PNG는 무거움. WebP는 둘 다 됨</li>
        <li>구글 PageSpeed에서 WebP 사용 권장 → Core Web Vitals 점수에 영향</li>
        <li>Chrome, Firefox, Safari, Edge 모두 지원 → IE 빼고는 다 됨 (IE는 이미 죽었음)</li>
      </ul>

      <p className="mb-4">이미지 많이 쓰는 블로그나 쇼핑몰 운영하면 WebP로 바꾸는 것만으로 로딩 속도 눈에 띄게 빨라짐.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">JPEG vs PNG vs WebP 비교</h2>

      <p className="mb-3">언제 뭘 쓸지 헷갈릴 때 참고:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>사진, 풍경 이미지 → JPEG (손실 압축이지만 사진은 티 안 남)</li>
        <li>투명 배경 필요한 로고, 아이콘 → PNG 또는 WebP</li>
        <li>웹에서 쓸 모든 이미지 → WebP (지원 여부만 확인하면 최선의 선택)</li>
        <li>인쇄용 고화질 이미지 → PNG (무손실이라 품질 보존)</li>
        <li>GIF 대신 애니메이션 → WebP 애니메이션 (GIF보다 용량 훨씬 작음)</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">실제로 써보니</h2>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">좋은 점:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>파일 업로드하고 포맷 선택하면 바로 됨 → 복잡한 설정 없음</li>
        <li>품질 슬라이더로 용량 vs 화질 조절 가능 → 직접 보면서 조정함</li>
        <li>배경색 채우기 기능 → 투명 PNG 변환할 때 검은색 되는 문제 없음</li>
        <li>미리보기로 결과 확인 후 다운로드 → 낭비 없음</li>
        <li>개인정보 걱정 없음 → 서버에 이미지 안 올라감</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">한계:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>한 번에 한 파일만 → 여러 장 일괄 변환은 안 됨</li>
        <li>이미지 크기 조절은 별도 툴 필요 → 포맷 변환만 지원</li>
        <li>SVG, TIFF 같은 특수 포맷은 지원 안 됨</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">사용법</h2>

      <ol className="space-y-1 mb-4 text-gray-700 dark:text-gray-300 list-decimal list-inside">
        <li>이미지 파일 올리기 (드래그 앤 드롭 또는 클릭)</li>
        <li>변환할 포맷 선택 (JPEG / WebP / PNG / BMP / GIF)</li>
        <li>품질 슬라이더 조정 (필요하면)</li>
        <li>PNG → JPEG라면 배경색 선택</li>
        <li>미리보기 확인 후 다운로드</li>
      </ol>

      <p className="mb-4">30초면 끝남.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">써보기</h2>

      <p className="mb-4">
        <Link href="/tools/image-convert" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 이미지 포맷 변환기 바로 가기
        </Link>
      </p>

      <p className="text-gray-600 dark:text-gray-400">설치 필요 없음. 회원가입 없음. 그냥 쓰면 됨.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <p className="text-sm text-gray-500 dark:text-gray-400">
        #이미지변환 #PNG변환 #WebP변환 #이미지최적화 #웹성능 #이미지포맷
      </p>
    </article>
  );
}
