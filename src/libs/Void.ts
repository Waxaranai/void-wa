import Util from "./Util";
import VoidConfig from "../config";
import MessageHandler from "../handler/Message";
import { Logger } from "winston";
import { createLogger } from "./Logger";
import { create, ConfigObject } from "@open-wa/wa-automate";
import { VoidServer } from "./VoidServer";
import { QrHandler } from "../handler/Qr";
import { DatabaseHandler } from "../handler/Database";
export default class Void {
    public qrHandler!: QrHandler;
    private readonly server = new VoidServer(this, VoidConfig.port);
    public constructor(public readonly config: typeof VoidConfig, public readonly options: ConfigObject) {
        this.qrHandler = new QrHandler(this.server);
        void create(options).then(async client => {
            const database = new DatabaseHandler(client);
            const handler = new MessageHandler(client, this.config.prefix);
            handler.loadAll();
            await database.connect();
            Object.assign(client, {
                config, db: database, handler,
                log: createLogger(), util: new Util(client)
            });
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
}
