'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { FaqSection } from '@/components/ui/FaqItem';

// ─────────────────────────────────────────────────────────
// EXIF parser (hand-written, DataView-based, no external deps)
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
    1: 'Normal',
    2: 'Mirrored horizontally',
    3: 'Rotated 180°',
    4: 'Mirrored vertically',
    5: 'Mirrored + rotated 90° CCW',
    6: 'Rotated 90° CW',
    7: 'Mirrored + rotated 90° CW',
    8: 'Rotated 90° CCW',
  };
  return map[value] || `Unknown (${value})`;
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

/** Locate the APP1 (Exif) segment in a JPEG and return the TIFF header start offset */
function findTiffStart(view: DataView): number | null {
  if (view.byteLength < 4 || view.getUint16(0) !== 0xffd8) return null; // not a JPEG (SOI)

  let offset = 2;
  while (offset + 4 <= view.byteLength) {
    if (view.getUint8(offset) !== 0xff) break;
    const marker = view.getUint8(offset + 1);

    if (marker === 0xd8 || (marker >= 0xd0 && marker <= 0xd7) || marker === 0x01) {
      offset += 2;
      continue;
    }
    if (marker === 0xd9 || marker === 0xda) break; // EOI / SOS reached, no more metadata

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
    if (make) rows.push({ label: 'Camera Make', value: readAscii(view, tiffStart, make, little) });

    const model = ifd0Map.get(0x0110);
    if (model) rows.push({ label: 'Camera Model', value: readAscii(view, tiffStart, model, little) });

    const orientation = ifd0Map.get(0x0112);
    if (orientation) {
      rows.push({ label: 'Orientation', value: orientationLabel(readShortOrLong(view, tiffStart, orientation, little)) });
    }

    const software = ifd0Map.get(0x0131);
    if (software) rows.push({ label: 'Software', value: readAscii(view, tiffStart, software, little) });

    const modDate = ifd0Map.get(0x0132);
    if (modDate) rows.push({ label: 'Modified Date', value: formatDate(readAscii(view, tiffStart, modDate, little)) });

    // Exif SubIFD
    try {
      const exifPtr = ifd0Map.get(0x8769);
      if (exifPtr) {
        const exifOffset = readShortOrLong(view, tiffStart, exifPtr, little);
        const { entries: exifEntries } = readIfdEntries(view, tiffStart, exifOffset, little);
        const exifMap = new Map<number, IfdEntry>();
        exifEntries.forEach((e) => exifMap.set(e.tag, e));

        const dateOriginal = exifMap.get(0x9003);
        if (dateOriginal) rows.push({ label: 'Date Taken', value: formatDate(readAscii(view, tiffStart, dateOriginal, little)) });

        const exposure = exifMap.get(0x829a);
        if (exposure) {
          const [num, den] = readRationalRaw(view, tiffStart, exposure, little);
          rows.push({ label: 'Exposure Time', value: formatExposure(num, den) });
        }

        const fnumber = exifMap.get(0x829d);
        if (fnumber) {
          const [num, den] = readRationalRaw(view, tiffStart, fnumber, little);
          rows.push({ label: 'Aperture (F-number)', value: den ? `f/${(num / den).toFixed(1)}` : '-' });
        }

        const iso = exifMap.get(0x8827);
        if (iso) rows.push({ label: 'ISO', value: String(readShortOrLong(view, tiffStart, iso, little)) });

        const focalLength = exifMap.get(0x920a);
        if (focalLength) {
          const [num, den] = readRationalRaw(view, tiffStart, focalLength, little);
          rows.push({ label: 'Focal Length', value: den ? `${(num / den).toFixed(1)}mm` : '-' });
        }

        const lensModel = exifMap.get(0xa434);
        if (lensModel) rows.push({ label: 'Lens Model', value: readAscii(view, tiffStart, lensModel, little) });
      }
    } catch {
      // Ignore SubIFD parse failures; keep whatever IFD0 already yielded
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
          rows.push({ label: 'GPS Latitude', value: latDecimal.toFixed(6) });
          rows.push({ label: 'GPS Longitude', value: lonDecimal.toFixed(6) });
        }
      }
    } catch {
      // Ignore GPS IFD parse failures
    }

    return { rows, gps };
  } catch {
    return null;
  }
}

// ─────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────

interface ImageSize {
  width: number;
  height: number;
}

export function ExifViewerEn() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [imageSize, setImageSize] = useState<ImageSize | null>(null);
  const [exifResult, setExifResult] = useState<ExifResult | null>(null);
  const [cleanedBlob, setCleanedBlob] = useState<Blob | null>(null);
  const [cleanedUrl, setCleanedUrl] = useState<string | null>(null);
  const [isRemoving, setIsRemoving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Clean up object URLs on unmount
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
      setErrorMsg('Only JPEG (.jpg, .jpeg) files are supported — EXIF is standardized for JPEG.');
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
        if (!ctx) throw new Error('failed to get canvas context');
        ctx.drawImage(img, 0, 0);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              setErrorMsg('Failed to convert image.');
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
        setErrorMsg('Something went wrong while removing metadata.');
        setIsRemoving(false);
      }
    };
    img.onerror = () => {
      setErrorMsg('Could not load the image.');
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
    ...(imageSize ? [{ label: 'Dimensions', value: `${imageSize.width} × ${imageSize.height}px` }] : []),
    ...(exifResult?.rows ?? []),
  ];

  const hasNoMetadata = exifResult !== null && exifResult.rows.length === 0;

  return (
    <div className="space-y-2">
      {/* Upload area */}
      <Card variant="bordered" className="p-6">
        <label className="block cursor-pointer">
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-gray-400 dark:hover:border-gray-500 transition-colors">
            <div className="text-4xl mb-2">📷</div>
            <p className="text-gray-600 dark:text-gray-400 mb-1">
              Click or drag a JPEG file here
            </p>
            <p className="text-sm text-gray-500">
              Everything is processed in your browser — nothing is uploaded to a server
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
          {/* File info + thumbnail */}
          <Card variant="bordered" className="p-4">
            <div className="flex gap-4 items-center">
              <div className="w-20 h-20 flex-shrink-0">
                <img src={previewUrl} alt="Uploaded" className="w-full h-full object-cover rounded" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate text-sm">{selectedFile.name}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {formatSize(selectedFile.size)}
                  {imageSize && ` • ${imageSize.width} × ${imageSize.height}px`}
                </p>
              </div>
              <Button size="sm" variant="ghost" onClick={resetState}>
                Remove
              </Button>
            </div>
          </Card>

          {/* GPS location warning */}
          {exifResult?.gps && (
            <Card variant="bordered" className="p-4 border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-950/30">
              <p className="font-semibold text-amber-900 dark:text-amber-200 mb-1">
                ⚠️ This photo contains a GPS location
              </p>
              <p className="text-sm text-amber-800 dark:text-amber-300">
                Lat {exifResult.gps.lat.toFixed(6)}, Lon {exifResult.gps.lon.toFixed(6)}
                {' — '}
                <a
                  href={`https://www.google.com/maps?q=${exifResult.gps.lat},${exifResult.gps.lon}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  view on map
                </a>
              </p>
              <p className="text-sm text-amber-800 dark:text-amber-300 mt-1">
                Sharing this file as-is on social media or marketplaces can reveal your home
                or workplace location. Use <strong>Remove metadata</strong> below before sharing.
              </p>
            </Card>
          )}

          {/* Metadata table */}
          <Card variant="bordered" className="p-4">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
              Metadata (EXIF)
            </h3>
            {hasNoMetadata && !imageSize ? (
              <p className="text-sm text-gray-500 dark:text-gray-400">Analyzing...</p>
            ) : displayRows.length === 0 ? (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                No metadata found. This photo may have no embedded shooting data, or it may
                already have been stripped once before.
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

          {/* Actions */}
          <div className="flex gap-2 flex-wrap">
            <Button onClick={handleRemoveMetadata} disabled={isRemoving}>
              {isRemoving ? 'Processing...' : 'Remove metadata'}
            </Button>
            {cleanedBlob && (
              <Button variant="secondary" onClick={handleDownload}>
                Download (clean image)
              </Button>
            )}
          </div>

          {/* Result */}
          {cleanedUrl && cleanedBlob && (
            <Card variant="bordered" className="p-4">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Clean image preview
              </p>
              <div className="flex gap-4 items-center">
                <div className="w-20 h-20 flex-shrink-0">
                  <img src={cleanedUrl} alt="Cleaned" className="w-full h-full object-cover rounded" />
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  <p>Size: {formatSize(cleanedBlob.size)}</p>
                  <p className="mt-1 text-green-600 dark:text-green-400">
                    GPS location, camera info, and all other EXIF metadata have been removed.
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
          🕵️ What is EXIF metadata?
        </h2>
        <p className="text-sm leading-relaxed">
          <strong className="text-gray-900 dark:text-white">
            Hidden shooting data embedded inside a photo file.
          </strong>{' '}
          It includes the camera make and model, the date and time taken, camera settings like
          exposure time, aperture and ISO — and, for most smartphone photos, the{' '}
          <strong>exact GPS coordinates</strong> of where the picture was taken. This tool reads
          and strips EXIF entirely inside your browser, with no server upload.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          📋 What EXIF typically stores
        </h2>
        <div className="overflow-x-auto text-sm">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b dark:border-gray-700">
                <th className="text-left py-2 px-2">Field</th>
                <th className="text-left py-2 px-2">Contains</th>
                <th className="text-left py-2 px-2">Privacy risk</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-mono">GPS location</td><td>Latitude/longitude of the shot</td><td className="text-red-600 dark:text-red-400">Very high</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-mono">Date/time taken</td><td>Exact timestamp</td><td>Medium</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-mono">Camera/device info</td><td>Make, model, software</td><td>Low</td></tr>
              <tr><td className="py-2 px-2 font-mono">Shooting settings</td><td>Exposure, aperture, ISO, focal length</td><td>Low</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          🛡️ Why strip metadata before sharing?
        </h2>
        <p className="text-sm leading-relaxed mb-3">
          Sharing a smartphone photo directly — via email, messaging apps, or marketplace listings —
          can leak the <strong>exact coordinates of your home or a place you visit often</strong>.
          Many social platforms strip EXIF automatically on upload, but sending the original file
          directly (cloud storage links, email attachments, chat apps) usually leaves the metadata intact.
        </p>
        <div className="mt-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900 p-4 text-sm">
          <p className="font-semibold text-emerald-900 dark:text-emerald-200 mb-1">💡 A safe habit</p>
          <p className="text-emerald-800 dark:text-emerald-300">
            Before sending an original photo file to someone else, always check it for metadata
            and strip it first.
          </p>
        </div>
      </section>

      <FaqSection
        title="Frequently Asked Questions"
        faqs={[
          {
            question: 'Is my photo uploaded to a server?',
            answer: 'No. Reading the file, parsing EXIF, and removing metadata all happen entirely inside your browser. No image is ever sent to a server.',
          },
          {
            question: 'It says no GPS data was found — is that reliable?',
            answer: 'This tool reports exactly what EXIF GPS tags exist in the file. If none are found, the file genuinely has no embedded location. Note that photos already sent once through apps like Instagram or messaging services may have had EXIF stripped by that platform already.',
          },
          {
            question: 'Does removing metadata reduce image quality?',
            answer: 'The image is re-encoded through a canvas at 95% quality, so any visible difference is negligible. It does go through one additional lossy encoding pass, though, so it will not be pixel-for-pixel identical to the original.',
          },
        ]}
      />
    </div>
  );
}
