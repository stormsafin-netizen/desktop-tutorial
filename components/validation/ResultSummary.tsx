import type { ValidationResult } from '@/types/validation';
import RuleResultCard from './RuleResultCard';

interface Props {
  result: ValidationResult;
  filename: string;
}

export default function ResultSummary({ result, filename }: Props) {
  const isPassed = result.overall_result === 'PASS';
  const { document_metadata: meta, rules } = result;
  const ruleEntries = Object.entries(rules) as [string, (typeof rules)[keyof typeof rules]][];

  return (
    <div className="space-y-6">
      {/* Overall result banner */}
      <div
        className={`rounded-xl p-6 text-center ${
          isPassed ? 'bg-green-600' : 'bg-red-600'
        } text-white`}
      >
        <p className="text-4xl font-bold mb-1">{isPassed ? '✓ PASS' : '✗ FAIL'}</p>
        <p className="text-sm opacity-80">{filename}</p>
        <div className="mt-3 flex justify-center gap-6 text-sm opacity-90">
          {meta.detected_product_name && (
            <span>品名: {meta.detected_product_name}</span>
          )}
          {meta.detected_lot_number && (
            <span>ロット: {meta.detected_lot_number}</span>
          )}
          {meta.detected_date && <span>製造日: {meta.detected_date}</span>}
          <span>{meta.total_pages_analyzed}ページ解析</span>
        </div>
      </div>

      {/* Rule cards */}
      <div className="grid grid-cols-1 gap-4">
        {ruleEntries.map(([key, rule]) => (
          <RuleResultCard key={key} ruleKey={key} rule={rule} />
        ))}
      </div>
    </div>
  );
}
