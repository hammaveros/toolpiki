import Link from 'next/link';

export default function RandomPickerPostEn() {
  return (
    <article className="prose prose-gray dark:prose-invert max-w-none">
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Fun · June 22, 2026 · 4 min read</p>

      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        "You Pick" — "No, You Pick" — "Fine, Let's Just Flip a Coin"
      </h1>

      <p className="mb-4">
        <Link href="/en/tools/random-picker-en" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 Try the Random Picker
        </Link>
      </p>

      <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 dark:text-gray-400 mb-6">
        Eight people, one team captain slot, and nobody wants to volunteer. Somebody needs to decide.
      </blockquote>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">When You Need This</h2>

      <p className="mb-3">Random selection comes up more often than you would expect:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>Picking who presents first → nobody wants to go first, so someone has to be chosen</li>
        <li>Splitting a group into teams → doing this fairly without arguments takes longer than it should</li>
        <li>Assigning chores → "I always do the dishes" stops being a valid complaint when it was random</li>
        <li>Deciding where to eat → a group of four people, all claiming they "don't mind," will never decide on their own</li>
        <li>Selecting a winner from a list of names → giveaways, classroom participation, event raffles</li>
        <li>Picking a movie or game to play → everyone vetoes everyone else's suggestion until you run out of time</li>
        <li>Randomizing a playlist or reading list → when you have too many options and decision fatigue kicks in</li>
        <li>Load balancing manual tasks among team members → rotating who handles support tickets, code reviews, etc.</li>
      </ul>

      <p className="mb-4">In most of these situations, the decision itself does not matter much. The process of making the decision is the actual problem.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">The Problem with Existing Options</h2>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>Coin flip → only works for two options</li>
        <li>Dice → same problem, and most people do not have a die nearby</li>
        <li>Drawing straws → requires physical setup, and someone always suspects it was rigged</li>
        <li>Random number generator → you still have to manually map numbers to names</li>
        <li>Asking someone else to decide → just kicks the problem to another person</li>
        <li>Closing your eyes and pointing → works once, becomes annoying if you need to do it repeatedly</li>
        <li>Spreadsheet with RAND() → functional but unnecessarily complicated for picking a name from a list</li>
      </ul>

      <p className="mb-4">None of these handle the team-splitting case well. And none of them are set up to handle more than a handful of items without significant manual work.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">What I Built</h2>

      <p className="mb-3">The idea started with team selection. I needed to split a group of twelve people into two balanced teams for a work event, and I did not want anyone complaining the teams were rigged. I wanted something I could show on a screen so everyone could see the randomization happen in real time.</p>

      <p className="mb-3">The tool ended up covering several cases:</p>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">Single pick:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>Enter a list of names or items, one per line</li>
        <li>Hit the pick button</li>
        <li>One item is selected at random, with a short animation so it feels fair</li>
        <li>Option to remove picked items so you do not get repeats</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">Team split:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>Enter the full list of participants</li>
        <li>Set how many teams you want (or how many people per team)</li>
        <li>Teams are generated randomly and displayed side by side</li>
        <li>Regenerate if someone does not like the result (though at that point it is no longer random, so fair warning)</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">Weighted random:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>Assign weights to items if some should appear more often than others</li>
        <li>Useful for things like weighted lotteries or priority queues</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Real Situations I Have Used This For</h2>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">Work:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>Deciding the order of sprint retrospective speakers. Nobody volunteers to go first. Random pick ends the standoff in two seconds.</li>
        <li>Splitting into breakout groups for a workshop. 24 attendees, 4 groups, needed to feel fair. The team split feature handled it instantly.</li>
        <li>Picking who runs the weekly demo when the usual person is out. Nobody wants to be voluntold. Random pick removes the awkwardness.</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">Personal:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>Where to eat with friends. Enter five restaurant options, let it pick. The group agreed to trust the result ahead of time, which is the key move.</li>
        <li>What movie to watch. Same approach. Enter the shortlist, let it decide, no more analysis paralysis.</li>
        <li>Chore rotation among housemates. Enter everyone's names, pick who does dishes tonight. Harder to argue with math than with a person.</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Honest Assessment</h2>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">What works well:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>Fast to use → paste a list, click once, done</li>
        <li>Team splitting is genuinely useful → not many free tools do this cleanly</li>
        <li>The animation makes it feel fair to observers → important when people need to trust the result</li>
        <li>Weighted random is a nice extra for edge cases</li>
        <li>No account, no setup, works on mobile</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">Limitations:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>No saved lists → you re-enter names each time (you could bookmark a pre-filled version with a browser trick, but it is not built in)</li>
        <li>Truly random means sometimes the same person gets picked twice in a row → that is how randomness works, but people do not always accept that</li>
        <li>No audit trail → if someone asks "why did it pick that person," there is no log to show</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">How to Use It</h2>

      <ol className="space-y-1 mb-4 text-gray-700 dark:text-gray-300 list-decimal list-inside">
        <li>Type or paste your list — one item per line</li>
        <li>Choose single pick or team split mode</li>
        <li>For team split: set the number of teams</li>
        <li>Click the button</li>
        <li>See the result immediately</li>
        <li>Repeat if needed (with or without removing already-picked items)</li>
      </ol>

      <p className="mb-4">The whole thing takes about ten seconds from opening the page to having a result.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Try It</h2>

      <p className="mb-4">
        <Link href="/en/tools/random-picker-en" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 Try the Random Picker
        </Link>
      </p>

      <p className="text-gray-600 dark:text-gray-400">No sign-up. If the result feels unfair, blame statistics, not the tool.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <p className="text-sm text-gray-500 dark:text-gray-400">
        `#random-picker` `#team-generator` `#decision-maker` `#free-tools` `#productivity`
      </p>
    </article>
  );
}
