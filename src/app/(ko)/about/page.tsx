import type { Metadata } from 'next';
import { siteConfig } from '@/data/site';

export const metadata: Metadata = {
  title: `소개 - ${siteConfig.name}`,
  description: `${siteConfig.name}은 회원가입 없이 브라우저에서 바로 쓸 수 있는 무료 온라인 도구 모음입니다. 운영 철학과 도구 추가 기준, 데이터 처리 방침을 소개합니다.`,
};

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
        ToolPiki 소개
      </h1>

      <div className="prose dark:prose-invert max-w-none space-y-6">
        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
            ToolPiki는 어떤 사이트인가요?
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            ToolPiki(toolpiki.com)는 매일 반복적으로 발생하는 작은 작업들을 더 빠르고 깔끔하게 처리할 수 있도록 만든
            웹 도구 모음입니다. 사이트 이름은 영어 &quot;Tool&quot;과 &quot;Pick&quot;을 합친 말로,
            <strong> 필요한 도구를 골라서 바로 쓴다</strong>는 사용 흐름을 그대로 담았습니다.
            글자수를 세고, JSON을 정리하고, 이미지를 압축하고, QR 코드를 만들고, 색상 코드를 변환하는 일은
            매번 검색해서 처음부터 시작하기에는 사소하지만, 모이면 시간이 적지 않게 듭니다.
            ToolPiki는 그 시간을 아껴주기 위한 작은 작업대 같은 사이트를 지향합니다.
          </p>
          <p className="text-gray-700 dark:text-gray-300 mt-3">
            대부분의 도구는 별도 가입이나 로그인 없이 페이지에 들어가는 즉시 사용할 수 있고,
            결과는 입력과 동시에 자동으로 갱신됩니다. 결과는 클립보드 복사 또는 파일 다운로드 형태로 가져갈 수 있으며,
            자주 쓰는 도구는 별표 아이콘으로 즐겨찾기에 등록해 두면 다음 방문에 메인 화면에서 바로 열립니다.
            현재 100개가 넘는 도구를 운영하고 있고, 카테고리별로 정리된 목록과 검색창에서 원하는 도구를 빠르게 찾으실 수 있습니다.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
            운영 철학과 도구를 만드는 이유
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            ToolPiki는 <strong>광고 가득한 도구 사이트에서 같은 작업을 반복하다 지쳐서 만든 사이트</strong>입니다.
            글자수를 세려고 검색하면 화면 절반이 광고로 덮인 사이트가 나오고, JSON을 정리하려고 들어가면
            가입을 강요하는 페이지가 나오는 경험을 누구나 한 번쯤 해봤을 것입니다.
            ToolPiki는 그런 마찰을 줄이는 것을 가장 중요한 가치로 두고 운영합니다.
          </p>
          <p className="text-gray-700 dark:text-gray-300 mt-3">
            그래서 다음 원칙들을 지키려고 합니다.
          </p>
          <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 mt-2 space-y-2">
            <li>
              <strong>회원가입 없이 즉시 사용</strong>: 어떤 도구도 가입, 로그인, 이메일 인증을 요구하지 않습니다.
              필요한 페이지에 들어가면 바로 사용할 수 있어야 한다는 것이 기본 전제입니다.
            </li>
            <li>
              <strong>입력 데이터는 사용자의 기기에서만 처리</strong>: 거의 모든 도구는 브라우저 안에서만 동작하며,
              서버로 데이터를 전송하지 않습니다. 회사 내부 자료나 개인 정보가 포함된 파일도 비교적 안심하고 다룰 수 있습니다.
            </li>
            <li>
              <strong>광고는 최소한으로</strong>: 운영비 충당을 위해 일부 페이지에 광고를 게재하지만,
              광고가 도구 사용을 방해하지 않도록 위치와 분량을 제한하고 있습니다.
              운세, 사주, 타로, 궁합, 복권, 채팅 페이지에는 아예 광고를 노출하지 않습니다.
            </li>
            <li>
              <strong>속도와 단순함을 우선</strong>: 화려한 애니메이션이나 복잡한 UI보다, 결과가 빠르게 나오고
              결과를 가져가기 쉬운 형태를 선호합니다.
            </li>
            <li>
              <strong>직접 써보고 추가</strong>: 도구는 운영자가 직접 사용하면서 필요하다고 느낀 것을 우선적으로 추가합니다.
              유행을 따라가기 위한 도구는 만들지 않습니다.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
            누가 운영하나요?
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            ToolPiki는 <strong>혼자 운영하는 개인 프로젝트</strong>입니다. 회사나 단체와 연관된 사이트가 아니며,
            특정 기업의 자회사도 아닙니다. 실제 개발, 디자인, 운영, 콘텐츠 작성, 광고 관리, 이용자 응대까지
            한 사람이 모두 맡고 있습니다. 그래서 빠르게 움직일 수 있고, 어떤 도구를 추가할지에 대한 결정도
            주관이 명확합니다.
          </p>
          <p className="text-gray-700 dark:text-gray-300 mt-3">
            개인 프로젝트인 만큼 한계도 있습니다. 24시간 모니터링이 어려워 장애가 발생해도 즉시 대응이 어려울 수 있고,
            기능 개선 속도도 회사 단위 서비스에 비해 느릴 수 있습니다. 그 대신 사용자 피드백을 직접 읽고 직접 반영합니다.
            메일로 보내주신 의견은 대부분 직접 답장을 드리며, 합리적이라고 판단되는 제안은 빠르면 며칠 안에 반영합니다.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
            도구 추가와 관리 기준
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            새 도구는 다음 기준을 모두 통과해야 사이트에 추가합니다.
          </p>
          <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 mt-2 space-y-2">
            <li>
              <strong>실제 수요</strong>: 검색 트렌드, 직접 경험, 이용자 피드백 중 하나 이상에서 명확한 수요가 보여야 합니다.
            </li>
            <li>
              <strong>중복 회피</strong>: 비슷한 기능이 이미 있다면 새로 만들지 않고 기존 도구를 개선합니다.
              (예: 글자수 관련 도구는 한 곳에 모아 관리)
            </li>
            <li>
              <strong>클라이언트 측 동작 가능</strong>: 가능하면 서버 없이 브라우저에서 처리할 수 있는 도구를 우선합니다.
              데이터 보호와 응답 속도 측면에서 유리하기 때문입니다.
            </li>
            <li>
              <strong>직접 검토</strong>: 외부 라이브러리를 활용하더라도 출력 결과를 직접 확인하고,
              비정상 입력에 대한 처리, 모바일에서의 동작, 다크 모드 호환성까지 점검한 뒤 게시합니다.
            </li>
            <li>
              <strong>꾸준한 유지보수</strong>: 추가 후에도 라이브러리 업데이트, 브라우저 호환성 변경 등에 맞춰
              주기적으로 점검하고, 사용량이 너무 적은 도구는 정리하기도 합니다.
            </li>
          </ul>
          <p className="text-gray-700 dark:text-gray-300 mt-3">
            카테고리는 텍스트, 인코딩, 포맷터, 이미지, 색상, 계산기/생성기, 재미/테스트의 일곱 갈래로 나눠 정리하고 있습니다.
            각 카테고리에는 평균 8~25개 정도의 도구가 있으며, 검색창에서는 도구 이름뿐 아니라 설명과 태그까지 함께 검색됩니다.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
            운영 정책
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            <strong>광고 정책.</strong> ToolPiki는 운영비 충당을 위해 Google AdSense와 카카오 애드핏(Kakao AdFit)을
            통해 광고를 게재합니다. 광고는 도구 사용에 방해가 되지 않는 위치에만 노출되며, 운세, 사주풀이, 타로,
            궁합, 복권 추천, 채팅 페이지에는 광고가 표시되지 않습니다. 이 페이지들은 검색 엔진에서도 색인되지 않도록
            처리해 두었습니다.
          </p>
          <p className="text-gray-700 dark:text-gray-300 mt-3">
            <strong>재미 도구 처리 방침.</strong> 운세나 심리 테스트 같은 재미 카테고리의 도구는 오락 목적의 콘텐츠임을
            결과 화면에서도 명시합니다. 중요한 결정의 근거로 사용하지 않으시는 것을 권장합니다.
          </p>
          <p className="text-gray-700 dark:text-gray-300 mt-3">
            <strong>데이터 처리 방침 요약.</strong> 도구에 입력한 텍스트, 첨부 파일, 옵션 값은 사용자의 브라우저 안에서만
            처리되며, ToolPiki 서버로 전송되지 않습니다. 즐겨찾기와 다크 모드 같은 환경 값은 브라우저의 로컬 스토리지에
            저장되어 본인 기기에서만 유지됩니다. 익명화된 방문 통계가 서비스 개선을 위해 수집될 수 있으며, 자세한 내용은
            {' '}<a href="/privacy" className="text-blue-600 dark:text-blue-400 hover:underline">개인정보처리방침</a>을
            참고해 주세요.
          </p>
          <p className="text-gray-700 dark:text-gray-300 mt-3">
            <strong>저작권과 콘텐츠.</strong> 사이트의 디자인, 아이콘, 텍스트 콘텐츠는 운영자에게 권리가 있으며,
            도구가 만들어 낸 결과물(예: QR 코드, 변환된 이미지, 색상 코드 등)은 이용자에게 자유롭게 활용 권한이 있습니다.
            서비스 이용 조건의 자세한 사항은 <a href="/terms" className="text-blue-600 dark:text-blue-400 hover:underline">이용약관</a>을
            참고해 주세요.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
            연락처
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            도구 제안, 버그 제보, 기능 요청, 광고 문의 등은 아래 이메일로 보내주세요.
            가능하면 직접 답장을 드리며, 합리적인 제안은 빠르게 반영하려고 노력하고 있습니다.
          </p>
          <p className="text-gray-700 dark:text-gray-300 mt-2">
            이메일:{' '}
            <a
              href={`mailto:${siteConfig.contactEmail}`}
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              {siteConfig.contactEmail}
            </a>
          </p>
        </section>
      </div>
    </div>
  );
}
