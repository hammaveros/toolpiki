'use client';

import { useState, useEffect } from 'react';
import { Textarea } from '@/components/ui/Textarea';
import { Card } from '@/components/ui/Card';
import { FaqSection } from '@/components/ui/FaqItem';
import { CopyButton } from '@/components/ui/CopyButton';

interface JwtParts {
  header: Record<string, unknown>;
  payload: Record<string, unknown>;
  signature: string;
}

export function JwtDecoder() {
  const [input, setInput] = useState('');
  const [decoded, setDecoded] = useState<JwtParts | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!input.trim()) {
      setDecoded(null);
      setError('');
      return;
    }

    try {
      const parts = input.trim().split('.');
      if (parts.length !== 3) {
        throw new Error('JWT는 3개의 부분(header.payload.signature)으로 구성되어야 합니다.');
      }

      const decodeBase64Url = (str: string): string => {
        const base64 = str.replace(/-/g, '+').replace(/_/g, '/');
        const padding = '='.repeat((4 - (base64.length % 4)) % 4);
        return atob(base64 + padding);
      };

      const header = JSON.parse(decodeBase64Url(parts[0]));
      const payload = JSON.parse(decodeBase64Url(parts[1]));

      setDecoded({
        header,
        payload,
        signature: parts[2],
      });
      setError('');
    } catch (e) {
      setDecoded(null);
      setError(e instanceof Error ? e.message : '유효하지 않은 JWT 형식입니다.');
    }
  }, [input]);

  const formatTimestamp = (timestamp: number): string => {
    try {
      const date = new Date(timestamp * 1000);
      return date.toLocaleString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
    } catch {
      return String(timestamp);
    }
  };

  const isExpired = (): boolean => {
    if (!decoded?.payload.exp) return false;
    return (decoded.payload.exp as number) * 1000 < Date.now();
  };

  const hasTimeFields = decoded && (
    typeof decoded.payload.iat === 'number' ||
    typeof decoded.payload.exp === 'number' ||
    typeof decoded.payload.nbf === 'number'
  );

  return (
    <div className="space-y-4">
      <Textarea
        label="JWT 토큰"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
        rows={4}
        className="font-mono text-sm"
      />

      {error && (
        <Card variant="bordered" className="p-4 border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/20">
          <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
        </Card>
      )}

      {decoded && (
        <div className="space-y-4">
          {typeof decoded.payload.exp === 'number' && (
            <div className={`p-3 rounded-lg text-sm ${
              isExpired()
                ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400'
                : 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400'
            }`}>
              {isExpired() ? '⚠️ 토큰이 만료되었습니다' : '✓ 토큰이 유효합니다'}
              <span className="ml-2 text-gray-500">
                (만료: {formatTimestamp(decoded.payload.exp)})
              </span>
            </div>
          )}

          <Card variant="bordered" className="p-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-medium text-red-500">HEADER</h3>
              <CopyButton text={JSON.stringify(decoded.header, null, 2)} size="sm" />
            </div>
            <pre className="text-sm bg-gray-50 dark:bg-gray-800 p-3 rounded overflow-x-auto">
              {JSON.stringify(decoded.header, null, 2)}
            </pre>
          </Card>

          <Card variant="bordered" className="p-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-medium text-purple-500">PAYLOAD</h3>
              <CopyButton text={JSON.stringify(decoded.payload, null, 2)} size="sm" />
            </div>
            <pre className="text-sm bg-gray-50 dark:bg-gray-800 p-3 rounded overflow-x-auto">
              {JSON.stringify(decoded.payload, null, 2)}
            </pre>

            {hasTimeFields && (
              <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-600 dark:text-gray-400 space-y-1">
                {typeof decoded.payload.iat === 'number' && (
                  <div>발급 시간 (iat): {formatTimestamp(decoded.payload.iat)}</div>
                )}
                {typeof decoded.payload.exp === 'number' && (
                  <div>만료 시간 (exp): {formatTimestamp(decoded.payload.exp)}</div>
                )}
                {typeof decoded.payload.nbf === 'number' && (
                  <div>시작 시간 (nbf): {formatTimestamp(decoded.payload.nbf)}</div>
                )}
              </div>
            )}
          </Card>

          <Card variant="bordered" className="p-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-medium text-blue-500">SIGNATURE</h3>
              <CopyButton text={decoded.signature} size="sm" />
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
              서명 검증을 위해서는 비밀 키가 필요합니다.
            </p>
            <code className="text-sm bg-gray-50 dark:bg-gray-800 p-3 rounded block overflow-x-auto break-all">
              {decoded.signature}
            </code>
          </Card>
        </div>
      )}

      <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          JWT 구조
        </h3>
        <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
          <li><span className="text-red-500 font-medium">Header</span>: 알고리즘(alg), 토큰 타입(typ)</li>
          <li><span className="text-purple-500 font-medium">Payload</span>: 클레임(claims) - sub, iss, exp, iat 등</li>
          <li><span className="text-blue-500 font-medium">Signature</span>: Header + Payload + Secret으로 생성</li>
        </ul>
      </div>

      <SeoContent />
    </div>
  );
}

function SeoContent() {
  return (
    <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 space-y-8 text-gray-700 dark:text-gray-300">
      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">🔑 JWT 디코더란?</h2>
        <p className="text-sm leading-relaxed">
          JWT(JSON Web Token)는 웹 애플리케이션에서 인증과 정보 교환에 사용되는 토큰 형식입니다.
          Header(알고리즘 정보), Payload(클레임 데이터), Signature(서명) 세 부분으로 구성되며,
          각 부분은 점(.)으로 구분되고 Base64url로 인코딩됩니다.
          이 도구는 JWT를 디코딩하여 토큰의 내용을 확인하고 만료 시간을 검증합니다.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">📋 JWT 주요 클레임</h2>
        <div className="text-sm space-y-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div className="p-2 bg-gray-50 dark:bg-gray-800/50 rounded"><strong>iss</strong> (Issuer): 토큰 발급자</div>
            <div className="p-2 bg-gray-50 dark:bg-gray-800/50 rounded"><strong>sub</strong> (Subject): 토큰 주체 (주로 사용자 ID)</div>
            <div className="p-2 bg-gray-50 dark:bg-gray-800/50 rounded"><strong>aud</strong> (Audience): 토큰 대상</div>
            <div className="p-2 bg-gray-50 dark:bg-gray-800/50 rounded"><strong>exp</strong> (Expiration): 만료 시간 (Unix timestamp)</div>
            <div className="p-2 bg-gray-50 dark:bg-gray-800/50 rounded"><strong>iat</strong> (Issued At): 발급 시간</div>
            <div className="p-2 bg-gray-50 dark:bg-gray-800/50 rounded"><strong>nbf</strong> (Not Before): 토큰 활성화 시간</div>
          </div>
        </div>
      </section>

      <FaqSection
        title="자주 묻는 질문"
        faqs={[
          { question: 'JWT 디코딩은 안전한가요?', answer: 'JWT의 Header와 Payload는 암호화가 아닌 Base64url 인코딩이므로 누구나 디코딩할 수 있습니다. 서명(Signature)만이 위변조를 방지합니다. 민감한 정보는 Payload에 넣지 마세요.' },
          { question: '토큰 만료 확인은 어떻게 하나요?', answer: 'Payload의 exp(expiration) 클레임을 현재 시간과 비교합니다. 이 도구는 자동으로 만료 여부를 표시합니다.' },
          { question: 'JWT의 서명 검증도 가능한가요?', answer: '서명 검증에는 비밀 키(HMAC) 또는 공개 키(RSA/ECDSA)가 필요합니다. 이 도구는 보안상 디코딩만 수행하며, 서명 검증은 서버에서 해야 합니다.' },
        ]}
      />
    </div>
  );
}
