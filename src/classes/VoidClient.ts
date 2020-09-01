import { Client } from "whatsapp-web.js";
import { resolve } from "path";
import express from "express";
import config from "../config";
import CommandHandler from "./CommandHandler";
import EventLoader from "../util/EventLoader";
import type { ClientOptions } from "whatsapp-web.js";

export default class VoidClient extends Client {
    readonly commandHandler: CommandHandler = new CommandHandler(this, "/", resolve(__dirname, "..", "commands"));
    readonly config = config;
    readonly http = express();
    public constructor(readonly options: ClientOptions) {
        super(options);
    }
    public async setup(): Promise<void> {
        EventLoader(this, resolve(__dirname, "..", "events"));
        this.http.listen(config.PORT || 3000);
        this.commandHandler.loadAll();
        return await super.initialize();
    }
}