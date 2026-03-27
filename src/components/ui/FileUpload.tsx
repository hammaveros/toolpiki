'use client';

import { useCallback, useRef, useState } from 'react';
import { cn } from '@/lib/utils/cn';

interface FileUploadProps {
  accept?: string;
  multiple?: boolean;
  maxSize?: number; // MB
  onUpload?: (files: File[]) => void;
  onFileSelect?: (file: File) => void;
  className?: string;
  label?: string;
  description?: string;
}

export function FileUpload({
  accept = 'image/*',
  multiple = false,
  maxSize = 10,
  onUpload,
  onFileSelect,
  className,
  label = '파일을 드래그하거나 클릭하여 업로드',
  description,
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback(
    (files: FileList | null) => {
      if (!files || files.length === 0) return;

      const fileArray = Array.from(files);
      const maxBytes = maxSize * 1024 * 1024;

      // 파일 크기 검사
      const oversizedFiles = fileArray.filter((file) => file.size > maxBytes);
      if (oversizedFiles.length > 0) {
        setError(`파일 크기는 ${maxSize}MB를 초과할 수 없습니다.`);
        return;
      }

      setError(null);
      if (onFileSelect) {
        onFileSelect(fileArray[0]);
      }
      if (onUpload) {
        onUpload(multiple ? fileArray : [fileArray[0]]);
      }
    },
    [maxSize, multiple, onUpload, onFileSelect]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      handleFiles(e.dataTransfer.files);
    },
    [handleFiles]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  return (
    <div className={cn('w-full', className)}>
      <div
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={cn(
          'flex flex-col items-center justify-center gap-3 p-8 rounded-xl border-2 border-dashed cursor-pointer transition-colors',
          'min-h-[160px]',
          isDragging
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-950'
            : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500',
          'bg-gray-50 dark:bg-gray-800/50'
        )}
      >
        <UploadIcon className="w-10 h-10 text-gray-400" />
        <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
          {label}
        </p>
        {description && (
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
            {description}
          </p>
        )}
        <p className="text-xs text-gray-400 dark:text-gray-500">
          최대 {maxSize}MB
        </p>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={(e) => handleFiles(e.target.files)}
        className="hidden"
      />
      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
    </div>
  );
}

function UploadIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
      />
    </svg>
  );
}
