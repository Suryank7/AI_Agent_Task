# 🧠 Memory Layer for Document Automation

> **Turn your invoice processing "Smart" by enabling it to learn from every human correction.**

## 🚀 The Problem
Traditional OCR systems are amnesiac—they make the same mistakes over and over. When a human corrects "Leistungsdatum" to "Service Date", that knowledge is lost immediately. We built a **Memory Layer** that sits on top of extraction to capture these insights and automate future decisions.

## ✨ Key Features
- **Vendor Memory**: Learns structural patterns (e.g., date formats, tax behaviors) specific to each supplier.
- **Correction Memory**: Auto-applies fixes based on past human edits (e.g., mapping descriptions to SKUs).
- **Compliance Guardrails**:
  - **Duplicate Detection**: Flags potential double-payments.
  - **Skonto Detection**: Highlights missed early-payment discounts.
- **Confidence Decay**: "Forgets" rules that users reject, ensuring the system adapts to changing formats.
- **Hybrid Persistence**: seamlessly runs on **Node.js** (File System) and **Browser** (LocalStorage).

## 🛠️ Technology Stack
- **Languages**: TypeScript (Strict Mode)
- **Runtime**: Node.js & Modern Browser (Vite)
- **Architecture**: Adapter-based Persistence (FS/LocalStorage), Heuristic Decision Engine

## 🏁 Getting Started

### Prerequisites
- Node.js (v16+)
- NPM

### Installation
```bash
npm install
```

### Running the Web Demo (Recommended)
Launch the interactive Invoice Simulator:
```bash
npx vite
```
Open **http://localhost:5173** in your browser.

### Running the CLI Suite
Run the backend verification suite:
```bash
npx tsc && node src/demo.js
```

## 🧪 Simulation Scenarios
1.  **Supplier GmbH**: Demonstration of "One-Shot Learning" for date extraction strings.
2.  **Parts AG**: Tax compliance checks learned from feedback.
3.  **Freight & Co**: Auto-coding SKUs from unstructured text descriptions.
