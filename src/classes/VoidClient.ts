import { Client } from "whatsapp-web.js";
import { resolve } from "path";
import { toDataURL } from "qrcode";
import express from "express";
import config from "../config";
import request from "superagent";
import CommandHandler from "./CommandHandler";
import EventLoader from "../util/EventLoader";
import type { ClientOptions } from "whatsapp-web.js";

export default class VoidClient extends Client {
    public qr = "";
    readonly request = request;
    readonly commandHandler: CommandHandler = new CommandHandler(this, config.prefix, resolve(__dirname, "..", "commands"));
    readonly config = config;
    readonly http = express();
    public constructor(readonly options: ClientOptions) {
        super(options);
    }
    public async setup(): Promise<void> {
        EventLoader(this, resolve(__dirname, "..", "events"));
        this.http.get("/", async (_, response) => {
            if (this.info) return response.status(401).send("<center><h1>Already logged in.</h1></center>");
            if (!this.qr.length) return response.status(401).send("<center><h1>Please wait 5 seconds and refresh this page.</h1></center>");
            const code = await toDataURL(this.qr);
            const body = `<center><img src='${code}' alt="code"></img><br/>Scan this QRCode with Whatsapp on your phone!</center>`;
            return response.status(200).send(body);
        });
        this.http.listen(config.PORT || 3000);
        this.commandHandler.loadAll();
        return await super.initialize();
    }
}