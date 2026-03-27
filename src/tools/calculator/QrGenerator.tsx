'use client';

import { useState, useEffect, useRef } from 'react';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { FaqSection } from '@/components/ui/FaqItem';

type QrMode = 'text' | 'wifi' | 'vcard';

interface WifiData {
  ssid: string;
  password: string;
  encryption: 'WPA' | 'WEP' | 'nopass';
  hidden: boolean;
}

interface VcardData {
  name: string;
  phone: string;
  email: string;
  company: string;
  title: string;
  url: string;
}

export function QrGenerator() {
  const [mode, setMode] = useState<QrMode>('text');
  const [textInput, setTextInput] = useState('');
  const [wifiData, setWifiData] = useState<WifiData>({
    ssid: '',
    password: '',
    encryption: 'WPA',
    hidden: false,
  });
  const [vcardData, setVcardData] = useState<VcardData>({
    name: '',
    phone: '',
    email: '',
    company: '',
    title: '',
    url: '',
  });
  const [size, setSize] = useState('200');
  const [fgColor, setFgColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [qrDataUrl, setQrDataUrl] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // QR 데이터 생성
  const getQrData = (): string => {
    switch (mode) {
      case 'text':
        return textInput;
      case 'wifi':
        if (!wifiData.ssid) return '';
        const hidden = wifiData.hidden ? 'H:true;' : '';
        return `WIFI:T:${wifiData.encryption};S:${wifiData.ssid};P:${wifiData.password};${hidden};`;
      case 'vcard':
        if (!vcardData.name) return '';
        let vcard = 'BEGIN:VCARD\nVERSION:3.0\n';
        vcard += `FN:${vcardData.name}\n`;
        if (vcardData.phone) vcard += `TEL:${vcardData.phone}\n`;
        if (vcardData.email) vcard += `EMAIL:${vcardData.email}\n`;
        if (vcardData.company) vcard += `ORG:${vcardData.company}\n`;
        if (vcardData.title) vcard += `TITLE:${vcardData.title}\n`;
        if (vcardData.url) vcard += `URL:${vcardData.url}\n`;
        vcard += 'END:VCARD';
        return vcard;
      default:
        return '';
    }
  };

  const qrData = getQrData();

  useEffect(() => {
    if (!qrData) {
      setQrDataUrl('');
      return;
    }

    generateQR(qrData, parseInt(size));
  }, [qrData, size, fgColor, bgColor]);

  const generateQR = (text: string, qrSize: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const fg = fgColor.replace('#', '');
    const bg = bgColor.replace('#', '');

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      canvas.width = qrSize;
      canvas.height = qrSize;
      ctx.drawImage(img, 0, 0, qrSize, qrSize);
      setQrDataUrl(canvas.toDataURL('image/png'));
    };
    img.onerror = () => {
      setQrDataUrl('');
    };
    img.src = `https://api.qrserver.com/v1/create-qr-code/?size=${qrSize}x${qrSize}&data=${encodeURIComponent(text)}&color=${fg}&bgcolor=${bg}`;
  };

  const handleDownload = () => {
    if (!qrDataUrl) return;

    const link = document.createElement('a');
    link.download = 'qrcode.png';
    link.href = qrDataUrl;
    link.click();
  };

  const modeLabels: Record<QrMode, string> = {
    text: '텍스트/URL',
    wifi: 'Wi-Fi',
    vcard: '연락처',
  };

  return (
    <div className="space-y-4">
      {/* 모드 선택 탭 */}
      <Card variant="bordered" className="p-2">
        <div className="flex gap-1">
          {(['text', 'wifi', 'vcard'] as QrMode[]).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                mode === m
                  ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              {modeLabels[m]}
            </button>
          ))}
        </div>
      </Card>

      {/* 모드별 입력 */}
      <Card variant="bordered" className="p-4">
        {mode === 'text' && (
          <Textarea
            label="QR코드에 담을 내용"
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            placeholder="URL, 텍스트, 전화번호 등을 입력하세요..."
            rows={4}
          />
        )}

        {mode === 'wifi' && (
          <div className="space-y-3">
            <Input
              label="네트워크 이름 (SSID)"
              value={wifiData.ssid}
              onChange={(e) => setWifiData({ ...wifiData, ssid: e.target.value })}
              placeholder="Wi-Fi 이름"
            />
            <Input
              label="비밀번호"
              type="password"
              value={wifiData.password}
              onChange={(e) => setWifiData({ ...wifiData, password: e.target.value })}
              placeholder="Wi-Fi 비밀번호"
            />
            <Select
              label="암호화 방식"
              value={wifiData.encryption}
              onChange={(e) => setWifiData({ ...wifiData, encryption: e.target.value as 'WPA' | 'WEP' | 'nopass' })}
              options={[
                { value: 'WPA', label: 'WPA/WPA2/WPA3' },
                { value: 'WEP', label: 'WEP' },
                { value: 'nopass', label: '암호 없음' },
              ]}
            />
            <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <input
                type="checkbox"
                checked={wifiData.hidden}
                onChange={(e) => setWifiData({ ...wifiData, hidden: e.target.checked })}
                className="rounded"
              />
              숨겨진 네트워크
            </label>
          </div>
        )}

        {mode === 'vcard' && (
          <div className="space-y-3">
            <Input
              label="이름 *"
              value={vcardData.name}
              onChange={(e) => setVcardData({ ...vcardData, name: e.target.value })}
              placeholder="홍길동"
            />
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="전화번호"
                value={vcardData.phone}
                onChange={(e) => setVcardData({ ...vcardData, phone: e.target.value })}
                placeholder="010-1234-5678"
              />
              <Input
                label="이메일"
                type="email"
                value={vcardData.email}
                onChange={(e) => setVcardData({ ...vcardData, email: e.target.value })}
                placeholder="email@example.com"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="회사"
                value={vcardData.company}
                onChange={(e) => setVcardData({ ...vcardData, company: e.target.value })}
                placeholder="회사명"
              />
              <Input
                label="직함"
                value={vcardData.title}
                onChange={(e) => setVcardData({ ...vcardData, title: e.target.value })}
                placeholder="직책/직함"
              />
            </div>
            <Input
              label="웹사이트"
              value={vcardData.url}
              onChange={(e) => setVcardData({ ...vcardData, url: e.target.value })}
              placeholder="https://example.com"
            />
          </div>
        )}
      </Card>

      {/* 옵션 */}
      <Card variant="bordered" className="p-4">
        <div className="flex flex-wrap gap-4 items-end">
          <div className="w-36">
            <Select
              label="크기"
              value={size}
              onChange={(e) => setSize(e.target.value)}
              options={[
                { value: '150', label: '150 x 150' },
                { value: '200', label: '200 x 200' },
                { value: '300', label: '300 x 300' },
                { value: '400', label: '400 x 400' },
              ]}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              전경색
            </label>
            <input
              type="color"
              value={fgColor}
              onChange={(e) => setFgColor(e.target.value)}
              className="w-12 h-10 rounded cursor-pointer border border-gray-300 dark:border-gray-600"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              배경색
            </label>
            <input
              type="color"
              value={bgColor}
              onChange={(e) => setBgColor(e.target.value)}
              className="w-12 h-10 rounded cursor-pointer border border-gray-300 dark:border-gray-600"
            />
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              setFgColor('#000000');
              setBgColor('#ffffff');
            }}
          >
            색상 초기화
          </Button>
        </div>
      </Card>

      {/* QR 코드 결과 */}
      {qrDataUrl && (
        <Card variant="bordered" className="p-6">
          <div className="flex flex-col items-center gap-4">
            <div className="p-4 rounded-lg" style={{ backgroundColor: bgColor }}>
              <img
                src={qrDataUrl}
                alt="생성된 QR 코드"
                width={parseInt(size)}
                height={parseInt(size)}
              />
            </div>
            <Button variant="primary" onClick={handleDownload}>
              PNG로 다운로드
            </Button>
          </div>
        </Card>
      )}

      {/* 숨겨진 캔버스 */}
      <canvas ref={canvasRef} className="hidden" />

      {/* 도움말 */}
      <div className="text-sm text-gray-500 dark:text-gray-400 space-y-1">
        <p>• <strong>텍스트/URL</strong>: URL, 텍스트, 전화번호 등을 QR코드로 변환</p>
        <p>• <strong>Wi-Fi</strong>: 스캔만으로 Wi-Fi에 자동 접속 가능</p>
        <p>• <strong>연락처</strong>: 스캔하면 연락처를 바로 저장 가능</p>
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
          📱 QR코드 생성기란?
        </h2>
        <p className="text-sm leading-relaxed">
          QR코드 생성기는 URL, 텍스트, Wi-Fi 정보, 연락처 등을 스마트폰으로 스캔 가능한 QR코드로 변환하는 도구입니다.
          명함, 포스터, 제품 패키지, 매장 안내 등 다양한 용도로 활용할 수 있습니다.
          전경색과 배경색을 자유롭게 설정하고 원하는 크기로 PNG 이미지를 다운로드하세요.
          Wi-Fi QR코드는 스캔만으로 자동 접속이 가능하여 게스트 와이파이 공유에 편리합니다.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          📊 QR코드 모드별 활용
        </h2>
        <div className="overflow-x-auto text-sm">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b dark:border-gray-700">
                <th className="text-left py-2 px-2">모드</th>
                <th className="text-left py-2 px-2">담을 정보</th>
                <th className="text-left py-2 px-2">활용 예시</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">텍스트/URL</td><td>웹사이트, 문자열, 전화번호</td><td>홈페이지 링크, 할인쿠폰 코드</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">Wi-Fi</td><td>SSID, 비밀번호, 암호화</td><td>카페/매장 와이파이 안내</td></tr>
              <tr><td className="py-2 px-2 font-medium">연락처 (vCard)</td><td>이름, 전화, 이메일, 회사</td><td>명함 대체, 행사 명찰</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          💡 QR코드 활용 팁
        </h2>
        <ul className="text-sm leading-relaxed space-y-2 list-disc list-inside">
          <li><strong>적절한 크기</strong>: 인쇄용은 300x300 이상 권장, 작은 크기는 인식 오류 가능</li>
          <li><strong>대비 유지</strong>: 전경색과 배경색의 명암 차이가 커야 인식률 향상</li>
          <li><strong>테스트 필수</strong>: 인쇄 전 여러 스마트폰으로 스캔 테스트 권장</li>
          <li><strong>URL 단축</strong>: 긴 URL은 QR 복잡도 증가, 단축 URL 사용 고려</li>
        </ul>
      </section>

      <FaqSection
        title="자주 묻는 질문"
        faqs={[
          {
            question: 'Wi-Fi QR코드가 작동하지 않아요',
            answer: 'SSID(네트워크 이름)와 비밀번호가 정확한지 확인하세요. 숨겨진 네트워크는 "숨겨진 네트워크" 옵션을 체크해야 합니다. 일부 구형 기기는 WPA3를 지원하지 않을 수 있습니다.',
          },
          {
            question: 'QR코드 색상을 바꿔도 되나요?',
            answer: '네, 하지만 전경색과 배경색의 대비가 충분해야 합니다. 어두운 전경 + 밝은 배경 조합이 가장 안정적입니다. 밝은 전경색은 인식률이 떨어질 수 있습니다.',
          },
          {
            question: '생성된 QR코드는 어디에 저장되나요?',
            answer: 'QR코드는 브라우저에서 생성되며 서버에 저장되지 않습니다. 다운로드 버튼으로 PNG 파일을 저장하세요. 페이지를 닫으면 재생성해야 합니다.',
          },
        ]}
      />
    </div>
  );
}
