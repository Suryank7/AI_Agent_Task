import { MemoryStore, StorageAdapter } from './memory_store';
import { InvoiceProcessor } from './processor';
import { sampleInvoices } from '../data/sample_invoices';
import { Invoice, MemoryRule } from './types';

// Implementation of LocalStorageAdapter here to keep it browser-only
class LocalStorageAdapter implements StorageAdapter {
    private key = 'invoice_memory_rules';

    load(): { memories: MemoryRule[], history: any[] } {
        const data = localStorage.getItem(this.key);
        if (!data) return { memories: [], history: [] };
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed)) return { memories: parsed, history: [] };
        return parsed;
    }

    save(memories: MemoryRule[], history: any[]): void {
        localStorage.setItem(this.key, JSON.stringify({ memories, history }));
    }
    
    clear(): void {
        localStorage.removeItem(this.key);
    }
}

const store = new MemoryStore(new LocalStorageAdapter());
const processor = new InvoiceProcessor(store);

// UI Elements
const outputDiv = document.getElementById('output')!;
const memoryTableContainer = document.getElementById('memoryTableContainer')!;
let lastProcessedInvoice: Invoice | null = null;
let lastResult: any = null;

function log(msg: string | object) {
    const text = typeof msg === 'string' ? msg : JSON.stringify(msg, null, 2);
    outputDiv.innerText = text;
}

function renderMemoryTable() {
    const memories = store.getAllMemories();
    if (memories.length === 0) {
        memoryTableContainer.innerHTML = '<p style="color: #6b7280; font-style: italic;">No memories stored yet.</p>';
        return;
    }
    
    let html = `<table><thead><tr><th>Vendor</th><th>Pattern</th><th>Action</th><th>Value</th><th>Conf</th></tr></thead><tbody>`;
    memories.forEach(m => {
        html += `<tr>
            <td>${m.vendorName}</td>
            <td>${m.pattern}</td>
            <td>${m.action}</td>
            <td>${m.value}</td>
            <td>${m.confidence.toFixed(2)}</td>
        </tr>`;
    });
    html += '</tbody></table>';
    memoryTableContainer.innerHTML = html;
}

async function runScenario(index: number) {
    const invoice = sampleInvoices[index];
    if (!invoice) return log("Invalid Invoice Index");
    
    log(`Processing Invoice: ${invoice.vendorName} (${invoice.id})...`);
    
    const result = await processor.process(invoice);
    lastProcessedInvoice = invoice;
    lastResult = result;
    
    log(result);
}

// Event Listeners
document.getElementById('clearMemories')?.addEventListener('click', () => {
    store.clear();
    renderMemoryTable();
    log("Memory cleared.");
});

document.getElementById('runScenario1')?.addEventListener('click', () => runScenario(0)); // Supplier GmbH - First run
document.getElementById('runScenario2')?.addEventListener('click', () => runScenario(1)); // Supplier GmbH - Second run

// Special handling for the logic
// Scenario 3 (Tax) is index 2
// Scenario 3 (Tax) is index 4 (INV-B-001) in the new 12-item list
document.getElementById('runScenario3')?.addEventListener('click', () => runScenario(4));
// Scenario 4 (Freight) is index 9 (INV-C-002) which has "Seefracht"
document.getElementById('runScenario4')?.addEventListener('click', () => runScenario(9));

document.getElementById('correctInvoice')?.addEventListener('click', async () => {
    if (!lastProcessedInvoice) return log("Run a scenario first!");

    // Simple heuristic to apply the "Right" correction based on vendor
    const vendor = lastProcessedInvoice.vendorName;
    let comment = "Manual correction";
    const corrected = JSON.parse(JSON.stringify(lastProcessedInvoice));

    if (vendor === 'Supplier GmbH') {
        if (!corrected.lineItems[0]) corrected.lineItems = [{}];
        // Updated to match INV-A-001's raw text "01.01.2024"
        corrected.lineItems[0].serviceDate = '2024-01-01';
        comment = "Fixed service date extraction";
    } else if (vendor === 'Parts AG') {
         comment = "Tax inclusive detection triggered";
    } else if (vendor === 'Freight & Co') {
         if (!corrected.lineItems[0]) corrected.lineItems = [{}];
         corrected.lineItems[0].sku = 'FREIGHT-SKU-001';
         comment = "Map Seefracht to SKU";
    }

    await processor.learn({
        originalInvoiceId: lastProcessedInvoice.id,
        correctedInvoice: corrected,
        userComments: comment
    });

    renderMemoryTable();
    log(`Learned from correction for ${vendor}!\nComment: ${comment}`);
});

// Init
renderMemoryTable();
