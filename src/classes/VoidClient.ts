import { Client } from "whatsapp-web.js";
import { resolve } from "path";
import CommandHandler from "./CommandHandler";
import EventHandler from "./EventHandler";
import type { ClientOptions } from "whatsapp-web.js";
import express from "express";

export default class VoidClient extends Client {
    readonly commandHandler: CommandHandler = new CommandHandler(this, "/", resolve(__dirname, "..", "commands"));
    readonly eventHandler: EventHandler = new EventHandler(this, resolve(__dirname, "..", "events"));
    readonly http = express();
    public constructor(readonly options: ClientOptions) {
        super(options);
    }
    public async setup(): Promise<void> {
        this.http.listen(3000);
        this.eventHandler.loadAll();
        this.commandHandler.loadAll();
        return await super.initialize();
    }
}