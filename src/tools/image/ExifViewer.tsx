'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { FaqSection } from '@/components/ui/FaqItem';

// ─────────────────────────────────────────────────────────
// EXIF 파서 (외부 라이브러리 없이 DataView로 직접 파싱)
// ─────────────────────────────────────────────────────────

interface IfdEntry {
  tag: number;
  type: number;
  count: number;
  valueOffset: number;
}

interface ExifRow {
  label: string;
  value: string;
}

interface ExifResult {
  rows: ExifRow[];
  gps: { lat: number; lon: number } | null;
}

function readIfdEntries(
  view: DataView,
  tiffStart: number,
  ifdOffset: number,
  little: boolean
): { entries: IfdEntry[] } {
  const entryCount = view.getUint16(tiffStart + ifdOffset, little);
  const entries: IfdEntry[] = [];
  for (let i = 0; i < entryCount; i++) {
    const base = tiffStart + ifdOffset + 2 + i * 12;
    entries.push({
      tag: view.getUint16(base, little),
      type: view.getUint16(base + 2, little),
      count: view.getUint32(base + 4, little),
      valueOffset: base + 8,
    });
  }
  return { entries };
}

function readAscii(view: DataView, tiffStart: number, entry: IfdEntry, little: boolean): string {
  const size = entry.count;
  const dataOffset = size <= 4 ? entry.valueOffset : tiffStart + view.getUint32(entry.valueOffset, little);
  const bytes: number[] = [];
  for (let i = 0; i < entry.count; i++) {
    const b = view.getUint8(dataOffset + i);
    if (b === 0) break;
    bytes.push(b);
  }
  return String.fromCharCode(...bytes).trim();
}

function readShortOrLong(view: DataView, tiffStart: number, entry: IfdEntry, little: boolean): number {
  const typeSize = entry.type === 3 ? 2 : 4;
  const size = typeSize * entry.count;
  const dataOffset = size <= 4 ? entry.valueOffset : tiffStart + view.getUint32(entry.valueOffset, little);
  return entry.type === 3 ? view.getUint16(dataOffset, little) : view.getUint32(dataOffset, little);
}

function readRationalRaw(
  view: DataView,
  tiffStart: number,
  entry: IfdEntry,
  little: boolean,
  index = 0
): [number, number] {
  const size = 8 * entry.count;
  const base = size <= 4 ? entry.valueOffset : tiffStart + view.getUint32(entry.valueOffset, little);
  const dataOffset = base + index * 8;
  const isSigned = entry.type === 10;
  const num = isSigned ? view.getInt32(dataOffset, little) : view.getUint32(dataOffset, little);
  const den = isSigned ? view.getInt32(dataOffset + 4, little) : view.getUint32(dataOffset + 4, little);
  return [num, den];
}

function formatExposure(num: number, den: number): string {
  if (!den || !num) return '-';
  const value = num / den;
  if (value >= 1) return `${value.toFixed(1)}s`;
  return `1/${Math.round(den / num)}s`;
}

function formatDate(raw: string): string {
  return raw.replace(/^(\d{4}):(\d{2}):(\d{2})/, '$1-$2-$3');
}

function orientationLabel(value: number): string {
  const map: Record<number, string> = {
    1: '정상',
    2: '좌우 반전',
    3: '180도 회전',
    4: '상하 반전',
    5: '반시계 90도 + 반전',
    6: '시계방향 90도 회전',
    7: '시계방향 90도 + 반전',
    8: '반시계방향 90도 회전',
  };
  return map[value] || `알 수 없음 (${value})`;
}

function dmsToDecimal(view: DataView, tiffStart: number, entry: IfdEntry, little: boolean, negative: boolean): number {
  const [d0, d1] = readRationalRaw(view, tiffStart, entry, little, 0);
  const [m0, m1] = readRationalRaw(view, tiffStart, entry, little, 1);
  const [s0, s1] = readRationalRaw(view, tiffStart, entry, little, 2);
  const deg = d1 ? d0 / d1 : 0;
  const min = m1 ? m0 / m1 : 0;
  const sec = s1 ? s0 / s1 : 0;
  const decimal = deg + min / 60 + sec / 3600;
  return negative ? -decimal : decimal;
}

/** JPEG 바이트에서 APP1(Exif) 세그먼트를 찾아 TIFF 헤더 시작 위치를 반환 */
function findTiffStart(view: DataView): number | null {
  if (view.byteLength < 4 || view.getUint16(0) !== 0xffd8) return null; // SOI(JPEG) 아님

  let offset = 2;
  while (offset + 4 <= view.byteLength) {
    if (view.getUint8(offset) !== 0xff) break;
    const marker = view.getUint8(offset + 1);

    if (marker === 0xd8 || (marker >= 0xd0 && marker <= 0xd7) || marker === 0x01) {
      offset += 2;
      continue;
    }
    if (marker === 0xd9 || marker === 0xda) break; // EOI / SOS 도달 = 더 이상 메타데이터 없음

    const segSize = view.getUint16(offset + 2, false);
    if (marker === 0xe1 && segSize >= 8) {
      const isExif =
        view.getUint8(offset + 4) === 0x45 &&
        view.getUint8(offset + 5) === 0x78 &&
        view.getUint8(offset + 6) === 0x69 &&
        view.getUint8(offset + 7) === 0x66;
      if (isExif) return offset + 10;
    }
    offset += 2 + segSize;
  }
  return null;
}

function parseExif(buffer: ArrayBuffer): ExifResult | null {
  try {
    const view = new DataView(buffer);
    const tiffStart = findTiffStart(view);
    if (tiffStart === null || tiffStart + 8 > view.byteLength) return null;

    const byteOrder = view.getUint16(tiffStart, false);
    if (byteOrder !== 0x4949 && byteOrder !== 0x4d4d) return null;
    const little = byteOrder === 0x4949;
    if (view.getUint16(tiffStart + 2, little) !== 42) return null;

    const ifd0Offset = view.getUint32(tiffStart + 4, little);
    const { entries: ifd0 } = readIfdEntries(view, tiffStart, ifd0Offset, little);
    const ifd0Map = new Map<number, IfdEntry>();
    ifd0.forEach((e) => ifd0Map.set(e.tag, e));

    const rows: ExifRow[] = [];
    let gps: { lat: number; lon: number } | null = null;

    const make = ifd0Map.get(0x010f);
    if (make) rows.push({ label: '제조사', value: readAscii(view, tiffStart, make, little) });

    const model = ifd0Map.get(0x0110);
    if (model) rows.push({ label: '모델명', value: readAscii(view, tiffStart, model, little) });

    const orientation = ifd0Map.get(0x0112);
    if (orientation) {
      rows.push({ label: '방향', value: orientationLabel(readShortOrLong(view, tiffStart, orientation, little)) });
    }

    const software = ifd0Map.get(0x0131);
    if (software) rows.push({ label: '소프트웨어', value: readAscii(view, tiffStart, software, little) });

    const modDate = ifd0Map.get(0x0132);
    if (modDate) rows.push({ label: '수정 날짜', value: formatDate(readAscii(view, tiffStart, modDate, little)) });

    // Exif SubIFD
    try {
      const exifPtr = ifd0Map.get(0x8769);
      if (exifPtr) {
        const exifOffset = readShortOrLong(view, tiffStart, exifPtr, little);
        const { entries: exifEntries } = readIfdEntries(view, tiffStart, exifOffset, little);
        const exifMap = new Map<number, IfdEntry>();
        exifEntries.forEach((e) => exifMap.set(e.tag, e));

        const dateOriginal = exifMap.get(0x9003);
        if (dateOriginal) rows.push({ label: '촬영 날짜', value: formatDate(readAscii(view, tiffStart, dateOriginal, little)) });

        const exposure = exifMap.get(0x829a);
        if (exposure) {
          const [num, den] = readRationalRaw(view, tiffStart, exposure, little);
          rows.push({ label: '노출 시간', value: formatExposure(num, den) });
        }

        const fnumber = exifMap.get(0x829d);
        if (fnumber) {
          const [num, den] = readRationalRaw(view, tiffStart, fnumber, little);
          rows.push({ label: '조리개 값', value: den ? `f/${(num / den).toFixed(1)}` : '-' });
        }

        const iso = exifMap.get(0x8827);
        if (iso) rows.push({ label: 'ISO', value: String(readShortOrLong(view, tiffStart, iso, little)) });

        const focalLength = exifMap.get(0x920a);
        if (focalLength) {
          const [num, den] = readRationalRaw(view, tiffStart, focalLength, little);
          rows.push({ label: '초점 거리', value: den ? `${(num / den).toFixed(1)}mm` : '-' });
        }

        const lensModel = exifMap.get(0xa434);
        if (lensModel) rows.push({ label: '렌즈 모델', value: readAscii(view, tiffStart, lensModel, little) });
      }
    } catch {
      // Exif SubIFD 파싱 실패는 무시하고 IFD0에서 얻은 정보는 유지
    }

    // GPS IFD
    try {
      const gpsPtr = ifd0Map.get(0x8825);
      if (gpsPtr) {
        const gpsOffset = readShortOrLong(view, tiffStart, gpsPtr, little);
        const { entries: gpsEntries } = readIfdEntries(view, tiffStart, gpsOffset, little);
        const gpsMap = new Map<number, IfdEntry>();
        gpsEntries.forEach((e) => gpsMap.set(e.tag, e));

        const latRef = gpsMap.get(0x0001);
        const lat = gpsMap.get(0x0002);
        const lonRef = gpsMap.get(0x0003);
        const lon = gpsMap.get(0x0004);

        if (latRef && lat && lonRef && lon && lat.count >= 3 && lon.count >= 3) {
          const latRefStr = readAscii(view, tiffStart, latRef, little);
          const lonRefStr = readAscii(view, tiffStart, lonRef, little);
          const latDecimal = dmsToDecimal(view, tiffStart, lat, little, latRefStr === 'S');
          const lonDecimal = dmsToDecimal(view, tiffStart, lon, little, lonRefStr === 'W');
          gps = { lat: latDecimal, lon: lonDecimal };
          rows.push({ label: 'GPS 위도', value: latDecimal.toFixed(6) });
          rows.push({ label: 'GPS 경도', value: lonDecimal.toFixed(6) });
        }
      }
    } catch {
      // GPS IFD 파싱 실패는 무시
    }

    return { rows, gps };
  } catch {
    return null;
  }
}

// ─────────────────────────────────────────────────────────
// 컴포넌트
// ─────────────────────────────────────────────────────────

interface ImageSize {
  width: number;
  height: number;
}

export function ExifViewer() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [imageSize, setImageSize] = useState<ImageSize | null>(null);
  const [exifResult, setExifResult] = useState<ExifResult | null>(null);
  const [cleanedBlob, setCleanedBlob] = useState<Blob | null>(null);
  const [cleanedUrl, setCleanedUrl] = useState<string | null>(null);
  const [isRemoving, setIsRemoving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // 언마운트 시 object URL 정리
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      if (cleanedUrl) URL.revokeObjectURL(cleanedUrl);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const resetState = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    if (cleanedUrl) URL.revokeObjectURL(cleanedUrl);
    setSelectedFile(null);
    setPreviewUrl(null);
    setImageSize(null);
    setExifResult(null);
    setCleanedBlob(null);
    setCleanedUrl(null);
    setErrorMsg(null);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    if (previewUrl) URL.revokeObjectURL(previewUrl);
    if (cleanedUrl) URL.revokeObjectURL(cleanedUrl);

    setErrorMsg(null);
    setCleanedBlob(null);
    setCleanedUrl(null);
    setImageSize(null);
    setExifResult(null);

    const isJpeg = file.type === 'image/jpeg' || /\.jpe?g$/i.test(file.name);
    if (!isJpeg) {
      setErrorMsg('JPEG(.jpg, .jpeg) 파일만 지원합니다. EXIF는 JPEG에만 표준적으로 저장됩니다.');
      setSelectedFile(null);
      setPreviewUrl(null);
      return;
    }

    const url = URL.createObjectURL(file);
    setSelectedFile(file);
    setPreviewUrl(url);

    try {
      const buffer = await file.arrayBuffer();
      const result = parseExif(buffer);
      setExifResult(result ?? { rows: [], gps: null });
    } catch {
      setExifResult({ rows: [], gps: null });
    }

    const img = new Image();
    img.onload = () => setImageSize({ width: img.naturalWidth, height: img.naturalHeight });
    img.src = url;
  };

  const handleRemoveMetadata = () => {
    if (!previewUrl) return;
    setIsRemoving(true);
    setErrorMsg(null);

    const img = new Image();
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('canvas context 생성 실패');
        ctx.drawImage(img, 0, 0);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              setErrorMsg('이미지 변환에 실패했습니다.');
              setIsRemoving(false);
              return;
            }
            if (cleanedUrl) URL.revokeObjectURL(cleanedUrl);
            setCleanedBlob(blob);
            setCleanedUrl(URL.createObjectURL(blob));
            setIsRemoving(false);
          },
          'image/jpeg',
          0.95
        );
      } catch {
        setErrorMsg('메타데이터 제거 중 오류가 발생했습니다.');
        setIsRemoving(false);
      }
    };
    img.onerror = () => {
      setErrorMsg('이미지를 불러올 수 없습니다.');
      setIsRemoving(false);
    };
    img.src = previewUrl;
  };

  const handleDownload = () => {
    if (!cleanedBlob || !selectedFile) return;
    const url = URL.createObjectURL(cleanedBlob);
    const link = document.createElement('a');
    const baseName = selectedFile.name.replace(/\.[^/.]+$/, '');
    link.download = `${baseName}_clean.jpg`;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  };

  const formatSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  const displayRows: ExifRow[] = [
    ...(imageSize ? [{ label: '이미지 크기', value: `${imageSize.width} × ${imageSize.height}px` }] : []),
    ...(exifResult?.rows ?? []),
  ];

  const hasNoMetadata = exifResult !== null && exifResult.rows.length === 0;

  return (
    <div className="space-y-2">
      {/* 업로드 영역 */}
      <Card variant="bordered" className="p-6">
        <label className="block cursor-pointer">
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-gray-400 dark:hover:border-gray-500 transition-colors">
            <div className="text-4xl mb-2">📷</div>
            <p className="text-gray-600 dark:text-gray-400 mb-1">
              클릭하거나 JPEG 파일을 드래그하세요
            </p>
            <p className="text-sm text-gray-500">
              모든 분석은 브라우저에서만 처리되며 서버로 전송되지 않습니다
            </p>
          </div>
          <input type="file" accept="image/jpeg" onChange={handleFileUpload} className="hidden" />
        </label>
      </Card>

      {errorMsg && (
        <Card variant="bordered" className="p-4 border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/30">
          <p className="text-sm text-red-700 dark:text-red-400">{errorMsg}</p>
        </Card>
      )}

      {selectedFile && previewUrl && (
        <>
          {/* 파일 정보 + 썸네일 */}
          <Card variant="bordered" className="p-4">
            <div className="flex gap-4 items-center">
              <div className="w-20 h-20 flex-shrink-0">
                <img src={previewUrl} alt="업로드한 이미지" className="w-full h-full object-cover rounded" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate text-sm">{selectedFile.name}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {formatSize(selectedFile.size)}
                  {imageSize && ` • ${imageSize.width} × ${imageSize.height}px`}
                </p>
              </div>
              <Button size="sm" variant="ghost" onClick={resetState}>
                삭제
              </Button>
            </div>
          </Card>

          {/* GPS 위치 경고 */}
          {exifResult?.gps && (
            <Card variant="bordered" className="p-4 border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-950/30">
              <p className="font-semibold text-amber-900 dark:text-amber-200 mb-1">
                ⚠️ 이 사진에는 촬영 위치(GPS)가 포함되어 있습니다
              </p>
              <p className="text-sm text-amber-800 dark:text-amber-300">
                위도 {exifResult.gps.lat.toFixed(6)}, 경도 {exifResult.gps.lon.toFixed(6)}
                {' — '}
                <a
                  href={`https://www.google.com/maps?q=${exifResult.gps.lat},${exifResult.gps.lon}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  지도에서 보기
                </a>
              </p>
              <p className="text-sm text-amber-800 dark:text-amber-300 mt-1">
                이 상태로 사진을 SNS나 중고거래에 올리면 집·회사 등 실제 위치가 그대로 노출될 수 있습니다.
                아래 <strong>메타데이터 제거</strong>로 위치 정보를 지운 뒤 공유하세요.
              </p>
            </Card>
          )}

          {/* 메타데이터 테이블 */}
          <Card variant="bordered" className="p-4">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
              메타데이터 (EXIF)
            </h3>
            {hasNoMetadata && !imageSize ? (
              <p className="text-sm text-gray-500 dark:text-gray-400">분석 중...</p>
            ) : displayRows.length === 0 ? (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                메타데이터를 찾을 수 없습니다. (촬영 정보가 없거나, 이미 한 번 정리된 사진일 수 있습니다)
              </p>
            ) : (
              <div className="overflow-x-auto text-sm">
                <table className="w-full text-xs">
                  <tbody>
                    {displayRows.map((row, idx) => (
                      <tr key={idx} className="border-b dark:border-gray-800 last:border-0">
                        <td className="py-2 pr-4 font-medium text-gray-600 dark:text-gray-400 whitespace-nowrap align-top">
                          {row.label}
                        </td>
                        <td className="py-2 font-mono break-all">{row.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>

          {/* 액션 */}
          <div className="flex gap-2 flex-wrap">
            <Button onClick={handleRemoveMetadata} disabled={isRemoving}>
              {isRemoving ? '처리 중...' : '메타데이터 제거'}
            </Button>
            {cleanedBlob && (
              <Button variant="secondary" onClick={handleDownload}>
                다운로드 (정리된 이미지)
              </Button>
            )}
          </div>

          {/* 정리 결과 */}
          {cleanedUrl && cleanedBlob && (
            <Card variant="bordered" className="p-4">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                정리된 이미지 미리보기
              </p>
              <div className="flex gap-4 items-center">
                <div className="w-20 h-20 flex-shrink-0">
                  <img src={cleanedUrl} alt="정리된 이미지" className="w-full h-full object-cover rounded" />
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  <p>용량: {formatSize(cleanedBlob.size)}</p>
                  <p className="mt-1 text-green-600 dark:text-green-400">
                    GPS 위치, 카메라 정보 등 모든 EXIF 메타데이터가 제거되었습니다.
                  </p>
                </div>
              </div>
            </Card>
          )}
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
          🕵️ EXIF 메타데이터란?
        </h2>
        <p className="text-sm leading-relaxed">
          <strong className="text-gray-900 dark:text-white">
            사진 파일 안에 눈에 보이지 않게 저장되는 촬영 정보.
          </strong>{' '}
          카메라 제조사·모델명, 촬영 날짜/시간, 노출 시간·조리개·ISO 같은 카메라 설정값뿐 아니라,
          스마트폰으로 찍은 사진이라면 <strong>정확한 GPS 위치 좌표</strong>까지 함께 저장됩니다.
          이 도구는 서버 업로드 없이 브라우저 안에서만 EXIF를 읽고 지웁니다.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          📋 EXIF에 담기는 대표 정보
        </h2>
        <div className="overflow-x-auto text-sm">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b dark:border-gray-700">
                <th className="text-left py-2 px-2">항목</th>
                <th className="text-left py-2 px-2">내용</th>
                <th className="text-left py-2 px-2">개인정보 위험도</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-mono">GPS 위치</td><td>촬영한 위도/경도 좌표</td><td className="text-red-600 dark:text-red-400">매우 높음</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-mono">촬영 날짜/시간</td><td>정확한 촬영 시각</td><td>중간</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-mono">카메라/기기 정보</td><td>제조사, 모델명, 소프트웨어</td><td>낮음</td></tr>
              <tr><td className="py-2 px-2 font-mono">촬영 설정</td><td>노출 시간, 조리개, ISO, 초점 거리</td><td>낮음</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          🛡️ 왜 사진에서 메타데이터를 지워야 할까?
        </h2>
        <p className="text-sm leading-relaxed mb-3">
          스마트폰으로 찍은 사진을 그대로 SNS, 중고거래 플랫폼, 부동산 매물 사진 등으로 올리면
          <strong> 집 주소나 자주 가는 장소의 정확한 좌표가 그대로 노출</strong>될 수 있습니다.
          많은 플랫폼이 업로드 시 자동으로 EXIF를 제거해주지만, 이메일·메신저·클라우드로 원본 파일을
          직접 전달할 때는 메타데이터가 그대로 남아있는 경우가 많습니다.
        </p>
        <div className="mt-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900 p-4 text-sm">
          <p className="font-semibold text-emerald-900 dark:text-emerald-200 mb-1">💡 안전한 습관</p>
          <p className="text-emerald-800 dark:text-emerald-300">
            타인에게 원본 사진 파일을 직접 전달하기 전에는 항상 메타데이터를 확인하고 제거하는 습관을 들이세요.
          </p>
        </div>
      </section>

      <FaqSection
        title="자주 묻는 질문"
        faqs={[
          {
            question: '사진을 업로드하면 서버로 전송되나요?',
            answer: '아니요. 파일 읽기, EXIF 분석, 메타데이터 제거까지 모든 과정이 브라우저 안에서만 처리됩니다. 어떤 이미지도 서버로 전송되지 않습니다.',
          },
          {
            question: 'GPS 정보가 없다고 나오는데 정말 안전한가요?',
            answer: '이 도구가 표시하는 것은 파일에 실제로 저장된 EXIF GPS 태그입니다. 태그가 없으면 해당 파일에는 위치 정보가 없는 것이 맞습니다. 다만 카카오톡, 인스타그램 등으로 이미 한 번 전송된 사진은 플랫폼이 자체적으로 EXIF를 제거했을 수 있습니다.',
          },
          {
            question: '메타데이터를 제거하면 화질이 나빠지나요?',
            answer: '캔버스로 다시 인코딩(품질 95%)하는 방식이라 육안으로 차이를 느끼기 어렵습니다. 다만 원본과 픽셀 단위로 100% 동일하지는 않은 손실 압축 과정을 한 번 더 거치게 됩니다.',
          },
        ]}
      />
    </div>
  );
}
