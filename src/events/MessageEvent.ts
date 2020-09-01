import type { EventSchema } from "../interfaces";
import type VoidClient from "../classes/VoidClient";
import type { Message } from "whatsapp-web.js";

export default class MessageEvent implements EventSchema {
    readonly name = "message";
    public constructor(readonly client: VoidClient) { }
    public exec(message: Message): void {
        this.client.commandHandler.handle(message);
    }
}