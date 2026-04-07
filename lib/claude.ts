import Anthropic from '@anthropic-ai/sdk';
import { z } from 'zod';
import type { Base64Image } from './pdf';
import type { ValidationResult } from '@/types/validation';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// ── Zod schema for runtime validation of Claude's JSON response ──────────────

const FindingSchema = z.object({
  page: z.number(),
  field_name: z.string(),
  issue: z.string(),
});

const ToleranceFindingSchema = FindingSchema.extend({
  spec_range: z.string(),
  actual_value: z.string(),
});

const RuleDetailSchema = z.object({
  result: z.enum(['PASS', 'FAIL']),
  findings: z.array(FindingSchema),
  summary: z.string(),
});

const ToleranceRuleDetailSchema = z.object({
  result: z.enum(['PASS', 'FAIL']),
  findings: z.array(ToleranceFindingSchema),
  summary: z.string(),
});

const ValidationResultSchema = z.object({
  overall_result: z.enum(['PASS', 'FAIL']),
  rules: z.object({
    blank_handling: RuleDetailSchema,
    tolerance_check: ToleranceRuleDetailSchema,
    diagonal_strikethrough: RuleDetailSchema,
    comment_accuracy: RuleDetailSchema,
  }),
  document_metadata: z.object({
    detected_product_name: z.string(),
    detected_lot_number: z.string(),
    detected_date: z.string(),
    total_pages_analyzed: z.number(),
  }),
});

// ── System prompt ─────────────────────────────────────────────────────────────

const SYSTEM_PROMPT = `あなたは日本の医薬品製造所のGMP（Good Manufacturing Practice）文書監査の専門家です。
製造指図記録書（バッチレコード）の画像を解析し、以下4つのルールに基づいて検証を行ってください。

## 検証ルール

### 1. 空欄処理 (blank_handling)
- 記入が不要な欄・項目には「N/A」「ー」「/」「なし」などの記載か、斜線が引かれているべきです
- 何も記載されていない空欄（斜線もなし）はGMP不適合です
- 指摘する場合: ページ番号・項目名・問題内容を具体的に記載してください

### 2. 許容範囲チェック (tolerance_check)
- 規格値・許容範囲が記載されている項目（例: "95.0〜105.0%", "25±2°C", "300±5g"）を特定してください
- 実績値が許容範囲外である場合はFAILです
- 指摘する場合: ページ番号・項目名・規格範囲・実測値をすべて記載してください

### 3. 斜線処理 (diagonal_strikethrough)
- 表や記録欄の未使用スペース（行や列）には斜線を引く必要があります
- 未使用スペースに斜線がない場合はGMP不適合です
- 空欄処理の斜線とは区別して判定してください

### 4. コメント正確性 (comment_accuracy)
- 備考・特記事項・コメント欄の内容を評価してください
- 判読不能な記載、不完全な文章、矛盾する内容、根拠不明の記載はFAILです
- コメント欄が存在しない場合はPASSとしてください

## 出力形式
以下のJSONスキーマに厳密に従って応答してください。JSON以外の文字は一切含めないでください。

{
  "overall_result": "PASS" または "FAIL",
  "rules": {
    "blank_handling": {
      "result": "PASS" または "FAIL",
      "findings": [
        { "page": <ページ番号>, "field_name": "<項目名>", "issue": "<問題の説明>" }
      ],
      "summary": "<概要（日本語）>"
    },
    "tolerance_check": {
      "result": "PASS" または "FAIL",
      "findings": [
        {
          "page": <ページ番号>,
          "field_name": "<項目名>",
          "spec_range": "<規格範囲>",
          "actual_value": "<実測値>",
          "issue": "<問題の説明>"
        }
      ],
      "summary": "<概要（日本語）>"
    },
    "diagonal_strikethrough": {
      "result": "PASS" または "FAIL",
      "findings": [
        { "page": <ページ番号>, "field_name": "<項目・エリア名>", "issue": "<問題の説明>" }
      ],
      "summary": "<概要（日本語）>"
    },
    "comment_accuracy": {
      "result": "PASS" または "FAIL",
      "findings": [
        { "page": <ページ番号>, "field_name": "<コメント欄の場所>", "issue": "<問題の説明>" }
      ],
      "summary": "<概要（日本語）>"
    }
  },
  "document_metadata": {
    "detected_product_name": "<品名（検出できない場合は空文字）>",
    "detected_lot_number": "<ロット番号（検出できない場合は空文字）>",
    "detected_date": "<製造日（検出できない場合は空文字）>",
    "total_pages_analyzed": <解析したページ数>
  }
}`;

// ── Main export ───────────────────────────────────────────────────────────────

export async function analyzeDocument(pageImages: Base64Image[]): Promise<ValidationResult> {
  const imageContent: Anthropic.ImageBlockParam[] = pageImages.map((img) => ({
    type: 'image',
    source: {
      type: 'base64',
      media_type: 'image/png',
      data: img.data,
    },
  }));

  const pageLabels = pageImages.map((img) => ({
    type: 'text' as const,
    text: `--- ページ ${img.page} ---`,
  }));

  // Interleave page labels with images
  const userContent: Anthropic.ContentBlockParam[] = [];
  for (let i = 0; i < pageImages.length; i++) {
    userContent.push(pageLabels[i]);
    userContent.push(imageContent[i]);
  }
  userContent.push({
    type: 'text',
    text: '上記の製造指図記録書を解析し、指定されたJSONスキーマで検証結果を返してください。',
  });

  const response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 4096,
    temperature: 0,
    system: SYSTEM_PROMPT,
    messages: [
      { role: 'user', content: userContent },
      // Prefill with "{" to force JSON output
      { role: 'assistant', content: '{' },
    ],
  });

  const rawText =
    '{' + (response.content[0].type === 'text' ? response.content[0].text : '');

  let parsed: unknown;
  try {
    parsed = JSON.parse(rawText);
  } catch {
    throw new Error(`Claudeのレスポンスが不正なJSONです: ${rawText.slice(0, 200)}`);
  }

  const validated = ValidationResultSchema.safeParse(parsed);
  if (!validated.success) {
    throw new Error(`Claudeのレスポンスがスキーマに合致しません: ${validated.error.message}`);
  }

  return validated.data as ValidationResult;
}
