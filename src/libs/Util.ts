import type { Client } from "@open-wa/wa-automate";
import { readdirSync, statSync } from "fs";
import { join } from "path";

export default class Util {
    public constructor(private readonly client: Client) {}

    public readdirRecursive(directory: string): string[] {
        const results: string[] = [];

        function read(path: string): void {
            const files = readdirSync(path);

            for (const file of files) {
                const dir = join(path, file);
                if (statSync(dir).isDirectory()) read(dir);
                else results.push(dir);
            }
        }
        read(directory);

        return results;
    }

    public async wait(ms: number): Promise<NodeJS.Timeout> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}
