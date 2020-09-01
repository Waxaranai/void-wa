import readdirRecursive from "./readdirRecursive";
import type VoidClient from "../classes/VoidClient";
import type { EventSchema } from "../interfaces";

export default function EventLoader(client: VoidClient, path: string): void {
    const files = readdirRecursive(path);
    for (const file of files) {
        const event: EventSchema = new (require(file).default)(client);
        client.addListener(event.name, event.exec.bind(event) as any);
    }
}