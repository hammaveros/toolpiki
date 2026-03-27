'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { ResultShareButtonsEn } from '@/components/share/ResultShareButtonsEn';
import { siteConfig } from '@/data/site';
import { FaqSection } from '@/components/ui/FaqItem';

const ZODIAC_SIGNS = [
  { name: 'Aries', emoji: '♈', dates: 'Mar 21 - Apr 19', element: 'Fire' },
  { name: 'Taurus', emoji: '♉', dates: 'Apr 20 - May 20', element: 'Earth' },
  { name: 'Gemini', emoji: '♊', dates: 'May 21 - Jun 20', element: 'Air' },
  { name: 'Cancer', emoji: '♋', dates: 'Jun 21 - Jul 22', element: 'Water' },
  { name: 'Leo', emoji: '♌', dates: 'Jul 23 - Aug 22', element: 'Fire' },
  { name: 'Virgo', emoji: '♍', dates: 'Aug 23 - Sep 22', element: 'Earth' },
  { name: 'Libra', emoji: '♎', dates: 'Sep 23 - Oct 22', element: 'Air' },
  { name: 'Scorpio', emoji: '♏', dates: 'Oct 23 - Nov 21', element: 'Water' },
  { name: 'Sagittarius', emoji: '♐', dates: 'Nov 22 - Dec 21', element: 'Fire' },
  { name: 'Capricorn', emoji: '♑', dates: 'Dec 22 - Jan 19', element: 'Earth' },
  { name: 'Aquarius', emoji: '♒', dates: 'Jan 20 - Feb 18', element: 'Air' },
  { name: 'Pisces', emoji: '♓', dates: 'Feb 19 - Mar 20', element: 'Water' },
];

const HOROSCOPE_TEMPLATES = {
  love: [
    'Romance is in the air today. Keep your heart open to new connections.',
    'Focus on deepening existing relationships rather than seeking new ones.',
    'A meaningful conversation could spark something special.',
    'Past memories may resurface. Handle them with care.',
    'Your charm is at its peak today. Use it wisely!',
    'Take time to appreciate your loved ones.',
    'An unexpected encounter could change your perspective.',
    'Trust your intuition in matters of the heart.',
  ],
  career: [
    'A new opportunity is on the horizon. Stay prepared.',
    'Your hard work is about to pay off.',
    'Collaboration will be key to your success today.',
    'Focus on completing pending tasks before taking on new ones.',
    'A creative solution will help you overcome a challenge.',
    'Network and make connections - they\'ll be valuable later.',
    'Take a leadership role in your current project.',
    'Review your goals and make necessary adjustments.',
  ],
  health: [
    'Focus on rest and recovery today.',
    'A good time to start a new exercise routine.',
    'Pay attention to your nutrition and hydration.',
    'Outdoor activities will boost your energy.',
    'Take breaks to avoid burnout.',
    'Listen to your body\'s signals.',
    'Mental wellness should be your priority today.',
    'Try meditation or yoga for inner peace.',
  ],
};

const LUCKY_COLORS = ['Red', 'Blue', 'Green', 'Purple', 'Gold', 'Silver', 'Orange', 'Pink'];

function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function getHoroscope(signIndex: number, date: string) {
  const dateNum = new Date(date).getTime() / 86400000;
  const seed = signIndex * 1000 + Math.floor(dateNum);

  const loveIndex = Math.floor(seededRandom(seed) * HOROSCOPE_TEMPLATES.love.length);
  const careerIndex = Math.floor(seededRandom(seed + 1) * HOROSCOPE_TEMPLATES.career.length);
  const healthIndex = Math.floor(seededRandom(seed + 2) * HOROSCOPE_TEMPLATES.health.length);
  const luckyNumber = Math.floor(seededRandom(seed + 3) * 99) + 1;
  const luckyColorIndex = Math.floor(seededRandom(seed + 4) * LUCKY_COLORS.length);

  return {
    love: HOROSCOPE_TEMPLATES.love[loveIndex],
    career: HOROSCOPE_TEMPLATES.career[careerIndex],
    health: HOROSCOPE_TEMPLATES.health[healthIndex],
    luckyNumber,
    luckyColor: LUCKY_COLORS[luckyColorIndex],
  };
}

export function DailyHoroscope() {
  const [selectedSign, setSelectedSign] = useState<number | null>(null);
  const [todayDate, setTodayDate] = useState('');

  useEffect(() => {
    const now = new Date();
    setTodayDate(now.toISOString().split('T')[0]);
  }, []);

  const horoscope = selectedSign !== null ? getHoroscope(selectedSign, todayDate) : null;
  const sign = selectedSign !== null ? ZODIAC_SIGNS[selectedSign] : null;

  const getShareUrl = () => {
    if (selectedSign === null || !sign) return '';
    const data = { sign: sign.name };
    const encoded = btoa(encodeURIComponent(JSON.stringify(data)));
    return `${siteConfig.url}/en/tools/daily-horoscope#share=${encoded}`;
  };

  return (
    <div className="space-y-2">
      {/* Sign Selection */}
      <Card variant="bordered" className="p-6">
        <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4">
          Select Your Zodiac Sign
        </h3>

        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
          {ZODIAC_SIGNS.map((zodiac, idx) => (
            <button
              key={zodiac.name}
              onClick={() => setSelectedSign(idx)}
              className={`p-3 rounded-lg text-center transition-all ${
                selectedSign === idx
                  ? 'bg-purple-500 text-white ring-2 ring-purple-300'
                  : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              <span className="text-2xl block">{zodiac.emoji}</span>
              <span className="text-xs font-medium">{zodiac.name}</span>
            </button>
          ))}
        </div>
      </Card>

      {/* Horoscope Result */}
      {sign && horoscope && (
        <Card variant="bordered" className="p-6">
          <div className="text-center mb-6">
            <span className="text-5xl">{sign.emoji}</span>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
              {sign.name}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {sign.dates} • {sign.element} Sign
            </p>
          </div>

          <div className="space-y-4">
            {/* Love */}
            <div className="p-4 bg-pink-50 dark:bg-pink-900/20 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">❤️</span>
                <span className="font-semibold text-pink-700 dark:text-pink-300">Love</span>
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300">{horoscope.love}</p>
            </div>

            {/* Career */}
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">💼</span>
                <span className="font-semibold text-blue-700 dark:text-blue-300">Career</span>
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300">{horoscope.career}</p>
            </div>

            {/* Health */}
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">🏃</span>
                <span className="font-semibold text-green-700 dark:text-green-300">Health</span>
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300">{horoscope.health}</p>
            </div>

            {/* Lucky Numbers */}
            <div className="flex gap-4 justify-center pt-4">
              <div className="text-center">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Lucky Number</p>
                <span className="inline-block px-4 py-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg font-bold text-yellow-700 dark:text-yellow-300">
                  {horoscope.luckyNumber}
                </span>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Lucky Color</p>
                <span className="inline-block px-4 py-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg font-bold text-purple-700 dark:text-purple-300">
                  {horoscope.luckyColor}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            <ResultShareButtonsEn
              url={getShareUrl()}
              title={`Daily Horoscope for ${sign.name} ${sign.emoji}`}
              description={`Love: ${horoscope.love}`}
              visible={true}
            />
          </div>
        </Card>
      )}

      <div className="text-center text-sm text-gray-500 dark:text-gray-400">
        ⚠️ For entertainment purposes only. Horoscopes are not scientifically proven.
      </div>

      <SeoContent />
    </div>
  );
}

function SeoContent() {
  return (
    <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 space-y-8 text-gray-700 dark:text-gray-300">
      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          ⭐ What is Daily Horoscope?
        </h2>
        <p className="text-sm leading-relaxed">
          Get daily astrological predictions based on your zodiac sign.
          Each sign is associated with one of four elements: Fire, Earth, Air, or Water.
          Check your love, career, and health forecasts along with lucky numbers and colors.
          Perfect for starting your day with a little cosmic guidance!
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          🔮 Zodiac Signs by Element
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-2 pr-4 font-semibold text-gray-900 dark:text-white">Element</th>
                <th className="text-left py-2 pr-4 font-semibold text-gray-900 dark:text-white">Signs</th>
                <th className="text-left py-2 font-semibold text-gray-900 dark:text-white">Traits</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 dark:text-gray-400">
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <td className="py-2 pr-4">🔥 Fire</td>
                <td className="py-2 pr-4">Aries, Leo, Sagittarius</td>
                <td className="py-2">Passionate, dynamic, energetic</td>
              </tr>
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <td className="py-2 pr-4">🌍 Earth</td>
                <td className="py-2 pr-4">Taurus, Virgo, Capricorn</td>
                <td className="py-2">Practical, grounded, reliable</td>
              </tr>
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <td className="py-2 pr-4">💨 Air</td>
                <td className="py-2 pr-4">Gemini, Libra, Aquarius</td>
                <td className="py-2">Intellectual, social, communicative</td>
              </tr>
              <tr>
                <td className="py-2 pr-4">💧 Water</td>
                <td className="py-2 pr-4">Cancer, Scorpio, Pisces</td>
                <td className="py-2">Intuitive, emotional, nurturing</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          💡 How to Use Your Horoscope
        </h2>
        <ul className="text-sm space-y-2 list-disc list-inside text-gray-600 dark:text-gray-400">
          <li><strong>Morning ritual:</strong> Check your horoscope to set the tone for your day</li>
          <li><strong>Lucky numbers:</strong> Use them for decisions, games, or creative inspiration</li>
          <li><strong>Lucky colors:</strong> Consider wearing or surrounding yourself with your lucky color</li>
          <li><strong>Share with friends:</strong> Compare horoscopes and discuss predictions</li>
        </ul>
      </section>

      <FaqSection
        title="Frequently Asked Questions"
        faqs={[
          { question: 'How are horoscopes generated?', answer: 'Horoscopes are randomly generated for entertainment purposes. They are not based on actual astrological calculations.' },
          { question: 'Should I take my horoscope seriously?', answer: 'No, this is purely for fun! Horoscopes are not scientifically proven and should not be used for important life decisions.' },
          { question: 'Why do horoscopes change daily?', answer: 'Each day generates new random predictions to give you fresh content to enjoy every day.' },
        ]}
      />
    </div>
  );
}
