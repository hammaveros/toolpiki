'use client';

interface FaqItemProps {
  question: string;
  answer: string;
  defaultOpen?: boolean;
}

export function FaqItem({ question, answer, defaultOpen = false }: FaqItemProps) {
  return (
    <details
      className="group bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700"
      open={defaultOpen}
    >
      <summary className="flex items-center justify-between p-4 cursor-pointer text-sm font-semibold text-gray-900 dark:text-white">
        {question}
        <span className="ml-2 text-gray-400 group-open:rotate-180 transition-transform">
          ▼
        </span>
      </summary>
      <p className="px-4 pb-4 text-sm text-gray-600 dark:text-gray-400">
        {answer}
      </p>
    </details>
  );
}

interface FaqSectionProps {
  title?: string;
  faqs: { question: string; answer: string }[];
  className?: string;
}

export function FaqSection({ title, faqs, className = '' }: FaqSectionProps) {
  if (!faqs || faqs.length === 0) return null;

  return (
    <section className={className}>
      {title && (
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          {title}
        </h2>
      )}
      <div className="space-y-2">
        {faqs.map((faq, index) => (
          <FaqItem key={index} question={faq.question} answer={faq.answer} />
        ))}
      </div>
    </section>
  );
}
