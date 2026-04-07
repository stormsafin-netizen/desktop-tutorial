'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import type { ValidationResult } from '@/types/validation';

interface Props {
  onResult?: (recordId: string, result: ValidationResult) => void;
}

export default function UploadForm({ onResult }: Props) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState<'idle' | 'uploading' | 'analyzing' | 'done' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped?.type === 'application/pdf') setFile(dropped);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) return;
    setErrorMessage('');

    const token = localStorage.getItem('auth_token');
    if (!token) {
      router.push('/login');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    setStage('uploading');
    setProgress(0);

    // Use XHR for upload progress tracking
    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/api/validate');
    xhr.setRequestHeader('Authorization', `Bearer ${token}`);

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        setProgress(Math.round((event.loaded / event.total) * 50));
      }
    };

    xhr.onreadystatechange = () => {
      if (xhr.readyState !== XMLHttpRequest.DONE) return;

      if (xhr.status === 201) {
        setProgress(100);
        setStage('done');
        const data = JSON.parse(xhr.responseText);
        if (onResult) {
          onResult(data.recordId, data.results);
        } else {
          router.push(`/validate/${data.recordId}`);
        }
      } else {
        setStage('error');
        try {
          const data = JSON.parse(xhr.responseText);
          setErrorMessage(data.error ?? '検証処理に失敗しました');
        } catch {
          setErrorMessage('検証処理に失敗しました');
        }
      }
    };

    // Simulate analyzing progress after upload
    xhr.upload.onload = () => {
      setStage('analyzing');
      let p = 50;
      const interval = setInterval(() => {
        p = Math.min(95, p + 3);
        setProgress(p);
        if (p >= 95) clearInterval(interval);
      }, 800);
    };

    xhr.send(formData);
  }

  const isLoading = stage === 'uploading' || stage === 'analyzing';

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Drop zone */}
      <div
        className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-colors ${
          dragging
            ? 'border-blue-400 bg-blue-50'
            : file
            ? 'border-green-400 bg-green-50'
            : 'border-gray-300 hover:border-blue-300 hover:bg-blue-50'
        }`}
        onClick={() => !isLoading && inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
      >
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && setFile(e.target.files[0])}
          disabled={isLoading}
        />
        {file ? (
          <div>
            <p className="text-2xl mb-2">📄</p>
            <p className="font-semibold text-gray-800">{file.name}</p>
            <p className="text-sm text-gray-500 mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
            {!isLoading && (
              <p className="text-xs text-blue-600 mt-2">クリックして変更</p>
            )}
          </div>
        ) : (
          <div>
            <p className="text-4xl mb-3">📁</p>
            <p className="font-semibold text-gray-700">PDFをドロップ、またはクリックして選択</p>
            <p className="text-sm text-gray-400 mt-1">製造指図記録書 (最大50MB)</p>
          </div>
        )}
      </div>

      {/* Progress bar */}
      {isLoading && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-600">
            <span>{stage === 'uploading' ? 'アップロード中...' : 'Claude AIで解析中...'}</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          {stage === 'analyzing' && (
            <p className="text-xs text-gray-500 text-center">
              4つのGMPルールを検証しています。数十秒かかる場合があります…
            </p>
          )}
        </div>
      )}

      {errorMessage && (
        <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-700">
          {errorMessage}
        </div>
      )}

      <button
        type="submit"
        disabled={!file || isLoading}
        className="w-full bg-blue-600 text-white rounded-lg py-3 font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isLoading ? '検証中...' : '検証開始'}
      </button>
    </form>
  );
}
