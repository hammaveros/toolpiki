import Link from 'next/link';

export default function HashGeneratorPostEn() {
  return (
    <article className="prose prose-gray dark:prose-invert max-w-none">
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Encoding · July 22, 2026 · 4 min read</p>

      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        Hash Functions Explained: What MD5, SHA-1, and SHA-256 Actually Do and When to Use Each
      </h1>

      <p className="mb-4">
        <Link href="/en/tools/hash-generator-en" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 Try the Hash Generator
        </Link>
      </p>

      <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 dark:text-gray-400 mb-6">
        You downloaded a file. The website shows a SHA-256 checksum. You want to verify the file was not corrupted or tampered with. Now you need to generate the hash yourself to compare.
      </blockquote>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">What a Hash Function Does</h2>

      <p className="mb-3">
        A cryptographic hash function takes any input — a word, a sentence, an entire file — and produces a fixed-length output called a hash (or digest). The key properties:
      </p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>Deterministic → the same input always produces the same hash</li>
        <li>Fixed output length → MD5 always outputs 32 hex characters; SHA-256 always outputs 64</li>
        <li>Avalanche effect → changing one character in the input completely changes the output hash</li>
        <li>One-way → you cannot reverse a hash to recover the original input (computationally infeasible)</li>
        <li>Collision resistant → it should be practically impossible to find two different inputs that produce the same hash</li>
      </ul>

      <p className="mb-4">
        These properties make hash functions useful for integrity checking, password storage, digital signatures, and deduplication — but the practical safety of these uses depends heavily on which algorithm you use.
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">MD5: Still Everywhere, No Longer Safe for Security</h2>

      <p className="mb-3">
        MD5 was designed in 1991 and was the standard for decades. It produces a 128-bit (32 hex character) hash. The problem: MD5 collision attacks were demonstrated in the early 2000s, and by 2012, collisions could be generated in under a second on consumer hardware.
      </p>

      <p className="mb-3">What this means practically:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>MD5 is broken for any security-sensitive use: password hashing, digital signatures, certificate fingerprinting</li>
        <li>MD5 is still fine for non-security uses: file deduplication, cache keys, checksums where you control both sides</li>
        <li>An attacker who can generate MD5 collisions can create a malicious file that hashes to the same value as a legitimate one</li>
        <li>Most certificate authorities stopped using MD5 in certificates after 2008</li>
      </ul>

      <p className="mb-4">
        You will still see MD5 checksums on software download pages because many projects never updated. For verifying a download against the provided checksum, it still works as a corruption check (random bit flips will not produce the same hash). It is not safe if the threat is deliberate tampering.
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">SHA-1: Deprecated, Still Encountered</h2>

      <p className="mb-3">
        SHA-1 produces a 160-bit (40 hex character) hash. It was widely used through the 2000s and was considered more secure than MD5. The first practical SHA-1 collision was demonstrated by Google's SHAttered project in 2017. Today:
      </p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>SHA-1 is officially deprecated by NIST and major browser vendors</li>
        <li>Most modern systems have migrated away from SHA-1 in TLS certificates</li>
        <li>Git still uses SHA-1 internally for object hashing (though migration to SHA-256 is in progress)</li>
        <li>You will encounter SHA-1 hashes in legacy systems and older documentation</li>
        <li>Like MD5, it is fine for non-security deduplication but should not be used for new security applications</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">SHA-256: The Current Standard for General Use</h2>

      <p className="mb-3">
        SHA-256 is part of the SHA-2 family and produces a 256-bit (64 hex character) hash. It has no known practical collision vulnerabilities and is the current recommended standard for most applications:
      </p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>TLS/HTTPS certificates → SHA-256 is the standard digest algorithm in modern certificates</li>
        <li>Software distribution checksums → most major Linux distributions and security-conscious projects use SHA-256</li>
        <li>Blockchain → Bitcoin uses double SHA-256 for proof of work</li>
        <li>Code signing → used in code signing certificates for executables and packages</li>
        <li>HMAC authentication → the basis of many API authentication schemes (AWS Signature v4, etc.)</li>
      </ul>

      <p className="mb-4">
        For new applications: use SHA-256. For passwords specifically, use a dedicated password hashing algorithm like bcrypt, scrypt, or Argon2 — those are designed to be slow and resistant to GPU-accelerated cracking, which SHA-256 is not.
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Common Use Cases for the Hash Generator</h2>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>File integrity verification → download a file, generate its SHA-256, compare against the official checksum</li>
        <li>Quick text fingerprinting → generate a hash of a document or string to track changes</li>
        <li>Testing hash behavior → explore how small input changes produce completely different outputs</li>
        <li>Learning and debugging → verify that your code is producing the same hash as a reference</li>
        <li>Deduplication → hash file contents to identify duplicates without comparing bytes directly</li>
        <li>API development → verify that your HMAC or signing implementation produces the correct hash</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">What This Tool Does</h2>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>Enter any text input</li>
        <li>Generates MD5, SHA-1, and SHA-256 hashes simultaneously</li>
        <li>Results update as you type</li>
        <li>One-click copy for each hash value</li>
        <li>Handles Unicode input correctly</li>
        <li>All processing happens in your browser — the input text is never sent to a server</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Honest Assessment</h2>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">What works well:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>Multiple algorithms at once → no need to run three different tools</li>
        <li>Client-side processing → sensitive inputs stay in your browser</li>
        <li>Instant updates → see how the hash changes as you modify the input</li>
        <li>Clean output formatting → 64-character SHA-256 hashes are hard to read; the tool formats them clearly</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">Limitations:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>Text input only → does not hash binary files directly (you would need a local tool for that)</li>
        <li>No HMAC support → for keyed hashing you need a more specialized tool</li>
        <li>No SHA-3 or SHA-512 → covers the most common algorithms but not the full SHA family</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Try It</h2>

      <p className="mb-4">
        <Link href="/en/tools/hash-generator-en" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 Try the Hash Generator
        </Link>
      </p>
      <p className="text-gray-600 dark:text-gray-400">MD5, SHA-1, SHA-256 — all three at once, instant results, runs entirely in your browser.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <p className="text-sm text-gray-500 dark:text-gray-400">
        `#hash-generator` `#sha256` `#md5` `#checksum` `#cryptography`
      </p>
    </article>
  );
}
