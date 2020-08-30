import type { EventSchema } from "../interfaces";
import type VoidClient from "../classes/VoidClient";

export default class ReadyEvent implements EventSchema {
    readonly name = "ready";
    public constructor(readonly client: VoidClient) { }
    public exec(): void {
        console.log(`Logged in as: ${this.client.info.me.user}`);
    }
}