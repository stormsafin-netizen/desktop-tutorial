'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import RecordList from '@/components/dashboard/RecordList';
import type { ValidationRecordSummary } from '@/types/validation';

export default function DashboardPage() {
  const router = useRouter();
  const [records, setRecords] = useState<ValidationRecordSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      router.push('/login');
      return;
    }

    fetch('/api/records', { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => {
        if (res.status === 401) { router.push('/login'); return null; }
        return res.json();
      })
      .then((data) => {
        if (data) setRecords(data.records ?? []);
      })
      .catch(() => setError('記録の取得に失敗しました'))
      .finally(() => setLoading(false));
  }, [router]);

  function handleLogout() {
    localStorage.removeItem('auth_token');
    router.push('/login');
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <h1 className="font-bold text-gray-900">製造指図記録書 検証システム</h1>
        <div className="flex items-center gap-3">
          <Link
            href="/validate"
            className="bg-blue-600 text-white text-sm px-4 py-1.5 rounded-lg hover:bg-blue-700 transition-colors"
          >
            + 新規検証
          </Link>
          <button
            onClick={handleLogout}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            ログアウト
          </button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        <h2 className="font-semibold text-lg mb-4">検証履歴</h2>

        {loading ? (
          <div className="text-center py-16 text-gray-400 text-sm">読み込み中...</div>
        ) : error ? (
          <div className="text-red-600 text-sm">{error}</div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <RecordList records={records} />
          </div>
        )}
      </main>
    </div>
  );
}
