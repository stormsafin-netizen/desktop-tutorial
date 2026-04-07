'use client';

import Link from 'next/link';
import type { ValidationRecordSummary } from '@/types/validation';

interface Props {
  records: ValidationRecordSummary[];
}

function StatusBadge({ status, result }: { status: string; result: string | null }) {
  if (status === 'processing') {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-yellow-100 text-yellow-800">
        <span className="animate-spin">⟳</span> 処理中
      </span>
    );
  }
  if (status === 'error') {
    return (
      <span className="px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-600">
        エラー
      </span>
    );
  }
  if (result === 'PASS') {
    return (
      <span className="px-2 py-0.5 rounded-full text-xs bg-green-100 text-green-800 font-bold">
        ✓ PASS
      </span>
    );
  }
  return (
    <span className="px-2 py-0.5 rounded-full text-xs bg-red-100 text-red-800 font-bold">
      ✗ FAIL
    </span>
  );
}

export default function RecordList({ records }: Props) {
  if (records.length === 0) {
    return (
      <div className="text-center py-16 text-gray-400">
        <p className="text-4xl mb-3">📋</p>
        <p className="text-sm">まだ検証記録がありません</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-100">
      {records.map((record) => (
        <Link
          key={record.id}
          href={`/validate/${record.id}`}
          className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors group"
        >
          <div className="flex items-center gap-3 min-w-0">
            <span className="text-gray-400 text-lg">📄</span>
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-800 truncate group-hover:text-blue-600">
                {record.filename}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                {new Date(record.created_at).toLocaleString('ja-JP')}
                {record.page_count != null && ` · ${record.page_count}ページ`}
              </p>
            </div>
          </div>
          <StatusBadge status={record.status} result={record.overall_result} />
        </Link>
      ))}
    </div>
  );
}
