'use client';

import { useState, useMemo } from 'react';
import { Textarea } from '@/components/ui/Textarea';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { CopyButton } from '@/components/ui/CopyButton';
import { FaqSection } from '@/components/ui/FaqItem';

function SeoContent() {
  return (
    <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 space-y-8 text-gray-700 dark:text-gray-300">
      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          🔗 URL 쿼리 파서란?
        </h2>
        <p className="text-sm leading-relaxed">
          <strong className="text-gray-900 dark:text-white">URL의 쿼리 파라미터를 한눈에 추출·편집·재조합합니다.</strong>{' '}
          마케팅 URL의 <strong>UTM 파라미터</strong> 분석, API <strong>쿼리스트링 디버깅</strong>,
          인코딩된 값의 자동 디코딩까지 한 번에 처리합니다.
          편집한 파라미터는 새 URL로 재조합되어 <strong>바로 복사</strong>해 사용할 수 있습니다.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          📋 URL 구조 이해하기
        </h2>
        <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded text-xs font-mono mb-3">
          <span className="text-blue-600">https://</span>
          <span className="text-green-600">example.com</span>
          <span className="text-purple-600">/path/to/page</span>
          <span className="text-orange-600">?key1=value1&key2=value2</span>
          <span className="text-red-600">#section</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
          <div className="p-2 bg-gray-50 dark:bg-gray-800/50 rounded"><span className="text-blue-600">프로토콜</span>: https://</div>
          <div className="p-2 bg-gray-50 dark:bg-gray-800/50 rounded"><span className="text-green-600">호스트</span>: 도메인명</div>
          <div className="p-2 bg-gray-50 dark:bg-gray-800/50 rounded"><span className="text-purple-600">경로</span>: 페이지 위치</div>
          <div className="p-2 bg-gray-50 dark:bg-gray-800/50 rounded"><span className="text-orange-600">쿼리</span>: ?key=value</div>
          <div className="p-2 bg-gray-50 dark:bg-gray-800/50 rounded"><span className="text-red-600">해시</span>: #앵커</div>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          💡 UTM 파라미터 활용
        </h2>
        <ul className="text-sm leading-relaxed space-y-2 list-disc list-inside">
          <li><strong>utm_source</strong> — 트래픽 출처 (<code className="px-1 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-xs font-mono">google</code>, <code className="px-1 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-xs font-mono">facebook</code>, <code className="px-1 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-xs font-mono">newsletter</code>)</li>
          <li><strong>utm_medium</strong> — 마케팅 매체 (<code className="px-1 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-xs font-mono">cpc</code>, <code className="px-1 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-xs font-mono">email</code>, <code className="px-1 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-xs font-mono">social</code>)</li>
          <li><strong>utm_campaign</strong> — 캠페인명 (<code className="px-1 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-xs font-mono">spring_sale</code>, <code className="px-1 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-xs font-mono">launch</code>)</li>
          <li><strong>utm_term</strong> — 검색 키워드 (유료 검색용)</li>
          <li><strong>utm_content</strong> — 콘텐츠 구분 (A/B 테스트용)</li>
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          🔡 URL 인코딩 대조표
        </h2>
        <p className="text-sm leading-relaxed mb-3">
          쿼리 값에 들어가면 문제를 일으키는 문자들입니다. 인코딩하지 않으면 파라미터 경계가 잘못 잘려
          값이 통째로 사라지거나 엉뚱하게 나뉩니다.
        </p>
        <div className="overflow-x-auto text-sm">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b dark:border-gray-700">
                <th className="text-left py-2 px-2">문자</th>
                <th className="text-left py-2 px-2">인코딩</th>
                <th className="text-left py-2 px-2">인코딩하지 않으면</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b dark:border-gray-800"><td className="py-1.5 px-2 font-mono">(공백)</td><td className="font-mono">%20 또는 +</td><td>URL이 잘려 인식됨</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-1.5 px-2 font-mono">&amp;</td><td className="font-mono">%26</td><td>새 파라미터 시작으로 오인</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-1.5 px-2 font-mono">=</td><td className="font-mono">%3D</td><td>키와 값 구분자로 오인</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-1.5 px-2 font-mono">?</td><td className="font-mono">%3F</td><td>쿼리 시작으로 오인</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-1.5 px-2 font-mono">#</td><td className="font-mono">%23</td><td>이후 전부 해시로 처리되어 서버에 전달 안 됨</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-1.5 px-2 font-mono">+</td><td className="font-mono">%2B</td><td>공백으로 해석됨</td></tr>
              <tr><td className="py-1.5 px-2 font-mono">가</td><td className="font-mono">%EA%B0%80</td><td>환경에 따라 깨짐</td></tr>
            </tbody>
          </table>
        </div>
        <p className="text-sm leading-relaxed mt-3">
          한글은 UTF-8 기준으로 한 글자가 3바이트라 <code className="px-1 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-xs font-mono">%XX</code>가 세 개씩 붙습니다.
          검색어를 URL에 담을 때 유독 길어지는 이유입니다.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          🐛 쿼리스트링에서 자주 겪는 문제
        </h2>
        <ul className="text-sm leading-relaxed space-y-2 list-disc list-inside">
          <li><strong>URL 안에 URL을 넣을 때</strong> — 리다이렉트 주소를 <code className="px-1 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-xs font-mono">?redirect=https://...</code>처럼 그대로 넣으면 그 안의 <code className="px-1 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-xs font-mono">&amp;</code>가 파라미터 구분자로 잘립니다. 반드시 인코딩해야 합니다.</li>
          <li><strong>이중 인코딩</strong> — 이미 인코딩된 값을 또 인코딩하면 <code className="px-1 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-xs font-mono">%25EA%25B0%2580</code>처럼 <code className="px-1 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-xs font-mono">%</code>가 <code className="px-1 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-xs font-mono">%25</code>로 변해 원본을 잃습니다.</li>
          <li><strong>공백을 + 로 쓸지 %20으로 쓸지</strong> — 폼 전송에서는 <code className="px-1 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-xs font-mono">+</code>가 공백을 뜻하지만, 경로 부분에서는 그냥 플러스 기호입니다. 안전하게 하려면 <code className="px-1 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-xs font-mono">%20</code>을 쓰세요.</li>
          <li><strong>URL 길이 제한</strong> — 명확한 표준은 없지만 브라우저·서버·프록시마다 상한이 달라, 아주 긴 데이터는 쿼리 대신 POST 본문으로 보내는 편이 안전합니다.</li>
          <li><strong>민감 정보 노출</strong> — 쿼리스트링은 브라우저 기록·서버 로그·리퍼러 헤더에 그대로 남습니다. 토큰이나 개인정보를 담지 마세요.</li>
        </ul>
      </section>

      <div className="rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900 p-4 text-sm">
        <p className="font-semibold text-blue-900 dark:text-blue-200 mb-1">💡 실무 팁</p>
        <p className="text-blue-800 dark:text-blue-300">
          UTM은 <strong>모두 소문자</strong>로 통일하세요. <code className="px-1 py-0.5 rounded bg-blue-100 dark:bg-blue-900/40 text-xs font-mono">Google</code>과 <code className="px-1 py-0.5 rounded bg-blue-100 dark:bg-blue-900/40 text-xs font-mono">google</code>은 GA에서 <strong>서로 다른 소스</strong>로 잡혀 리포트가 쪼개집니다.
        </p>
      </div>

      <FaqSection
        title="자주 묻는 질문"
        faqs={[
          {
            question: 'URL 인코딩이란 무엇인가요?',
            answer: 'URL에서 특수문자나 한글을 표현하기 위해 %XX 형식으로 변환하는 것입니다. 예: 공백은 %20, 한글 "가"는 %EA%B0%80으로 인코딩됩니다.',
          },
          {
            question: '여러 개의 같은 키가 있으면 어떻게 되나요?',
            answer: 'URL 표준에서는 같은 키를 여러 번 사용할 수 있습니다(예: ?color=red&color=blue). 이 도구는 각각을 개별 파라미터로 표시합니다.',
          },
          {
            question: '해시(#) 이후의 내용도 서버로 전송되나요?',
            answer: '아니요, 해시 프래그먼트는 브라우저에서만 사용되며 서버로 전송되지 않습니다. 페이지 내 특정 위치로 스크롤하거나 SPA 라우팅에 사용됩니다.',
          },
          {
            question: 'URL 안에 다른 URL을 넣으려면 어떻게 하나요?',
            answer: '반드시 인코딩해야 합니다. redirect=https://a.com?x=1&y=2 처럼 그대로 넣으면 &부터 별도 파라미터로 잘립니다. 값 전체를 URL 인코딩하면 하나의 값으로 안전하게 전달됩니다.',
          },
          {
            question: '%25가 잔뜩 붙은 URL은 왜 그런가요?',
            answer: '이중 인코딩된 상태입니다. %가 다시 %25로 인코딩되면서 생깁니다. 한 번 디코딩한 뒤 원본이 나오는지 확인하고, 인코딩은 한 번만 적용하도록 코드를 점검하세요.',
          },
          {
            question: '쿼리스트링에 토큰을 담아도 되나요?',
            answer: '권장하지 않습니다. 브라우저 방문 기록, 서버 접근 로그, 외부 사이트로 전달되는 리퍼러 헤더에 그대로 남습니다. 인증 정보는 헤더나 POST 본문으로 전달하세요.',
          },
        ]}
      />
    </div>
  );
}

interface QueryParam {
  key: string;
  value: string;
  decoded: string;
}

export function UrlQueryParser() {
  const [url, setUrl] = useState('');
  const [params, setParams] = useState<QueryParam[]>([]);
  const [newKey, setNewKey] = useState('');
  const [newValue, setNewValue] = useState('');

  const parsed = useMemo(() => {
    if (!url.trim()) return null;

    try {
      // URL 객체로 파싱 시도
      let urlObj: URL;
      try {
        urlObj = new URL(url);
      } catch {
        // http:// 없으면 추가해서 시도
        urlObj = new URL(`https://${url}`);
      }

      const searchParams = urlObj.searchParams;
      const queryParams: QueryParam[] = [];

      searchParams.forEach((value, key) => {
        queryParams.push({
          key,
          value,
          decoded: decodeURIComponent(value),
        });
      });

      return {
        protocol: urlObj.protocol,
        host: urlObj.host,
        pathname: urlObj.pathname,
        hash: urlObj.hash,
        params: queryParams,
      };
    } catch {
      return null;
    }
  }, [url]);

  // params가 변경되면 URL 재구성
  const reconstructedUrl = useMemo(() => {
    if (!parsed) return '';

    const urlObj = new URL(`${parsed.protocol}//${parsed.host}${parsed.pathname}`);

    params.forEach(({ key, value }) => {
      if (key) urlObj.searchParams.set(key, value);
    });

    if (parsed.hash) {
      urlObj.hash = parsed.hash;
    }

    return urlObj.toString();
  }, [parsed, params]);

  // URL 파싱 시 params 초기화
  const handleParse = () => {
    if (parsed) {
      setParams(parsed.params.map((p) => ({ ...p })));
    }
  };

  // 파라미터 수정
  const updateParam = (index: number, field: 'key' | 'value', newVal: string) => {
    setParams((prev) =>
      prev.map((p, i) =>
        i === index
          ? { ...p, [field]: newVal, decoded: field === 'value' ? decodeURIComponent(newVal) : p.decoded }
          : p
      )
    );
  };

  // 파라미터 삭제
  const removeParam = (index: number) => {
    setParams((prev) => prev.filter((_, i) => i !== index));
  };

  // 파라미터 추가
  const addParam = () => {
    if (!newKey.trim()) return;
    setParams((prev) => [
      ...prev,
      { key: newKey, value: newValue, decoded: decodeURIComponent(newValue) },
    ]);
    setNewKey('');
    setNewValue('');
  };

  return (
    <div className="space-y-2">
      {/* URL 입력 */}
      <div>
        <Textarea
          label="URL 입력"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://example.com/path?key1=value1&key2=value2"
          rows={3}
        />
        <div className="flex justify-end mt-2">
          <Button onClick={handleParse} disabled={!parsed}>
            파라미터 추출
          </Button>
        </div>
      </div>

      {/* 파싱 결과 */}
      {parsed && (
        <Card variant="bordered" className="p-4">
          <p className="text-sm font-medium mb-3">URL 구조</p>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-gray-500 dark:text-gray-400">프로토콜:</span>
              <span className="ml-2 font-mono">{parsed.protocol}</span>
            </div>
            <div>
              <span className="text-gray-500 dark:text-gray-400">호스트:</span>
              <span className="ml-2 font-mono">{parsed.host}</span>
            </div>
            <div>
              <span className="text-gray-500 dark:text-gray-400">경로:</span>
              <span className="ml-2 font-mono">{parsed.pathname}</span>
            </div>
            {parsed.hash && (
              <div>
                <span className="text-gray-500 dark:text-gray-400">해시:</span>
                <span className="ml-2 font-mono">{parsed.hash}</span>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* 파라미터 편집 */}
      {params.length > 0 && (
        <Card variant="bordered" className="p-4">
          <p className="text-sm font-medium mb-3">쿼리 파라미터 ({params.length}개)</p>
          <div className="space-y-3">
            {params.map((param, idx) => (
              <div key={idx} className="flex gap-2 items-start">
                <Input
                  value={param.key}
                  onChange={(e) => updateParam(idx, 'key', e.target.value)}
                  placeholder="key"
                  className="flex-1"
                />
                <span className="text-gray-400 mt-2">=</span>
                <div className="flex-[2]">
                  <Input
                    value={param.value}
                    onChange={(e) => updateParam(idx, 'value', e.target.value)}
                    placeholder="value"
                  />
                  {param.value !== param.decoded && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-mono truncate">
                      디코딩: {param.decoded}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => removeParam(idx)}
                  className="mt-2 text-gray-400 hover:text-red-500"
                >
                  ×
                </button>
              </div>
            ))}
          </div>

          {/* 파라미터 추가 */}
          <div className="flex gap-2 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Input
              value={newKey}
              onChange={(e) => setNewKey(e.target.value)}
              placeholder="새 key"
              className="flex-1"
            />
            <span className="text-gray-400 mt-2">=</span>
            <Input
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
              placeholder="새 value"
              className="flex-[2]"
              onKeyDown={(e) => e.key === 'Enter' && addParam()}
            />
            <Button variant="secondary" onClick={addParam}>
              추가
            </Button>
          </div>
        </Card>
      )}

      {/* 재구성된 URL */}
      {params.length > 0 && reconstructedUrl && (
        <Card variant="bordered" className="p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium">재구성된 URL</p>
            <CopyButton text={reconstructedUrl} />
          </div>
          <p className="font-mono text-sm break-all bg-gray-100 dark:bg-gray-800 p-3 rounded-lg">
            {reconstructedUrl}
          </p>
        </Card>
      )}

      {/* 안내 */}
      <div className="text-xs text-gray-400 dark:text-gray-500 space-y-1">
        <p>• URL을 입력하고 "파라미터 추출"을 눌러 편집하세요</p>
        <p>• 인코딩된 값은 자동으로 디코딩하여 표시합니다</p>
      </div>

      <SeoContent />
    </div>
  );
}
