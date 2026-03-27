'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { siteConfig } from '@/data/site';
import { FaqSection } from '@/components/ui/FaqItem';
import { toPng } from 'html-to-image';
import { LETTER_TEMPLATES, getTemplate, type LetterTemplate } from './letterTemplates';

const MAX_CHARS = 100;
const BASE_LETTER_URL = `${siteConfig.url}/letter?v=`;

function LetterCard({
  text,
  template,
  fontSize,
  letterRef,
}: {
  text: string;
  template: LetterTemplate;
  fontSize: string;
  letterRef?: React.RefObject<HTMLDivElement | null>;
}) {
  return (
    <div ref={letterRef} className={`${template.cardClass} p-8 md:p-10 relative overflow-hidden`}>
      {/* 코너 데코 */}
      {template.cornerDecor && (
        <>
          {template.cornerDecor.topLeft && (
            <span className="absolute top-3 left-3 text-lg opacity-40">{template.cornerDecor.topLeft}</span>
          )}
          {template.cornerDecor.topRight && (
            <span className="absolute top-3 right-3 text-lg opacity-40">{template.cornerDecor.topRight}</span>
          )}
          {template.cornerDecor.bottomLeft && (
            <span className="absolute bottom-3 left-3 text-lg opacity-40">{template.cornerDecor.bottomLeft}</span>
          )}
          {template.cornerDecor.bottomRight && (
            <span className="absolute bottom-3 right-3 text-lg opacity-40">{template.cornerDecor.bottomRight}</span>
          )}
        </>
      )}
      <div className="text-center mb-4">
        <span className="text-4xl">{template.topDecor}</span>
      </div>
      <p className={`${fontSize} leading-relaxed ${template.textClass} whitespace-pre-wrap text-center`}>
        {text}
      </p>
      <div className={`text-right mt-6 text-[10px] ${template.watermarkClass}`}>jsspace.online</div>
    </div>
  );
}

export function LetterQr() {
  const [text, setText] = useState('');
  const [templateId, setTemplateId] = useState(1);
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [saving, setSaving] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const letterRef = useRef<HTMLDivElement>(null);

  const template = getTemplate(templateId);
  const isOverLimit = text.length > MAX_CHARS;
  const letterUrl = text ? `${BASE_LETTER_URL}${encodeURIComponent(text)}&t=${templateId}` : '';

  // 글자수에 따른 폰트 크기
  const getFontSize = () => {
    const len = text.length;
    if (len <= 20) return 'text-2xl';
    if (len <= 50) return 'text-xl';
    if (len <= 100) return 'text-lg';
    if (len <= 150) return 'text-base';
    return 'text-sm';
  };

  // QR 생성
  const generateQR = useCallback((url: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      canvas.width = 300;
      canvas.height = 300;
      ctx.drawImage(img, 0, 0, 300, 300);
      setQrDataUrl(canvas.toDataURL('image/png'));
    };
    img.onerror = () => setQrDataUrl('');
    img.src = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(url)}`;
  }, []);

  useEffect(() => {
    if (!text.trim() || isOverLimit) {
      setQrDataUrl('');
      return;
    }
    const timer = setTimeout(() => generateQR(letterUrl), 500);
    return () => clearTimeout(timer);
  }, [letterUrl, isOverLimit, text, generateQR]);

  // URL 복사
  const handleCopyUrl = async () => {
    if (!letterUrl) return;
    await navigator.clipboard.writeText(letterUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // QR 다운로드
  const handleDownloadQr = () => {
    if (!qrDataUrl) return;
    const link = document.createElement('a');
    link.download = 'letter-qr.png';
    link.href = qrDataUrl;
    link.click();
  };

  // 편지 이미지 저장
  const handleSaveImage = async () => {
    if (!letterRef.current) return;
    setSaving(true);
    try {
      const dataUrl = await toPng(letterRef.current, {
        backgroundColor: template.bgColor,
        pixelRatio: 2,
      });
      const link = document.createElement('a');
      link.download = 'letter.png';
      link.href = dataUrl;
      link.click();
    } catch {
      // ignore
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* 편지지 선택 */}
      <Card variant="bordered" className="p-4">
        <p className="text-sm font-medium mb-3">편지지 선택</p>
        <div className="flex flex-wrap gap-2">
          {LETTER_TEMPLATES.map((t) => (
            <button
              key={t.id}
              onClick={() => setTemplateId(t.id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border text-sm transition-all ${
                templateId === t.id
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 ring-1 ring-blue-500'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500 text-gray-600 dark:text-gray-400'
              }`}
            >
              <span>{t.icon}</span>
              <span>{t.nameKr}</span>
            </button>
          ))}
        </div>
      </Card>

      {/* 편지 작성 */}
      <Card variant="bordered" className="p-4">
        <p className="text-sm font-medium mb-2">편지 내용</p>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="짧은 편지를 써보세요... 친구에게, 동료에게, 가족에게 ✉️"
          rows={5}
          maxLength={MAX_CHARS}
          className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="flex justify-end mt-2 text-xs">
          <span className={isOverLimit ? 'text-red-500 font-medium' : 'text-gray-400'}>
            {text.length} / {MAX_CHARS}자
          </span>
        </div>
      </Card>

      {/* 편지 미리보기 */}
      {text.trim() && !isOverLimit && (
        <LetterCard text={text} template={template} fontSize={getFontSize()} letterRef={letterRef} />
      )}

      {/* QR 코드 + 버튼 */}
      {qrDataUrl && (
        <Card variant="bordered" className="p-6">
          <div className="flex flex-col items-center gap-4">
            <p className="text-sm font-medium">QR 코드를 스캔하면 편지가 열립니다</p>
            <img src={qrDataUrl} alt="편지 QR 코드" width={200} height={200} className="rounded-lg" />
            <div className="flex flex-wrap justify-center gap-2">
              <Button onClick={handleDownloadQr} variant="secondary" size="sm">
                📥 QR 다운로드
              </Button>
              <Button onClick={handleCopyUrl} variant="secondary" size="sm">
                {copied ? '✅ 복사됨!' : '🔗 URL 복사'}
              </Button>
              <Button onClick={handleSaveImage} disabled={saving} variant="secondary" size="sm">
                {saving ? '저장 중...' : '🖼️ 편지 이미지 저장'}
              </Button>
            </div>
          </div>
        </Card>
      )}

      <canvas ref={canvasRef} className="hidden" />

      <div className="text-xs text-gray-400 dark:text-gray-500 space-y-1">
        <p>• 편지 내용은 URL에 포함되며 서버에 저장되지 않습니다</p>
        <p>• 최대 {MAX_CHARS}자까지 입력 가능합니다 (QR 인식을 위해 제한)</p>
        <p>• QR을 인쇄해서 카드나 선물에 붙여보세요!</p>
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
          ✉️ 편지 QR이란?
        </h2>
        <p className="text-sm leading-relaxed">
          편지 QR은 짧은 편지를 작성하고 QR코드로 공유할 수 있는 도구입니다.
          받는 사람이 QR코드를 스캔하면 예쁘게 꾸며진 편지 카드가 열립니다.
          편지 내용은 URL에 직접 포함되어 서버에 저장되지 않아 개인정보 걱정이 없습니다.
          5가지 편지지 디자인 중 원하는 스타일을 골라 더 특별한 편지를 만들어보세요.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          활용 아이디어
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-2 px-3 font-semibold">상황</th>
                <th className="text-left py-2 px-3 font-semibold">활용법</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 dark:text-gray-400">
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <td className="py-2 px-3">생일 선물</td>
                <td className="py-2 px-3">QR코드를 카드에 붙여서 메시지 전달</td>
              </tr>
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <td className="py-2 px-3">이벤트</td>
                <td className="py-2 px-3">행사장에 QR 포스터로 메시지 공유</td>
              </tr>
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <td className="py-2 px-3">응원 메시지</td>
                <td className="py-2 px-3">시험/면접 앞둔 친구에게 QR로 응원</td>
              </tr>
              <tr>
                <td className="py-2 px-3">감사 인사</td>
                <td className="py-2 px-3">URL 링크로 카카오톡/메신저 공유</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          사용 팁
        </h2>
        <ul className="text-sm space-y-2 list-disc list-inside text-gray-600 dark:text-gray-400">
          <li>짧은 문장일수록 QR코드가 단순해져 스캔이 잘 됩니다</li>
          <li>편지 이미지를 저장해서 SNS에 올릴 수도 있습니다</li>
          <li>QR코드를 인쇄할 때는 최소 2cm 이상 크기를 추천합니다</li>
          <li>줄바꿈(Enter)도 편지에 그대로 반영됩니다</li>
        </ul>
      </section>

      <FaqSection
        title="자주 묻는 질문"
        faqs={[
          {
            question: '편지 내용이 서버에 저장되나요?',
            answer: '아니요, 편지 내용은 URL에 직접 인코딩되어 전달됩니다. 별도의 서버 저장 없이 브라우저에서만 처리됩니다.',
          },
          {
            question: '글자수 제한이 있나요?',
            answer: '최대 100자까지 입력 가능합니다. QR코드 인식률을 위해 글자수를 제한하고 있습니다.',
          },
          {
            question: 'QR코드를 인쇄해도 되나요?',
            answer: '네, PNG로 다운로드하여 카드, 선물, 포스터 등에 인쇄할 수 있습니다. 고해상도로 생성되어 깨끗하게 출력됩니다.',
          },
        ]}
      />
    </div>
  );
}
