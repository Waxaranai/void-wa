import { existsSync, writeFileSync } from "fs";
import type VoidClient from "../classes/VoidClient";
import type { EventSchema } from "../interfaces";
import type { ClientSession } from "whatsapp-web.js";

export default class AuthenticatedEvent implements EventSchema {
    readonly name = "authenticated";
    public constructor(readonly client: VoidClient) { }
    public exec(session: ClientSession): void {
        if (existsSync(this.client.config.sessionPath) && this.client.config.resumeSession) writeFileSync(this.client.config.sessionPath, JSON.stringify(session, null, 2));
        else console.log(session);
    }
}