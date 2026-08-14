'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Select } from '@/components/ui/Select';
import { Input } from '@/components/ui/Input';
import { FileUpload } from '@/components/ui/FileUpload';
import { FaqSection } from '@/components/ui/FaqItem';

type Position =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'middle-left'
  | 'middle-center'
  | 'middle-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right'
  | 'tiled';

type OutputFormat = 'png' | 'jpeg';

interface WatermarkSettings {
  text: string;
  fontSize: number;
  color: string;
  opacity: number;
  position: Position;
  rotation: number;
}

const POSITION_GRID: { value: Position; label: string; title: string }[] = [
  { value: 'top-left', label: '↖', title: '좌상단' },
  { value: 'top-center', label: '↑', title: '상단 중앙' },
  { value: 'top-right', label: '↗', title: '우상단' },
  { value: 'middle-left', label: '←', title: '좌측 중앙' },
  { value: 'middle-center', label: '●', title: '정중앙' },
  { value: 'middle-right', label: '→', title: '우측 중앙' },
  { value: 'bottom-left', label: '↙', title: '좌하단' },
  { value: 'bottom-center', label: '↓', title: '하단 중앙' },
  { value: 'bottom-right', label: '↘', title: '우하단' },
];

function drawWatermark(
  canvas: HTMLCanvasElement,
  img: HTMLImageElement,
  settings: WatermarkSettings,
  outputFormat: OutputFormat
) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // JPEG는 투명도를 지원하지 않으므로 흰 배경을 먼저 채운다
  if (outputFormat === 'jpeg') {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

  const { text, fontSize, color, opacity, position, rotation } = settings;
  if (!text) return;

  const radians = (rotation * Math.PI) / 180;

  ctx.save();
  ctx.globalAlpha = Math.max(0, Math.min(100, opacity)) / 100;
  ctx.fillStyle = color;
  ctx.font = `${fontSize}px sans-serif`;

  if (position === 'tiled') {
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate(radians);

    const textWidth = Math.max(ctx.measureText(text).width, fontSize);
    const gapX = textWidth + fontSize * 1.5;
    const gapY = fontSize * 3;
    const diag = Math.sqrt(canvas.width ** 2 + canvas.height ** 2);

    for (let y = -diag; y <= diag; y += gapY) {
      for (let x = -diag; x <= diag; x += gapX) {
        ctx.fillText(text, x, y);
      }
    }
  } else {
    const padding = Math.max(16, fontSize * 0.4);
    let x = canvas.width / 2;
    let y = canvas.height / 2;
    let textAlign: CanvasTextAlign = 'center';
    let textBaseline: CanvasTextBaseline = 'middle';

    if (position.includes('left')) {
      x = padding;
      textAlign = 'left';
    } else if (position.includes('right')) {
      x = canvas.width - padding;
      textAlign = 'right';
    }

    if (position.startsWith('top')) {
      y = padding;
      textBaseline = 'top';
    } else if (position.startsWith('bottom')) {
      y = canvas.height - padding;
      textBaseline = 'bottom';
    }

    ctx.textAlign = textAlign;
    ctx.textBaseline = textBaseline;
    ctx.translate(x, y);
    ctx.rotate(radians);
    ctx.fillText(text, 0, 0);
  }

  ctx.restore();
}

export function ImageWatermark() {
  const [imgObj, setImgObj] = useState<HTMLImageElement | null>(null);
  const [imageSize, setImageSize] = useState<{ width: number; height: number } | null>(null);
  const [fileName, setFileName] = useState('image');

  const [text, setText] = useState('워터마크');
  const [fontSize, setFontSize] = useState(48);
  const [color, setColor] = useState('#ffffff');
  const [opacity, setOpacity] = useState(50);
  const [position, setPosition] = useState<Position>('bottom-right');
  const [rotation, setRotation] = useState(-30);
  const [outputFormat, setOutputFormat] = useState<OutputFormat>('png');

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleImageUpload = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result;
      if (typeof result !== 'string') return;

      const img = new Image();
      img.onload = () => {
        setImgObj(img);
        setImageSize({ width: img.naturalWidth, height: img.naturalHeight });
      };
      img.src = result;
    };
    reader.readAsDataURL(file);

    setFileName(file.name.replace(/\.[^/.]+$/, '') || 'image');
  }, []);

  useEffect(() => {
    if (!imgObj || !canvasRef.current) return;
    drawWatermark(
      canvasRef.current,
      imgObj,
      { text, fontSize, color, opacity, position, rotation },
      outputFormat
    );
  }, [imgObj, text, fontSize, color, opacity, position, rotation, outputFormat]);

  const handleReset = () => {
    setImgObj(null);
    setImageSize(null);
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const mime = outputFormat === 'png' ? 'image/png' : 'image/jpeg';
    const extension = outputFormat === 'png' ? 'png' : 'jpg';

    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = `${fileName}_watermark.${extension}`;
        link.href = url;
        link.click();
        URL.revokeObjectURL(url);
      },
      mime,
      outputFormat === 'jpeg' ? 0.92 : undefined
    );
  };

  return (
    <div className="space-y-2">
      <FileUpload
        accept="image/*"
        onFileSelect={handleImageUpload}
        label="이미지 업로드"
        description="워터마크를 추가할 이미지를 선택하세요"
      />

      {imgObj && imageSize && (
        <>
          <Card variant="bordered" className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 텍스트 / 스타일 설정 */}
              <div className="space-y-4">
                <Input
                  label="워터마크 텍스트"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="워터마크로 표시할 텍스트"
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    글자 크기: {fontSize}px
                  </label>
                  <input
                    type="range"
                    min="12"
                    max="200"
                    value={fontSize}
                    onChange={(e) => setFontSize(Number(e.target.value))}
                    className="w-full"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      색상
                    </label>
                    <input
                      type="color"
                      value={color}
                      onChange={(e) => setColor(e.target.value)}
                      className="w-full h-11 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      불투명도: {opacity}%
                    </label>
                    <input
                      type="range"
                      min="5"
                      max="100"
                      value={opacity}
                      onChange={(e) => setOpacity(Number(e.target.value))}
                      className="w-full"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    회전 각도: {rotation}°
                  </label>
                  <input
                    type="range"
                    min="-90"
                    max="90"
                    value={rotation}
                    onChange={(e) => setRotation(Number(e.target.value))}
                    className="w-full"
                  />
                </div>
              </div>

              {/* 위치 / 출력 설정 */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    위치
                  </label>
                  <div className="grid grid-cols-3 gap-1 w-fit">
                    {POSITION_GRID.map((p) => (
                      <button
                        key={p.value}
                        type="button"
                        title={p.title}
                        onClick={() => setPosition(p.value)}
                        className={`w-11 h-11 flex items-center justify-center rounded-lg border text-base transition-colors ${
                          position === p.value
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => setPosition('tiled')}
                    className={`mt-2 w-full py-2 text-sm rounded-lg border transition-colors ${
                      position === 'tiled'
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                    }`}
                  >
                    🔁 타일로 반복 배치
                  </button>
                </div>

                <Select
                  label="출력 형식"
                  value={outputFormat}
                  onChange={(e) => setOutputFormat(e.target.value as OutputFormat)}
                  options={[
                    { value: 'png', label: 'PNG (투명 배경 지원)' },
                    { value: 'jpeg', label: 'JPEG (파일 크기 작음)' },
                  ]}
                />
              </div>
            </div>
          </Card>

          <Card variant="bordered" className="p-4">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              미리보기 ({imageSize.width} x {imageSize.height}px)
            </p>
            <div className="overflow-auto max-w-full flex justify-center bg-gray-50 dark:bg-gray-900/50 rounded-lg p-2">
              <canvas
                ref={canvasRef}
                className="max-w-full h-auto rounded"
                style={{ maxHeight: '500px' }}
              />
            </div>
          </Card>

          <div className="flex gap-2 flex-wrap">
            <Button onClick={handleDownload}>다운로드</Button>
            <Button variant="ghost" onClick={handleReset}>
              이미지 제거
            </Button>
          </div>
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
          🖋️ 이미지 워터마크란?
        </h2>
        <p className="text-sm leading-relaxed">
          <strong className="text-gray-900 dark:text-white">사진 위에 텍스트를 겹쳐 저작권 표시나 출처를 남기는 기능.</strong>{' '}
          <strong>글자 크기, 색상, 불투명도, 회전 각도</strong>를 자유롭게 조절할 수 있고,
          <strong>9방향 배치</strong> 또는 이미지 전체를 대각선으로 덮는 <strong>타일 반복 배치</strong>를 지원합니다.
          모든 처리는 브라우저 Canvas에서만 이루어지며, 이미지가 서버로 전송되지 않아 안전합니다.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          📍 배치 방식 비교
        </h2>
        <div className="overflow-x-auto text-sm">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b dark:border-gray-700">
                <th className="text-left py-2 px-2">방식</th>
                <th className="text-left py-2 px-2">특징</th>
                <th className="text-left py-2 px-2">적합한 용도</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2">9그리드 단일 배치</td><td>한 곳에만 표시, 사진 방해 최소</td><td>블로그, SNS 사진</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2">타일 반복 배치</td><td>전체를 대각선으로 촘촘히 덮음</td><td>도용 방지, 계약서/문서 미리보기</td></tr>
              <tr><td className="py-2 px-2">회전 각도 조절</td><td>텍스트를 비스듬히 기울임</td><td>자연스러운 디자인, 위조 방지 강화</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          💡 워터마크 설정 가이드
        </h2>
        <ul className="text-sm leading-relaxed space-y-2 list-disc list-inside">
          <li><strong>불투명도 30~50%</strong> — 사진을 가리지 않으면서 표시가 보임</li>
          <li><strong>모서리 배치(우하단 등)</strong> — 저작권 표시용으로 가장 많이 사용</li>
          <li><strong>타일 반복 + 회전 -30°</strong> — 문서/시안 유출 방지에 효과적</li>
          <li><strong>흰색/검정 대비색</strong> — 배경 밝기에 따라 눈에 잘 띄는 색상 선택</li>
        </ul>
        <div className="mt-4 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900 p-4 text-sm">
          <p className="font-semibold text-emerald-900 dark:text-emerald-200 mb-1">💡 워터마크 팁</p>
          <p className="text-emerald-800 dark:text-emerald-300">
            공유용 사진은 <strong>우하단 배치 + 불투명도 40%</strong>, 도용 방지가 중요하면 <strong>타일 반복</strong>을 사용하세요.
          </p>
        </div>
      </section>

      <FaqSection
        title="자주 묻는 질문"
        faqs={[
          {
            question: '워터마크를 추가하면 원본 이미지가 훼손되나요?',
            answer: '아니요, 원본 파일은 그대로 유지됩니다. 워터마크가 합성된 새 이미지를 별도로 다운로드하는 방식이며, 브라우저에서만 처리되어 서버로 전송되지 않습니다.',
          },
          {
            question: 'PNG와 JPEG 중 어떤 형식을 선택해야 하나요?',
            answer: '투명 배경 이미지이거나 최고 화질이 필요하면 PNG를, 파일 크기를 줄이고 싶으면 JPEG를 선택하세요. JPEG로 저장 시 투명 영역은 흰색 배경으로 채워집니다.',
          },
          {
            question: '워터마크가 이미지 전체를 가리지 않게 하려면?',
            answer: '9그리드 중 원하는 모서리(예: 우하단)를 선택하고 불투명도를 30~50%로 낮추면 사진을 크게 가리지 않으면서도 표시가 잘 보입니다.',
          },
        ]}
      />
    </div>
  );
}
