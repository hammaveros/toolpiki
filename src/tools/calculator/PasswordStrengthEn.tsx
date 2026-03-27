'use client';

import { useState, useMemo } from 'react';
import { Card } from '@/components/ui/Card';
import { FaqSection } from '@/components/ui/FaqItem';

interface StrengthResult {
  score: number;
  level: 'very-weak' | 'weak' | 'fair' | 'strong' | 'very-strong';
  label: string;
  color: string;
  tips: string[];
}

function analyzePassword(password: string): StrengthResult {
  if (!password) {
    return { score: 0, level: 'very-weak', label: 'Waiting', color: 'gray', tips: [] };
  }

  let score = 0;
  const tips: string[] = [];

  // Length score (max 30)
  if (password.length >= 16) score += 30;
  else if (password.length >= 12) score += 25;
  else if (password.length >= 8) score += 15;
  else if (password.length >= 6) score += 10;
  else {
    score += 5;
    tips.push('Use at least 8 characters');
  }

  // Lowercase (10)
  if (/[a-z]/.test(password)) score += 10;
  else tips.push('Add lowercase letters');

  // Uppercase (10)
  if (/[A-Z]/.test(password)) score += 10;
  else tips.push('Add uppercase letters');

  // Digits (15)
  if (/\d/.test(password)) score += 15;
  else tips.push('Add numbers');

  // Special chars (20)
  if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) score += 20;
  else tips.push('Add special characters (!@#$%...)');

  // Variety bonus (15)
  const hasLower = /[a-z]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasDigit = /\d/.test(password);
  const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
  const variety = [hasLower, hasUpper, hasDigit, hasSpecial].filter(Boolean).length;
  if (variety === 4) score += 15;
  else if (variety === 3) score += 10;

  // Repeated chars penalty
  if (/(.)\1{2,}/.test(password)) {
    score -= 10;
    tips.push('Avoid repeating same character 3+ times');
  }

  // Common patterns penalty
  const commonPatterns = ['123', 'abc', 'qwerty', 'password', 'admin', '1234'];
  const lowerPw = password.toLowerCase();
  for (const pattern of commonPatterns) {
    if (lowerPw.includes(pattern)) {
      score -= 15;
      tips.push('Avoid common patterns (123, abc, qwerty)');
      break;
    }
  }

  score = Math.max(0, Math.min(100, score));

  let level: StrengthResult['level'];
  let label: string;
  let color: string;

  if (score >= 80) {
    level = 'very-strong';
    label = 'Very Strong';
    color = 'green';
  } else if (score >= 60) {
    level = 'strong';
    label = 'Strong';
    color = 'blue';
  } else if (score >= 40) {
    level = 'fair';
    label = 'Fair';
    color = 'yellow';
  } else if (score >= 20) {
    level = 'weak';
    label = 'Weak';
    color = 'orange';
  } else {
    level = 'very-weak';
    label = 'Very Weak';
    color = 'red';
  }

  return { score, level, label, color, tips: tips.slice(0, 3) };
}

export function PasswordStrengthEn() {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const result = useMemo(() => analyzePassword(password), [password]);

  const colorClasses: Record<string, { bar: string; text: string; bg: string }> = {
    gray: { bar: 'bg-gray-300', text: 'text-gray-500', bg: 'bg-gray-50 dark:bg-gray-800' },
    red: { bar: 'bg-red-500', text: 'text-red-600', bg: 'bg-red-50 dark:bg-red-900/20' },
    orange: { bar: 'bg-orange-500', text: 'text-orange-600', bg: 'bg-orange-50 dark:bg-orange-900/20' },
    yellow: { bar: 'bg-yellow-500', text: 'text-yellow-600', bg: 'bg-yellow-50 dark:bg-yellow-900/20' },
    blue: { bar: 'bg-blue-500', text: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20' },
    green: { bar: 'bg-green-500', text: 'text-green-600', bg: 'bg-green-50 dark:bg-green-900/20' },
  };

  const colors = colorClasses[result.color];

  return (
    <div className="space-y-4">
      {/* Password Input */}
      <Card variant="bordered" className="p-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Enter Password
        </label>
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Type your password"
            className="w-full px-4 py-3 pr-12 text-lg border rounded-lg bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            autoComplete="off"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            {showPassword ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            )}
          </button>
        </div>
      </Card>

      {/* Strength Display */}
      <Card variant="bordered" className={`p-4 ${colors.bg}`}>
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Password Strength</span>
          <span className={`text-lg font-bold ${colors.text}`}>{result.label}</span>
        </div>

        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className={`h-full ${colors.bar} transition-all duration-300 ease-out`}
            style={{ width: `${result.score}%` }}
          />
        </div>

        <div className="mt-2 text-right">
          <span className={`text-sm font-medium ${colors.text}`}>{result.score} / 100</span>
        </div>
      </Card>

      {/* Analysis */}
      {password && (
        <Card variant="bordered" className="p-4">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Analysis</h3>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2">
              <span className={password.length >= 8 ? 'text-green-500' : 'text-red-500'}>
                {password.length >= 8 ? '✓' : '✗'}
              </span>
              <span className="text-gray-600 dark:text-gray-400">8+ characters</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={/[a-z]/.test(password) ? 'text-green-500' : 'text-red-500'}>
                {/[a-z]/.test(password) ? '✓' : '✗'}
              </span>
              <span className="text-gray-600 dark:text-gray-400">Lowercase</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={/[A-Z]/.test(password) ? 'text-green-500' : 'text-red-500'}>
                {/[A-Z]/.test(password) ? '✓' : '✗'}
              </span>
              <span className="text-gray-600 dark:text-gray-400">Uppercase</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={/\d/.test(password) ? 'text-green-500' : 'text-red-500'}>
                {/\d/.test(password) ? '✓' : '✗'}
              </span>
              <span className="text-gray-600 dark:text-gray-400">Numbers</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password) ? 'text-green-500' : 'text-red-500'}>
                {/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password) ? '✓' : '✗'}
              </span>
              <span className="text-gray-600 dark:text-gray-400">Special chars</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-blue-500">ℹ</span>
              <span className="text-gray-600 dark:text-gray-400">{password.length} chars</span>
            </div>
          </div>

          {result.tips.length > 0 && (
            <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tips</h4>
              <ul className="space-y-1">
                {result.tips.map((tip, i) => (
                  <li key={i} className="text-sm text-orange-600 dark:text-orange-400 flex items-start gap-2">
                    <span>💡</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Card>
      )}

      <div className="text-xs text-gray-400 dark:text-gray-500 space-y-1">
        <p>• Your password is analyzed locally and never sent to any server</p>
        <p>• Always follow each website&apos;s password policy when signing up</p>
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
          🔐 What is Password Strength Checker?
        </h2>
        <p className="text-sm leading-relaxed">
          Password Strength Checker analyzes your password security in real-time.
          It evaluates length, uppercase, lowercase, numbers, special characters, and detects common patterns (123, abc, qwerty).
          Scores out of 100 with five levels from Very Weak to Very Strong.
          Your password is processed locally in the browser and never sent to any server.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          📊 Scoring Criteria
        </h2>
        <div className="overflow-x-auto text-sm">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b dark:border-gray-700">
                <th className="text-left py-2 px-2">Factor</th>
                <th className="text-left py-2 px-2">Points</th>
                <th className="text-left py-2 px-2">Recommendation</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">Length</td><td className="font-mono">Up to 30</td><td>12+ characters recommended</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">Lowercase</td><td className="font-mono">10</td><td>Include a-z</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">Uppercase</td><td className="font-mono">10</td><td>Include A-Z</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">Numbers</td><td className="font-mono">15</td><td>Include 0-9</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">Special chars</td><td className="font-mono">20</td><td>!@#$%^&* etc.</td></tr>
              <tr><td className="py-2 px-2 font-medium">Variety bonus</td><td className="font-mono">Up to 15</td><td>Use all 4 types</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          💡 Tips for Strong Passwords
        </h2>
        <ul className="text-sm leading-relaxed space-y-2 list-disc list-inside">
          <li><strong>Length first</strong>: 12+ chars is more effective than complexity alone</li>
          <li><strong>Passphrase</strong>: Use memorable sentences like "I wake up at 7am every day!"</li>
          <li><strong>Avoid personal info</strong>: No birthdays, phone numbers, or names</li>
          <li><strong>Unique per site</strong>: Never reuse passwords across accounts</li>
        </ul>
      </section>

      <FaqSection
        title="Frequently Asked Questions"
        faqs={[
          {
            question: 'Is my password stored anywhere?',
            answer: 'No. All analysis is done locally in your browser. Nothing is sent to any server or stored. Refreshing the page clears everything.',
          },
          {
            question: 'Is 80+ score safe enough?',
            answer: 'Generally yes, 80+ is secure for most online services. However, financial or enterprise systems may have additional requirements like password history checks.',
          },
          {
            question: 'Should I use a password manager?',
            answer: 'Highly recommended. Password managers generate and store unique strong passwords for each site, significantly improving your security.',
          },
        ]}
      />
    </div>
  );
}
