import Link from 'next/link';

export default function JwtDecoderPostEn() {
  return (
    <article className="prose prose-gray dark:prose-invert max-w-none">
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Developer Tools · July 9, 2026 · 4 min read</p>

      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        What's Actually Inside That JWT? Decode and Inspect It in Seconds
      </h1>

      <p className="mb-4">
        <Link href="/en/tools/jwt-decoder-en" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 Try the JWT Decoder
        </Link>
      </p>

      <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 dark:text-gray-400 mb-6">
        Got a 401 Unauthorized error. The token was in the request header. I needed to check whether the claims were correct and whether it was expired. Reading base64url by eye wasn't going to work.
      </blockquote>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">When You Need to Decode a JWT</h2>

      <p className="mb-3">Common debugging scenarios:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>Authentication not working → check if the token has the right claims</li>
        <li>Permission denied → verify that the expected role or scope is in the token</li>
        <li>Token expired error → see the exact <code>exp</code> timestamp</li>
        <li>Understanding a third-party token → inspect what claims an OAuth provider sends</li>
        <li>Writing tests → need to understand the token structure to mock it correctly</li>
        <li>Security audit → check what data is encoded in tokens your app issues</li>
      </ul>

      <p className="mb-4">
        JWTs are everywhere in modern web development — OAuth tokens, session tokens, API keys, SSO assertions. They look like random strings but they're structured data. Being able to read that data quickly is useful almost every day when building or debugging auth flows.
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">What a JWT Actually Is</h2>

      <p className="mb-4">
        A JWT (JSON Web Token) is three Base64url-encoded JSON objects separated by dots: <code>header.payload.signature</code>.
      </p>

      <p className="mb-4">
        The <strong>header</strong> describes the token type and the algorithm used to sign it. Typically something like: <code>{`{"alg":"HS256","typ":"JWT"}`}</code>.
      </p>

      <p className="mb-4">
        The <strong>payload</strong> contains the claims — statements about the subject of the token and metadata. Standard claims include: <code>sub</code> (subject, usually a user ID), <code>iss</code> (issuer), <code>aud</code> (audience), <code>exp</code> (expiration time as a Unix timestamp), <code>iat</code> (issued at). Applications add their own custom claims: roles, permissions, email, username.
      </p>

      <p className="mb-4">
        The <strong>signature</strong> is computed from the encoded header and payload using the algorithm and key specified in the header. It lets the recipient verify that the token wasn't tampered with and came from a trusted issuer — but only if you verify it with the right key. Decoding the payload does not verify the signature.
      </p>

      <p className="mb-4">
        This is an important distinction: anyone can decode a JWT and read the payload. The payload is not encrypted (unless you're using JWE, a less common variant). The signature prevents tampering, but the data is readable without a key. Don't put sensitive secrets in a JWT payload.
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">What the Tool Does</h2>

      <p className="mb-3">Core features:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>Paste a JWT and see the header and payload decoded as formatted JSON</li>
        <li>Expiration time (<code>exp</code>) shown as a human-readable date</li>
        <li>Clear indication if the token is expired</li>
        <li>Time until expiration (if not yet expired)</li>
        <li>All standard claim fields explained with labels</li>
        <li>Signature section shown (not verified, but visible)</li>
      </ul>

      <p className="mb-3">Useful extras:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>Timestamp fields automatically converted to readable dates</li>
        <li>Copy individual claim values</li>
        <li>Detection of algorithm type and key size</li>
        <li>Warning if the algorithm is <code>none</code> (a security anti-pattern)</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">JWT Security Notes Worth Knowing</h2>

      <p className="mb-4">
        Because this comes up when people are debugging auth:
      </p>

      <p className="mb-4">
        <strong>Decoding is not verifying.</strong> This tool decodes the payload. It does not verify the signature. A token can be decoded correctly but still be invalid (forged, tampered with, signed with the wrong key). Verification requires the secret or public key.
      </p>

      <p className="mb-4">
        <strong>The <code>alg: none</code> vulnerability.</strong> Some JWT libraries historically accepted tokens with <code>"alg": "none"</code>, meaning no signature required. This allowed forged tokens. Your JWT library should reject tokens with <code>alg: none</code> unless explicitly allowed. The tool warns you if you paste a token with this header.
      </p>

      <p className="mb-4">
        <strong>Algorithm confusion attacks.</strong> If your server expects RS256 (asymmetric, public key) but can be tricked into accepting HS256 (symmetric, shared secret), an attacker who knows the public key can sign tokens with it as a shared secret. Avoid libraries or configurations that accept multiple algorithms for the same verification path.
      </p>

      <p className="mb-4">
        <strong>Short expiration times matter.</strong> JWTs are typically not revocable (unlike session tokens stored in a database). Once issued, they're valid until expiry. Short expiration + refresh token flow is the pattern to use for tokens that need to be revocable.
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Honest Assessment</h2>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">What works well:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>Instant readable view of what's in a token</li>
        <li>Expiration display is the single most-used feature — critical for debugging</li>
        <li>Timestamp conversion saves manual calculation every time</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">Limitations:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>Cannot verify signature (would require the secret/public key)</li>
        <li>Doesn't support JWE (encrypted tokens) — payload remains unreadable for those</li>
        <li>Avoid pasting tokens from production systems with sensitive data in the payload</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">How to Use It</h2>

      <ol className="space-y-1 mb-4 text-gray-700 dark:text-gray-300 list-decimal list-inside">
        <li>Paste the JWT string into the input</li>
        <li>See header and payload decoded immediately</li>
        <li>Check the expiration status and timestamp</li>
        <li>Inspect individual claims</li>
      </ol>

      <p className="mb-4">Takes seconds. Useful every time you debug auth.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Try It</h2>

      <p className="mb-4">
        <Link href="/en/tools/jwt-decoder-en" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 Try the JWT Decoder
        </Link>
      </p>

      <p className="text-gray-600 dark:text-gray-400">Runs locally in your browser. Nothing sent to a server.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <p className="text-sm text-gray-500 dark:text-gray-400">
        `#jwt` `#jwt-decoder` `#authentication` `#developer-tools` `#security`
      </p>
    </article>
  );
}
