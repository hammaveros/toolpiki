import Link from 'next/link';

export default function PercentagePostEn() {
  return (
    <article className="prose prose-gray dark:prose-invert max-w-none">
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Calculator · July 21, 2026 · 4 min read</p>

      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        Percentage Math Is Simple Until You Actually Need It Fast
      </h1>

      <p className="mb-4">
        <Link href="/en/tools/percentage-en" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 Try the Percentage Calculator
        </Link>
      </p>

      <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 dark:text-gray-400 mb-6">
        The item is $47, marked down 30%. Your brain starts the calculation and then quietly gives up.
      </blockquote>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">When Percentage Calculations Come Up</h2>

      <p className="mb-3">More often than you might think:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>Shopping → a 30% discount on $79.99, how much do you actually pay?</li>
        <li>Salary negotiations → your current salary is $68,000, they offered 12% more — what is the number?</li>
        <li>Finance → a portfolio went from $12,400 to $14,800, what is the percentage gain?</li>
        <li>Taxes → the tax rate is 8.5%, the pre-tax total is $214, what is the tax amount?</li>
        <li>Grades → you scored 47 out of 60, what is your percentage?</li>
        <li>Markup → you buy something for $35 and want a 40% margin, what should the selling price be?</li>
        <li>Tips → the bill is $88 and you want to leave 20%, how much do you add?</li>
        <li>Data analysis → 234 out of 1,800 responses selected an option, what percentage is that?</li>
      </ul>

      <p className="mb-4">
        Every one of these is a real scenario where someone pauses and reaches for their phone. The calculations are not conceptually hard. But doing them quickly and accurately under time pressure — while standing in a store, in the middle of a negotiation, or on a call — is a different story.
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Why People Get Percentage Calculations Wrong</h2>

      <p className="mb-3">
        The most common error is confusing which number goes where. "What percent of 80 is 20?" and "20 is what percent of 80?" sound similar but get muddled easily. Throw in a discount scenario — "if $120 is the price after a 25% discount, what was the original?" — and the math direction flips completely.
      </p>

      <p className="mb-3">Common confusion points:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>Percentage of vs. percentage off → "20% of 80" is 16; "20% off 80" is 64</li>
        <li>Markup vs. margin → a 40% markup on cost is not the same as a 40% margin on price</li>
        <li>Percentage change vs. absolute change → a price went from $50 to $60, that is a 20% increase, not a 10% increase</li>
        <li>Reverse percentage → the sale price is $75 after a 25% discount, what was the original? ($100, not $93.75)</li>
        <li>Percentage points vs. percentages → interest going from 3% to 5% is a 2 percentage point increase but a 67% relative increase</li>
      </ul>

      <p className="mb-4">
        The reverse percentage one trips people up constantly. If something is $75 after a 25% discount, the instinct is to add 25% back: $75 × 1.25 = $93.75. But that is wrong. The correct answer is $75 ÷ 0.75 = $100. The mistake makes logical sense — you subtracted 25% to get there, so you add 25% to reverse it — but percentages do not work symmetrically. Adding 25% undoes a 20% decrease, not a 25% decrease.
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">What Generic Calculators Miss</h2>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>A phone calculator requires you to know the formula → you still have to think about what to multiply or divide</li>
        <li>Most search engine "percentage calculator" results → just one type of calculation, usually X% of Y</li>
        <li>Spreadsheet formulas → useful if you are already in a spreadsheet, friction if you are not</li>
        <li>No explanation → you get a number but not a sanity check that you set up the problem correctly</li>
      </ul>

      <p className="mb-4">
        The issue is that percentage problems come in genuinely different shapes. "What is 15% of 200?" is a different structure from "200 is 15% of what?" and "what percentage is 30 of 200?" even though all three involve the same core relationship. A calculator built around one shape does not help with the others.
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">What This Tool Does</h2>

      <p className="mb-3">Multiple calculation modes, all in one place:</p>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">Basic percentage:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>What is X% of Y? → straightforward percentage lookup</li>
        <li>X is what percent of Y? → find the percentage given two numbers</li>
        <li>X is Y% of what? → reverse percentage to find the original</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">Discount and markup:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>Apply a discount → original price minus percentage, shows the saved amount</li>
        <li>Apply a markup → cost price plus percentage margin, shows the final price</li>
        <li>Reverse discount → final price and discount rate, find the original price</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">Percentage change:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>From value A to value B → shows increase or decrease as a percentage</li>
        <li>Useful for financial comparisons, grade changes, and before/after metrics</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Real Scenarios Where This Saves Time</h2>

      <p className="mb-3">A few examples where the tool earns its place:</p>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">Salary negotiation:</p>
      <p className="mb-4 text-gray-700 dark:text-gray-300">
        You are currently at $72,000. They offer 8%. Quickly: 8% of $72,000 is $5,760. New salary: $77,760. Is that enough? You can decide in seconds rather than doing long multiplication in your head while trying to hold a professional conversation.
      </p>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">Shopping discount:</p>
      <p className="mb-4 text-gray-700 dark:text-gray-300">
        The jacket is $189, 35% off. Mental math gives you a rough number, but you want the exact figure before deciding. Original price $189, 35% discount: you save $66.15, pay $122.85. You pull out your card.
      </p>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">Business margin check:</p>
      <p className="mb-4 text-gray-700 dark:text-gray-300">
        Your cost is $45 per unit, you want 60% gross margin. The selling price needs to be $45 ÷ (1 − 0.60) = $112.50. A lot of people mistakenly add 60% markup to cost ($45 × 1.60 = $72) and wonder why their margins look wrong in the accounting reports.
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Honest Assessment</h2>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">What works well:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>Multiple problem types in one interface → no need to google a different tool for each scenario</li>
        <li>Shows the formula used → you can verify you set up the problem correctly</li>
        <li>Handles the reverse case → original price from discounted price, original number from percentage result</li>
        <li>Instant results → no button to press, answers update as you type</li>
        <li>Clean layout → each mode is clearly separated, no confusion about which fields do what</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">Limitations:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>Does not handle compound interest scenarios → for those, use a dedicated compound interest calculator</li>
        <li>No currency formatting by default → results show as plain numbers, you supply the currency context</li>
        <li>Does not chain calculations → if your problem requires multiple percentage steps, you do them one at a time</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">How to Use It</h2>

      <ol className="space-y-1 mb-4 text-gray-700 dark:text-gray-300 list-decimal list-inside">
        <li>Pick the type of calculation you need from the available modes</li>
        <li>Enter your numbers in the corresponding fields</li>
        <li>Read the result — shown instantly with the formula for verification</li>
        <li>Switch modes if your next calculation has a different structure</li>
      </ol>

      <p className="mb-4">Takes about 10 seconds per calculation.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Try It</h2>

      <p className="mb-4">
        <Link href="/en/tools/percentage-en" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 Try the Percentage Calculator
        </Link>
      </p>
      <p className="text-gray-600 dark:text-gray-400">Multiple modes, reverse calculations, instant results — no ads blocking the input fields.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <p className="text-sm text-gray-500 dark:text-gray-400">
        `#percentage-calculator` `#discount-calculator` `#markup` `#math` `#free-tools`
      </p>
    </article>
  );
}
