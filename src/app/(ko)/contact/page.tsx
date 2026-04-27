import type { Metadata } from 'next';
import { siteConfig } from '@/data/site';

export const metadata: Metadata = {
  title: `문의하기 - ${siteConfig.name}`,
  description: `${siteConfig.name}에 대한 문의, 피드백, 도구 제안, 버그 신고 등을 보내주세요. 운영자가 직접 확인하고 답변드립니다.`,
};

export default function ContactPage() {
  const email = siteConfig.contactEmail;

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        문의하기
      </h1>

      <div className="prose dark:prose-invert max-w-none space-y-4 text-gray-700 dark:text-gray-300">
        <p>
          ToolPiki는 한 명이 운영하는 작은 사이트입니다. 그래서 보내주신 의견이나 제보는 자동 응답이나
          상담 봇이 아니라 <strong>운영자가 직접 확인하고 답장</strong>드립니다.
          도구 사용 중 불편한 점, 결과가 이상하게 나오는 상황, 추가했으면 하는 도구가 있다면 부담 없이 알려주세요.
        </p>

        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mt-6 mb-2">
          어떤 내용을 보내실 수 있나요?
        </h2>
        <ul className="list-disc list-inside space-y-1">
          <li><strong>버그 제보</strong>: 도구가 동작하지 않거나 결과가 이상한 경우</li>
          <li><strong>도구 추가 요청</strong>: 자주 쓰지만 사이트에 없는 도구 제안</li>
          <li><strong>기능 개선 의견</strong>: 기존 도구의 사용성 개선 제안</li>
          <li><strong>오타 및 번역 제보</strong>: 한국어/영어 텍스트의 어색한 표현 신고</li>
          <li><strong>광고 문의</strong>: 사이트 광고 관련 협업 요청</li>
          <li><strong>일반 문의</strong>: 사이트 운영, 데이터 처리, 약관 등에 관한 질문</li>
        </ul>

        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mt-6 mb-2">
          버그 제보 시 함께 알려주시면 좋은 정보
        </h2>
        <p>
          아래 정보를 함께 보내주시면 더 빠르게 원인을 파악할 수 있습니다.
        </p>
        <ul className="list-disc list-inside space-y-1">
          <li>사용한 도구의 이름이나 페이지 주소</li>
          <li>입력한 값(가능하다면 동일하게 재현되는 예시)</li>
          <li>화면에 나타난 오류 메시지 또는 스크린샷</li>
          <li>사용 중인 브라우저와 운영체제 (예: Chrome 122, Windows 11)</li>
        </ul>

        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mt-6 mb-2">
          답변 기간 안내
        </h2>
        <p>
          평일 기준으로 평균 1~3일 이내에 답장드리려고 노력하고 있습니다. 다만 개인 프로젝트의 특성상
          공휴일이나 출장 등으로 답변이 늦어질 수 있는 점 양해 부탁드립니다. 단순한 버그 제보의 경우
          답장보다는 사이트 수정으로 빠르게 반영하는 것을 우선하기도 합니다.
        </p>
      </div>

      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mt-8 mb-4">
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">문의 이메일</p>
        <a
          href={`mailto:${email}`}
          className="text-blue-600 dark:text-blue-400 hover:underline text-lg font-medium"
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
