'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import ResultSummary from '@/components/validation/ResultSummary';
import type { ValidationRecord } from '@/types/validation';

export default function RecordDetailPage() {
  const router = useRouter();
  const { recordId } = useParams<{ recordId: string }>();
  const [record, setRecord] = useState<ValidationRecord & { signedUrl?: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (!token) { router.push('/login'); return; }

    fetch(`/api/records/${recordId}`, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => {
        if (res.status === 401) { router.push('/login'); return null; }
        if (res.status === 404) { setError('記録が見つかりません'); return null; }
        return res.json();
      })
      .then((data) => { if (data) setRecord(data); })
      .catch(() => setError('記録の取得に失敗しました'))
      .finally(() => setLoading(false));
  }, [recordId, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400 text-sm">
        読み込み中...
      </div>
    );
  }

  if (error || !record) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || '記録が見つかりません'}</p>
          <Link href="/dashboard" className="text-blue-600 text-sm hover:underline">
            ダッシュボードへ戻る
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="text-gray-400 hover:text-gray-600 text-sm">
            ← 戻る
          </Link>
          <h1 className="font-bold text-gray-900 text-sm truncate max-w-xs">{record.filename}</h1>
        </div>
        {record.signedUrl && (
          <a
            href={record.signedUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-600 hover:underline"
          >
            元PDFを開く ↗
          </a>
        )}
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8">
        {record.status === 'processing' && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 text-center text-yellow-700 text-sm">
            解析中です。しばらくお待ちください…
          </div>
        )}

        {record.status === 'error' && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center text-red-700 text-sm">
            エラーが発生しました: {record.error_message}
          </div>
        )}

        {record.status === 'complete' && record.results && (
          <ResultSummary result={record.results} filename={record.filename} />
        )}
      </main>
    </div>
  );
}
