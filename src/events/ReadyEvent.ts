import type { EventSchema } from "../interfaces";
import type VoidClient from "../classes/VoidClient";

export default class ReadyEvent implements EventSchema {
    readonly name = "ready";
    public constructor(readonly client: VoidClient) { }
    public exec(): void {
        this.client.setDisplayName(this.client.config.name);
        console.log(`${this.client.config.name} is ready!`);
    }
}