export type RuleResult = 'PASS' | 'FAIL';
export type RecordStatus = 'processing' | 'complete' | 'error';

export interface Finding {
  page: number;
  field_name: string;
  issue: string;
}

export interface ToleranceFinding extends Finding {
  spec_range: string;
  actual_value: string;
}

export interface RuleDetail {
  result: RuleResult;
  findings: Finding[];
  summary: string;
}

export interface ToleranceRuleDetail {
  result: RuleResult;
  findings: ToleranceFinding[];
  summary: string;
}

export interface ValidationRules {
  blank_handling: RuleDetail;
  tolerance_check: ToleranceRuleDetail;
  diagonal_strikethrough: RuleDetail;
  comment_accuracy: RuleDetail;
}

export interface DocumentMetadata {
  detected_product_name: string;
  detected_lot_number: string;
  detected_date: string;
  total_pages_analyzed: number;
}

export interface ValidationResult {
  overall_result: RuleResult;
  rules: ValidationRules;
  document_metadata: DocumentMetadata;
}

export interface ValidationRecord {
  id: string;
  user_id: number;
  filename: string;
  storage_path: string;
  status: RecordStatus;
  overall_result: RuleResult | null;
  results: ValidationResult | null;
  error_message: string | null;
  page_count: number | null;
  created_at: string;
}

export interface ValidationRecordSummary {
  id: string;
  filename: string;
  status: RecordStatus;
  overall_result: RuleResult | null;
  page_count: number | null;
  created_at: string;
}
