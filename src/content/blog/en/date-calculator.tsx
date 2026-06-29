import Link from 'next/link';

export default function DateCalculatorPostEn() {
  return (
    <article className="prose prose-gray dark:prose-invert max-w-none">
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Calculator · June 24, 2026 · 4 min read</p>

      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        Date Math Is Harder Than It Looks, and You Should Stop Doing It by Hand
      </h1>

      <p className="mb-4">
        <Link href="/en/tools/date-calculator-en" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 Try the Date Calculator
        </Link>
      </p>

      <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 dark:text-gray-400 mb-6">
        The contract ends 90 days from today. You open a calendar, count weeks, lose track, start over.
      </blockquote>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">When Date Calculation Actually Matters</h2>

      <p className="mb-3">It comes up constantly in work and everyday life:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>Contracts and NDAs → 30/60/90-day windows, renewal deadlines, notice periods</li>
        <li>Project planning → how many working days until the launch date?</li>
        <li>Freelance and consulting → billing periods, invoice due dates, payment terms</li>
        <li>Legal and compliance → statute of limitations, regulatory filing deadlines</li>
        <li>Medical → prescription durations, treatment intervals, follow-up scheduling</li>
        <li>Travel → days until departure, visa validity windows, time zone crossings</li>
        <li>Personal milestones → anniversaries, how old is someone, days since an event</li>
        <li>Countdowns → product launches, exam dates, event planning</li>
      </ul>

      <p className="mb-4">
        The problem is not that these calculations are conceptually difficult. The problem is that humans are bad at calendar arithmetic. Months have different lengths. Leap years exist. Weekends interrupt working day counts. You can hold one or two of these factors in mind while counting on a calendar, but if you need to do it reliably under pressure, the error rate is higher than you expect.
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Why Calendar Counting Goes Wrong</h2>

      <p className="mb-3">
        Open a calendar and try to count 90 days from March 15. You scroll through March (16 days left), April (30 days), May (30 days), and you have 76. You need 14 more into June, landing on June 13. You check your math. You are not sure if you counted March 15 as day zero or day one. You do it again. You get June 12. You are no longer confident in either answer.
      </p>

      <p className="mb-3">
        The "off by one" problem is real. Whether you count the start date as day zero or day one changes the result by a day, and in legal or contractual contexts that day matters.
      </p>

      <p className="mb-3">Similar traps:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>February 29 exists in leap years → adding one year to a date in February requires knowing whether the destination year is a leap year</li>
        <li>Month-end calculations → "three months from January 31" — is it April 30 or May 1?</li>
        <li>Working day counts → skip weekends and public holidays, but which holidays depends on jurisdiction</li>
        <li>Duration between two dates → 2 years, 3 months, 14 days is a different answer than 808 days, both technically correct but useful in different contexts</li>
        <li>Time zones → a deadline of "end of day March 15" in a different time zone can shift by up to a full day</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">What Existing Tools Get Wrong</h2>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>Most online date calculators only do one thing → difference between two dates OR add/subtract days, not both</li>
        <li>The results are given in just one unit → you get "120 days" but not "3 months and 29 days"</li>
        <li>No working day support → they count calendar days only, which is wrong for business deadlines</li>
        <li>No countdown mode → they calculate a date but do not keep it live and updating</li>
        <li>Date format confusion → some assume MM/DD, others expect DD/MM, there is no indication which</li>
        <li>Mobile UX is bad → date pickers that are painful to use on a touch screen</li>
      </ul>

      <p className="mb-4">
        The working day issue deserves more attention. If a contract says "30 business days," that is not the same as 30 calendar days. Depending on the month and how weekends fall, it could be anywhere from 42 to 44 calendar days. Most date calculators just count every day including weekends and Saturday. That is wrong for the use case.
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">What This Tool Does</h2>

      <p className="mb-3">Three modes in one place:</p>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">Date difference:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>Pick two dates and get the gap between them</li>
        <li>Result shown in days, weeks, months, and years simultaneously</li>
        <li>Working day count (excluding weekends)</li>
        <li>Leap year handling is automatic</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">Add or subtract days:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>Start from any date and add or subtract a number of days, weeks, or months</li>
        <li>Get the exact result date with day of week shown</li>
        <li>Working day option → "90 business days from today" gives the right answer</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">Countdown:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>Set a future date and see days remaining, updating in real time</li>
        <li>Useful for deadlines, events, and project milestones</li>
        <li>Also works for past dates → how long ago was something</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Working Days vs. Calendar Days: A Real Example</h2>

      <p className="mb-3">
        Say you need to deliver a project 45 business days from June 2, 2026. Counting calendar days you might estimate mid-July. But 45 business days skips nine weekends (18 days), landing you in mid-August. The difference is more than a month.
      </p>

      <p className="mb-3">
        For anything with a legal or contractual component, getting this right matters. The other party's lawyers will count business days. You should too. Manual counting across a calendar, skipping each Saturday and Sunday, is slow and error-prone. This is exactly the case where a calculator earns its place.
      </p>

      <p className="mb-4">
        The tool handles this: enter the start date, the number of business days, and get the result including which day of the week it falls on.
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Honest Assessment</h2>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">What works well:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>Multiple result formats → total days, weeks, months, and years in one view</li>
        <li>Working day calculation → actually skips weekends correctly</li>
        <li>Day of week shown on results → useful sanity check</li>
        <li>Countdown mode stays live → no need to refresh</li>
        <li>Works on mobile without frustrating date picker issues</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">Limitations:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>Working day calculation skips weekends but not public holidays → holidays vary too much by country and region to support globally</li>
        <li>No time zone handling → all calculations assume the same local time zone</li>
        <li>No calendar view → you see the result date but not a visual calendar context</li>
        <li>Cannot chain calculations → "90 days from X, then add 30 more" requires two separate operations</li>
      </ul>

      <p className="mb-4">
        The public holiday limitation is worth being aware of for legal contexts. If you need exact business day counts including regional holidays, you will need to adjust manually for days like Thanksgiving, Christmas, or other jurisdiction-specific dates.
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">How to Use It</h2>

      <ol className="space-y-1 mb-4 text-gray-700 dark:text-gray-300 list-decimal list-inside">
        <li>Choose a mode: date difference, add/subtract, or countdown</li>
        <li>Enter your start date (or both dates for difference mode)</li>
        <li>Enter the number of days, weeks, or months if adding or subtracting</li>
        <li>Toggle working days if you need business day calculation</li>
        <li>Read the result — it shows total days, the breakdown by units, and the day of the week</li>
      </ol>

      <p className="mb-4">Under a minute in all cases.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Try It</h2>

      <p className="mb-4">
        <Link href="/en/tools/date-calculator-en" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 Try the Date Calculator
        </Link>
      </p>
      <p className="text-gray-600 dark:text-gray-400">Three modes, working day support, no ads covering the inputs.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <p className="text-sm text-gray-500 dark:text-gray-400">
        `#date-calculator` `#working-days` `#countdown` `#productivity` `#free-tools`
      </p>
    </article>
  );
}
