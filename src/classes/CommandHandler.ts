/* eslint-disable new-parens */
import { readdir } from "fs";
import { resolve } from "path";
import type VoidClient from "./VoidClient";
import type { Message } from "whatsapp-web.js";
import type { CommandSchema, CategoriesSchema } from "../interfaces";

export default class CommandHandler {
    public commands: Map<string, CommandSchema> = new Map;
    public categories: Map<string, CategoriesSchema> = new Map;
    public constructor(readonly client: VoidClient, readonly prefix: string, readonly path: string) { }
    public async handle(msg: Message): Promise<void> {
        if (msg.fromMe || !msg.body || !msg.body.startsWith(this.prefix)) return undefined;
        const args = msg.body.slice(this.prefix.length).trim().split(/ +/g);
        const commandID = args.shift();
        if (!commandID) return undefined;
        const command = this.commands.get(commandID) as CommandSchema;
        if (!command) return undefined;
        const chat = await msg.getChat();
        if (chat.isReadOnly) return undefined;
        if (chat.isGroup && command.options!.privateOnly) return undefined;
        if (!chat.isGroup && command.options!.groupOnly) return undefined;
        try {
            command.exec(msg, args);
        } catch (e) { console.error(e); }
    }
    public loadAll(): void {
        readdir(this.path, (_, categories: string[]) => {
            for (const cat of categories) {
                const dir = resolve(this.path, cat);
                const config = {
                    name: cat,
                    dir,
                    commands: []
                } as CategoriesSchema;
                readdir(dir, (_, files: string[]) => {
                    for (const file of files) {
                        const path = resolve(dir, file);
                        const command = new (require(path).default)(this.client) as CommandSchema;
                        command.dir = path;
                        command.categories = config;
                        config.commands.push(command);
                        this.commands.set(command.id, command);
                    }
                });
                this.categories.set(dir, config);
            }
        });
    }
}