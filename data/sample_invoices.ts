import { Invoice } from '../src/types';

export const sampleInvoices: Invoice[] = [
  // Scene 1: Supplier GmbH (Initial) - Missing Service Date
  {
    id: 'INV-A-001',
    vendorName: 'Supplier GmbH',
    invoiceNumber: 'INV-2024-001',
    invoiceDate: '12.01.2024',
    totalAmount: 2975.0,
    currency: 'EUR',
    rawText: "Rechnungsnr: INV-2024-001\nLeistungsdatum: 01.01.2024\nBestellnr: PO-A-050",
    lineItems: [
        { description: 'Widget', quantity: 100, unitPrice: 25.0, total: 2500.0, sku: 'WIDGET-001' }
    ]
  },
  // Scene 2: Supplier GmbH (Future) - Should apply learned rule
  {
    id: 'INV-A-002',
    vendorName: 'Supplier GmbH',
    invoiceNumber: 'INV-2024-002',
    invoiceDate: '18.01.2024',
    totalAmount: 2826.25,
    currency: 'EUR',
    rawText: "Rechnungsnr: INV-2024-002\nLeistungsdatum: 15.01.2024\nBestellnr: PO-A-050\nHinweis: Teillieferung",
    lineItems: [
        { description: 'Widget', quantity: 95, unitPrice: 25.0, total: 2375.0, sku: 'WIDGET-001' }
    ]
  },
  // Extra Supplier GmbH
  {
    id: 'INV-A-003',
    vendorName: 'Supplier GmbH',
    invoiceNumber: 'INV-2024-003',
    invoiceDate: '25.01.2024',
    totalAmount: 595.0,
    currency: 'EUR',
    rawText: "Rechnungsnr: INV-2024-003\nLeistungsdatum: 20.01.2024\nBestellung: (keine Angabe)\nReferenz: Lieferung Januar",
    lineItems: [
        { description: 'Widget Pro', quantity: 20, unitPrice: 25.0, total: 500.0, sku: 'WIDGET-002' }
    ]
  },
    {
    id: 'INV-A-004',
    vendorName: 'Supplier GmbH',
    invoiceNumber: 'INV-2024-003', // Note: Same invoice number as A-003 -> Good for Duplicate Detection
    invoiceDate: '26.01.2024',
    totalAmount: 595.0,
    currency: 'EUR',
    rawText: "Rechnungsnr: INV-2024-003\nLeistungsdatum: 20.01.2024\nHinweis: erneute Zusendung",
    lineItems: [
        { description: 'Widget Pro', quantity: 20, unitPrice: 25.0, total: 500.0, sku: 'WIDGET-002' }
    ]
  },

  // Scene 3: Parts AG - Tax Inclusive
  {
    id: 'INV-B-001',
    vendorName: 'Parts AG',
    invoiceNumber: 'PA-7781',
    invoiceDate: '05-02-2024',
    totalAmount: 2400.0,
    currency: 'EUR',
    rawText: "Invoice No: PA-7781\nPO: PO-B-110\nPrices incl. VAT (MwSt. inkl.)\nTotal: 2380.00 EUR",
    lineItems: [
        { description: 'Bolts', quantity: 200, unitPrice: 10.0, total: 2000.0, sku: 'BOLT-99' }
    ]
  },
  {
    id: 'INV-B-002',
    vendorName: 'Parts AG',
    invoiceNumber: 'PA-7799',
    invoiceDate: '20-02-2024',
    totalAmount: 1785.0,
    currency: 'EUR',
    rawText: "Invoice No: PA-7799\nPO: PO-B-110\nMwSt. inkl.",
    lineItems: [
        { description: 'Bolts', quantity: 150, unitPrice: 10.0, total: 1500.0, sku: 'BOLT-99' }
    ]
  },
  {
    id: 'INV-B-003',
    vendorName: 'Parts AG',
    invoiceNumber: 'PA-7810',
    invoiceDate: '03-03-2024',
    totalAmount: 1190.0,
    currency: '', // Explicitly missing in data (fields.currency: null) but rawText has "Currency: EUR" -> good for memory correction
    rawText: "Invoice No: PA-7810\nPO: PO-B-111\nCurrency: EUR",
    lineItems: [
        { description: 'Nuts', quantity: 500, unitPrice: 2.0, total: 1000.0, sku: 'NUT-10' }
    ]
  },
  {
    id: 'INV-B-004',
    vendorName: 'Parts AG',
    invoiceNumber: 'PA-7810',
    invoiceDate: '04-03-2024',
    totalAmount: 1190.0,
    currency: 'EUR',
    rawText: "Duplicate submission of PA-7810",
    lineItems: [
        { description: 'Nuts', quantity: 500, unitPrice: 2.0, total: 1000.0, sku: 'NUT-10' }
    ]
  },

  // Scene 4: Freight & Co - Skonto & SKU
  {
    id: 'INV-C-001',
    vendorName: 'Freight & Co',
    invoiceNumber: 'FC-1001',
    invoiceDate: '01.03.2024',
    totalAmount: 1190.0,
    currency: 'EUR',
    rawText: "Invoice: FC-1001\nPO: PO-C-900\n2% Skonto if paid within 10 days",
    lineItems: [
        { description: 'Transport charges', quantity: 1, unitPrice: 1000.0, total: 1000.0, sku: undefined }
    ]
  },
  {
    id: 'INV-C-002', // Perfect for SKU mapping "Seefracht"
    vendorName: 'Freight & Co',
    invoiceNumber: 'FC-1002',
    invoiceDate: '10.03.2024',
    totalAmount: 1190.0,
    currency: 'EUR',
    rawText: "Invoice: FC-1002\nPO: PO-C-900\nService: Seefracht",
    lineItems: [
        { description: 'Seefracht / Shipping', quantity: 1, unitPrice: 1000.0, total: 1000.0, sku: undefined }
    ]
  },
  {
    id: 'INV-C-003',
    vendorName: 'Freight & Co',
    invoiceNumber: 'FC-1003',
    invoiceDate: '20.03.2024',
    totalAmount: 1213.8,
    currency: 'EUR',
    rawText: "Invoice: FC-1003\nPO: PO-C-901\nSlight fuel surcharge applied",
    lineItems: [
        { description: 'Transport charges', quantity: 1, unitPrice: 1020.0, total: 1020.0, sku: undefined }
    ]
  },
  {
    id: 'INV-C-004',
    vendorName: 'Freight & Co',
    invoiceNumber: 'FC-1004',
    invoiceDate: '28.03.2024',
    totalAmount: 1213.8,
    currency: 'EUR',
    rawText: "Invoice: FC-1004\nPO: PO-C-901\nNote: delivery confirmation pending",
    lineItems: [
        { description: 'Transport charges', quantity: 1, unitPrice: 1020.0, total: 1020.0, sku: undefined }
    ]
  }
];
