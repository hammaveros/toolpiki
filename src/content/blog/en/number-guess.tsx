import Link from 'next/link';

export default function NumberGuessPostEn() {
  return (
    <article className="prose prose-gray dark:prose-invert max-w-none">
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Fun · July 27, 2026 · 3 min read</p>

      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        Higher or Lower — The Number Guessing Game That Is Harder Than It Looks
      </h1>

      <p className="mb-4">
        <Link href="/en/tools/number-guess-en" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 Try the Number Guessing Game
        </Link>
      </p>

      <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 dark:text-gray-400 mb-6">
        Seems simple. A number between 1 and 100. Seven tries. That should be easy. Then you guess 50 and it says higher, and you realize you've already used up your best guess.
      </blockquote>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Why This Kind of Game Still Works</h2>

      <p className="mb-3">The number guessing game is one of the oldest interactive games in computing history. It appeared in programming tutorials from the 1970s as one of the first things a beginner could build. It still works as a game because the core mechanic is genuinely engaging:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>There is a definite answer → you are not playing against randomness, the number is already set</li>
        <li>Each guess gives you real information → higher or lower eliminates half the remaining possibilities</li>
        <li>There is a time pressure element → limited guesses means you need to think, not just click</li>
        <li>You can apply actual strategy → binary search gives you a mathematically optimal approach</li>
        <li>Failure is quick and consequence-free → a wrong game takes under a minute, and you can retry immediately</li>
        <li>It scratches the same itch as a puzzle → there is a correct answer and you are working toward it</li>
      </ul>

      <p className="mb-4">It is also the kind of game you can play in ten idle seconds without any setup, account, or load time. That makes it genuinely useful as a small distraction.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">The Math Behind the Optimal Strategy</h2>

      <p className="mb-3">The number guessing game is a practical demonstration of binary search. The optimal strategy is to always guess the midpoint of the remaining range:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>Range 1–100 → guess 50. Higher? Now range is 51–100. Lower? Now range is 1–49.</li>
        <li>Each guess cuts the remaining range in half.</li>
        <li>With 7 guesses, you can cover 2^7 = 128 possibilities — more than enough for 1–100.</li>
        <li>This means it is always possible to win in 7 guesses or fewer if you use the optimal strategy.</li>
      </ul>

      <p className="mb-3">Where people go wrong:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>Guessing based on intuition rather than information → "it feels like a high number" is not a strategy</li>
        <li>Not tracking the current range → forgetting what you have already eliminated</li>
        <li>Rounding the midpoint poorly → 51 and 75 means midpoint is 63, not 60 or 65</li>
        <li>Anchoring on their first guess → once you get a higher or lower, the original guess is irrelevant</li>
      </ul>

      <p className="mb-4">Playing this game a few times and deliberately applying binary search makes the concept click in a way that reading about it does not.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">What the Game Includes</h2>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">Core mechanics:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>Random number generated between 1 and 100 at the start of each game</li>
        <li>Higher / lower feedback after each guess</li>
        <li>Guess counter showing how many attempts you have used</li>
        <li>Win condition: guess the number within the attempt limit</li>
        <li>Loss condition: run out of guesses — number is revealed</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">Quality of life:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>Previous guesses listed on screen so you do not have to remember them</li>
        <li>Visual range indicator showing your current narrowed-down zone</li>
        <li>Instant retry — one click starts a new game</li>
        <li>Works on mobile with number keyboard</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Who Actually Uses This</h2>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">People killing time:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>Waiting for a build to finish, a download to complete, or a meeting to start. Quick enough to play in a two-minute window, satisfying enough to feel worth it.</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">People teaching concepts:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>Developers explaining binary search to junior team members or students. Showing the game and then asking them to find a pattern makes the algorithm intuitive fast.</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">Competitive players:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>Some people get genuinely invested in minimizing their guess count. A win in 5 guesses feels noticeably better than a win in 7. Optimizing for that creates a surprisingly engaging loop.</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Honest Assessment</h2>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">What works well:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>Instant to play — no load time, no setup</li>
        <li>Actually engaging despite the simplicity</li>
        <li>Clean feedback loop — you always know exactly where you went wrong</li>
        <li>No ads interrupting gameplay</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">Limitations:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>Single difficulty — no 1–1000 mode or other ranges (yet)</li>
        <li>No score history — best guess counts are not tracked between sessions</li>
        <li>Short sessions — not a game you play for more than a few minutes at a stretch</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">How to Play</h2>

      <ol className="space-y-1 mb-4 text-gray-700 dark:text-gray-300 list-decimal list-inside">
        <li>The game picks a random number between 1 and 100</li>
        <li>Enter your first guess — start with 50 for optimal strategy</li>
        <li>Read the feedback: higher means the number is above your guess, lower means below</li>
        <li>Narrow down your range and guess the midpoint of what remains</li>
        <li>Win by guessing correctly within the attempt limit</li>
        <li>Retry immediately to beat your previous guess count</li>
      </ol>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Try It</h2>

      <p className="mb-4">
        <Link href="/en/tools/number-guess-en" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 Try the Number Guessing Game
        </Link>
      </p>

      <p className="text-gray-600 dark:text-gray-400">Free, instant, no account. See if you can do it in under 5 guesses.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <p className="text-sm text-gray-500 dark:text-gray-400">
        `#number-guess` `#higher-lower` `#brain-game` `#binary-search` `#free-game`
      </p>
    </article>
  );
}
