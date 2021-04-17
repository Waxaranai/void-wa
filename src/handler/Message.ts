import BaseCommand from "../libs/BaseCommand";
import { Client, Message } from "@open-wa/wa-automate";
import { ICategories } from "../typings";
import { join } from "path";

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
            await this.client.simulateTyping(msg.chatId, true);
            await command.exec(msg, args);
        } catch (error) {
            this.client.log.error(error);
        } finally {
            await this.client.simulateTyping(msg.chatId, false);
        }
    }

    public async handle(msg: Message): Promise<void> {
        Object.assign(msg, { body: msg.type === "chat" ? msg.body : (msg.type === "image" && msg.caption) ? msg.caption : (msg.type === "video" && msg.caption) ? msg.caption : msg.body });
        const blocked = await this.client.getBlockedIds();
        if (blocked.includes(msg.sender.id) && !msg.fromMe) return undefined;
        const prefix = await this.getPrefix(msg);
        if (!prefix || !prefix.length || !msg.body.toLowerCase().startsWith(prefix.toLowerCase())) return undefined;
        Object.assign(msg, { prefix });
        const args = msg.body.slice(prefix.length).trim().split(/ +/g);
        const commandID = args.shift();
        const command = this.commands.get(commandID!.toLowerCase()) ?? Array.from(this.commands.values()).find(x => x.options.aliases.includes(commandID!));
        if (!command) return undefined;
        if (msg.isGroupMsg && msg.chat.isReadOnly) return undefined;
        if (command.options.adminOnly && !command.options.groupOnly) return undefined;
        if (msg.isGroupMsg && command.options.adminOnly && command.options.groupOnly) {
            const { me } = await this.client.getMe();
            const adminList = await this.client.getGroupAdmins(msg.chatId as Message["chat"]["groupMetadata"]["id"]) as string[];
            if (!adminList.includes(me._serialized)) adminList.push(me._serialized);
            if (!adminList.includes(msg.sender.id)) return undefined;
        }
        if (!msg.fromMe && command.options.meOnly) return undefined;
        if (msg.isGroupMsg && command.options.privateOnly) return undefined;
        if (!msg.isGroupMsg && command.options.groupOnly) return undefined;
        await this.runCommand(msg, args, command);
    }

    public async getPrefix(msg: Message): Promise<string | void> {
        const prefixes: string[] = [this.client.config.prefix];
        if (msg.isGroupMsg) {
            const settings = await this.client.db.models.settings.findOne({ group: msg.chatId });
            if (!settings) {
                const data = Object.assign(this.client.config.defaultSettings, { group: msg.chatId });
                await this.client.db.models.settings.findOneAndUpdate({ group: msg.chatId }, data, { upsert: true, new: true });
            }
            prefixes.push(settings?.prefix as string);
        }
        for (const prefix of prefixes) {
            if (!msg.body) continue;
            if (msg.body.toLowerCase().startsWith(prefix.toLowerCase())) return prefix;
        }
    }

    public loadAll(): void {
        this.client.log.info("Loading commands...");
        const loaded = [];
        const path = join(__dirname, "../commands");
        const files = this.client.util.readdirRecursive(path);
        for (const file of files) {
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const load = require(file).default;
            if (!load || !(load.prototype instanceof BaseCommand)) continue;
            const command = this.getCommand(file);
            if (command.options.adminOnly && !command.options.groupOnly) {
                this.client.log.error(`adminOnly options only available if groupOnly is set to true on ${file}`);
                continue;
            }
            loaded.push(command.id);
            this.registry(command);
        }
        this.client.log.info(`Loaded ${loaded.length} command.`);
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
