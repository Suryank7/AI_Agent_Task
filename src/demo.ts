import { MemoryStore } from './memory_store';
import { InvoiceProcessor } from './processor';
import { sampleInvoices } from '../data/sample_invoices';
import type { Invoice } from './types';
import { FileAdapter } from './file_adapter';

async function runDemo() {
  const store = new MemoryStore(new FileAdapter());
  store.clear(); 
  
  const processor = new InvoiceProcessor(store);

  console.log("=== SCENARIO 1: Supplier GmbH (First Run) ===");
  const invoice1 = sampleInvoices[0];
  if (!invoice1) throw new Error("Invoice 1 missing");
  
  const result1 = await processor.process(invoice1);
  console.log("Result 1:", JSON.stringify(result1, null, 2));

  // Simulating User Learning
  console.log("\n=== USER ACTION: Correcting Invoice 1 ===");
  // User says: "Leistungsdatum is the service date"
  const correctedInvoice1 = JSON.parse(JSON.stringify(invoice1)) as Invoice;
  if (!correctedInvoice1.lineItems[0]) throw new Error("Line items missing");
  correctedInvoice1.lineItems[0].serviceDate = '2023-09-28'; 
  
  await processor.learn({
      originalInvoiceId: invoice1.id,
      correctedInvoice: correctedInvoice1,
      userComments: "Fixed service date extraction"
  });

  console.log("\n=== SCENARIO 2: Supplier GmbH (Second Run - Learned) ===");
  const invoice2 = sampleInvoices[1];
  if (!invoice2) throw new Error("Invoice 2 missing");
  
  const result2 = await processor.process(invoice2);
  console.log("Result 2:", JSON.stringify(result2, null, 2));

  console.log("\n=== SCENARIO 3: Parts AG (Tax Issue) ===");
  const invoice3 = sampleInvoices[2];
  if (!invoice3) throw new Error("Invoice 3 missing");

  const result3 = await processor.process(invoice3);
  console.log("Result 3:", JSON.stringify(result3, null, 2));
  
  // Learn tax correction
  await processor.learn({
      originalInvoiceId: invoice3.id,
      correctedInvoice: invoice3, 
      userComments: "Tax inclusive detection triggered"
  });

  console.log("\n=== SCENARIO 4: Freight & Co (SKU Mapping) ===");
  const invoice4 = sampleInvoices[3];
  if (!invoice4) throw new Error("Invoice 4 missing");

  // First run
  console.log("--- First Pass ---");
  const result4a = await processor.process(invoice4);
  console.log("Result 4a (Needs Review):", result4a.requiresHumanReview);
  
  // Learn SKU
  const correctedInvoice4 = JSON.parse(JSON.stringify(invoice4)) as Invoice;
  if (!correctedInvoice4.lineItems[0]) throw new Error("Line items missing");

  correctedInvoice4.lineItems[0].sku = 'FREIGHT-SKU-001';
  await processor.learn({
      originalInvoiceId: invoice4.id,
      correctedInvoice: correctedInvoice4,
      userComments: "Map Seefracht to SKU"
  });
  
  // Process again to see it applied (simulating next invoice from same vendor)
  console.log("--- Second Pass (Simulated Next Invoice) ---");
  const result4b = await processor.process(invoice4); 
  console.log("Result 4b (SKU Mapped):", JSON.stringify(result4b.proposedCorrections, null, 2));

  console.log("\n=== SCENARIO 5: Confidence Decay (Bonus) ===");
  // Simulate user unhappy with the SKU mapping
  await processor.learn({
      originalInvoiceId: invoice4.id,
      correctedInvoice: correctedInvoice4,
      userComments: "Penalty: SKU mapping was wrong (Simulation)"
  });
  
  // Check memory state via public getter or visualization script
  const memories = processor.getStore().getMemoriesForVendor('Freight & Co');
  console.log("Freight & Co Confidence after penalty:", memories[0]?.confidence);

}

runDemo().catch(console.error);
