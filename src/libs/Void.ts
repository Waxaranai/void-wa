import type VoidConfig from "../config";
import type { ConfigObject } from "@open-wa/wa-automate";

import { create } from "@open-wa/wa-automate";
import MessageHandler from "../handler/Message";

export default class Void {
    public constructor(public readonly config: typeof VoidConfig, public readonly options: ConfigObject) {
        void create(this, options).then(client => {
            const handler = new MessageHandler(client, this.config.prefix);
            void handler.loadAll();
            client.handler = handler;
            client.config = config;
            void client.onAnyMessage(message => {
                void client.getAmountOfLoadedMessages().then(msg => msg >= 3000 ? client.cutMsgCache() : msg);
                handler.handle(message);
            });
            void client.onStateChanged(state => {
                if (state === "CONFLICT" || state === "UNLAUNCHED") void client.forceRefocus();
                if (state === "CONNECTED") console.log("Connected to the phone!");
                if (state === "UNPAIRED") console.log("Logged out!");
            });
        });
    }
}

declare module "@open-wa/wa-automate" {
    interface Client {
        handler: MessageHandler;
        config: typeof VoidConfig;
    }
}