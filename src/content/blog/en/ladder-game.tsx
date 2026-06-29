import Link from 'next/link';

export default function LadderGamePostEn() {
  return (
    <article className="prose prose-gray dark:prose-invert max-w-none">
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Fun · July 28, 2026 · 4 min read</p>

      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        The Ladder Game — A Fairer Way to Assign Things Nobody Wants to Do
      </h1>

      <p className="mb-4">
        <Link href="/en/tools/ladder-game-en" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 Try the Ladder Game
        </Link>
      </p>

      <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 dark:text-gray-400 mb-6">
        You have five people and five tasks, and nobody wants to go last. A ladder game solves this in thirty seconds and somehow makes it fun.
      </blockquote>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">What Is the Ladder Game?</h2>

      <p className="mb-3">The ladder game (also called a ghost leg lottery or amidakuji) is a method for random assignment where each participant follows a vertical path through a grid of horizontal connectors. The paths cross and redirect in unpredictable ways, making the final assignment feel genuinely random and visible.</p>

      <p className="mb-3">Here is how the concept works:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>Vertical lines are drawn, one per participant</li>
        <li>Horizontal connectors are added at random intervals between adjacent vertical lines</li>
        <li>Each participant follows their line downward, switching lanes whenever they hit a horizontal connector</li>
        <li>The result at the bottom is where they end up — their assigned outcome</li>
      </ul>

      <p className="mb-4">Because the connectors are placed randomly and the paths are visible to everyone, the result feels both transparent and fair. Nobody can claim it was rigged because everyone can trace their own path and verify it.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">When This Is Actually Useful</h2>

      <p className="mb-3">The ladder game is particularly good for situations where you need to assign distinct outcomes to distinct participants:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>Assigning presentation order → first, second, third — who goes when, without the negotiation</li>
        <li>Dividing chores in shared housing → who gets dishes, trash, vacuuming, groceries</li>
        <li>Allocating desks or seating → when you have specific spots and multiple people who want them</li>
        <li>Assigning gift exchange recipients → Secret Santa pairings that feel random and transparent</li>
        <li>Distributing project roles → who takes which part of a group assignment</li>
        <li>Deciding vacation days priority → when multiple people want the same dates off</li>
        <li>Allocating shifts → who works which time slot in a rotation</li>
        <li>Event raffles with distinct prizes → each winner gets something different, fairly assigned</li>
      </ul>

      <p className="mb-4">The key distinction from other random tools is the one-to-one matching. Every participant gets exactly one outcome, and every outcome goes to exactly one participant. No duplicates, no omissions.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">The Appeal of Making It Visual</h2>

      <p className="mb-3">Random number generators and dice produce results, but they do not produce process. The ladder game's visual path-following is what makes it feel different:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>Everyone can follow their own path on screen</li>
        <li>The randomness is embedded in the structure of the grid, not a black box</li>
        <li>Watching the reveal is genuinely satisfying — each path unfolds like a small puzzle being solved</li>
        <li>People are more willing to accept results they can verify with their own eyes</li>
        <li>It turns a mundane assignment task into a brief group activity</li>
      </ul>

      <p className="mb-4">This is why the game has been used in schools and offices across East Asia for decades before being discovered digitally. The process matters as much as the outcome.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">What the Digital Version Includes</h2>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">Input:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>Enter participant names at the top of each vertical line</li>
        <li>Enter outcome labels at the bottom — tasks, prizes, spots, orders, whatever you are assigning</li>
        <li>The number of participants and outcomes must match</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">The game:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>Random ladder grid generated and displayed</li>
        <li>Animated path reveal — each line traces its route to the bottom</li>
        <li>Final assignments shown clearly after all paths complete</li>
        <li>Regenerate button for a fresh grid if needed</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">Practical extras:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>Hide mode — results hidden until each participant chooses to reveal their own path</li>
        <li>Copy result summary to clipboard</li>
        <li>Works on mobile for in-person use</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Real Uses I Have Seen</h2>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">Shared apartment chore assignment:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>Four roommates, four weekly chores. Instead of the usual argument about who has done more recently, they use the ladder game once a week. Nobody disputes the outcome because they watched it happen.</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">Classroom presentation order:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>A teacher projected the ladder game to assign presentation slots to fifteen students. The animation made the class laugh, and the result was accepted immediately with zero complaints. Compare that to the usual "who wants to go first?" silence.</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">Office Secret Santa:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>Used to assign gift givers to receivers without anyone knowing others' assignments. The hide mode was useful here — each person revealed their own path privately.</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Honest Assessment</h2>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">What works well:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>Transparent random assignment that people actually trust</li>
        <li>The animation makes it a small group event rather than just a utility</li>
        <li>Perfect for any one-to-one matching scenario</li>
        <li>Hide mode adds a useful private reveal option</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">Limitations:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>Only works for equal-count participant/outcome pairings</li>
        <li>Not useful if you want unequal weighting or probabilities</li>
        <li>Paths can get small and hard to follow with many participants</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">How to Use It</h2>

      <ol className="space-y-1 mb-4 text-gray-700 dark:text-gray-300 list-decimal list-inside">
        <li>Enter participant names at the top slots</li>
        <li>Enter the outcomes or assignments at the bottom slots</li>
        <li>Click generate to create the random ladder</li>
        <li>Watch the animated path reveal</li>
        <li>See who got what at the end</li>
        <li>Regenerate if needed — or just accept the result</li>
      </ol>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Try It</h2>

      <p className="mb-4">
        <Link href="/en/tools/ladder-game-en" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 Try the Ladder Game
        </Link>
      </p>

      <p className="text-gray-600 dark:text-gray-400">Free, instant, no account. A better way to assign things nobody wants.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <p className="text-sm text-gray-500 dark:text-gray-400">
        `#ladder-game` `#random-assignment` `#amidakuji` `#group-activity` `#free-tools`
      </p>
    </article>
  );
}
