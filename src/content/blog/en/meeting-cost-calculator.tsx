import Link from 'next/link';

export default function MeetingCostCalculatorPostEn() {
  return (
    <article className="prose prose-gray dark:prose-invert max-w-none">
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Calculator · July 20, 2026 · 5 min read</p>

      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        Every Meeting Has a Dollar Cost. Most People Have Never Actually Calculated It.
      </h1>

      <p className="mb-4">
        <Link href="/en/tools/meeting-cost-calculator-en" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 Calculate Your Meeting Cost
        </Link>
      </p>

      <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 dark:text-gray-400 mb-6">
        A one-hour meeting with eight people at an average salary of $80,000 per year costs roughly $320 in direct labor. That is before you account for benefits, overhead, lost focus time, and the time it takes everyone to get back on track afterward.
      </blockquote>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Why Meeting Costs Are Almost Never Discussed</h2>

      <p className="mb-3">Meetings are accepted as a default mode of organizational communication. But unlike almost every other resource a company uses, meeting time is rarely priced:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>Software licenses appear on budget reports. Meeting time does not.</li>
        <li>Office supplies get expense approval. A two-hour all-hands with 50 people does not.</li>
        <li>Travel costs are scrutinized. Daily meeting overhead is invisible.</li>
        <li>Managers who approve $500 in spending without question will schedule a meeting that costs five times more without thinking twice.</li>
      </ul>

      <p className="mb-3">This is not an argument against meetings. Some meetings are invaluable — they resolve conflicts, build alignment, and create outcomes that would take weeks via email. The problem is meetings that exist by inertia, habit, or a lack of alternatives.</p>

      <p className="mb-4">Attaching a dollar figure to meeting time does not make meetings go away. It makes the implicit cost explicit — which is the first step toward deciding whether any given meeting is worth it.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">How the Calculator Works</h2>

      <p className="mb-3">The meeting cost calculator takes three inputs and gives you the direct labor cost:</p>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">Inputs:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>Number of attendees</li>
        <li>Average annual salary (or hourly rate) of attendees</li>
        <li>Meeting duration in hours and minutes</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">Outputs:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>Direct labor cost for the meeting</li>
        <li>Cost per minute (useful for watching during a meeting)</li>
        <li>Cost per attendee</li>
        <li>Estimated total cost with overhead multiplier (typically 1.25–1.5× salary for benefits and overhead)</li>
        <li>Live timer mode — shows the running cost in real time as the meeting progresses</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">Salary input options:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>Annual salary → automatically converted to hourly rate (÷ 2,080 work hours per year)</li>
        <li>Hourly rate → used directly</li>
        <li>Per-person rates → enter different salaries per attendee for more precise calculation</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">The Numbers That Surprise People</h2>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">Scenario 1 — Weekly team standup (10 people):</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>10 people × $85,000 average salary × 15 minutes</li>
        <li>Direct cost: ~$102 per standup</li>
        <li>Per year (52 weeks): ~$5,304</li>
        <li>With overhead multiplier (1.4×): ~$7,426/year</li>
        <li>Is a 15-minute standup worth $7,400 per year? For many teams, yes. For some, it is worth scrutinizing.</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">Scenario 2 — Monthly executive leadership meeting (12 people):</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>12 people × $180,000 average salary × 2 hours</li>
        <li>Direct cost: ~$2,077 per meeting</li>
        <li>Per year (12 meetings): ~$24,923</li>
        <li>With overhead: ~$34,892/year</li>
        <li>These meetings are often worth it — but knowing the number clarifies the expected value threshold</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">Scenario 3 — The "quick check-in" that runs long (6 people):</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>Scheduled for 30 minutes, runs 75 minutes</li>
        <li>6 people × $95,000 average salary × 75 minutes</li>
        <li>Direct cost: ~$272</li>
        <li>The 45-minute overrun alone costs $163 — about the same as a nice business lunch</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">The Real Cost Is Higher Than the Calculator Shows</h2>

      <p className="mb-3">Direct salary cost is the floor, not the ceiling. Several other costs are harder to quantify but real:</p>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">Context-switching cost:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>Research suggests it takes 15–25 minutes to fully resume deep work after an interruption</li>
        <li>A one-hour meeting in the middle of the afternoon can effectively destroy two hours of productive work time</li>
        <li>This is especially significant for developers, writers, researchers, and others doing complex cognitive work</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">Preparation time:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>A 30-minute meeting often requires 15–60 minutes of preparation for each presenter</li>
        <li>This multiplier is invisible in the calendar entry</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">Follow-up and action items:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>Writing meeting notes, distributing action items, following up on decisions — this typically adds 20–30% to the meeting duration in post-meeting time</li>
      </ul>

      <p className="mb-4">The calculator gives you the direct labor cost. Multiply by 2–3× to get a rough estimate of the true organizational cost including all these factors.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">The Live Timer Mode</h2>

      <p className="mb-3">One feature worth highlighting: the live timer mode lets you run the calculator during an actual meeting.</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>Enter attendees and average salary before the meeting starts</li>
        <li>Hit Start when the meeting begins</li>
        <li>The calculator ticks up in real time, showing the running cost</li>
        <li>Display this on a screen during the meeting — or just have it open on your laptop as a personal reminder</li>
      </ul>

      <p className="mb-3">This sounds provocative. Used correctly, it is not about making people feel bad — it is about making the cost of time visible so that the conversation can be as efficient as possible.</p>

      <p className="mb-4">Some teams display the running cost on a screen during planning meetings as a light social prompt to stay on track. Results vary, but it does tend to reduce tangents.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">When to Use This</h2>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>Before scheduling a recurring meeting — is the weekly cadence justified by outcomes?</li>
        <li>When proposing a meeting reduction to a skeptical manager — bring the numbers</li>
        <li>When auditing your own calendar to identify high-cost, low-value meetings</li>
        <li>When designing meeting norms for a new team — set expectations around cost-efficiency from the start</li>
        <li>When a meeting is drifting off-topic and you need a tactful way to refocus it</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Honest Assessment</h2>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">What works well:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>Makes meeting cost concrete in under 10 seconds</li>
        <li>Live timer mode is genuinely useful during long meetings</li>
        <li>Overhead multiplier gives a more realistic total than direct salary alone</li>
        <li>Per-person cost breakdown is useful for identifying which meetings are salary-disproportionate</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">Limitations:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>Cannot capture the value of a meeting — only the cost side of the equation</li>
        <li>Average salary inputs are estimates — actual per-person rates are rarely known precisely outside of HR</li>
        <li>Does not account for asynchronous meeting preparation or follow-up time</li>
        <li>Not a meeting optimization tool — just a cost calculator</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">How to Use It</h2>

      <ol className="space-y-1 mb-4 text-gray-700 dark:text-gray-300 list-decimal list-inside">
        <li>Enter the number of attendees</li>
        <li>Enter the average annual salary or hourly rate</li>
        <li>Enter the meeting duration</li>
        <li>Review the direct cost, cost per minute, and estimated total with overhead</li>
        <li>Optionally start the live timer at the beginning of a real meeting</li>
      </ol>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Try It</h2>

      <p className="mb-4">
        <Link href="/en/tools/meeting-cost-calculator-en" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 Calculate Your Meeting Cost
        </Link>
      </p>

      <p className="text-gray-600 dark:text-gray-400">Put a number on it. Then decide if it is worth it.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <p className="text-sm text-gray-500 dark:text-gray-400">
        `#meeting-cost` `#productivity` `#meeting-calculator` `#workplace` `#time-management` `#free-tools`
      </p>
    </article>
  );
}
