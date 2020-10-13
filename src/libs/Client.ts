import type VoidConfig from "../config";
import type { ConfigObject } from "@open-wa/wa-automate";

import { create } from "@open-wa/wa-automate";
import MessageHandler from "../handler/Message";

export default class Void {
    public constructor(public readonly config: typeof VoidConfig, public readonly options: ConfigObject) {
        void create(this, options).then(client => {
            const handler = new MessageHandler(client, this.config.prefix);
            void handler.loadAll();
            void client.onMessage(message => handler.handle(message));
        });
    }
}

