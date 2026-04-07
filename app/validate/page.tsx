import Link from 'next/link';
import UploadForm from '@/components/validation/UploadForm';

export default function ValidatePage() {
  return (
    <div className="min-h-screen">
      <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3">
        <Link href="/dashboard" className="text-gray-400 hover:text-gray-600 text-sm">
          ← 戻る
        </Link>
        <h1 className="font-bold text-gray-900">新規検証</h1>
      </header>

      <main className="max-w-xl mx-auto px-4 py-10">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="font-semibold text-base mb-1">製造指図記録書をアップロード</h2>
          <p className="text-sm text-gray-500 mb-6">
            PDFをアップロードすると、以下4つのGMPルールを自動検証します。
          </p>

          <div className="grid grid-cols-2 gap-2 mb-6 text-xs text-gray-600">
            {[
              ['空欄処理', '未記入欄の適切な処置'],
              ['許容範囲', '実績値が規格内か'],
              ['斜線処理', '未使用スペースへの斜線'],
              ['コメント正確性', '備考欄の正確な記載'],
            ].map(([label, desc]) => (
              <div key={label} className="bg-gray-50 rounded-lg px-3 py-2">
                <p className="font-medium text-gray-700">{label}</p>
                <p className="text-gray-500 mt-0.5">{desc}</p>
              </div>
            ))}
          </div>

          <UploadForm />
        </div>
      </main>
    </div>
  );
}
