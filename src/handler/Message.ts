import type { Client, Message } from "@open-wa/wa-automate";
import type { ICategories } from "../typings";
import { join } from "path";
import readdirRecursive from "../util/ReaddirRecursive";
import BaseCommand from "../libs/BaseCommand";

export default class MessageHandler {
    public readonly cooldowns = new Map<string, Map<string, any>>();
    public readonly commands = new Map<string, BaseCommand>();
    public readonly categories: ICategories[] = [];
    public constructor(public readonly client: Client, public readonly prefix: string) { }

    public async runCommand(msg: Message, args: string[], command: BaseCommand): Promise<void> {
        if (!this.cooldowns.has(command.id)) this.cooldowns.set(command.id, new Map());
        const now = Date.now();
        const timestamps: Map<string, number> = this.cooldowns.get(command.id)!;
        const cooldownAmount = (command.options.cooldown ?? 10) * 1000;
        if (timestamps.has(msg.sender.id)) {
            const expirationTime = timestamps.get(msg.sender.id)! + cooldownAmount;
            if (now < expirationTime) return undefined;
            timestamps.set(msg.sender.id, now);
            setTimeout(() => timestamps.delete(msg.sender.id), cooldownAmount);
        } else {
            timestamps.set(msg.sender.id, now);
            if (msg.fromMe) timestamps.delete(msg.sender.id);
        } try {
            await command.exec(msg, args);
        } catch (error) {
            console.log(error);
        }
    }

    public async handle(msg: Message): Promise<void> {
        const blocked = await this.client.getBlockedIds();
        if (blocked.includes(msg.from) && !msg.fromMe) return undefined;
        msg.body = (msg.type === "chat" && msg.body.startsWith(this.prefix)) ? msg.body : ((msg.type === "image" && msg.caption) && msg.caption.startsWith(this.prefix)) ? msg.caption : "";
        if (!this.prefix.length || !msg.body.startsWith(this.prefix)) return undefined;
        const args = msg.body.slice(this.prefix.length).trim().split(/ +/g);
        const commandID = args.shift();
        const command = this.commands.get(commandID!) ?? Array.from(this.commands.values()).find(x => x.options.aliases.includes(commandID!));
        if (!command) return undefined;
        if (msg.isGroupMsg && msg.chat.isReadOnly) return undefined;
        if (!msg.fromMe && command.options.meOnly) return undefined;
        if (msg.isGroupMsg && command.options.privateOnly) return undefined;
        if (!msg.isGroupMsg && command.options.groupOnly) return undefined;
        await this.runCommand(msg, args, command);
    }

    public loadAll(): void {
        console.log("Loading commands...");
        const loaded = [];
        const path = join(__dirname, "../commands");
        const files = readdirRecursive(path);
        for (const file of files) {
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const load = require(file).default;
            if (!load || !(load.prototype instanceof BaseCommand)) continue;
            const command = this.getCommand(file);
            loaded.push(command.id);
            this.registry(command);
        }
        console.log(`Loaded ${loaded.length} command.`);
    }


    public registry(command: string | BaseCommand): void {
        if (typeof command === "string") command = this.getCommand(command);
        this.addToCategory(command);
        this.commands.set(command.id, command);
    }

    public getCommand(path: string): BaseCommand {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const command: BaseCommand = new (require(path).default)(this.client);
        command.client = this.client;
        command.path = path;
        command.handler = this;
        return command;
    }

    public addToCategory(command: BaseCommand): void {
        const category: ICategories = this.categories.find(x => x.name === command.options.category) ?? {
            name: command.options.category || "Uncategorized",
            commands: []
        };
        if (!category.commands.some(x => x.id === command.id)) category.commands.push(command);
        if (!this.categories.some(x => x.name === command.options.category)) this.categories.push(category);
    }
}
