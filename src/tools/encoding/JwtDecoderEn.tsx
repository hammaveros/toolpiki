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

export function JwtDecoderEn() {
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
        throw new Error('JWT must consist of 3 parts (header.payload.signature).');
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
      setError(e instanceof Error ? e.message : 'Invalid JWT format.');
    }
  }, [input]);

  const formatTimestamp = (timestamp: number): string => {
    try {
      const date = new Date(timestamp * 1000);
      return date.toLocaleString('en-US', {
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
        label="JWT Token"
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
              {isExpired() ? '⚠️ Token has expired' : '✓ Token is valid'}
              <span className="ml-2 text-gray-500">
                (Expires: {formatTimestamp(decoded.payload.exp)})
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
                  <div>Issued At (iat): {formatTimestamp(decoded.payload.iat)}</div>
                )}
                {typeof decoded.payload.exp === 'number' && (
                  <div>Expires At (exp): {formatTimestamp(decoded.payload.exp)}</div>
                )}
                {typeof decoded.payload.nbf === 'number' && (
                  <div>Not Before (nbf): {formatTimestamp(decoded.payload.nbf)}</div>
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
              A secret key is required to verify the signature.
            </p>
            <code className="text-sm bg-gray-50 dark:bg-gray-800 p-3 rounded block overflow-x-auto break-all">
              {decoded.signature}
            </code>
          </Card>
        </div>
      )}

      <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          JWT Structure
        </h3>
        <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
          <li><span className="text-red-500 font-medium">Header</span>: Algorithm (alg), Token Type (typ)</li>
          <li><span className="text-purple-500 font-medium">Payload</span>: Claims - sub, iss, exp, iat, etc.</li>
          <li><span className="text-blue-500 font-medium">Signature</span>: Generated from Header + Payload + Secret</li>
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
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">🔑 What is JWT Decoder?</h2>
        <p className="text-sm leading-relaxed">
          JWT (JSON Web Token) is a token format used for authentication and information exchange in web applications.
          It consists of three parts: Header (algorithm info), Payload (claims data), and Signature (verification),
          each separated by dots (.) and encoded in Base64url format.
          This tool decodes JWTs to inspect token contents and verify expiration times.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">📋 Standard JWT Claims</h2>
        <div className="text-sm space-y-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div className="p-2 bg-gray-50 dark:bg-gray-800/50 rounded"><strong>iss</strong> (Issuer): Token issuer</div>
            <div className="p-2 bg-gray-50 dark:bg-gray-800/50 rounded"><strong>sub</strong> (Subject): Token subject (usually user ID)</div>
            <div className="p-2 bg-gray-50 dark:bg-gray-800/50 rounded"><strong>aud</strong> (Audience): Intended recipient</div>
            <div className="p-2 bg-gray-50 dark:bg-gray-800/50 rounded"><strong>exp</strong> (Expiration): Expiry time (Unix timestamp)</div>
            <div className="p-2 bg-gray-50 dark:bg-gray-800/50 rounded"><strong>iat</strong> (Issued At): Token creation time</div>
            <div className="p-2 bg-gray-50 dark:bg-gray-800/50 rounded"><strong>nbf</strong> (Not Before): Token activation time</div>
          </div>
        </div>
      </section>

      <FaqSection
        title="Frequently Asked Questions"
        faqs={[
          { question: 'Is JWT decoding safe?', answer: 'JWT Header and Payload use Base64url encoding (not encryption), so anyone can decode them. Only the Signature prevents tampering. Never put sensitive data in the Payload.' },
          { question: 'How do I check if a token is expired?', answer: 'Compare the exp (expiration) claim in the Payload with the current time. This tool automatically displays the expiration status.' },
          { question: 'Can this tool verify JWT signatures?', answer: 'Signature verification requires a secret key (HMAC) or public key (RSA/ECDSA). This tool only performs decoding for security reasons. Signature verification should be done server-side.' },
        ]}
      />
    </div>
  );
}
