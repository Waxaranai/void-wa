import type { EventSchema } from "../interfaces";
import type VoidClient from "../classes/VoidClient";

export default class QrEvent implements EventSchema {
    readonly name = "qr";
    public constructor(readonly client: VoidClient) { }
    public exec(qr: string): void {
        console.log(`https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${qr}`);
    }
}