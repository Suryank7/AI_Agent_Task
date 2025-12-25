import { MemoryRule } from './types';

export interface InvoiceRecord {
    vendorName: string;
    invoiceNumber: string;
    date: string;
    id: string; // Internal ID
}

export interface StorageAdapter {
    load(): { memories: MemoryRule[], history: InvoiceRecord[] };
    save(memories: MemoryRule[], history: InvoiceRecord[]): void;
    clear(): void;
}

export class MemoryStore {
  private memories: MemoryRule[] = [];
  private history: InvoiceRecord[] = [];
  private adapter: StorageAdapter;

  constructor(adapter: StorageAdapter) {
      this.adapter = adapter;
      this.load();
  }

  public load() {
    const data = this.adapter.load();
    this.memories = data.memories || [];
    this.history = data.history || [];
  }

  public save() {
    this.adapter.save(this.memories, this.history);
  }

  public addMemory(memory: MemoryRule) {
    const existingIndex = this.memories.findIndex(m => 
      m.vendorName === memory.vendorName && 
      m.pattern === memory.pattern && 
      m.type === memory.type
    );

    if (existingIndex >= 0) {
      this.memories[existingIndex] = { ...this.memories[existingIndex], ...memory, usageCount: this.memories[existingIndex].usageCount + 1 };
    } else {
      this.memories.push(memory);
    }
    this.save();
  }
  
  public addInvoiceHistory(record: InvoiceRecord) {
      // Avoid exact internal duplicates
      if (this.history.some(h => h.id === record.id)) return;
      this.history.push(record);
      this.save();
  }
  
  public findDuplicate(vendor: string, number: string): InvoiceRecord | undefined {
      return this.history.find(h => h.vendorName === vendor && h.invoiceNumber === number);
  }

  public getMemoriesForVendor(vendorName: string): MemoryRule[] {
    return this.memories.filter(m => m.vendorName === vendorName);
  }

  public getAllMemories(): MemoryRule[] {
    return this.memories;
  }
  
  public clear() {
      this.memories = [];
      this.history = [];
      this.adapter.clear();
  }
}
