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
          URL 쿼리 파서는 URL에 포함된 쿼리 파라미터(?key=value 형식)를 추출하고 편집할 수 있는 도구입니다.
          복잡한 마케팅 URL의 UTM 파라미터를 분석하거나, API 엔드포인트의 쿼리스트링을 디버깅하고,
          인코딩된 값을 자동으로 디코딩하여 확인할 수 있습니다.
          편집한 파라미터는 새 URL로 재구성되어 바로 복사하여 사용할 수 있습니다.
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
          <li><strong>utm_source</strong>: 트래픽 출처 (google, facebook, newsletter)</li>
          <li><strong>utm_medium</strong>: 마케팅 매체 (cpc, email, social)</li>
          <li><strong>utm_campaign</strong>: 캠페인명 (spring_sale, launch)</li>
          <li><strong>utm_term</strong>: 검색 키워드 (유료 검색용)</li>
          <li><strong>utm_content</strong>: 콘텐츠 구분 (A/B 테스트용)</li>
        </ul>
      </section>

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
