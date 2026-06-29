import Link from 'next/link';

export default function TipCalculatorPostEn() {
  return (
    <article className="prose prose-gray dark:prose-invert max-w-none">
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Calculator · July 22, 2026 · 4 min read</p>

      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        Tipping in the US: The Unwritten Rules and How to Calculate Them Without Embarrassment
      </h1>

      <p className="mb-4">
        <Link href="/en/tools/tip-calculator-en" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 Try the Tip Calculator
        </Link>
      </p>

      <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 dark:text-gray-400 mb-6">
        The bill arrives. There are four of you. The total is $143. Nobody is sure if you tip on the pre-tax or post-tax amount, and the table is quietly doing math.
      </blockquote>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Why Tipping Is Genuinely Confusing</h2>

      <p className="mb-3">
        If you did not grow up in the United States, tipping culture can feel opaque. Even people who grew up here disagree on the specifics. The baseline expectations have also shifted over the past decade, so advice from five years ago may be outdated.
      </p>

      <p className="mb-3">The common questions that come up at the table:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>What is the standard tip percentage for sit-down restaurants? (15% used to be standard; 18–20% is the current baseline; 20–25% for excellent service)</li>
        <li>Do you tip on the pre-tax subtotal or the post-tax total? (Most tip on the pre-tax amount, though many people just tip on whatever is on the bill)</li>
        <li>What about delivery? (10–15% is common; some people tip flat amounts; delivery apps often suggest higher percentages)</li>
        <li>Coffee shops and quick service with tip prompts on the screen? (This is newer and contested; 15–20% for made-to-order drinks, skipping on counter service is socially acceptable in most cities)</li>
        <li>How do you split the tip when splitting the bill unevenly?</li>
        <li>What about large group auto-gratuity? (Many restaurants add 18–20% automatically for groups of 6 or 8+)</li>
      </ul>

      <p className="mb-4">
        None of this is formally written anywhere. It is cultural knowledge transmitted informally, and it varies by region, type of establishment, and how recently someone has been paying attention to how norms have shifted.
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">The Mental Math Problem</h2>

      <p className="mb-3">
        The old trick for 20% tip: move the decimal point one place (10%), double it. $47.50 → $4.75 × 2 = $9.50 tip. Simple enough.
      </p>

      <p className="mb-3">
        Except the bill is $143.80 with tax, there are four people with different items, someone had extra drinks, and you are trying to be sociable rather than staring at your phone doing long division. The mental math breaks down fast when the numbers get messy.
      </p>

      <p className="mb-3">Other scenarios where it gets complicated:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>Splitting a bill four ways when one person had a $40 entrée and another had a $15 salad</li>
        <li>A group of eight where the restaurant has already added automatic gratuity and you are not sure if you should add more</li>
        <li>A business dinner where you want to know the full expected cost including tip before ordering</li>
        <li>Travelling internationally and trying to calibrate to US norms after being in a no-tip country</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">What This Tool Does</h2>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">Basic tip calculation:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>Enter the bill amount and select a tip percentage</li>
        <li>Shows tip amount and total in one view</li>
        <li>Pre-tax and post-tax modes — tip on the subtotal or the full bill</li>
        <li>Custom percentage input for non-standard amounts</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">Bill splitting:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>Enter the number of people and see the per-person amount including tip</li>
        <li>Handles both even splits and rounding to avoid awkward cents</li>
        <li>Shows how much each person owes with the tip distributed fairly</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">Tip percentage guide:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>Quick reference for common service types and current US norms</li>
        <li>Helps visitors and newcomers calibrate without asking someone awkward questions</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Current US Tipping Norms (2026)</h2>

      <p className="mb-3">For reference, since these shift over time:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>Sit-down restaurant (table service): 18–22% is the current expected baseline; 15% reads as slightly low; 25%+ is appreciated for excellent service</li>
        <li>Bar tab: $1–2 per drink for simple orders; 20% for more complex cocktails or attentive service</li>
        <li>Food delivery: 10–15% of the order; $3–5 minimum on small orders is a common guideline</li>
        <li>Rideshare (Uber/Lyft): 15–20%; many people tip 15% as default</li>
        <li>Haircut/salon: 15–20% on the service price, not the retail products</li>
        <li>Hotel housekeeping: $2–5 per night; often skipped but considered thoughtful</li>
        <li>Counter service / coffee shops: 10–15% for made-to-order items; not expected for simple pours</li>
      </ul>

      <p className="mb-4">
        These are general guidelines, not rules. Tipping norms vary by city (NYC and LA tend to run higher), by establishment, and by individual circumstance. The tool helps you calculate; the context guides how much to tip.
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Honest Assessment</h2>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">What works well:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>Fast to use at the table → enter bill amount, done in seconds</li>
        <li>Rounding option → avoids splitting to the penny which is awkward with cash</li>
        <li>Per-person calculation → useful when multiple people are sharing and splitting</li>
        <li>Pre-tax option → for people who prefer tipping on the subtotal</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">Limitations:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>Even split only → does not handle "I had the steak so I owe more" uneven splits</li>
        <li>No automatic gratuity detection → you have to check your bill manually for added gratuity</li>
        <li>US-centric norms → the guideline percentages reflect American service culture specifically</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">How to Use It</h2>

      <ol className="space-y-1 mb-4 text-gray-700 dark:text-gray-300 list-decimal list-inside">
        <li>Enter the bill amount (pre-tax or post-tax, your choice)</li>
        <li>Select a tip percentage or enter a custom one</li>
        <li>Enter the number of people splitting the bill</li>
        <li>Read: tip amount, total, and per-person amount all shown at once</li>
      </ol>

      <p className="mb-4">Takes about 15 seconds. Works well under the table on a phone screen.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Try It</h2>

      <p className="mb-4">
        <Link href="/en/tools/tip-calculator-en" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 Try the Tip Calculator
        </Link>
      </p>
      <p className="text-gray-600 dark:text-gray-400">Bill total, split by people, tip percentage — quick and clean for table use.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <p className="text-sm text-gray-500 dark:text-gray-400">
        `#tip-calculator` `#tipping` `#restaurant` `#bill-split` `#us-culture`
      </p>
    </article>
  );
}
