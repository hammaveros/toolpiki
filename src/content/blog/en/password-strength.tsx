import Link from 'next/link';

export default function PasswordStrengthPostEn() {
  return (
    <article className="prose prose-gray dark:prose-invert max-w-none">
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Calculator · June 23, 2026 · 5 min read</p>

      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        What Actually Makes a Password Strong (And How to Check Yours)
      </h1>

      <p className="mb-4">
        <Link href="/en/tools/password-strength-en" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 Try the Password Strength Checker
        </Link>
      </p>

      <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 dark:text-gray-400 mb-6">
        You type a password you have been using for years and the site says it is "Strong." That does not mean it is actually secure.
      </blockquote>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">The Problem with "Strong" Password Indicators</h2>

      <p className="mb-3">
        Almost every sign-up form has a password strength meter. Almost all of them are useless.
      </p>

      <p className="mb-3">
        Most password strength indicators check for three things: length above a minimum threshold, presence of uppercase letters, and presence of numbers or symbols. Meet those requirements and you get a green bar. `Password1!` is rated Strong. So is `Summer2024!`. These are genuinely weak passwords — they appear in breach databases, they follow patterns that automated guessing tools know about, and an attacker with a modern GPU can crack them in minutes.
      </p>

      <p className="mb-3">
        The indicator told you they were strong because it was checking format rules, not actual resistance to attack.
      </p>

      <p className="mb-3">Situations where this matters:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>You reuse a "strong" password across multiple accounts → one breach exposes all of them</li>
        <li>You use a word with common substitutions (@ for a, 3 for e) → attackers have dictionaries for exactly this</li>
        <li>Your password is a real word plus a number → password cracking tools try these combinations first</li>
        <li>You use a name plus a birth year → common pattern, guessable with minimal effort</li>
        <li>You are creating passwords for clients or a team → you want to verify they meet an actual security bar</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">How Password Attacks Actually Work</h2>

      <p className="mb-3">
        Understanding the attack side helps explain why some passwords that look strong are not.
      </p>

      <p className="mb-3">
        <strong className="font-semibold text-gray-900 dark:text-white">Dictionary attacks</strong> try known words and common phrases. Not just "password" — entire wordlists of millions of words, including slang, names, place names, and pop culture references.
      </p>

      <p className="mb-3">
        <strong className="font-semibold text-gray-900 dark:text-white">Rule-based attacks</strong> take dictionary words and apply common transformations. Capitalize the first letter. Add a number at the end. Substitute @ for a. Replace 3 for e. If your password is `P@ssw0rd`, it is in every rule-based wordlist.
      </p>

      <p className="mb-3">
        <strong className="font-semibold text-gray-900 dark:text-white">Credential stuffing</strong> uses username and password pairs leaked from previous breaches. If you have used the same password on multiple sites and any of those sites had a breach, your credentials are already in lists that attackers use.
      </p>

      <p className="mb-3">
        <strong className="font-semibold text-gray-900 dark:text-white">Brute force</strong> tries every possible combination. At modern speeds, eight-character passwords of any composition can be cracked in hours with specialized hardware. Length matters more than complexity.
      </p>

      <p className="mb-4">
        The math behind this: a twelve-character truly random password with mixed characters has entropy high enough that brute force is not feasible with current hardware. A twelve-character password based on a dictionary word with substitutions has much lower effective entropy — far fewer combinations than it appears to have.
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">What a Better Strength Checker Looks For</h2>

      <p className="mb-3">A meaningful assessment goes beyond format rules:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>Entropy estimation → how many guesses would it take to crack this, probabilistically?</li>
        <li>Pattern detection → does it follow keyboard walks, date patterns, or word-number combos?</li>
        <li>Common password matching → is it in a known breach list?</li>
        <li>Repetition and sequences → `aaa`, `123`, `abc` all reduce effective entropy</li>
        <li>Length weighting → longer passwords should score significantly higher</li>
      </ul>

      <p className="mb-4">
        The zxcvbn algorithm, developed by Dropbox security researchers, does this kind of estimation. It models how an attacker would actually approach a password, rather than checking format compliance. The result is a score based on estimated crack time rather than character diversity.
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">What This Tool Does</h2>

      <p className="mb-3">Two parts: a strength checker and a password generator.</p>

      <p className="mb-3">The strength checker:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>Estimates crack time at realistic attack speeds</li>
        <li>Flags predictable patterns (keyboard sequences, common substitutions, date formats)</li>
        <li>Checks against common password patterns from breach data</li>
        <li>Shows which specific patterns are making the password weaker</li>
        <li>Gives a clearer signal than a vague green/yellow/red bar</li>
      </ul>

      <p className="mb-3">The generator:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>Creates cryptographically random passwords</li>
        <li>Configurable length (12-64 characters)</li>
        <li>Toggle character sets: uppercase, lowercase, numbers, symbols</li>
        <li>One-click copy to clipboard</li>
        <li>Generate multiple options to find one you can work with</li>
      </ul>

      <p className="mb-4">
        The combination matters. Checking a password and finding it weak is only useful if you have a way to generate a better one immediately. Having both in one place removes the round trip.
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">A Note on Passphrases</h2>

      <p className="mb-3">
        Four random words strung together — `correct horse battery staple`, famously from XKCD 936 — can be stronger than a complex-looking eight-character password. A passphrase is longer (more entropy) and easier to remember. The downside is that many sites have character limits that make long passphrases impractical.
      </p>

      <p className="mb-3">
        For accounts where you can use a password manager (which you should), use the manager to generate and store a long random password. For accounts where you need to memorize the password (like the password manager master password itself), a passphrase is a practical alternative.
      </p>

      <p className="mb-4">
        The tool generates both options. If you need something memorable, a passphrase. If you are storing it in a manager, a full random string.
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Honest Assessment</h2>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">What works well:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>More meaningful strength assessment than format-only checkers</li>
        <li>Explains what specifically is weak, not just a number score</li>
        <li>Generator produces genuinely random passwords, not pseudo-random</li>
        <li>No data is sent anywhere → typed passwords never leave the browser</li>
        <li>Useful for security awareness → helps you understand why something is weak</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">Limitations:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>Does not check whether a password has appeared in actual breach databases (that would require a server lookup)</li>
        <li>Crack time estimates assume offline attack scenarios — online attacks with rate limiting are much slower</li>
        <li>Not a substitute for a password manager → still need to store unique passwords per site</li>
        <li>Cannot assess context → a weak password on a low-stakes account may be fine, a strong one on a bank account is essential</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">How to Use It</h2>

      <ol className="space-y-1 mb-4 text-gray-700 dark:text-gray-300 list-decimal list-inside">
        <li>Type or paste a password to check its strength (nothing is sent to a server)</li>
        <li>Read the analysis to understand what is making it weak or strong</li>
        <li>If you need a new password, switch to the generator tab</li>
        <li>Set your preferred length and character requirements</li>
        <li>Copy the generated password and save it in your password manager</li>
      </ol>

      <p className="mb-4">The whole process takes under two minutes.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Try It</h2>

      <p className="mb-4">
        <Link href="/en/tools/password-strength-en" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 Try the Password Strength Checker
        </Link>
      </p>
      <p className="text-gray-600 dark:text-gray-400">Everything runs in the browser. Your passwords never leave your device.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <p className="text-sm text-gray-500 dark:text-gray-400">
        `#password-security` `#password-generator` `#cybersecurity` `#free-tools` `#privacy`
      </p>
    </article>
  );
}
