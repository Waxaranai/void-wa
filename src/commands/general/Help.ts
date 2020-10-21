import type { Client, Message } from "@open-wa/wa-automate";
import { stripIndent } from "common-tags";
import BaseCommand from "../../libs/BaseCommand";

export default class HelpCommand extends BaseCommand {
    public constructor(public readonly client: Client) {
        super("help", {
            aliases: ["menu", "h"],
            category: "general"

        }, {
            content: "Generating command list",
            usage: "[command]"
        });
    }

    public async exec(msg: Message, args: string[]): Promise<void> {
        const handler = this.handler!;
        const command = handler.commands.get(args[0]) ?? Array.from(handler.commands.values()).find(x => x.options.aliases.includes(args[0]));
        if (!command) {
            let base = "*Command List*\n\n";
            const modules = handler.categories;
            for (const mod of modules) {
                base += stripIndent(`
            *${this.firstUpperCase(mod.name)}*
            ${mod.commands.map(x => x.id).join(", ") || "None"}`);
            }
            await this.client.sendText(msg.chatId, base);
            return undefined;
        }
        const detail = stripIndent(`
        Command info for *${command.id}*
        _${command.description.content ? command.description.content : "No description available"}_

        *Aliases:* ${command.options.aliases.join(", ") || "No aliases"}
        *Usage:* ${command.description.usage ? `${handler.prefix}${command.id} ${command.description.usage}` : `${handler.prefix}${command.id}`}
        *Cooldown:* ${command.options.cooldown ? `${command.options.cooldown}s` : "10s"}

        ℹ️ _<> means required and [ ] means optional, don't include <> or [ ] when using command._
        `);
        await this.client.sendText(msg.chatId, detail);
    }

    private firstUpperCase(text: string): string {
        return `${text.charAt(0).toUpperCase()}${text.slice(1)}`;
    }
}
