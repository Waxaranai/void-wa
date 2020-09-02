import type { EventSchema } from "../interfaces";
import type VoidClient from "../classes/VoidClient";

export default class QrEvent implements EventSchema {
    readonly name = "qr";
    public constructor(readonly client: VoidClient) { }
    public exec(qr: string): void {
        this.client.qr = qr;
    }
}