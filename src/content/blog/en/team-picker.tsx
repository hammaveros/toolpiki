import Link from 'next/link';

export default function TeamPickerPostEn() {
  return (
    <article className="prose prose-gray dark:prose-invert max-w-none">
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Fun · July 26, 2026 · 4 min read</p>

      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        "Not It" — How to Split Teams Without the Awkward Negotiation
      </h1>

      <p className="mb-4">
        <Link href="/en/tools/team-picker-en" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 Try the Team Picker
        </Link>
      </p>

      <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 dark:text-gray-400 mb-6">
        Ten people, two teams, and somehow the whole thing turned into a fifteen-minute negotiation. There had to be a better way.
      </blockquote>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">When You Actually Need This</h2>

      <p className="mb-3">Team splitting comes up in more contexts than people realize:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>Office retreats and team-building events → someone always ends up managing the logistics while also trying to split into groups fairly</li>
        <li>Classroom group assignments → teachers dividing students into project teams without the drama of people picking their friends</li>
        <li>Sports and pickup games → basketball, dodgeball, volleyball — anything where you need balanced sides</li>
        <li>Online game sessions → splitting a Discord server of players into two even lobbies</li>
        <li>Workshop breakout rooms → dividing attendees into smaller discussion groups quickly</li>
        <li>Hackathons and coding events → organizers need random team formation that feels fair to everyone</li>
        <li>Family game nights → the kind where cousins argue about who gets stuck with the youngest kid on their team</li>
        <li>Remote standups → rotating pairs for peer check-ins or buddy systems</li>
      </ul>

      <p className="mb-4">In each of these situations, the team composition itself matters less than the process feeling fair. If a random tool made the decision, nobody can complain it was rigged.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">What Usually Goes Wrong</h2>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>Captains picking → the same popular people get picked first every time, the last person feels bad</li>
        <li>Odd numbers → nobody knows what to do with the leftover person</li>
        <li>Manual shuffling → someone moves people around "for balance" and then it no longer feels random</li>
        <li>Spreadsheet RAND() → technically works but pulling up a spreadsheet in the middle of a social event is embarrassing</li>
        <li>Paper slips → fine if you prepared them in advance, useless if you did not</li>
        <li>Rock-paper-scissors chains → only works for pairs, breaks down with more than two groups</li>
        <li>Asking for volunteers → some people always volunteer and the same cliques form every time</li>
      </ul>

      <p className="mb-4">The core problem is that any method that involves human judgment opens the door to complaints. Fully random, visibly executed randomness is the only way to sidestep the politics.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">What This Tool Does</h2>

      <p className="mb-3">The Team Picker is straightforward on purpose. Here is what it covers:</p>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">Input:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>Paste or type a list of names, one per line</li>
        <li>Set how many teams you want</li>
        <li>The tool handles uneven splits automatically — no manual math required</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">Output:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>Teams displayed side by side, clearly labeled</li>
        <li>Balanced as evenly as possible given the group size</li>
        <li>Regenerate button for immediate reshuffling if needed</li>
        <li>Copy button to paste results into a chat or document</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">Extras:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>Works on mobile — useful when you are standing in a room and need to show results on your phone</li>
        <li>No account or setup required</li>
        <li>Runs entirely in the browser — no data sent anywhere</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Real Situations This Solved</h2>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">Work event:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>Company offsite, 18 people, needed three teams of six for a scavenger hunt. Pasted the names, set teams to three, showed the screen to the group. Done in 30 seconds. No arguments.</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">Online gaming:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>A Discord community doing a among-us style game with 12 players. Pasted usernames, split into two teams of six, pasted result back into Discord. Someone tried to complain and was told to take it up with the RNG.</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">Classroom:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>A teacher needed to split 27 students into groups of three for a project. Nine groups, names pasted in, result projected on the board. Students could see it was random, so the complaints were minimal.</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">Family gathering:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>Board game night with 10 family members. Two teams of five needed for a trivia game. Typed in names, hit split. The randomness actually made it more fun because unexpected combinations ended up on the same team.</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Honest Take</h2>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">What works well:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>Genuinely fast → paste list, set teams, done</li>
        <li>Handles odd numbers without complaints</li>
        <li>Mobile-friendly for in-person use cases</li>
        <li>The output is easy to share or copy into other tools</li>
        <li>No friction — no signup, no loading screens, no pop-ups</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">Limitations:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>No skill-based balancing → it is purely random, not weighted by ability</li>
        <li>No saved lists → you re-enter names each session</li>
        <li>If someone really dislikes their team and you regenerate, it stops being truly random from that point</li>
      </ul>

      <p className="mb-4">For anything that needs true skill balancing — like a serious tournament — you would want a more dedicated seeding system. For casual or logistical splitting, this covers it.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">How to Use It</h2>

      <ol className="space-y-1 mb-4 text-gray-700 dark:text-gray-300 list-decimal list-inside">
        <li>Open the tool and type or paste your list of names</li>
        <li>Set the number of teams you want</li>
        <li>Click the split button</li>
        <li>Review the teams displayed on screen</li>
        <li>Copy or share the result</li>
        <li>Hit regenerate if you need a different split</li>
      </ol>

      <p className="mb-4">The whole process takes under a minute for any group size.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Try It</h2>

      <p className="mb-4">
        <Link href="/en/tools/team-picker-en" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 Try the Team Picker
        </Link>
      </p>

      <p className="text-gray-600 dark:text-gray-400">No account needed. If the teams seem unbalanced, that is randomness doing its job.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <p className="text-sm text-gray-500 dark:text-gray-400">
        `#team-picker` `#random-teams` `#group-splitter` `#free-tools` `#fun`
      </p>
    </article>
  );
}
