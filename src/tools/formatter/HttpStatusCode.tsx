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
          🌐 HTTP 상태 코드란?
        </h2>
        <p className="text-sm leading-relaxed">
          HTTP 상태 코드는 웹 서버가 클라이언트 요청에 대한 처리 결과를 알려주는 3자리 숫자입니다.
          RFC 7231 등 HTTP 표준에서 정의되며, 첫 번째 숫자로 응답의 성격을 나타냅니다.
          1xx는 정보, 2xx는 성공, 3xx는 리다이렉션, 4xx는 클라이언트 오류, 5xx는 서버 오류를 의미합니다.
          개발자는 이 코드를 통해 API 디버깅, 오류 처리, 로깅 등을 수행합니다.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          📊 카테고리별 의미
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
          <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
            <span className="font-medium text-blue-700 dark:text-blue-300">1xx 정보</span>
            <p className="text-xs text-gray-500 mt-1">요청 수신, 처리 계속</p>
          </div>
          <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded">
            <span className="font-medium text-green-700 dark:text-green-300">2xx 성공</span>
            <p className="text-xs text-gray-500 mt-1">요청 정상 처리 완료</p>
          </div>
          <div className="p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded">
            <span className="font-medium text-yellow-700 dark:text-yellow-300">3xx 리다이렉션</span>
            <p className="text-xs text-gray-500 mt-1">추가 작업 필요 (이동)</p>
          </div>
          <div className="p-2 bg-orange-50 dark:bg-orange-900/20 rounded">
            <span className="font-medium text-orange-700 dark:text-orange-300">4xx 클라이언트 오류</span>
            <p className="text-xs text-gray-500 mt-1">잘못된 요청</p>
          </div>
          <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded sm:col-span-2">
            <span className="font-medium text-red-700 dark:text-red-300">5xx 서버 오류</span>
            <p className="text-xs text-gray-500 mt-1">서버 처리 실패</p>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          💡 자주 만나는 상태 코드
        </h2>
        <ul className="text-sm leading-relaxed space-y-1 list-disc list-inside">
          <li><strong>200 OK</strong> - 요청 성공, 가장 일반적인 응답</li>
          <li><strong>201 Created</strong> - POST로 새 리소스 생성 성공</li>
          <li><strong>400 Bad Request</strong> - 요청 파라미터나 본문 오류</li>
          <li><strong>401/403</strong> - 인증/권한 문제</li>
          <li><strong>404 Not Found</strong> - 리소스를 찾을 수 없음</li>
          <li><strong>500 Internal Server Error</strong> - 서버 내부 오류</li>
        </ul>
      </section>

      <FaqSection
        title="자주 묻는 질문"
        faqs={[
          {
            question: '401과 403의 차이는 무엇인가요?',
            answer: '401 Unauthorized는 인증이 필요하거나 실패한 경우(로그인 필요), 403 Forbidden은 인증은 되었지만 해당 리소스에 대한 권한이 없는 경우입니다.',
          },
          {
            question: '302와 307의 차이는 무엇인가요?',
            answer: '302 Found는 역사적으로 브라우저가 POST를 GET으로 바꿔서 리다이렉트했지만, 307 Temporary Redirect는 원래 HTTP 메서드를 유지합니다.',
          },
          {
            question: '커스텀 상태 코드를 만들 수 있나요?',
            answer: '가능하지만 권장하지 않습니다. 표준 코드를 사용하고, 상세 정보는 응답 본문에 포함하는 것이 좋습니다. 499(Nginx), 520-527(Cloudflare) 등 벤더별 확장 코드도 있습니다.',
          },
        ]}
      />
    </div>
  );
}
