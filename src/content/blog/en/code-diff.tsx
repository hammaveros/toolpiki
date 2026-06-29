import Link from 'next/link';

export default function CodeDiffPostEn() {
  return (
    <article className="prose prose-gray dark:prose-invert max-w-none">
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Developer Tools · July 9, 2026 · 4 min read</p>

      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        Spot Exactly What Changed Between Two Code Versions — Without Opening Git
      </h1>

      <p className="mb-4">
        <Link href="/en/tools/code-diff-en" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 Try the Code Diff Tool
        </Link>
      </p>

      <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 dark:text-gray-400 mb-6">
        I had two versions of a config file — one from before the deployment, one from after. I needed to see what changed. The files weren't in git. I just needed a diff.
      </blockquote>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">When You Need a Quick Diff Without Git</h2>

      <p className="mb-3">It happens regularly:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>Comparing config files from two different servers</li>
        <li>Reviewing changes to a document that isn't version controlled</li>
        <li>Checking what an AI tool changed in a block of code</li>
        <li>Comparing two API responses to spot the difference</li>
        <li>Reviewing a paste from a colleague before applying it</li>
        <li>Debugging why two environment files produce different behavior</li>
        <li>Verifying that a refactored function is semantically equivalent to the original</li>
      </ul>

      <p className="mb-4">
        Git is the right tool when your code is in a repository. But a lot of text that needs comparison doesn't live in git — logs, configs, pasted snippets, clipboard content. A quick browser-based diff handles these cases without the overhead of creating a repository or using a local diff tool.
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Why Not Just Use git diff Locally?</h2>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>Content not in git → have to create temp files and run <code>diff file1 file2</code></li>
        <li>Terminal diff output → character-level changes are hard to read in plain text</li>
        <li>IDE diff → need the IDE open, and the files need to be on disk</li>
        <li>GitHub diff → only works for files already in a pull request</li>
      </ul>

      <p className="mb-4">
        Creating two temp files and running diff works, but it's a few extra steps. A browser-based tool where you paste two blocks of text and immediately see highlighted differences is faster for quick comparisons.
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">What the Tool Does</h2>

      <p className="mb-3">Core features:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>Paste two code blocks side by side</li>
        <li>Differences are highlighted with additions (green) and deletions (red)</li>
        <li>Line-by-line diff view with line numbers</li>
        <li>Inline diff view for character-level changes within a line</li>
        <li>Statistics: total additions, deletions, and changed lines</li>
        <li>Copy the diff output</li>
      </ul>

      <p className="mb-3">Useful options:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>Ignore whitespace — useful for comparing code with different indentation</li>
        <li>Ignore case — case-insensitive comparison</li>
        <li>Unified diff view (like git diff output) vs. split view</li>
        <li>Syntax highlighting for common languages</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">How Diff Algorithms Work</h2>

      <p className="mb-4">
        The classic diff algorithm is the Longest Common Subsequence (LCS) algorithm. It finds the longest sequence of lines that appears in the same order in both files, then treats everything not in that sequence as either an addition (in the new file but not the old) or a deletion (in the old file but not the new).
      </p>

      <p className="mb-4">
        Modern diff tools often use the Myers diff algorithm, which is optimized to find diffs that look natural to humans — minimizing the total edit distance while keeping the diff easy to read. This is the algorithm git uses.
      </p>

      <p className="mb-4">
        Within-line differences use a similar approach but at the character level. Once you've identified which lines changed, you compare the old and new versions of each changed line character by character to highlight exactly what within the line is different.
      </p>

      <p className="mb-4">
        The "ignore whitespace" option works by normalizing whitespace before comparison — collapsing multiple spaces to one, trimming trailing spaces, potentially ignoring indentation entirely. This is useful when comparing code that has been auto-formatted or re-indented, where you care about the logic but not the style.
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Honest Assessment</h2>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">What works well:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>Immediately shows what changed — no command line needed</li>
        <li>Inline character-level diff is genuinely useful for spotting subtle changes</li>
        <li>Ignore whitespace option saves time when comparing reformatted code</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">Limitations:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>Not connected to git — can't navigate commit history</li>
        <li>Large files (many thousands of lines) may be slow to process</li>
        <li>No merge/conflict resolution — view only</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">How to Use It</h2>

      <ol className="space-y-1 mb-4 text-gray-700 dark:text-gray-300 list-decimal list-inside">
        <li>Paste the original code in the left panel</li>
        <li>Paste the modified code in the right panel</li>
        <li>See differences highlighted immediately</li>
        <li>Use the inline view to spot character-level changes</li>
      </ol>

      <p className="mb-4">Results appear instantly as you paste.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Try It</h2>

      <p className="mb-4">
        <Link href="/en/tools/code-diff-en" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 Try the Code Diff Tool
        </Link>
      </p>

      <p className="text-gray-600 dark:text-gray-400">Runs in your browser. Nothing is uploaded.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <p className="text-sm text-gray-500 dark:text-gray-400">
        `#code-diff` `#text-diff` `#diff-tool` `#developer-tools` `#code-comparison`
      </p>
    </article>
  );
}
