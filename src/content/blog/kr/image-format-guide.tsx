import Link from 'next/link';

export default function ImageFormatGuidePost() {
  return (
    <article className="prose prose-gray dark:prose-invert max-w-none">
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">가이드 · 2026년 8월 22일 · 읽는 시간 9분</p>

      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        JPG vs PNG vs WebP vs AVIF — 지금 뭘 써야 하는지 정리
      </h1>

      <p className="mb-4 text-gray-700 dark:text-gray-300">
        스크린샷은 왜 PNG로 찍으면 선명하고 JPG로 저장하면 글자가 번질까. 블로그 이미지는 WebP로 바꾸면
        정말 빨라질까. AVIF는 이제 그냥 써도 되나. 이미지 포맷 선택은 &ldquo;용량 vs 품질 vs 호환성&rdquo;의
        삼각 트레이드오프인데, 2026년 현재는 답이 꽤 명확해졌다. 결론부터 표로 보고, 이유를 풀어 본다.
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">결론 요약</h2>

      <div className="overflow-x-auto mb-4">
        <table className="min-w-full text-sm border border-gray-200 dark:border-gray-700">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-800">
              <th className="px-3 py-2 text-left font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700">상황</th>
              <th className="px-3 py-2 text-left font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700">추천</th>
              <th className="px-3 py-2 text-left font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700">이유</th>
            </tr>
          </thead>
          <tbody className="text-gray-700 dark:text-gray-300">
            <tr className="border-b border-gray-100 dark:border-gray-800">
              <td className="px-3 py-2">웹사이트·블로그 사진</td>
              <td className="px-3 py-2 font-medium">WebP (여유 되면 AVIF)</td>
              <td className="px-3 py-2">JPG 대비 25~50% 작고 전 브라우저 지원</td>
            </tr>
            <tr className="border-b border-gray-100 dark:border-gray-800">
              <td className="px-3 py-2">스크린샷·UI·로고</td>
              <td className="px-3 py-2 font-medium">PNG (웹 게시는 무손실 WebP)</td>
              <td className="px-3 py-2">글자·경계선이 뭉개지지 않는 무손실</td>
            </tr>
            <tr className="border-b border-gray-100 dark:border-gray-800">
              <td className="px-3 py-2">투명 배경 필요</td>
              <td className="px-3 py-2 font-medium">PNG 또는 WebP</td>
              <td className="px-3 py-2">JPG는 투명도 자체가 없음</td>
            </tr>
            <tr className="border-b border-gray-100 dark:border-gray-800">
              <td className="px-3 py-2">아이콘·일러스트(도형 기반)</td>
              <td className="px-3 py-2 font-medium">SVG</td>
              <td className="px-3 py-2">확대해도 안 깨지고 용량이 극단적으로 작음</td>
            </tr>
            <tr className="border-b border-gray-100 dark:border-gray-800">
              <td className="px-3 py-2">카메라 원본 보관·인쇄</td>
              <td className="px-3 py-2 font-medium">JPG(고품질) 또는 원본 유지</td>
              <td className="px-3 py-2">호환성 최강, 모든 기기·인쇄소에서 열림</td>
            </tr>
            <tr>
              <td className="px-3 py-2">움직이는 짤</td>
              <td className="px-3 py-2 font-medium">WebP/MP4 (GIF는 지양)</td>
              <td className="px-3 py-2">GIF는 256색 + 용량 폭탄</td>
            </tr>
          </tbody>
        </table>
      </div>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">원리 하나만 알면 절반은 끝 — 손실 vs 무손실</h2>

      <p className="mb-4 text-gray-700 dark:text-gray-300">
        <strong>손실 압축(JPG)</strong>은 사람 눈이 둔감한 정보(미세한 색 변화)를 버려서 용량을 줄인다.
        사진처럼 색이 연속적으로 변하는 이미지에선 버린 티가 안 나지만, 스크린샷처럼 색 경계가 칼같이
        떨어지는 이미지에선 경계 주변에 지저분한 노이즈(압축 아티팩트)가 생긴다. 글자 주위가 번져 보이는
        게 바로 그것이다.
      </p>

      <p className="mb-4 text-gray-700 dark:text-gray-300">
        <strong>무손실 압축(PNG)</strong>은 정보를 하나도 버리지 않고 규칙성만 압축한다. 그래서 스크린샷·
        로고·차트가 선명하게 유지된다. 대신 색이 복잡한 사진을 PNG로 저장하면 JPG의 5~10배 용량이 된다.
        &ldquo;사진은 JPG, 그림·화면은 PNG&rdquo;라는 오래된 공식이 여기서 나왔다.
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">WebP — 이제 기본값으로 써도 되는 이유</h2>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>손실·무손실·투명도·애니메이션을 <strong>하나의 포맷</strong>이 전부 지원</li>
        <li>손실 모드에서 JPG 대비 대략 25~35% 작은 용량 (동일 체감 품질 기준)</li>
        <li>Chrome·Safari·Firefox·Edge 전부 지원 — 호환성 문제는 사실상 끝난 이슈</li>
      </ul>

      <p className="mb-4 text-gray-700 dark:text-gray-300">
        남은 단점은 웹 바깥이다. 오래된 포토샵 버전이나 일부 사내 시스템·문서 편집기가 WebP 업로드를
        안 받는 경우가 아직 있다. 그래서 &ldquo;웹에 올리는 건 WebP, 누군가에게 파일로 전달하는 건
        JPG/PNG&rdquo;가 현실적인 운영 규칙이다.
      </p>

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">AVIF — 더 작지만, 조건이 있다</h2>

      <p className="mb-4 text-gray-700 dark:text-gray-300">
        AVIF는 동영상 코덱 AV1에서 나온 포맷으로, 같은 품질에서 WebP보다도 20~30% 더 작다. 저용량
        구간에서 특히 강해서, 히어로 이미지·썸네일처럼 트래픽을 많이 먹는 곳에 효과가 크다. 주요
        브라우저 지원도 완료됐다. 대신 <strong>인코딩이 느리고</strong>(빌드 시간 증가), 편집 도구
        호환성이 WebP보다도 낮다. 이미지 CDN이나 Next.js 이미지 최적화처럼 변환을 자동화해 주는 파이프라인이
        있다면 켜고, 수동으로 파일을 관리한다면 WebP까지만 해도 충분하다.
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">놓치기 쉬운 실전 포인트</h2>

      <ol className="space-y-2 mb-4 text-gray-700 dark:text-gray-300 list-decimal list-inside">
        <li>
          <strong>포맷보다 리사이즈가 먼저다.</strong> 4000px 원본을 WebP로 바꾸는 것보다, 실제 표시
          크기(예: 800px)로 줄이는 게 용량을 훨씬 크게 깎는다. 순서는 리사이즈 → 포맷 변환 → 품질 조절.
        </li>
        <li>
          <strong>품질 100은 낭비다.</strong> 손실 포맷의 품질 75~85 구간이 체감 차이 없이 용량을 절반
          이하로 만드는 스위트 스폿이다.
        </li>
        <li>
          <strong>투명 PNG를 JPG로 바꾸면 배경이 검게(또는 희게) 깔린다.</strong> JPG에는 알파 채널이
          없어서다. 투명도가 필요하면 선택지는 PNG·WebP·AVIF뿐이다.
        </li>
        <li>
          <strong>재압축을 반복하지 말 것.</strong> 손실 포맷은 저장할 때마다 화질이 누적으로 깎인다.
          편집 원본은 무손실로 보관하고, 배포본만 손실 포맷으로 내보내는 습관이 안전하다.
        </li>
      </ol>

      <p className="mb-4 text-gray-700 dark:text-gray-300">
        가지고 있는 이미지를 포맷별로 바꿔 용량을 비교해 보고 싶다면{' '}
        <Link href="/tools/image-convert" className="text-blue-600 dark:text-blue-400 font-medium hover:underline">
          이미지 변환 도구
        </Link>
        와{' '}
        <Link href="/tools/image-compress" className="text-blue-600 dark:text-blue-400 font-medium hover:underline">
          이미지 압축 도구
        </Link>
        로 브라우저 안에서 바로 실험할 수 있다 (파일이 서버로 올라가지 않는다).
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <p className="text-sm text-gray-500 dark:text-gray-400">
        #이미지포맷 #WebP #AVIF #JPG #PNG #웹성능 #이미지최적화
      </p>
    </article>
  );
}
