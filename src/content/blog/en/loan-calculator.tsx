import Link from 'next/link';

export default function LoanCalculatorPostEn() {
  return (
    <article className="prose prose-gray dark:prose-invert max-w-none">
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Calculator · July 19, 2026 · 5 min read</p>

      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        Before You Sign a Loan, Run the Numbers. Here Is a Tool That Makes It Easy.
      </h1>

      <p className="mb-4">
        <Link href="/en/tools/loan-calculator-en" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 Open the Loan Calculator
        </Link>
      </p>

      <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 dark:text-gray-400 mb-6">
        A lender tells you the monthly payment. What they do not emphasize is the total interest you will pay over the life of the loan. For a 30-year mortgage, that number can easily exceed the original loan amount.
      </blockquote>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Why You Need to Run Loan Numbers Yourself</h2>

      <p className="mb-3">Loan decisions are some of the largest financial commitments most people make. The math involved is not complicated, but it is rarely shown clearly:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>Monthly payments are easier to process than total cost — lenders know this and emphasize the monthly number</li>
        <li>Small interest rate differences have enormous impact over long loan terms — a 0.5% difference on a 30-year mortgage can mean tens of thousands of dollars</li>
        <li>Refinancing decisions depend on break-even calculations that require knowing both old and new total costs</li>
        <li>Extra payments dramatically change total interest paid — but by how much, exactly?</li>
        <li>Comparing two loan offers requires reducing both to comparable total cost figures</li>
        <li>Understanding the amortization schedule shows you how much of each payment goes to principal versus interest — and the answer is often surprising</li>
      </ul>

      <p className="mb-4">A loan calculator puts you in control of that information before a lender decides to show it to you.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">What the Loan Calculator Shows</h2>

      <p className="mb-3">The calculator takes three inputs and gives you a complete picture of the loan:</p>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">Inputs:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>Principal amount (the amount borrowed)</li>
        <li>Annual interest rate</li>
        <li>Loan term (in years or months)</li>
        <li>Optional: extra monthly payment amount</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">Outputs:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>Monthly payment amount</li>
        <li>Total amount paid over the life of the loan</li>
        <li>Total interest paid</li>
        <li>Interest-to-principal ratio — what percentage of your total payments is interest</li>
        <li>If extra payments are specified: how many months shorter the loan becomes, and how much interest is saved</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">Amortization schedule:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>Month-by-month breakdown of each payment</li>
        <li>Shows principal paid, interest paid, and remaining balance for every payment</li>
        <li>Makes visible the early-period interest heavy nature of amortized loans</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">The Math Behind It</h2>

      <p className="mb-3">The standard loan payment formula for a fixed-rate amortizing loan is:</p>

      <p className="mb-4 font-mono text-sm bg-gray-100 dark:bg-gray-800 p-3 rounded">
        M = P × [r(1+r)^n] / [(1+r)^n - 1]
      </p>

      <p className="mb-3">Where:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>M = monthly payment</li>
        <li>P = principal amount</li>
        <li>r = monthly interest rate (annual rate ÷ 12)</li>
        <li>n = total number of payments (years × 12)</li>
      </ul>

      <p className="mb-4">The formula looks intimidating but the calculator handles it for you. What matters is understanding what the outputs mean and how to use them to make better decisions.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Scenarios Worth Running</h2>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">Comparing loan terms:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>$300,000 mortgage at 6.5% for 30 years → monthly payment ~$1,896, total interest ~$382,000</li>
        <li>Same loan at 15 years → monthly payment ~$2,613, total interest ~$170,000</li>
        <li>The 15-year costs $717 more per month but saves $212,000 in total interest</li>
        <li>Is the monthly difference affordable? The calculator helps you answer that concretely</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">Effect of interest rate on total cost:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>$300,000 at 6.0% for 30 years → total interest ~$347,000</li>
        <li>$300,000 at 6.5% for 30 years → total interest ~$382,000</li>
        <li>That 0.5% difference costs an additional $35,000 over the loan term</li>
        <li>This shows why shopping for a slightly better rate is worth significant effort</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">Extra payments:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>$300,000 at 6.5% for 30 years with an extra $200/month → loan pays off in 24 years, saves ~$80,000 in interest</li>
        <li>Shows the dramatic effect of modest extra payments on long-term loans</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">Car loan comparison:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>$30,000 car at 5% for 60 months → monthly $566, total interest $3,968</li>
        <li>Same car at 7% → monthly $594, total interest $5,638</li>
        <li>The 2% rate difference adds $1,670 to the total cost — worth negotiating on</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Reading the Amortization Schedule</h2>

      <p className="mb-3">The amortization schedule is the most revealing part for people who have never seen one:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>On a 30-year mortgage, in month 1, most of your payment goes to interest — not principal</li>
        <li>On a $300,000 loan at 6.5%, month 1 payment is $1,896: roughly $1,625 is interest, $271 is principal</li>
        <li>It takes about 20 years before more than half of each monthly payment goes to principal</li>
        <li>This is why refinancing early makes sense for some people — if you refinance in year 5, you are mostly starting the amortization clock over, which costs you on interest</li>
      </ul>

      <p className="mb-4">Seeing this schedule makes real the financial mechanics of long-term debt in a way that a single monthly payment number never does.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Honest Assessment</h2>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">What works well:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>Instant calculation — results update as you type</li>
        <li>Total interest is prominently shown, not buried</li>
        <li>Extra payment scenario is genuinely useful for planning</li>
        <li>Amortization schedule gives full transparency into the loan</li>
        <li>Supports common loan types: mortgage, auto, personal, student</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">Limitations:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>Assumes a fixed interest rate — does not handle variable-rate or ARM loans</li>
        <li>Does not include property taxes, insurance, or PMI for mortgages</li>
        <li>Does not account for origination fees or points — your actual cost of borrowing may be higher</li>
        <li>Not a substitute for advice from a financial advisor or lender for major decisions</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">How to Use It</h2>

      <ol className="space-y-1 mb-4 text-gray-700 dark:text-gray-300 list-decimal list-inside">
        <li>Enter the loan amount (principal)</li>
        <li>Enter the annual interest rate</li>
        <li>Enter the loan term in years</li>
        <li>Optionally add an extra monthly payment to see payoff impact</li>
        <li>Review monthly payment, total cost, and total interest</li>
        <li>Expand the amortization schedule to see the month-by-month breakdown</li>
      </ol>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Try It</h2>

      <p className="mb-4">
        <Link href="/en/tools/loan-calculator-en" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 Open the Loan Calculator
        </Link>
      </p>

      <p className="text-gray-600 dark:text-gray-400">Run the numbers before you sign. See the total cost, not just the monthly payment.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <p className="text-sm text-gray-500 dark:text-gray-400">
        `#loan-calculator` `#mortgage-calculator` `#interest-calculator` `#personal-finance` `#amortization` `#free-tools`
      </p>
    </article>
  );
}
