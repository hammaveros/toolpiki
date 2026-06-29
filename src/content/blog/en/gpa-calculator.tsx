import Link from 'next/link';

export default function GpaCalculatorPostEn() {
  return (
    <article className="prose prose-gray dark:prose-invert max-w-none">
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Calculator · July 22, 2026 · 4 min read</p>

      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        GPA Confusion: Why Your Grade Average Is More Complicated Than a Simple Average
      </h1>

      <p className="mb-4">
        <Link href="/en/tools/gpa-calculator-en" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 Try the GPA Calculator
        </Link>
      </p>

      <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 dark:text-gray-400 mb-6">
        You got an A in a 3-credit class, a B in a 4-credit class, and a C in a 2-credit class. Your GPA is not 3.0. You have been calculating this wrong.
      </blockquote>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">When GPA Calculation Matters</h2>

      <p className="mb-3">It comes up more often and with higher stakes than people expect:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>Checking academic standing → minimum GPA requirements for financial aid, scholarships, and program continuation</li>
        <li>Graduate school applications → most programs have minimum GPA cutoffs (commonly 3.0 or 3.5)</li>
        <li>Honors and dean's list → usually requires 3.5 or 3.7 depending on the institution</li>
        <li>Job applications → some employers ask for GPA on entry-level applications</li>
        <li>Predicting your GPA → figuring out what grades you need in remaining courses to hit a target</li>
        <li>Understanding your transcript → international students and people returning to school often encounter the 4.0 scale for the first time</li>
        <li>Transfer applications → computing a cumulative GPA across multiple institutions</li>
      </ul>

      <p className="mb-4">
        In any of these situations, having the wrong number is worse than not knowing. A student who thinks they have a 3.2 GPA and actually has a 3.08 may miss a scholarship threshold without realizing it until after the deadline.
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">How GPA Actually Works (The Part People Get Wrong)</h2>

      <p className="mb-3">
        GPA is a weighted average, not a simple average. The weight for each course is its credit hours. A 4-credit course has twice the impact on your GPA as a 2-credit course.
      </p>

      <p className="mb-3">The calculation:</p>
      <ol className="space-y-1 mb-4 text-gray-700 dark:text-gray-300 list-decimal list-inside">
        <li>Convert each letter grade to a grade point value (A = 4.0, B = 3.0, C = 2.0, D = 1.0, F = 0)</li>
        <li>Multiply each grade point value by the credit hours for that course → this gives quality points</li>
        <li>Sum all quality points across all courses</li>
        <li>Divide the total quality points by the total credit hours</li>
      </ol>

      <p className="mb-3">Example:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>A (4.0) in Biology, 4 credits → 4.0 × 4 = 16 quality points</li>
        <li>B (3.0) in English, 3 credits → 3.0 × 3 = 9 quality points</li>
        <li>C (2.0) in Math, 3 credits → 2.0 × 3 = 6 quality points</li>
        <li>Total quality points: 16 + 9 + 6 = 31</li>
        <li>Total credits: 4 + 3 + 3 = 10</li>
        <li>GPA: 31 ÷ 10 = 3.10</li>
      </ul>

      <p className="mb-4">
        The simple average of A, B, and C grades would give you 3.0. The credit-weighted GPA is 3.10 because the A was in a higher-credit course. This difference matters when you are near a threshold.
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Plus and Minus Grades</h2>

      <p className="mb-3">
        Many institutions use plus/minus grades, which adds more precision (and more confusion). The most common scale:
      </p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>A+ = 4.0 (sometimes 4.3, varies by school)</li>
        <li>A = 4.0</li>
        <li>A− = 3.7</li>
        <li>B+ = 3.3</li>
        <li>B = 3.0</li>
        <li>B− = 2.7</li>
        <li>C+ = 2.3</li>
        <li>C = 2.0</li>
        <li>C− = 1.7</li>
        <li>D+ = 1.3</li>
        <li>D = 1.0</li>
        <li>D− = 0.7</li>
        <li>F = 0.0</li>
      </ul>

      <p className="mb-4">
        Not all schools use this full scale. Some cap the A+ at 4.0 (same as A). Some do not give A+ at all. If your institution uses a non-standard scale, you will need to adjust — but the calculator covers the most common variants.
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">What This Tool Does</h2>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">Semester GPA calculation:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>Enter each course with its grade and credit hours</li>
        <li>Add or remove courses as needed</li>
        <li>Get the credit-weighted GPA for the semester</li>
        <li>Shows quality points per course for transparency</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">Cumulative GPA:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>Enter your existing cumulative GPA and total credits completed</li>
        <li>Add new semester courses and grades</li>
        <li>Calculates the updated cumulative GPA</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">Target GPA planner:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>Enter your current GPA and remaining credits</li>
        <li>Enter a target GPA</li>
        <li>Calculates what average grade you need in remaining courses to reach the target</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Honest Assessment</h2>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">What works well:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>Credit-weighted calculation — the correct method, not a simple average</li>
        <li>Cumulative GPA mode — incorporates your existing academic record</li>
        <li>Target GPA planner — helps with realistic academic planning</li>
        <li>Plus/minus grade support — handles the full standard US scale</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">Limitations:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>No transcript import → you enter grades manually</li>
        <li>Standard 4.0 scale only → if your school uses a different maximum (like 4.3 for A+), adjust accordingly</li>
        <li>Does not account for grade replacement policies → some schools allow retakes that replace the old grade; this tool sums all entered courses</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">How to Use It</h2>

      <ol className="space-y-1 mb-4 text-gray-700 dark:text-gray-300 list-decimal list-inside">
        <li>Add each course with its letter grade and credit hours</li>
        <li>The semester GPA updates instantly as you enter courses</li>
        <li>Switch to cumulative mode and enter your existing GPA and total credits to get your updated cumulative GPA</li>
        <li>Use the target planner to find out what grades you need going forward</li>
      </ol>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Try It</h2>

      <p className="mb-4">
        <Link href="/en/tools/gpa-calculator-en" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 Try the GPA Calculator
        </Link>
      </p>
      <p className="text-gray-600 dark:text-gray-400">Weighted GPA calculation, cumulative mode, target planner — no account needed.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <p className="text-sm text-gray-500 dark:text-gray-400">
        `#gpa-calculator` `#grade-point-average` `#us-grading` `#academic` `#college`
      </p>
    </article>
  );
}
