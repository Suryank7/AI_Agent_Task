import { MemoryStore } from './memory_store';
import { FileAdapter } from './file_adapter';

const store = new MemoryStore(new FileAdapter());
store.load();
const memories = store.getAllMemories();

console.log("\n=== MEMORY VISUALIZATION ===");
if (memories.length === 0) {
    console.log("No memories stored.");
} else {
    console.table(memories.map(m => ({
        Vendor: m.vendorName,
        Pattern: m.pattern,
        Action: m.action,
        Value: m.value,
        Conf: m.confidence.toFixed(2),
        Used: m.usageCount
    })));
}
