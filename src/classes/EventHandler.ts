import readdirRecursive from "../util/readdirRecursive";
import type VoidClient from "./VoidClient";
import type { EventSchema } from "../interfaces";

export default class EventHandler {
    public constructor(readonly client: VoidClient, readonly path: string) { }
    public loadAll(): void {
        const files = readdirRecursive(this.path);
        for (const file of files) {
            const event: EventSchema = new (require(file).default)(this.client);
            this.client.addListener(event.name, event.exec.bind(event) as any);
        }
    }
}