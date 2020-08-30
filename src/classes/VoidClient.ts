import { Client } from "whatsapp-web.js";
import { resolve } from "path";
import CommandHandler from "./CommandHandler";
import EventHandler from "./EventHandler";
import type { ClientOptions } from "whatsapp-web.js";

export default class VoidClient extends Client {
    readonly commandHandler: CommandHandler = new CommandHandler(this, "/", resolve(__dirname, "..", "commands"));
    readonly eventHandler: EventHandler = new EventHandler(this, resolve(__dirname, "..", "events"));
    public constructor(readonly options: ClientOptions) {
        super(options);
    }
    public async setup(): Promise<void> {
        this.eventHandler.loadAll();
        this.commandHandler.loadAll();
        return await super.initialize();
    }
}