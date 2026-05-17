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
          <strong className="text-gray-900 dark:text-white">JWT packs an authentication payload into three Base64url segments joined by dots (RFC 7519).</strong>{' '}
          The <strong>Header</strong> announces the signing algorithm, the <strong>Payload</strong> carries claims like user ID, scopes, or expiry, and the <strong>Signature</strong> is a MAC that ties the first two parts to a secret or private key.
          This tool splits the input on the dot character, decodes each part to readable JSON, and — when an <code className="px-1 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-xs font-mono">exp</code> claim is present — compares it against the current Unix timestamp to <strong>flag expired tokens</strong>.
          Everything happens locally in the browser; the token you paste is never sent to a server.
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

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">🛡️ Common JWT Pitfalls</h2>
        <ul className="text-sm space-y-2 list-disc list-inside text-gray-600 dark:text-gray-400">
          <li><strong className="text-gray-900 dark:text-white">alg: none vulnerability</strong> — disclosed in 2015. Naive libraries accepted a token whose header advertised &quot;none&quot; and skipped signature checks entirely. Always <strong>whitelist the algorithms</strong> (HS256, RS256) on the verification side rather than reading <code className="px-1 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-xs font-mono">alg</code> from the untrusted header.</li>
          <li><strong className="text-gray-900 dark:text-white">Storing secrets in the payload</strong> — Base64url is <strong>not encryption</strong>; anything inside is visible to anyone who copies the token.</li>
          <li><strong className="text-gray-900 dark:text-white">Storage location matters</strong> — <code className="px-1 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-xs font-mono">localStorage</code> is reachable from any XSS payload. Use an <strong>HttpOnly Secure cookie</strong> for refresh tokens and keep short-lived access tokens in memory.</li>
          <li><strong className="text-gray-900 dark:text-white">Pair exp with revocation</strong> — server-side revocation list or a <code className="px-1 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-xs font-mono">jti</code> claim so a leaked token can actually be killed.</li>
        </ul>
      </section>

      <div className="rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900 p-4 text-sm">
        <p className="font-semibold text-red-900 dark:text-red-200 mb-1">🔒 Security Note</p>
        <p className="text-red-800 dark:text-red-300"><strong>Never verify signatures in the browser.</strong> Exposing HMAC secrets or RSA/ECDSA private keys is risky. Verification belongs on the server using a well-audited library such as <strong>jose</strong> or <strong>jsonwebtoken</strong>.</p>
      </div>

      <FaqSection
        title="Frequently Asked Questions"
        faqs={[
          { question: 'Is JWT decoding safe?', answer: 'Yes for the decoding step itself — but never treat the payload as private. Header and Payload are Base64url-encoded, not encrypted, so anyone with the token can read them. Tampering is the only thing the signature blocks. Avoid putting passwords, full names, or card numbers in claims.' },
          { question: 'How do I check if a token is expired?', answer: 'Compare the exp claim (a Unix timestamp in seconds) with the current time. This page does that automatically and colors the badge red when the token is past its expiry. Typical lifetimes are 15 minutes to 1 hour for access tokens and several days for refresh tokens.' },
          { question: 'Can this tool verify the signature?', answer: 'No, and intentionally so. Verifying HMAC needs the shared secret, and verifying RSA/ECDSA needs the public key. Exposing either in a browser tool would be risky, so signature verification belongs on the server using a well-audited library such as jose or jsonwebtoken.' },
        ]}
      />
    </div>
  );
}
