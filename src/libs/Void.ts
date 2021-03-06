import Util from "../utils/Util";
import VoidConfig from "../config";
import MessageHandler from "../handler/Message";
import { Logger } from "winston";
import { create, ConfigObject } from "@open-wa/wa-automate";
import { VoidServer } from "./VoidServer";
import { DatabaseHandler } from "../handler/Database";
export default class Void {
    private readonly server = new VoidServer(this, VoidConfig.port);
    public constructor(public readonly config: typeof VoidConfig, public readonly options: ConfigObject) {
        void create(options).then(async client => {
            const database = new DatabaseHandler(client);
            const handler = new MessageHandler(client, this.config.prefix);
            Object.assign(client, {
                config, db: database, handler,
                log: this.server.logger, util: new Util(client)
            });
            void handler.loadAll();
            await database.connect();
            await client.onAnyMessage(async message => {
                await client.getAmountOfLoadedMessages().then(msg => msg >= 3000 ? client.cutMsgCache() : msg);
                await client.sendSeen(message.chatId);
                await handler.handle(message);
            });
            await client.onStateChanged(async state => {
                if (state === "CONFLICT" || state === "UNLAUNCHED") {
                    await client.forceRefocus();
                    return undefined;
                }
                if (state === "CONNECTED") client.log.debug("Connected to the phone!");
                if (state === "UNPAIRED") client.log.debug("Logged out!");
            });
        });
    }
}

declare module "@open-wa/wa-automate" {
    interface Client {
        handler: MessageHandler;
        db: DatabaseHandler;
        config: typeof VoidConfig;
        util: Util;
        log: Logger;
    }
    interface Message {
        prefix: string;
    }
}
