'use client';

import { useState, useMemo } from 'react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { cn } from '@/lib/utils/cn';
import { FaqSection } from '@/components/ui/FaqItem';

type Mode = 'ratio' | 'screen' | 'golden';

const COMMON_RATIOS = [
  { name: '1:1 (Square)', ratio: 1 },
  { name: '4:3 (Standard)', ratio: 4 / 3 },
  { name: '3:2 (Photo)', ratio: 3 / 2 },
  { name: '16:9 (Widescreen)', ratio: 16 / 9 },
  { name: '16:10', ratio: 16 / 10 },
  { name: '21:9 (Ultrawide)', ratio: 21 / 9 },
  { name: '9:16 (Mobile)', ratio: 9 / 16 },
  { name: '2:3 (Poster)', ratio: 2 / 3 },
];

const GOLDEN_RATIO = 1.618033988749895;

function gcd(a: number, b: number): number {
  a = Math.abs(Math.round(a));
  b = Math.abs(Math.round(b));
  while (b) {
    const t = b;
    b = a % b;
    a = t;
  }
  return a;
}

function simplifyRatio(w: number, h: number): [number, number] {
  const d = gcd(w, h);
  return [Math.round(w / d), Math.round(h / d)];
}

export function RatioCalculatorEn() {
  const [mode, setMode] = useState<Mode>('ratio');

  // Ratio calculation
  const [width1, setWidth1] = useState('1920');
  const [height1, setHeight1] = useState('1080');
  const [width2, setWidth2] = useState('');
  const [height2, setHeight2] = useState('');

  // Screen ratio
  const [screenWidth, setScreenWidth] = useState('1920');
  const [screenHeight, setScreenHeight] = useState('1080');

  // Golden ratio
  const [goldenInput, setGoldenInput] = useState('100');

  const ratioResult = useMemo(() => {
    const w = parseFloat(width1) || 0;
    const h = parseFloat(height1) || 0;
    if (w <= 0 || h <= 0) return null;

    const [rw, rh] = simplifyRatio(w, h);
    const ratio = w / h;

    let calculatedW2 = '';
    let calculatedH2 = '';

    if (width2 && !height2) {
      calculatedH2 = (parseFloat(width2) / ratio).toFixed(2);
    } else if (height2 && !width2) {
      calculatedW2 = (parseFloat(height2) * ratio).toFixed(2);
    }

    return { rw, rh, ratio, calculatedW2, calculatedH2 };
  }, [width1, height1, width2, height2]);

  const screenResult = useMemo(() => {
    const w = parseFloat(screenWidth) || 0;
    const h = parseFloat(screenHeight) || 0;
    if (w <= 0 || h <= 0) return null;

    const [rw, rh] = simplifyRatio(w, h);
    const ratio = w / h;
    const diagonal = Math.sqrt(w * w + h * h);
    const megapixels = (w * h) / 1000000;

    return { rw, rh, ratio, diagonal, megapixels };
  }, [screenWidth, screenHeight]);

  const goldenResult = useMemo(() => {
    const value = parseFloat(goldenInput) || 0;
    if (value <= 0) return null;

    const larger = value * GOLDEN_RATIO;
    const smaller = value / GOLDEN_RATIO;

    return { value, larger, smaller };
  }, [goldenInput]);

  return (
    <div className="space-y-2">
      {/* Mode selection */}
      <div className="flex gap-2">
        {(['ratio', 'screen', 'golden'] as Mode[]).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={cn(
              'flex-1 py-2 px-4 rounded-lg font-medium transition-colors text-sm',
              mode === m
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            )}
          >
            {m === 'ratio' && 'Ratio Calc'}
            {m === 'screen' && 'Screen Ratio'}
            {m === 'golden' && 'Golden Ratio'}
          </button>
        ))}
      </div>

      {/* Ratio calculation */}
      {mode === 'ratio' && (
        <Card variant="bordered" className="p-5">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Original Size
              </label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  value={width1}
                  onChange={(e) => setWidth1(e.target.value)}
                  placeholder="Width"
                />
                <span className="text-gray-500">×</span>
                <Input
                  type="number"
                  value={height1}
                  onChange={(e) => setHeight1(e.target.value)}
                  placeholder="Height"
                />
              </div>
            </div>

            {ratioResult && (
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                  {ratioResult.rw} : {ratioResult.rh}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Ratio: {ratioResult.ratio.toFixed(4)}
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Calculate same ratio (enter one value)
              </label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  value={width2 || ratioResult?.calculatedW2 || ''}
                  onChange={(e) => { setWidth2(e.target.value); setHeight2(''); }}
                  placeholder="Width"
                />
                <span className="text-gray-500">×</span>
                <Input
                  type="number"
                  value={height2 || ratioResult?.calculatedH2 || ''}
                  onChange={(e) => { setHeight2(e.target.value); setWidth2(''); }}
                  placeholder="Height"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Common Ratios
              </label>
              <div className="flex flex-wrap gap-2">
                {COMMON_RATIOS.map((r, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      if (r.ratio >= 1) {
                        setWidth1(String(Math.round(r.ratio * 1000)));
                        setHeight1('1000');
                      } else {
                        setWidth1('1000');
                        setHeight1(String(Math.round(1000 / r.ratio)));
                      }
                    }}
                    className="px-3 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
                  >
                    {r.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Screen ratio */}
      {mode === 'screen' && (
        <Card variant="bordered" className="p-5">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Resolution (pixels)
              </label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  value={screenWidth}
                  onChange={(e) => setScreenWidth(e.target.value)}
                  placeholder="Width"
                />
                <span className="text-gray-500">×</span>
                <Input
                  type="number"
                  value={screenHeight}
                  onChange={(e) => setScreenHeight(e.target.value)}
                  placeholder="Height"
                />
              </div>
            </div>

            {screenResult && (
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg text-center">
                  <div className="text-sm text-gray-500 dark:text-gray-400">Ratio</div>
                  <div className="text-xl font-bold text-gray-900 dark:text-white">
                    {screenResult.rw}:{screenResult.rh}
                  </div>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg text-center">
                  <div className="text-sm text-gray-500 dark:text-gray-400">Aspect Ratio</div>
                  <div className="text-xl font-bold text-gray-900 dark:text-white">
                    {screenResult.ratio.toFixed(2)}
                  </div>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg text-center">
                  <div className="text-sm text-gray-500 dark:text-gray-400">Diagonal (px)</div>
                  <div className="text-xl font-bold text-gray-900 dark:text-white">
                    {screenResult.diagonal.toFixed(0)}
                  </div>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg text-center">
                  <div className="text-sm text-gray-500 dark:text-gray-400">Megapixels</div>
                  <div className="text-xl font-bold text-gray-900 dark:text-white">
                    {screenResult.megapixels.toFixed(2)} MP
                  </div>
                </div>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Golden ratio */}
      {mode === 'golden' && (
        <Card variant="bordered" className="p-5">
          <div className="space-y-6">
            <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <div className="text-sm text-yellow-600 dark:text-yellow-400 mb-1">Golden Ratio (φ)</div>
              <div className="text-3xl font-bold text-yellow-700 dark:text-yellow-300">
                1 : {GOLDEN_RATIO.toFixed(6)}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Base Value
              </label>
              <Input
                type="number"
                value={goldenInput}
                onChange={(e) => setGoldenInput(e.target.value)}
                placeholder="Enter a number"
              />
            </div>

            {goldenResult && (
              <div className="space-y-3">
                <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">Larger (× φ)</span>
                    <span className="font-mono font-bold text-gray-900 dark:text-white">
                      {goldenResult.larger.toFixed(4)}
                    </span>
                  </div>
                </div>
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-blue-600 dark:text-blue-400">Base Value</span>
                    <span className="font-mono font-bold text-blue-700 dark:text-blue-300">
                      {goldenResult.value}
                    </span>
                  </div>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">Smaller (÷ φ)</span>
                    <span className="font-mono font-bold text-gray-900 dark:text-white">
                      {goldenResult.smaller.toFixed(4)}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Card>
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
          📐 What is Ratio Calculator?
        </h2>
        <p className="text-sm leading-relaxed">
          Ratio Calculator computes and converts aspect ratios for images, videos, and screens.
          Automatically extracts ratios from dimensions and calculates new sizes while maintaining proportions.
          Includes common ratio presets (16:9, 4:3) and golden ratio (1:1.618) calculations.
          Essential tool for designers, developers, video editors, and photographers.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          📊 Common Screen/Image Ratios
        </h2>
        <div className="overflow-x-auto text-sm">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b dark:border-gray-700">
                <th className="text-left py-2 px-2">Ratio</th>
                <th className="text-left py-2 px-2">Use Case</th>
                <th className="text-left py-2 px-2">Example Resolution</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">16:9</td><td>YouTube, TV, Monitors</td><td className="font-mono">1920×1080, 3840×2160</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">4:3</td><td>Classic TV, Presentations</td><td className="font-mono">1024×768, 1400×1050</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">21:9</td><td>Ultrawide Monitors, Cinema</td><td className="font-mono">2560×1080, 3440×1440</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">9:16</td><td>Mobile Portrait, Shorts/Reels</td><td className="font-mono">1080×1920</td></tr>
              <tr><td className="py-2 px-2 font-medium">1:1</td><td>Instagram, Profile Photos</td><td className="font-mono">1080×1080</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          💡 Tips for Using Ratios
        </h2>
        <ul className="text-sm leading-relaxed space-y-2 list-disc list-inside">
          <li><strong>Thumbnails</strong>: Use 16:9 for YouTube, 1:1 or 4:5 for Instagram</li>
          <li><strong>Golden ratio design</strong>: 1:1.618 creates visually balanced layouts</li>
          <li><strong>When resizing</strong>: Maintain original ratio to prevent image distortion</li>
          <li><strong>Plan your crop</strong>: Decide target ratio before shooting or editing</li>
        </ul>
      </section>

      <FaqSection
        title="Frequently Asked Questions"
        faqs={[
          {
            question: 'What is the difference between aspect ratio and resolution?',
            answer: 'Aspect ratio is the proportional relationship between width and height (e.g., 16:9), while resolution is the actual pixel count (e.g., 1920×1080). Same aspect ratio can have different resolutions.',
          },
          {
            question: 'Why is the golden ratio important?',
            answer: 'The golden ratio (1:1.618) has been considered the most aesthetically pleasing proportion since ancient times. It is used in logos, layouts, and photo composition to create visual balance.',
          },
          {
            question: 'What happens if the aspect ratio does not match?',
            answer: 'The image will appear stretched or squashed. Common solutions are cropping the image or adding letterboxing (black bars) to maintain the correct proportions.',
          },
        ]}
      />
    </div>
  );
}
