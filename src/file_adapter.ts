import { StorageAdapter } from './memory_store';
import * as fs from 'fs';
import * as path from 'path';
import { MemoryRule } from './types';

export class FileAdapter implements StorageAdapter {
    private filePath: string;
    
    constructor() {
        const DATA_DIR = path.join(__dirname, '../data');
        this.filePath = path.join(DATA_DIR, 'memory.json');
        
        if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
        if (!fs.existsSync(this.filePath)) fs.writeFileSync(this.filePath, JSON.stringify([], null, 2));
    }

    load(): { memories: MemoryRule[], history: any[] } {
        try {
            const data = fs.readFileSync(this.filePath, 'utf-8');
            const parsed = JSON.parse(data);
            // Handle legacy array format
            if (Array.isArray(parsed)) return { memories: parsed, history: [] };
            return parsed;
        } catch (e) { return { memories: [], history: [] }; }
    }

    save(memories: MemoryRule[], history: any[]): void {
        fs.writeFileSync(this.filePath, JSON.stringify({ memories, history }, null, 2));
    }
    
    clear(): void {
        this.save([], []);
    }
}
