'use client';

import { useState } from 'react';
import type { RuleDetail, ToleranceRuleDetail } from '@/types/validation';

const RULE_LABELS: Record<string, string> = {
  blank_handling: '空欄処理',
  tolerance_check: '許容範囲チェック',
  diagonal_strikethrough: '斜線処理',
  comment_accuracy: 'コメント正確性',
};

const RULE_DESCRIPTIONS: Record<string, string> = {
  blank_handling: '未記入欄への適切な処理（N/A・斜線等）',
  tolerance_check: '実績値が規格範囲内に収まっているか',
  diagonal_strikethrough: '未使用スペースへの斜線引き',
  comment_accuracy: 'コメント欄の正確・完全な記載',
};

interface Props {
  ruleKey: string;
  rule: RuleDetail | ToleranceRuleDetail;
}

export default function RuleResultCard({ ruleKey, rule }: Props) {
  const [expanded, setExpanded] = useState(rule.result === 'FAIL');
  const isPassed = rule.result === 'PASS';

  return (
    <div className={`rounded-xl border-2 ${isPassed ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
      <button
        className="w-full text-left p-4 flex items-center justify-between"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-3">
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
              isPassed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}
          >
            {isPassed ? '✓ PASS' : '✗ FAIL'}
          </span>
          <div>
            <p className="font-semibold text-sm">{RULE_LABELS[ruleKey] ?? ruleKey}</p>
            <p className="text-xs text-gray-500 mt-0.5">{RULE_DESCRIPTIONS[ruleKey]}</p>
          </div>
        </div>
        <span className="text-gray-400 text-sm">{expanded ? '▲' : '▼'}</span>
      </button>

      {expanded && (
        <div className="px-4 pb-4 space-y-3">
          <p className="text-sm text-gray-700 bg-white rounded-lg px-3 py-2 border border-gray-200">
            {rule.summary}
          </p>

          {rule.findings.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                指摘事項 ({rule.findings.length}件)
              </p>
              {rule.findings.map((finding, i) => (
                <div key={i} className="bg-white rounded-lg border border-red-200 px-3 py-2 text-sm">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs bg-gray-100 px-1.5 py-0.5 rounded text-gray-600 font-mono">
                      p.{finding.page}
                    </span>
                    <span className="font-medium text-gray-800">{finding.field_name}</span>
                  </div>
                  <p className="text-gray-600 text-xs">{finding.issue}</p>
                  {'spec_range' in finding && (
                    <div className="mt-1.5 flex gap-3 text-xs">
                      <span className="text-gray-500">
                        規格: <span className="font-mono text-gray-700">{finding.spec_range}</span>
                      </span>
                      <span className="text-red-600">
                        実測: <span className="font-mono font-semibold">{finding.actual_value}</span>
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
