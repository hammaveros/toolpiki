'use client';

import { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { FileUpload } from '@/components/ui/FileUpload';
import { FaqSection } from '@/components/ui/FaqItem';

export function ImageRotate() {
  const [image, setImage] = useState<string | null>(null);
  const [rotation, setRotation] = useState(0);
  const [flipH, setFlipH] = useState(false);
  const [flipV, setFlipV] = useState(false);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleImageUpload = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setImage(e.target?.result as string);
      setRotation(0);
      setFlipH(false);
      setFlipV(false);
      setProcessedImage(null);
    };
    reader.readAsDataURL(file);
  }, []);

  const processImage = useCallback(() => {
    if (!image || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      // 90도 회전시 너비/높이 교환
      const isRotated = rotation === 90 || rotation === 270;
      canvas.width = isRotated ? img.height : img.width;
      canvas.height = isRotated ? img.width : img.height;

      ctx.save();

      // 중심으로 이동
      ctx.translate(canvas.width / 2, canvas.height / 2);

      // 회전
      ctx.rotate((rotation * Math.PI) / 180);

      // 뒤집기
      ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);

      // 이미지 그리기
      ctx.drawImage(img, -img.width / 2, -img.height / 2);

      ctx.restore();

      setProcessedImage(canvas.toDataURL('image/png'));
    };
    img.src = image;
  }, [image, rotation, flipH, flipV]);

  const handleRotateLeft = () => {
    setRotation((prev) => (prev - 90 + 360) % 360);
  };

  const handleRotateRight = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const handleDownload = () => {
    if (!processedImage) return;

    const link = document.createElement('a');
    link.download = `rotated_${rotation}deg.png`;
    link.href = processedImage;
    link.click();
  };

  const handleReset = () => {
    setRotation(0);
    setFlipH(false);
    setFlipV(false);
    setProcessedImage(null);
  };

  return (
    <div className="space-y-2">
      <FileUpload
        accept="image/*"
        onFileSelect={handleImageUpload}
        label="이미지 업로드"
        description="JPG, PNG, GIF, WebP 파일 지원"
      />

      {image && (
        <>
          <Card variant="bordered" className="p-4">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  회전
                </label>
                <div className="flex gap-2 flex-wrap">
                  <Button variant="secondary" onClick={handleRotateLeft}>
                    ↺ 90° 왼쪽
                  </Button>
                  <Button variant="secondary" onClick={handleRotateRight}>
                    ↻ 90° 오른쪽
                  </Button>
                  <Button
                    variant={rotation === 180 ? 'primary' : 'secondary'}
                    onClick={() => setRotation(180)}
                  >
                    180°
                  </Button>
                </div>
                <p className="text-sm text-gray-500 mt-2">현재 회전: {rotation}°</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  뒤집기
                </label>
                <div className="flex gap-2">
                  <Button
                    variant={flipH ? 'primary' : 'secondary'}
                    onClick={() => setFlipH(!flipH)}
                  >
                    ↔ 좌우 뒤집기
                  </Button>
                  <Button
                    variant={flipV ? 'primary' : 'secondary'}
                    onClick={() => setFlipV(!flipV)}
                  >
                    ↕ 상하 뒤집기
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          <div className="flex gap-2">
            <Button onClick={processImage}>적용</Button>
            <Button variant="secondary" onClick={handleReset}>
              초기화
            </Button>
            {processedImage && (
              <Button variant="secondary" onClick={handleDownload}>
                다운로드
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card variant="bordered" className="p-4">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">원본</p>
              <div className="flex justify-center">
                <img
                  src={image}
                  alt="Original"
                  className="max-w-full h-auto rounded"
                  style={{ maxHeight: '300px', objectFit: 'contain' }}
                />
              </div>
            </Card>

            <Card variant="bordered" className="p-4">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">미리보기</p>
              <div className="flex justify-center">
                <img
                  src={image}
                  alt="Preview"
                  className="max-w-full h-auto rounded transition-transform duration-200"
                  style={{
                    maxHeight: '300px',
                    objectFit: 'contain',
                    transform: `rotate(${rotation}deg) scaleX(${flipH ? -1 : 1}) scaleY(${flipV ? -1 : 1})`,
                  }}
                />
              </div>
            </Card>
          </div>

          {processedImage && (
            <Card variant="bordered" className="p-4">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                결과 (회전: {rotation}°, 좌우: {flipH ? '뒤집음' : '원본'}, 상하: {flipV ? '뒤집음' : '원본'})
              </p>
              <div className="flex justify-center">
                <img
                  src={processedImage}
                  alt="Processed"
                  className="max-w-full h-auto rounded"
                  style={{ maxHeight: '300px', objectFit: 'contain' }}
                />
              </div>
            </Card>
          )}
        </>
      )}

      <canvas ref={canvasRef} className="hidden" />

      <SeoContent />
    </div>
  );
}

function SeoContent() {
  return (
    <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 space-y-8 text-gray-700 dark:text-gray-300">
      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          🔄 이미지 회전/뒤집기란?
        </h2>
        <p className="text-sm leading-relaxed">
          <strong className="text-gray-900 dark:text-white">사진 방향을 수정하거나 거울 효과를 적용하는 도구.</strong>{' '}
          <strong>스마트폰 촬영 사진</strong>이 회전되어 있거나 <strong>스캔 문서</strong> 방향이 잘못됐을 때 간편하게 수정합니다.
          설치 없이 브라우저에서 바로 동작하며, 모든 처리는 <strong>로컬</strong>에서 이뤄져 개인정보가 안전합니다.
          <strong>실시간 미리보기</strong>로 결과를 확인하며 정확하게 조절할 수 있습니다.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          📐 회전 옵션 안내
        </h2>
        <div className="overflow-x-auto text-sm">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b dark:border-gray-700">
                <th className="text-left py-2 px-2">옵션</th>
                <th className="text-left py-2 px-2">설명</th>
                <th className="text-left py-2 px-2">활용 예시</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">90° 왼쪽</td><td>반시계 방향 90도</td><td>세로 사진을 가로로</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">90° 오른쪽</td><td>시계 방향 90도</td><td>가로 사진을 세로로</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">180°</td><td>위아래 뒤집기</td><td>거꾸로 촬영된 사진</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">좌우 뒤집기</td><td>수평 거울 효과</td><td>셀카 반전, 거울 효과</td></tr>
              <tr><td className="py-2 px-2 font-medium">상하 뒤집기</td><td>수직 거울 효과</td><td>반사 효과 제작</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          📱 사진이 저절로 눕는 이유 — EXIF Orientation
        </h2>
        <p className="text-sm leading-relaxed mb-3">
          스마트폰으로 세로로 찍은 사진이 PC에서만 옆으로 누워 보이는 경험, 흔합니다.
          카메라는 센서를 물리적으로 회전시키지 않고, <strong>&quot;이 사진은 몇 도 돌려서 보여달라&quot;는 표시(EXIF Orientation)</strong>만
          파일에 적어둡니다. 이 표시를 읽는 프로그램에서는 똑바로 보이고, 무시하는 프로그램에서는 누워 보이는 겁니다.
        </p>
        <div className="overflow-x-auto text-sm">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b dark:border-gray-700">
                <th className="text-left py-2 px-2">Orientation 값</th>
                <th className="text-left py-2 px-2">의미</th>
                <th className="text-left py-2 px-2">바로잡는 방법</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-mono">1</td><td>정상 (회전 없음)</td><td>그대로 사용</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-mono">3</td><td>180도 뒤집힘</td><td>180° 회전</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-mono">6</td><td>시계방향 90도 필요</td><td>90° 오른쪽</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-mono">8</td><td>반시계 90도 필요</td><td>90° 왼쪽</td></tr>
              <tr><td className="py-2 px-2 font-mono">2 / 4 / 5 / 7</td><td>거울 반전 포함</td><td>뒤집기 + 회전 조합</td></tr>
            </tbody>
          </table>
        </div>
        <p className="text-sm leading-relaxed mt-3">
          이 도구로 회전해서 저장하면 <strong>픽셀 자체가 돌아간 상태로 새로 기록</strong>되고 EXIF 표시에 의존하지 않게 됩니다.
          어디서 열어도 같은 방향으로 보이므로, 업로드했을 때 방향이 제멋대로 바뀌는 문제를 근본적으로 없앨 수 있습니다.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          🪞 회전과 뒤집기는 다르다
        </h2>
        <p className="text-sm leading-relaxed mb-3">
          둘을 헷갈리면 원하는 결과가 안 나옵니다. 결정적인 차이는 <strong>글자가 읽히는지</strong>입니다.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded">
            <p className="font-medium mb-1">회전 (Rotate)</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              이미지를 통째로 돌립니다. 고개를 기울이면 글자를 읽을 수 있습니다. 방향이 잘못 찍힌 사진·스캔 문서 교정용.
            </p>
          </div>
          <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded">
            <p className="font-medium mb-1">뒤집기 (Flip)</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              거울에 비친 것처럼 좌우/상하를 반전합니다. 글자가 반대로 보여 읽을 수 없습니다. 셀카 반전·반사 효과용.
            </p>
          </div>
        </div>
        <p className="text-sm leading-relaxed mt-3">
          전면 카메라 셀카는 대부분 좌우가 반전되어 저장됩니다. 실제로 남들이 보는 얼굴로 되돌리려면
          <strong> 좌우 뒤집기</strong>를 쓰세요. 배경에 간판이나 글자가 있다면 그 글자가 제대로 읽히는 쪽이 원래 방향입니다.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          💡 이미지 회전 활용 팁
        </h2>
        <ul className="text-sm leading-relaxed space-y-2 list-disc list-inside">
          <li><strong>EXIF 방향 문제</strong> — 카메라 방향 정보가 잘못 기록된 사진 직접 회전</li>
          <li><strong>스캔 문서</strong> — 잘못 스캔된 문서 방향 교정</li>
          <li><strong>셀카 반전</strong> — <strong>좌우 뒤집기</strong>로 원래 방향 복원</li>
          <li><strong>조합 사용</strong> — 회전 + 뒤집기로 다양한 효과</li>
          <li><strong>원본 보존</strong> — 적용 전 미리보기 확인, 새 파일로 저장</li>
        </ul>
        <div className="mt-4 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900 p-4 text-sm">
          <p className="font-semibold text-emerald-900 dark:text-emerald-200 mb-1">💡 무손실 회전</p>
          <p className="text-emerald-800 dark:text-emerald-300">
            <code className="px-1 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900/50 text-xs font-mono">90°</code> /
            <code className="px-1 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900/50 text-xs font-mono">180°</code> /
            <code className="px-1 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900/50 text-xs font-mono">270°</code> 직각 회전은 <strong>화질 손실 없음</strong>. PNG로 저장됩니다.
          </p>
        </div>
      </section>

      <FaqSection
        title="자주 묻는 질문"
        faqs={[
          {
            question: '회전 후 이미지 품질이 저하되나요?',
            answer: '90°, 180°, 270° 같은 직각 회전은 품질 손실 없이 처리됩니다. PNG 형식으로 저장되어 고품질을 유지합니다.',
          },
          {
            question: '회전과 뒤집기를 동시에 적용할 수 있나요?',
            answer: '네, 회전 각도와 좌우/상하 뒤집기를 자유롭게 조합할 수 있습니다. 미리보기에서 즉시 결과를 확인할 수 있습니다.',
          },
          {
            question: '지원하는 이미지 형식은 무엇인가요?',
            answer: 'JPG, PNG, GIF, WebP 등 브라우저에서 지원하는 대부분의 이미지 형식을 사용할 수 있습니다. 결과는 PNG로 저장됩니다.',
          },
          {
            question: '스마트폰 사진이 PC에서만 옆으로 누워 보여요.',
            answer: 'EXIF Orientation 정보를 읽지 않는 프로그램에서 생기는 현상입니다. 이 도구로 회전해 저장하면 픽셀 자체가 돌아간 상태로 기록되어, 어떤 프로그램에서 열어도 같은 방향으로 보입니다.',
          },
          {
            question: '결과가 PNG로 저장되면 용량이 커지지 않나요?',
            answer: 'PNG는 무손실이라 사진의 경우 원본 JPEG보다 커질 수 있습니다. 용량이 중요하다면 회전 후 이미지 포맷 변환기로 JPEG나 WebP로 바꾸면 됩니다.',
          },
          {
            question: '45도처럼 비스듬한 각도로도 돌릴 수 있나요?',
            answer: '이 도구는 90도 단위 회전과 좌우·상하 뒤집기를 지원합니다. 직각 회전은 픽셀 재계산이 없어 화질 손실이 전혀 없다는 장점이 있습니다.',
          },
        ]}
      />
    </div>
  );
}
