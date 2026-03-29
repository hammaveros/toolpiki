'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ResultShareButtonsEn } from '@/components/share/ResultShareButtonsEn';
import { FaqSection } from '@/components/ui/FaqItem';

interface Question {
  id: number;
  question: string;
  options: { text: string; color: string }[];
}

const QUESTIONS: Question[] = [
  {
    id: 1,
    question: 'How do you prefer to spend your weekend?',
    options: [
      { text: 'Adventures and outdoor activities', color: 'red' },
      { text: 'Relaxing at home with a book', color: 'blue' },
      { text: 'Meeting friends and socializing', color: 'yellow' },
      { text: 'Creative projects or hobbies', color: 'green' },
    ],
  },
  {
    id: 2,
    question: 'In a group project, you usually:',
    options: [
      { text: 'Take charge and lead', color: 'red' },
      { text: 'Research and analyze', color: 'blue' },
      { text: 'Keep the team motivated', color: 'yellow' },
      { text: 'Mediate and find balance', color: 'green' },
    ],
  },
  {
    id: 3,
    question: 'What matters most to you?',
    options: [
      { text: 'Achievement and success', color: 'red' },
      { text: 'Knowledge and truth', color: 'blue' },
      { text: 'Happiness and fun', color: 'yellow' },
      { text: 'Peace and harmony', color: 'green' },
    ],
  },
  {
    id: 4,
    question: 'How do you handle stress?',
    options: [
      { text: 'Face it head-on', color: 'red' },
      { text: 'Analyze and plan solutions', color: 'blue' },
      { text: 'Talk to friends about it', color: 'yellow' },
      { text: 'Take time alone to recharge', color: 'green' },
    ],
  },
  {
    id: 5,
    question: 'Your ideal vacation is:',
    options: [
      { text: 'Thrill-seeking adventure', color: 'red' },
      { text: 'Cultural exploration', color: 'blue' },
      { text: 'Beach party with friends', color: 'yellow' },
      { text: 'Quiet nature retreat', color: 'green' },
    ],
  },
];

interface ColorResult {
  color: string;
  name: string;
  emoji: string;
  hex: string;
  traits: string[];
  description: string;
}

const COLOR_RESULTS: Record<string, ColorResult> = {
  red: {
    color: 'red',
    name: 'Passionate Red',
    emoji: '🔴',
    hex: '#EF4444',
    traits: ['Bold', 'Ambitious', 'Energetic', 'Leader'],
    description: 'You\'re a natural leader with unstoppable energy. You tackle challenges head-on and inspire others with your passion and determination.',
  },
  blue: {
    color: 'blue',
    name: 'Calm Blue',
    emoji: '🔵',
    hex: '#3B82F6',
    traits: ['Thoughtful', 'Analytical', 'Loyal', 'Deep'],
    description: 'You value depth and understanding. Your calm demeanor and analytical mind make you a reliable problem-solver and trusted friend.',
  },
  yellow: {
    color: 'yellow',
    name: 'Joyful Yellow',
    emoji: '🟡',
    hex: '#EAB308',
    traits: ['Optimistic', 'Social', 'Creative', 'Fun'],
    description: 'You light up every room you enter! Your optimism and social nature draw people to you, and you spread joy wherever you go.',
  },
  green: {
    color: 'green',
    name: 'Balanced Green',
    emoji: '🟢',
    hex: '#22C55E',
    traits: ['Peaceful', 'Nurturing', 'Grounded', 'Wise'],
    description: 'You bring harmony and balance to everything. Your nurturing nature and grounded wisdom make you a calming presence in any situation.',
  },
};

export function PersonalityColorQuiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [result, setResult] = useState<ColorResult | null>(null);

  const handleAnswer = (color: string) => {
    const newAnswers = [...answers, color];
    setAnswers(newAnswers);

    if (currentQuestion < QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Calculate result
      const colorCounts: Record<string, number> = {};
      newAnswers.forEach((c) => {
        colorCounts[c] = (colorCounts[c] || 0) + 1;
      });

      const dominantColor = Object.entries(colorCounts).reduce(
        (a, b) => (b[1] > a[1] ? b : a),
        ['red', 0]
      )[0];

      setResult(COLOR_RESULTS[dominantColor]);
    }
  };

  const handleReset = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setResult(null);
  };

  const getShareUrl = () => {
    if (!result) return '';
    const data = { color: result.name };
    const encoded = btoa(encodeURIComponent(JSON.stringify(data)));
    return `${window.location.origin}${window.location.pathname}#share=${encoded}`;
  };

  const progress = ((currentQuestion + 1) / QUESTIONS.length) * 100;

  return (
    <div className="space-y-2">
      {!result ? (
        <>
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="h-2 rounded-full bg-gradient-to-r from-purple-400 to-pink-500 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
            Question {currentQuestion + 1} of {QUESTIONS.length}
          </p>

          {/* Question Card */}
          <Card variant="bordered" className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
              {QUESTIONS[currentQuestion].question}
            </h2>

            <div className="space-y-3">
              {QUESTIONS[currentQuestion].options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAnswer(option.color)}
                  className="w-full p-4 text-left rounded-lg border border-gray-200 dark:border-gray-700 hover:border-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all"
                >
                  <span className="text-gray-900 dark:text-white">{option.text}</span>
                </button>
              ))}
            </div>
          </Card>
        </>
      ) : (
        <>
          {/* Result Card */}
          <Card variant="bordered" className="p-6 text-center">
            <div
              className="w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center text-4xl"
              style={{ backgroundColor: result.hex + '30' }}
            >
              {result.emoji}
            </div>

            <h2 className="text-2xl font-bold mb-2" style={{ color: result.hex }}>
              {result.name}
            </h2>

            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {result.description}
            </p>

            {/* Traits */}
            <div className="flex flex-wrap justify-center gap-2 mb-6">
              {result.traits.map((trait) => (
                <span
                  key={trait}
                  className="px-3 py-1 rounded-full text-sm font-medium"
                  style={{
                    backgroundColor: result.hex + '20',
                    color: result.hex,
                  }}
                >
                  {trait}
                </span>
              ))}
            </div>

            <ResultShareButtonsEn
              url={getShareUrl()}
              title={`My personality color is ${result.name}!`}
              description={result.traits.join(', ')}
              visible={true}
            />

            <Button
              variant="outline"
              onClick={handleReset}
              className="mt-4"
            >
              Take Quiz Again
            </Button>
          </Card>
        </>
      )}

      <SeoContent />
    </div>
  );
}

function SeoContent() {
  return (
    <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 space-y-8 text-gray-700 dark:text-gray-300">
      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          🎨 What is Personality Color Quiz?
        </h2>
        <p className="text-sm leading-relaxed">
          A fun quiz that matches you with a color reflecting your personality based on 5 simple questions.
          Discover if you are Passionate Red (Leader), Calm Blue (Thinker), Joyful Yellow (Optimist), or Balanced Green (Peacemaker).
          Based on color psychology concepts, this quiz is designed for entertainment and light self-reflection.
          Share your results with friends and compare personality colors!
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          🔮 Personality Color Types
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-2 pr-4 font-semibold text-gray-900 dark:text-white">Color</th>
                <th className="text-left py-2 pr-4 font-semibold text-gray-900 dark:text-white">Type</th>
                <th className="text-left py-2 font-semibold text-gray-900 dark:text-white">Key Traits</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 dark:text-gray-400">
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <td className="py-2 pr-4">🔴 Red</td>
                <td className="py-2 pr-4">Leader</td>
                <td className="py-2">Bold, Ambitious, Energetic</td>
              </tr>
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <td className="py-2 pr-4">🔵 Blue</td>
                <td className="py-2 pr-4">Thinker</td>
                <td className="py-2">Thoughtful, Analytical, Loyal</td>
              </tr>
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <td className="py-2 pr-4">🟡 Yellow</td>
                <td className="py-2 pr-4">Optimist</td>
                <td className="py-2">Optimistic, Social, Creative</td>
              </tr>
              <tr>
                <td className="py-2 pr-4">🟢 Green</td>
                <td className="py-2 pr-4">Peacemaker</td>
                <td className="py-2">Peaceful, Nurturing, Grounded</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          💡 Understanding Your Result
        </h2>
        <ul className="text-sm space-y-2 list-disc list-inside text-gray-600 dark:text-gray-400">
          <li><strong>Primary color:</strong> Your dominant personality traits</li>
          <li><strong>Not fixed:</strong> Personality is complex; you may have traits from multiple colors</li>
          <li><strong>Context matters:</strong> You might act differently in various situations</li>
          <li><strong>Growth mindset:</strong> Use insights for self-reflection, not limitations</li>
        </ul>
      </section>

      <FaqSection
        title="Frequently Asked Questions"
        faqs={[
          { question: 'Is this based on real psychology?', answer: 'This quiz is inspired by color psychology concepts but is designed for entertainment. It should not be used as a psychological assessment.' },
          { question: 'Why did I get a different result than expected?', answer: 'The quiz captures tendencies based on specific scenarios. You might answer differently on another day depending on your mood.' },
          { question: 'Can I have traits from multiple colors?', answer: 'Absolutely! Most people have a mix of traits. Your result shows your dominant tendency based on the quiz answers.' },
        ]}
      />
    </div>
  );
}
