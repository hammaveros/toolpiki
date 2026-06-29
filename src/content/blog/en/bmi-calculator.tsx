import Link from 'next/link';

export default function BmiCalculatorPostEn() {
  return (
    <article className="prose prose-gray dark:prose-invert max-w-none">
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Calculator · July 19, 2026 · 4 min read</p>

      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        BMI Is a Simple Number. Understanding What It Does and Does Not Tell You Is More Complicated.
      </h1>

      <p className="mb-4">
        <Link href="/en/tools/bmi-calculator-en" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 Calculate Your BMI
        </Link>
      </p>

      <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 dark:text-gray-400 mb-6">
        BMI — body mass index — has been used as a health screening tool for decades. It is also one of the most criticized health metrics. Here is what it actually measures, how to calculate it, and when to take it seriously.
      </blockquote>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">What BMI Is and Why It Exists</h2>

      <p className="mb-3">BMI was developed in the 19th century by Belgian statistician Adolphe Quetelet as a population-level measurement tool. The formula is weight in kilograms divided by height in meters squared:</p>

      <p className="mb-4 font-mono text-sm bg-gray-100 dark:bg-gray-800 p-3 rounded">BMI = weight (kg) / height² (m)</p>

      <p className="mb-3">Or in imperial units:</p>

      <p className="mb-4 font-mono text-sm bg-gray-100 dark:bg-gray-800 p-3 rounded">BMI = (weight (lbs) × 703) / height² (inches)</p>

      <p className="mb-3">The result falls into categories:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>Under 18.5 → Underweight</li>
        <li>18.5 – 24.9 → Normal weight</li>
        <li>25.0 – 29.9 → Overweight</li>
        <li>30.0 and above → Obese</li>
      </ul>

      <p className="mb-4">BMI became widely adopted because it is simple to calculate, requires no equipment beyond a scale and measuring tape, and correlates reasonably well with body fat percentage at a population level. That last point is important: it is a population-level tool, not an individual diagnostic.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">What the BMI Calculator Shows</h2>

      <p className="mb-3">The calculator takes your height and weight in either metric or imperial units and outputs:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>Your BMI value</li>
        <li>Your BMI category (underweight, normal, overweight, obese)</li>
        <li>A visual position on the BMI scale showing where you fall relative to the boundaries</li>
        <li>The healthy weight range for your height (the weight range that falls within 18.5–24.9 BMI)</li>
        <li>Approximate weight to gain or lose to reach the normal range, if applicable</li>
      </ul>

      <p className="mb-3">It supports both unit systems:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>Metric: kilograms and centimeters</li>
        <li>Imperial: pounds and feet/inches</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">The Honest Limitations of BMI</h2>

      <p className="mb-3">BMI is useful as a rough screening tool but has significant limitations that are worth understanding:</p>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">It does not distinguish muscle from fat:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>A very muscular athlete can have a BMI in the "overweight" or "obese" category while having very low body fat</li>
        <li>Conversely, someone with a "normal" BMI can have a high percentage of body fat and low muscle mass — sometimes called "skinny fat" or normal-weight obesity</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">It does not account for body fat distribution:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>Abdominal fat (visceral fat) carries higher health risks than fat stored elsewhere</li>
        <li>Two people with the same BMI but different fat distributions have different health risk profiles</li>
        <li>Waist circumference is often considered a better predictor of metabolic health than BMI</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">Population differences:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>The original BMI thresholds were developed primarily from studies of European populations</li>
        <li>Research suggests that people of Asian descent have higher health risks at lower BMI values</li>
        <li>Some health organizations use adjusted thresholds for different ethnic populations</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">Age and sex:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>BMI does not adjust for age or sex, which affect healthy body composition</li>
        <li>Older adults typically have more body fat at the same BMI compared to younger adults</li>
        <li>Women naturally have higher body fat percentages than men at the same BMI</li>
      </ul>

      <p className="mb-4">These limitations mean BMI should be treated as one data point, not a definitive health assessment. It is a starting point for a conversation with a healthcare provider, not a diagnosis.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">When BMI Is Useful</h2>

      <p className="mb-3">Despite its limitations, BMI is still commonly used for good reasons:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>Quick screening → it takes five seconds to calculate and provides a rough classification</li>
        <li>Population-level research → comparing average weight status across countries, tracking trends over time</li>
        <li>Insurance and medical screening → commonly used as an initial assessment trigger for further evaluation</li>
        <li>Personal tracking → monitoring whether weight is trending in the right direction over months</li>
        <li>Motivation reference → understanding where you fall relative to clinical thresholds can be useful context for health goals</li>
      </ul>

      <p className="mb-4">Just keep in mind what it is: a single ratio of weight to height, not a comprehensive health assessment.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Honest Assessment</h2>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">What works well:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>Instant calculation — enter height and weight, get the result</li>
        <li>Both metric and imperial supported</li>
        <li>Shows healthy weight range in addition to your current BMI</li>
        <li>Visual scale gives context for where you fall relative to thresholds</li>
        <li>No registration or data storage</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">Limitations of the tool (not just BMI):</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>Cannot account for muscle mass or body composition</li>
        <li>Uses standard WHO thresholds — does not apply adjusted thresholds for ethnicity</li>
        <li>Not a medical tool — results are informational only</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">How to Use It</h2>

      <ol className="space-y-1 mb-4 text-gray-700 dark:text-gray-300 list-decimal list-inside">
        <li>Select metric (kg/cm) or imperial (lbs/ft+in)</li>
        <li>Enter your height</li>
        <li>Enter your weight</li>
        <li>Your BMI and category are shown instantly</li>
        <li>Review the healthy weight range for your height</li>
      </ol>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Try It</h2>

      <p className="mb-4">
        <Link href="/en/tools/bmi-calculator-en" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 Calculate Your BMI
        </Link>
      </p>

      <p className="text-gray-600 dark:text-gray-400">A number to know. A context to understand it in.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <p className="text-sm text-gray-500 dark:text-gray-400">
        `#bmi-calculator` `#body-mass-index` `#health-tools` `#weight-calculator` `#fitness` `#free-tools`
      </p>
    </article>
  );
}
