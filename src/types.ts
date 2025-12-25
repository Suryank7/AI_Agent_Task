
export interface Invoice {
  id: string;
  vendorName: string;
  invoiceNumber: string;
  invoiceDate: string; // YYYY-MM-DD
  dueDate?: string;
  totalAmount: number;
  currency: string;
  lineItems: LineItem[];
  rawText: string; // Full OCR text for recovery
}

export interface LineItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
  sku?: string;
  serviceDate?: string;
}

export type MemoryType = 'vendor' | 'correction' | 'resolution';

export interface MemoryRule {
  id: string;
  vendorName: string;
  type: MemoryType;
  pattern: string; // Regex or keyphrase
  action: string; // e.g., "replace_date", "adjust_tax"
  value: string; // The value to apply or logic parameter
  confidence: number; // 0.0 to 1.0
  usageCount: number;
  lastUsed: string; // ISO Date
  explanation: string;
}

export interface ProcessingResult {
  normalizedInvoice: Invoice;
  proposedCorrections: string[];
  requiresHumanReview: boolean;
  reasoning: string;
  confidenceScore: number;
  memoryUpdates: string[]; // Descriptions of potential new memories
  auditTrail: AuditEntry[];
}

export interface AuditEntry {
  step: 'recall' | 'apply' | 'decide' | 'learn';
  timestamp: string;
  details: string;
}

export interface CorrectionFeedback {
  originalInvoiceId: string;
  correctedInvoice: Invoice; // The "truth" from human
  userComments?: string;
}
