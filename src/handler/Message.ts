import { readdir } from "fs";
import { resolve } from "path";
import type { Client, Message } from "@open-wa/wa-automate";
import type { ICategories, ICommand } from "../typings";

export default class MessageHandler {
    public readonly commands = new Map<string, ICommand>();
    public readonly categories = new Map<string, ICategories>();
    public constructor(public readonly client: Client, public readonly path: string, public readonly prefix: string) { }

    public handle(msg: Message): void {
        if (!this.prefix.length || msg.fromMe || !msg.body || !msg.body.startsWith(this.prefix)) return undefined;
    }

    public loadAll(): void {
        console.log("Loading commands...");
        readdir(this.path, (error, categories: string[]) => {
            if (error) console.error(error);
            for (const cat of categories) {
                const dir = resolve(this.path, cat);
                const config: ICategories = {
                    name: cat,
                    path: dir,
                    commands: []
                };
                readdir(dir, (err, files: string[]) => {
                    if (err) console.error(err);
                    for (const file of files) {
                        const path = resolve(dir, file);
                        // eslint-disable-next-line @typescript-eslint/no-var-requires
                        const command = new (require(path).default)(this.client) as ICommand;
                        command.path = path;
                        command.client = this.client;
                        command.categories = config;
                        config.commands.push(command);
                        this.commands.set(command.id, command);
                    }
                });
                this.categories.set(dir, config);
            }
            return this.client;
        });
    }
}
