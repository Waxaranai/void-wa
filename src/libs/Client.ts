import type VoidConfig from "../config";
import type { Client, ConfigObject } from "@open-wa/wa-automate";

import { create } from "@open-wa/wa-automate";
import MessageHandler from "../handler/Message";

export default class Void {
    public client: Client | undefined;
    public handler: MessageHandler | undefined;
    public constructor(public readonly config: typeof VoidConfig, public readonly options: ConfigObject) {
        void create(this, options).then(client => {
            const handler = new MessageHandler(client, "commands", this.config.prefix);
            void handler.loadAll();
            void client.onMessage(message => handler.handle(message));
            this.handler = handler;
            this.client = client;
        });
    }
}

