import type { Metadata } from 'next';
import { siteConfig } from '@/data/site';

export const metadata: Metadata = {
  title: `문의하기 - ${siteConfig.name}`,
  description: `${siteConfig.name}에 대한 문의, 피드백, 버그 신고 등을 보내주세요.`,
};

export default function ContactPage() {
  const email = siteConfig.contactEmail;

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        문의하기
      </h1>

      <p className="text-gray-700 dark:text-gray-300 mb-4">
        ToolPiki를 이용하면서 불편한 점이 있거나,
        추가했으면 하는 도구가 있다면 알려주세요.
      </p>
      <p className="text-gray-700 dark:text-gray-300 mb-6">
        오류 제보, 기능 요청, 일반 문의 모두 환영합니다.
      </p>

      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-6">
        <a
          href={`mailto:${email}`}
          className="text-blue-600 dark:text-blue-400 hover:underline text-lg"
        >
          {email}
        </a>
      </div>

      <a
        href={`mailto:${email}?subject=[ToolPiki] 문의`}
        className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        이메일 보내기
      </a>
    </div>
  );
}
