'use client';

import { useState, useMemo } from 'react';
import { Card } from '@/components/ui/Card';
import { FaqSection } from '@/components/ui/FaqItem';

const httpCodes = [
  // 1xx
  { code: 100, name: 'Continue', desc: '요청의 일부를 받았으며, 계속 요청해도 됨', category: '1xx' },
  { code: 101, name: 'Switching Protocols', desc: '프로토콜 전환 요청을 수락함', category: '1xx' },
  // 2xx
  { code: 200, name: 'OK', desc: '요청 성공', category: '2xx' },
  { code: 201, name: 'Created', desc: '요청 성공, 새 리소스 생성됨', category: '2xx' },
  { code: 202, name: 'Accepted', desc: '요청 수락됨, 처리는 아직 완료되지 않음', category: '2xx' },
  { code: 204, name: 'No Content', desc: '요청 성공, 반환할 콘텐츠 없음', category: '2xx' },
  { code: 206, name: 'Partial Content', desc: '범위 요청 성공, 일부 콘텐츠 반환', category: '2xx' },
  // 3xx
  { code: 301, name: 'Moved Permanently', desc: '리소스가 영구적으로 이동됨', category: '3xx' },
  { code: 302, name: 'Found', desc: '리소스가 임시로 이동됨', category: '3xx' },
  { code: 303, name: 'See Other', desc: '다른 URI로 요청해야 함 (GET)', category: '3xx' },
  { code: 304, name: 'Not Modified', desc: '캐시된 버전 사용 가능', category: '3xx' },
  { code: 307, name: 'Temporary Redirect', desc: '임시 리다이렉트 (메서드 유지)', category: '3xx' },
  { code: 308, name: 'Permanent Redirect', desc: '영구 리다이렉트 (메서드 유지)', category: '3xx' },
  // 4xx
  { code: 400, name: 'Bad Request', desc: '잘못된 요청 구문', category: '4xx' },
  { code: 401, name: 'Unauthorized', desc: '인증 필요', category: '4xx' },
  { code: 403, name: 'Forbidden', desc: '접근 권한 없음', category: '4xx' },
  { code: 404, name: 'Not Found', desc: '리소스를 찾을 수 없음', category: '4xx' },
  { code: 405, name: 'Method Not Allowed', desc: '허용되지 않은 HTTP 메서드', category: '4xx' },
  { code: 408, name: 'Request Timeout', desc: '요청 시간 초과', category: '4xx' },
  { code: 409, name: 'Conflict', desc: '요청이 현재 상태와 충돌', category: '4xx' },
  { code: 410, name: 'Gone', desc: '리소스가 영구적으로 삭제됨', category: '4xx' },
  { code: 413, name: 'Payload Too Large', desc: '요청 본문이 너무 큼', category: '4xx' },
  { code: 414, name: 'URI Too Long', desc: 'URI가 너무 김', category: '4xx' },
  { code: 415, name: 'Unsupported Media Type', desc: '지원하지 않는 미디어 타입', category: '4xx' },
  { code: 422, name: 'Unprocessable Entity', desc: '요청은 이해했으나 처리 불가', category: '4xx' },
  { code: 429, name: 'Too Many Requests', desc: '요청 횟수 초과 (Rate Limit)', category: '4xx' },
  // 5xx
  { code: 500, name: 'Internal Server Error', desc: '서버 내부 오류', category: '5xx' },
  { code: 501, name: 'Not Implemented', desc: '요청한 기능을 지원하지 않음', category: '5xx' },
  { code: 502, name: 'Bad Gateway', desc: '게이트웨이가 잘못된 응답 받음', category: '5xx' },
  { code: 503, name: 'Service Unavailable', desc: '서비스 일시적 사용 불가', category: '5xx' },
  { code: 504, name: 'Gateway Timeout', desc: '게이트웨이 응답 시간 초과', category: '5xx' },
];

const categories = [
  { id: 'all', name: '전체', color: 'gray' },
  { id: '1xx', name: '1xx 정보', color: 'blue' },
  { id: '2xx', name: '2xx 성공', color: 'green' },
  { id: '3xx', name: '3xx 리다이렉션', color: 'yellow' },
  { id: '4xx', name: '4xx 클라이언트 오류', color: 'orange' },
  { id: '5xx', name: '5xx 서버 오류', color: 'red' },
];

export function HttpStatusCode() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredCodes = useMemo(() => {
    return httpCodes.filter((code) => {
      const matchesCategory = selectedCategory === 'all' || code.category === selectedCategory;
      const matchesSearch = search === '' ||
        code.code.toString().includes(search) ||
        code.name.toLowerCase().includes(search.toLowerCase()) ||
        code.desc.includes(search);
      return matchesCategory && matchesSearch;
    });
  }, [search, selectedCategory]);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case '1xx': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case '2xx': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case '3xx': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case '4xx': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400';
      case '5xx': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-4 flex-wrap">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="코드 또는 이름 검색..."
          className="flex-1 min-w-48 px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
        />
      </div>

      <div className="flex gap-2 flex-wrap">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
              selectedCategory === cat.id
                ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900'
                : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      <div className="grid gap-2">
        {filteredCodes.map((item) => (
          <Card key={item.code} variant="bordered" className="p-4">
            <div className="flex items-start gap-4">
              <span className={`px-3 py-1 rounded-lg font-mono font-bold ${getCategoryColor(item.category)}`}>
                {item.code}
              </span>
              <div className="flex-1">
                <h3 className="font-medium">{item.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{item.desc}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredCodes.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          검색 결과가 없습니다
        </div>
      )}

      <SeoContent />
    </div>
  );
}

function SeoContent() {
  return (
    <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 space-y-8 text-gray-700 dark:text-gray-300">
      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          🌐 3자리 숫자에 담긴 응답의 의미
        </h2>
        <p className="text-sm leading-relaxed">
          <strong className="text-gray-900 dark:text-white">HTTP 상태 코드는 서버가 보내는 짧은 답신입니다. 첫 자리만 외워도 절반은 끝.</strong>{' '}
          <strong>1xx</strong>는 &quot;계속해도 좋다&quot;, <strong>2xx</strong>는 &quot;성공&quot;, <strong>3xx</strong>는 &quot;다른 곳으로 가라&quot;,
          <strong>4xx</strong>는 &quot;네가 잘못했다&quot;, <strong>5xx</strong>는 &quot;내가 잘못했다&quot;로 외워두면 빠르게 분류됩니다.
          <strong>RFC 9110(2022)</strong> 기준 약 60여 개 코드 중 실무에서 자주 마주치는 30여 개를 한 화면에 정리했습니다.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          📊 카테고리별 큰 그림
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
          <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
            <span className="font-medium text-blue-700 dark:text-blue-300">1xx 정보</span>
            <p className="text-xs text-gray-500 mt-1">100 Continue, 101 Switching Protocols 등. WebSocket 업그레이드 외에는 거의 안 보임</p>
          </div>
          <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded">
            <span className="font-medium text-green-700 dark:text-green-300">2xx 성공</span>
            <p className="text-xs text-gray-500 mt-1">200 OK가 90% 이상. POST 후엔 201, DELETE 후엔 204를 자주 봄</p>
          </div>
          <div className="p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded">
            <span className="font-medium text-yellow-700 dark:text-yellow-300">3xx 리다이렉션</span>
            <p className="text-xs text-gray-500 mt-1">301(영구)와 302(임시)가 핵심. SEO 관점에선 무조건 301 권장</p>
          </div>
          <div className="p-2 bg-orange-50 dark:bg-orange-900/20 rounded">
            <span className="font-medium text-orange-700 dark:text-orange-300">4xx 클라이언트 오류</span>
            <p className="text-xs text-gray-500 mt-1">400/401/403/404가 절대 다수. 429는 Rate Limit이므로 백오프 필요</p>
          </div>
          <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded sm:col-span-2">
            <span className="font-medium text-red-700 dark:text-red-300">5xx 서버 오류</span>
            <p className="text-xs text-gray-500 mt-1">500은 코드 버그, 502/503/504는 인프라(게이트웨이/스케일링) 문제일 확률이 높음</p>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          💡 디버깅할 때 가장 자주 만나는 코드
        </h2>
        <ul className="text-sm leading-relaxed space-y-1 list-disc list-inside">
          <li><strong>200 OK</strong> — 성공. 그러나 응답 본문에 에러 메시지가 들어 있는 케이스(이른바 200 Always)는 의외로 흔하니 항상 바디도 확인.</li>
          <li><strong>301 / 308</strong> — 영구 리다이렉트. 도메인 이전이나 https 강제 전환 시 사용. 한 번 캐시되면 잘 안 풀리니 신중히.</li>
          <li><strong>401 vs 403</strong> — 401은 &quot;너 누구?&quot;(인증 부재/실패), 403은 &quot;너 누군지는 알겠는데 권한이 없어&quot;.</li>
          <li><strong>422 Unprocessable Entity</strong> — 문법은 맞는데 비즈니스 검증 실패. Rails, Laravel API에서 자주 등장.</li>
          <li><strong>429 Too Many Requests</strong> — 헤더의 Retry-After 값을 보고 정확한 시간만큼 기다린 뒤 재시도.</li>
          <li><strong>502 Bad Gateway</strong> — 업스트림(예: Node 서버)이 죽었거나, nginx 타임아웃 설정이 짧을 가능성.</li>
          <li><strong>504 Gateway Timeout</strong> — 백엔드가 살아 있지만 느림. 쿼리 인덱스, N+1, 외부 API 응답 시간부터 점검.</li>
        </ul>
      </section>

      <div className="rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900 p-4 text-sm">
        <p className="font-semibold text-amber-900 dark:text-amber-200 mb-1">⚠️ 헷갈리는 조합 체크</p>
        <p className="text-amber-800 dark:text-amber-300">
          <strong>401 vs 403</strong>: 토큰 부재/만료는 <strong>401</strong>, 권한 부족은 <strong>403</strong>.
          <strong> 502 vs 504</strong>: 업스트림이 죽었으면 <strong>502</strong>, 살아있는데 느리면 <strong>504</strong>.
          잘못 매핑하면 모니터링 알람 분류부터 엉킵니다.
        </p>
      </div>

      <FaqSection
        title="자주 묻는 질문"
        faqs={[
          {
            question: '401과 403, 어떻게 구분해서 써야 하나요?',
            answer: '클라이언트가 토큰을 안 보냈거나 만료된 경우엔 401, 토큰은 유효한데 해당 리소스에 접근 권한이 없을 땐 403입니다. 보안 관점에서 가끔 일부러 모든 권한 부족을 404로 위장하기도 하지만, 일반적인 비즈니스 API라면 표준대로 401/403을 정확히 나누어 주세요.',
          },
          {
            question: '302와 307은 둘 다 임시 리다이렉트인데 왜 나뉘어 있나요?',
            answer: '역사적 이유로 302는 일부 구현체가 POST를 GET으로 바꿔서 리다이렉트하는 동작을 했고, 그게 호환성 이슈가 되자 RFC 7231이 메서드를 그대로 유지하는 307 Temporary Redirect를 새로 정의했습니다. 폼 제출 후 리다이렉트라면 303 See Other가 가장 안전합니다.',
          },
          {
            question: '301 영구 리다이렉트, 한 번 걸면 못 되돌리나요?',
            answer: '서버 응답을 304가 아닌 301로 바꾸면 되돌릴 수는 있지만, 브라우저와 검색엔진이 일정 시간 결과를 캐시하기 때문에 사용자 입장에선 안 풀린 것처럼 보입니다. 도메인 이전 같은 경우라면 며칠 ~ 몇 주까지 캐시가 남는 경우가 있으니 신중하게 결정하세요.',
          },
          {
            question: '커스텀 상태 코드를 만들어 써도 되나요?',
            answer: '기술적으로는 가능하지만 권장하지 않습니다. 클라이언트 라이브러리나 프록시가 표준 코드만 이해하므로, 비즈니스 의미는 본문(JSON)에 errorCode 필드로 담고 HTTP 코드는 표준 범위 안에서 골라 쓰세요. nginx의 499(클라이언트 종료)나 Cloudflare의 520-527처럼 잘 알려진 벤더 확장은 예외입니다.',
          },
        ]}
      />
    </div>
  );
}
