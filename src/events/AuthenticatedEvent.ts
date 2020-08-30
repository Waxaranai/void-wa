import type { EventSchema } from "../interfaces";
import type VoidClient from "../classes/VoidClient";
import type { ClientSession } from "whatsapp-web.js";

export default class AuthenticatedEvent implements EventSchema {
    readonly name = "authenticated";
    public constructor(readonly client: VoidClient) { }
    public exec(session: ClientSession): void {
        console.log(session);
    }
}