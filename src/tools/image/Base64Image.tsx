'use client';

import { useState, useCallback } from 'react';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { CopyButton } from '@/components/ui/CopyButton';
import { Card } from '@/components/ui/Card';
import { FileUpload } from '@/components/ui/FileUpload';
import { FaqSection } from '@/components/ui/FaqItem';

export function Base64Image() {
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [image, setImage] = useState<string | null>(null);
  const [base64Input, setBase64Input] = useState('');
  const [base64Output, setBase64Output] = useState('');
  const [decodedImage, setDecodedImage] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [includePrefix, setIncludePrefix] = useState(true);

  const handleImageUpload = useCallback((file: File) => {
    setError('');
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      setImage(dataUrl);

      if (includePrefix) {
        setBase64Output(dataUrl);
      } else {
        setBase64Output(dataUrl.split(',')[1]);
      }
    };
    reader.readAsDataURL(file);
  }, [includePrefix]);

  const handleDecode = () => {
    setError('');
    try {
      let dataUrl = base64Input.trim();

      // data URL 형식이 아니면 추가
      if (!dataUrl.startsWith('data:')) {
        // 이미지 타입 추측
        if (dataUrl.startsWith('/9j/')) {
          dataUrl = `data:image/jpeg;base64,${dataUrl}`;
        } else if (dataUrl.startsWith('iVBOR')) {
          dataUrl = `data:image/png;base64,${dataUrl}`;
        } else if (dataUrl.startsWith('R0lGOD')) {
          dataUrl = `data:image/gif;base64,${dataUrl}`;
        } else if (dataUrl.startsWith('UklGR')) {
          dataUrl = `data:image/webp;base64,${dataUrl}`;
        } else {
          dataUrl = `data:image/png;base64,${dataUrl}`;
        }
      }

      // 이미지 로드 테스트
      const img = new Image();
      img.onload = () => {
        setDecodedImage(dataUrl);
        setError('');
      };
      img.onerror = () => {
        setError('유효하지 않은 이미지 데이터입니다.');
        setDecodedImage(null);
      };
      img.src = dataUrl;
    } catch {
      setError('Base64 디코딩 중 오류가 발생했습니다.');
      setDecodedImage(null);
    }
  };

  const handleDownload = () => {
    if (!decodedImage) return;

    const link = document.createElement('a');
    link.download = 'decoded_image.png';
    link.href = decodedImage;
    link.click();
  };

  const formatSize = (str: string): string => {
    const bytes = new Blob([str]).size;
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap">
        <Button
          variant={mode === 'encode' ? 'primary' : 'secondary'}
          onClick={() => setMode('encode')}
        >
          이미지 → Base64
        </Button>
        <Button
          variant={mode === 'decode' ? 'primary' : 'secondary'}
          onClick={() => setMode('decode')}
        >
          Base64 → 이미지
        </Button>
      </div>

      {mode === 'encode' ? (
        <>
          <FileUpload
            accept="image/*"
            onFileSelect={handleImageUpload}
            label="이미지 업로드"
            description="JPG, PNG, GIF, WebP 파일 지원"
          />

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={includePrefix}
              onChange={(e) => {
                setIncludePrefix(e.target.checked);
                if (image) {
                  if (e.target.checked) {
                    setBase64Output(image);
                  } else {
                    setBase64Output(image.split(',')[1]);
                  }
                }
              }}
              className="rounded"
            />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Data URL 접두사 포함 (data:image/...)
            </span>
          </label>

          {image && (
            <>
              <Card variant="bordered" className="p-4">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  업로드된 이미지
                </p>
                <img
                  src={image}
                  alt="Uploaded"
                  className="max-w-full h-auto rounded"
                  style={{ maxHeight: '200px' }}
                />
              </Card>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Base64 출력 ({formatSize(base64Output)})
                  </label>
                  <CopyButton text={base64Output} />
                </div>
                <Textarea
                  value={base64Output}
                  readOnly
                  rows={6}
                  className="font-mono text-xs"
                />
              </div>
            </>
          )}
        </>
      ) : (
        <>
          <Textarea
            label="Base64 입력"
            value={base64Input}
            onChange={(e) => setBase64Input(e.target.value)}
            placeholder="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA... 또는 iVBORw0KGgoAAAANSUhEUgAA..."
            rows={6}
            className="font-mono text-xs"
          />

          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}

          <div className="flex gap-2">
            <Button onClick={handleDecode}>변환</Button>
            {decodedImage && (
              <Button variant="secondary" onClick={handleDownload}>
                다운로드
              </Button>
            )}
            <Button variant="secondary" onClick={() => { setBase64Input(''); setDecodedImage(null); setError(''); }}>
              초기화
            </Button>
          </div>

          {decodedImage && (
            <Card variant="bordered" className="p-4">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                변환된 이미지
              </p>
              <img
                src={decodedImage}
                alt="Decoded"
                className="max-w-full h-auto rounded"
                style={{ maxHeight: '300px' }}
              />
            </Card>
          )}
        </>
      )}

      <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          사용 예시
        </h3>
        <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
          <li>• CSS: background-image: url(data:image/png;base64,...);</li>
          <li>• HTML: &lt;img src=&quot;data:image/png;base64,...&quot; /&gt;</li>
          <li>• JSON: 이미지를 텍스트로 저장/전송</li>
        </ul>
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
          🖼️ Base64 이미지 변환이란?
        </h2>
        <p className="text-sm leading-relaxed">
          Base64 이미지 변환은 이미지 파일을 텍스트 문자열로 인코딩하거나, 반대로 Base64 문자열을 이미지로 디코딩하는 도구입니다.
          Base64로 인코딩된 이미지는 HTML, CSS, JavaScript 코드에 직접 삽입할 수 있어 외부 파일 의존성을 줄일 수 있습니다.
          이메일 템플릿, 단일 HTML 파일 배포, API 데이터 전송 등에서 널리 활용됩니다.
          모든 처리는 브라우저에서 이루어지므로 이미지가 외부 서버로 전송되지 않아 안전합니다.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          📋 이미지 형식별 Base64 시그니처
        </h2>
        <div className="overflow-x-auto text-sm">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b dark:border-gray-700">
                <th className="text-left py-2 px-2">형식</th>
                <th className="text-left py-2 px-2">MIME 타입</th>
                <th className="text-left py-2 px-2">Base64 시작 문자</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">JPEG</td><td>image/jpeg</td><td className="font-mono">/9j/</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">PNG</td><td>image/png</td><td className="font-mono">iVBOR</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">GIF</td><td>image/gif</td><td className="font-mono">R0lGOD</td></tr>
              <tr><td className="py-2 px-2 font-medium">WebP</td><td>image/webp</td><td className="font-mono">UklGR</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          💡 Base64 이미지 활용 팁
        </h2>
        <ul className="text-sm leading-relaxed space-y-2 list-disc list-inside">
          <li><strong>작은 이미지에 적합</strong>: 아이콘, 로고 등 10KB 미만 이미지에 권장</li>
          <li><strong>Data URL 접두사</strong>: CSS/HTML에서 사용 시 data:image/... 형식 필요</li>
          <li><strong>용량 증가</strong>: Base64 인코딩 시 원본 대비 약 33% 크기 증가</li>
          <li><strong>캐싱 불가</strong>: 인라인 이미지는 브라우저 캐싱 불가, 반복 다운로드</li>
          <li><strong>이메일 첨부</strong>: HTML 이메일에 이미지 직접 삽입 시 유용</li>
        </ul>
      </section>

      <FaqSection
        title="자주 묻는 질문"
        faqs={[
          {
            question: 'Base64 인코딩하면 이미지가 커지나요?',
            answer: '네, Base64 인코딩은 바이너리를 텍스트로 변환하므로 약 33% 정도 용량이 증가합니다. 작은 이미지에 적합합니다.',
          },
          {
            question: 'Data URL 접두사는 언제 필요한가요?',
            answer: 'HTML img 태그의 src나 CSS background-image에 직접 사용할 때는 data:image/...;base64, 접두사가 필요합니다. API 전송 시에는 순수 Base64만 사용하기도 합니다.',
          },
          {
            question: 'Base64 문자열에서 이미지 형식을 알 수 있나요?',
            answer: '네, Base64 시작 문자로 이미지 형식을 추측할 수 있습니다. 이 도구는 /9j/(JPEG), iVBOR(PNG) 등 시그니처를 자동 감지합니다.',
          },
        ]}
      />
    </div>
  );
}
