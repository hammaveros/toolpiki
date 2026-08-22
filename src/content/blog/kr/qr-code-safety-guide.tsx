import Link from 'next/link';

export default function QrCodeSafetyGuidePost() {
  return (
    <article className="prose prose-gray dark:prose-invert max-w-none">
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">가이드 · 2026년 8월 23일 · 읽는 시간 8분</p>

      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        QR코드는 어떻게 30%가 가려져도 읽힐까 — 원리와 큐싱 사기 예방
      </h1>

      <p className="mb-4 text-gray-700 dark:text-gray-300">
        식당 테이블의 QR 스티커 한가운데에 가게 로고가 떡하니 박혀 있는데도 스캔이 된다. 모서리가 찢어진
        전단지의 QR도 읽힌다. 어떻게 가능한 걸까. 그리고 바로 그 관대함 때문에, 누군가 정상 QR 위에
        가짜 스티커를 덧붙이는 <strong>큐싱(Qshing, QR 피싱)</strong>이 가능해진다. QR코드의 구조를
        이해하면 편리함과 위험이 같은 원리에서 나온다는 걸 알 수 있다.
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">QR코드 해부도 — 네 가지 부품</h2>

      <ul className="space-y-2 mb-4 text-gray-700 dark:text-gray-300">
        <li>
          <strong>파인더 패턴 (세 모서리의 큰 사각형)</strong> — 카메라가 &ldquo;여기 QR이 있고, 이
          방향이 위&rdquo;를 인식하는 기준점. 네 모서리가 아니라 세 곳인 이유는, 빠진 한 곳으로 회전
          방향을 판별하기 위해서다. 거꾸로 찍어도 읽히는 비결.
        </li>
        <li>
          <strong>타이밍 패턴</strong> — 파인더 사이를 잇는 흑백 교차 점선. 모듈(칸)의 간격을 재는 자 역할.
        </li>
        <li>
          <strong>데이터 영역</strong> — 실제 내용이 담기는 부분. 흑백 칸 하나가 비트 하나다.
        </li>
        <li>
          <strong>콰이어트 존</strong> — 코드 둘레의 여백. 이걸 침범해 디자인하면 멀쩡한 코드도 인식률이
          뚝 떨어진다. 인쇄물에서 QR이 잘 안 찍히는 흔한 원인.
        </li>
      </ul>

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">가려져도 읽히는 이유 — 오류 정정</h2>

      <p className="mb-4 text-gray-700 dark:text-gray-300">
        QR코드는 데이터를 저장할 때 리드-솔로몬(Reed-Solomon) 오류 정정 부호를 함께 심는다. CD가
        긁혀도 재생되는 것과 같은 원리다. 생성할 때 네 단계 중 하나를 고르게 되어 있다.
      </p>

      <div className="overflow-x-auto mb-4">
        <table className="min-w-full text-sm border border-gray-200 dark:border-gray-700">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-800">
              <th className="px-3 py-2 text-left font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700">레벨</th>
              <th className="px-3 py-2 text-left font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700">복원 가능 손상</th>
              <th className="px-3 py-2 text-left font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700">어울리는 용도</th>
            </tr>
          </thead>
          <tbody className="text-gray-700 dark:text-gray-300">
            <tr className="border-b border-gray-100 dark:border-gray-800">
              <td className="px-3 py-2 font-medium">L</td>
              <td className="px-3 py-2">약 7%</td>
              <td className="px-3 py-2">화면 표시용, 데이터가 긴 경우</td>
            </tr>
            <tr className="border-b border-gray-100 dark:border-gray-800">
              <td className="px-3 py-2 font-medium">M</td>
              <td className="px-3 py-2">약 15%</td>
              <td className="px-3 py-2">일반 인쇄물 (가장 흔한 기본값)</td>
            </tr>
            <tr className="border-b border-gray-100 dark:border-gray-800">
              <td className="px-3 py-2 font-medium">Q</td>
              <td className="px-3 py-2">약 25%</td>
              <td className="px-3 py-2">야외 부착물, 오염 가능 환경</td>
            </tr>
            <tr>
              <td className="px-3 py-2 font-medium">H</td>
              <td className="px-3 py-2">약 30%</td>
              <td className="px-3 py-2">가운데 로고를 얹는 디자인 QR</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p className="mb-4 text-gray-700 dark:text-gray-300">
        로고 박힌 QR의 정체가 이것이다 — 레벨 H로 만들고 &ldquo;복원 가능한 30%&rdquo; 안에서 일부러
        가운데를 가린 것. 공짜는 아니어서, 정정 레벨을 올릴수록 같은 내용이라도 코드가 더 촘촘해지고
        (버전이 올라가고) 작게 인쇄했을 때 인식률이 떨어진다. 참고로 QR 버전은 1(21×21칸)부터
        40(177×177칸)까지 있고, 데이터가 길수록 자동으로 올라간다. URL을 짧게 유지해야 QR이 단순해져
        구겨진 포스터에서도 잘 읽힌다.
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">같은 원리의 어두운 면 — 큐싱(QR 피싱)</h2>

      <p className="mb-4 text-gray-700 dark:text-gray-300">
        QR의 본질적 약점은 <strong>사람이 내용을 읽을 수 없다</strong>는 것이다. 링크가 눈에 보이는
        문자라면 이상한 도메인을 알아챌 수 있지만, QR은 스캔하기 전까지 어디로 가는지 알 수 없다.
        이를 노린 수법이 실제로 반복 보고되고 있다.
      </p>

      <ul className="space-y-2 mb-4 text-gray-700 dark:text-gray-300">
        <li><strong>스티커 덧붙이기</strong> — 공영주차장 무인정산기, 공유 킥보드, 식당 테이블의 정상 QR 위에 가짜 QR 스티커를 붙여 가짜 결제 페이지로 유도</li>
        <li><strong>미납·과태료 안내문</strong> — 차량 와이퍼에 &ldquo;주차위반 납부&rdquo; 쪽지를 끼워 QR 결제를 유도</li>
        <li><strong>이메일 속 QR</strong> — 본문 링크는 보안 필터에 걸리니, 필터가 읽지 못하는 QR 이미지로 로그인 피싱 페이지를 전달</li>
      </ul>

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">스캔 전후 30초 체크리스트</h2>

      <ol className="space-y-2 mb-4 text-gray-700 dark:text-gray-300 list-decimal list-inside">
        <li><strong>물리적 스티커인지 만져 본다.</strong> 인쇄물 위에 덧붙인 스티커 QR은 일단 의심. 특히 결제·정산 기기에서.</li>
        <li><strong>스캔 직후 뜨는 URL 미리보기를 반드시 읽는다.</strong> 대부분의 카메라 앱은 이동 전에 주소를 보여준다. 이 한 단계를 건너뛰지 않는 게 핵심 방어선이다.</li>
        <li><strong>단축 URL이면 한 번 더 의심한다.</strong> 목적지를 숨기는 게 단축 URL의 기능이다. 공공기관·금융 안내가 단축 URL로 오는 경우는 드물다.</li>
        <li><strong>QR로 연 페이지에서는 로그인·카드번호 입력을 하지 않는다.</strong> 필요하면 QR 대신 공식 앱이나 주소 직접 입력으로 접근한다.</li>
        <li><strong>앱 설치를 요구하면 중단한다.</strong> QR → APK 다운로드 흐름은 전형적인 악성앱 배포 경로다.</li>
      </ol>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">만드는 쪽을 위한 팁</h2>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>인쇄물은 오류 정정 M 이상, 야외 부착물은 Q~H로</li>
        <li>URL은 짧게 (긴 파라미터는 서버 쪽 리다이렉트로 처리)</li>
        <li>코드 둘레 여백(콰이어트 존)을 디자인으로 침범하지 않기</li>
        <li>배포 전 인쇄 실물로, 밝은 곳/어두운 곳에서 스캔 테스트</li>
        <li>사용자 신뢰를 위해 QR 아래에 목적지 도메인을 텍스트로 함께 인쇄</li>
      </ul>

      <p className="mb-4 text-gray-700 dark:text-gray-300">
        오류 정정 레벨을 바꿔 가며 QR이 어떻게 달라지는지 보고 싶다면{' '}
        <Link href="/tools/qr-generator" className="text-blue-600 dark:text-blue-400 font-medium hover:underline">
          QR코드 생성기
        </Link>
        에서 직접 만들어 비교해 볼 수 있다.
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <p className="text-sm text-gray-500 dark:text-gray-400">
        #QR코드원리 #오류정정 #큐싱 #QR피싱 #보안 #QR코드생성
      </p>
    </article>
  );
}
