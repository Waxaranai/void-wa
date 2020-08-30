import readdirRecursive from "../util/readdirRecursive";
import type { CommandSchema } from "../interfaces";
import type VoidClient from "./VoidClient";
import type { Message } from "whatsapp-web.js";

export default class CommandHandler {
    public commands: Map<string, CommandSchema> = new Map();
    public categories: Map<string, CommandSchema[]> = new Map();
    public constructor(readonly client: VoidClient, readonly prefix: string, readonly path: string) { }
    public handle(msg: Message): void {
        if (msg.fromMe || !msg.body || !msg.body.startsWith(this.prefix)) return undefined;
        const args = msg.body.slice(this.prefix.length).trim().split(/ +/g);
        const commandID = args.shift();
        if (!commandID) return undefined;
        const command = this.commands.get(commandID) as CommandSchema;
        if (!command) return undefined;
        try {
            command.exec(msg, args);
        } catch (e) { console.error(e); }
    }
    public loadAll(): void {
        const files = readdirRecursive(this.path);
        for (const file of files) {
            const command: CommandSchema = new (require(file).default)(this.client);
            command.dir = file;
            this.commands.set(command.id, command);
            if (!this.categories.has(command.options!.category)) this.categories.set(command.options!.category, []);
            if (this.categories.has(command.options!.category)) {
                const cat = this.categories.get(command.options!.category);
                cat!.push(command);
                this.categories.set(command.options!.category, cat!);
            }
        }
    }
}