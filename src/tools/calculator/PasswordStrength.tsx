'use client';

import { useState, useMemo } from 'react';
import { Card } from '@/components/ui/Card';
import { FaqSection } from '@/components/ui/FaqItem';

interface StrengthResult {
  score: number; // 0-100
  level: 'very-weak' | 'weak' | 'fair' | 'strong' | 'very-strong';
  label: string;
  color: string;
  tips: string[];
}

function analyzePassword(password: string): StrengthResult {
  if (!password) {
    return { score: 0, level: 'very-weak', label: '입력 대기', color: 'gray', tips: [] };
  }

  let score = 0;
  const tips: string[] = [];

  // 길이 점수 (최대 30점)
  if (password.length >= 16) score += 30;
  else if (password.length >= 12) score += 25;
  else if (password.length >= 8) score += 15;
  else if (password.length >= 6) score += 10;
  else {
    score += 5;
    tips.push('8자 이상 사용하세요');
  }

  // 소문자 (10점)
  if (/[a-z]/.test(password)) score += 10;
  else tips.push('소문자를 추가하세요');

  // 대문자 (10점)
  if (/[A-Z]/.test(password)) score += 10;
  else tips.push('대문자를 추가하세요');

  // 숫자 (15점)
  if (/\d/.test(password)) score += 15;
  else tips.push('숫자를 추가하세요');

  // 특수문자 (20점)
  if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) score += 20;
  else tips.push('특수문자를 추가하세요 (!@#$%...)');

  // 다양성 보너스 (15점)
  const hasLower = /[a-z]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasDigit = /\d/.test(password);
  const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
  const variety = [hasLower, hasUpper, hasDigit, hasSpecial].filter(Boolean).length;
  if (variety === 4) score += 15;
  else if (variety === 3) score += 10;

  // 연속 문자 감점
  if (/(.)\1{2,}/.test(password)) {
    score -= 10;
    tips.push('같은 문자 3번 이상 반복 피하세요');
  }

  // 일반적인 패턴 감점
  const commonPatterns = ['123', 'abc', 'qwerty', 'password', 'admin', '1234'];
  const lowerPw = password.toLowerCase();
  for (const pattern of commonPatterns) {
    if (lowerPw.includes(pattern)) {
      score -= 15;
      tips.push('흔한 패턴 (123, abc, qwerty 등) 피하세요');
      break;
    }
  }

  // 점수 범위 조정
  score = Math.max(0, Math.min(100, score));

  // 레벨 판정
  let level: StrengthResult['level'];
  let label: string;
  let color: string;

  if (score >= 80) {
    level = 'very-strong';
    label = '매우 강함';
    color = 'green';
  } else if (score >= 60) {
    level = 'strong';
    label = '강함';
    color = 'blue';
  } else if (score >= 40) {
    level = 'fair';
    label = '보통';
    color = 'yellow';
  } else if (score >= 20) {
    level = 'weak';
    label = '약함';
    color = 'orange';
  } else {
    level = 'very-weak';
    label = '매우 약함';
    color = 'red';
  }

  return { score, level, label, color, tips: tips.slice(0, 3) };
}

export function PasswordStrength() {
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
      {/* 비밀번호 입력 */}
      <Card variant="bordered" className="p-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          비밀번호 입력
        </label>
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호를 입력하세요"
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

      {/* 강도 표시 */}
      <Card variant="bordered" className={`p-4 ${colors.bg}`}>
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">비밀번호 강도</span>
          <span className={`text-lg font-bold ${colors.text}`}>{result.label}</span>
        </div>

        {/* 프로그레스 바 */}
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className={`h-full ${colors.bar} transition-all duration-300 ease-out`}
            style={{ width: `${result.score}%` }}
          />
        </div>

        <div className="mt-2 text-right">
          <span className={`text-sm font-medium ${colors.text}`}>{result.score}점</span>
        </div>
      </Card>

      {/* 분석 결과 */}
      {password && (
        <Card variant="bordered" className="p-4">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">분석 결과</h3>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2">
              <span className={password.length >= 8 ? 'text-green-500' : 'text-red-500'}>
                {password.length >= 8 ? '✓' : '✗'}
              </span>
              <span className="text-gray-600 dark:text-gray-400">8자 이상</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={/[a-z]/.test(password) ? 'text-green-500' : 'text-red-500'}>
                {/[a-z]/.test(password) ? '✓' : '✗'}
              </span>
              <span className="text-gray-600 dark:text-gray-400">소문자</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={/[A-Z]/.test(password) ? 'text-green-500' : 'text-red-500'}>
                {/[A-Z]/.test(password) ? '✓' : '✗'}
              </span>
              <span className="text-gray-600 dark:text-gray-400">대문자</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={/\d/.test(password) ? 'text-green-500' : 'text-red-500'}>
                {/\d/.test(password) ? '✓' : '✗'}
              </span>
              <span className="text-gray-600 dark:text-gray-400">숫자</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password) ? 'text-green-500' : 'text-red-500'}>
                {/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password) ? '✓' : '✗'}
              </span>
              <span className="text-gray-600 dark:text-gray-400">특수문자</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-blue-500">ℹ</span>
              <span className="text-gray-600 dark:text-gray-400">{password.length}자</span>
            </div>
          </div>

          {/* 개선 팁 */}
          {result.tips.length > 0 && (
            <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">개선 팁</h4>
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

      {/* 안내 */}
      <div className="text-xs text-gray-400 dark:text-gray-500 space-y-1">
        <p>• 입력한 비밀번호는 서버로 전송되지 않습니다 (브라우저에서만 분석)</p>
        <p>• 실제 사이트 가입 시에는 각 사이트의 비밀번호 정책을 따르세요</p>
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
          🔐 비밀번호 강도 검사란?
        </h2>
        <p className="text-sm leading-relaxed">
          비밀번호 강도 검사는 입력한 비밀번호의 보안 수준을 실시간으로 분석하는 도구입니다.
          길이, 대소문자, 숫자, 특수문자 조합을 점검하고 흔한 패턴(123, abc, qwerty)도 감지합니다.
          100점 만점으로 점수화하여 매우 약함~매우 강함까지 5단계로 평가합니다.
          입력한 비밀번호는 브라우저에서만 처리되어 서버로 전송되지 않습니다.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          📊 강도 평가 기준
        </h2>
        <div className="overflow-x-auto text-sm">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b dark:border-gray-700">
                <th className="text-left py-2 px-2">요소</th>
                <th className="text-left py-2 px-2">점수</th>
                <th className="text-left py-2 px-2">권장 사항</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">길이</td><td className="font-mono">최대 30점</td><td>12자 이상 권장</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">소문자</td><td className="font-mono">10점</td><td>a-z 포함</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">대문자</td><td className="font-mono">10점</td><td>A-Z 포함</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">숫자</td><td className="font-mono">15점</td><td>0-9 포함</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">특수문자</td><td className="font-mono">20점</td><td>!@#$%^&* 등</td></tr>
              <tr><td className="py-2 px-2 font-medium">다양성 보너스</td><td className="font-mono">최대 15점</td><td>4종류 모두 사용 시</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          💡 강력한 비밀번호 만들기 팁
        </h2>
        <ul className="text-sm leading-relaxed space-y-2 list-disc list-inside">
          <li><strong>길이 우선</strong>: 12자 이상이면 복잡도보다 길이가 더 효과적</li>
          <li><strong>패스프레이즈</strong>: "나는매일아침7시에일어난다!" 같은 문장형</li>
          <li><strong>개인정보 금지</strong>: 생일, 전화번호, 이름 사용 피하기</li>
          <li><strong>사이트별 다르게</strong>: 동일 비밀번호 재사용 금지</li>
        </ul>
      </section>

      <FaqSection
        title="자주 묻는 질문"
        faqs={[
          {
            question: '입력한 비밀번호가 저장되나요?',
            answer: '아닙니다. 모든 분석은 브라우저에서 로컬로 처리되며, 서버로 전송되거나 저장되지 않습니다. 페이지를 새로고침하면 입력 내용이 사라집니다.',
          },
          {
            question: '80점 이상이면 안전한 비밀번호인가요?',
            answer: '일반적으로 80점 이상이면 대부분의 온라인 서비스에서 안전합니다. 하지만 금융/기업 시스템은 추가 요구사항(예: 이전 비밀번호 재사용 금지)이 있을 수 있습니다.',
          },
          {
            question: '비밀번호 관리자를 사용해도 되나요?',
            answer: '강력히 권장합니다. 비밀번호 관리자는 사이트별로 고유한 강력한 비밀번호를 생성/저장해주어 보안을 크게 향상시킵니다.',
          },
        ]}
      />
    </div>
  );
}
