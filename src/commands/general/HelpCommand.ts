import Command from "../../classes/Command";
import { stripIndent } from "common-tags";
import { firstUpperCase } from "../../util/Util";
import type { Message } from "whatsapp-web.js";
import type VoidClient from "../../classes/VoidClient";

export default class HelpCommand extends Command {
    public constructor(readonly client: VoidClient) {
        super(client, "help", { content: "Display list commands" }, { category: "general", aliases: ["h", "menu"] });
    }
    public exec(msg: Message, args: string[]): void {
        const command = this.client.commandHandler.commands.get(args[0]) || Array.from(this.handler.commands.values()).find(x => x.options.aliases.includes(args[0]));
        if (!command) {
            let content = "*Command's List*\n\n";
            for (const cat of Array.from(this.client.commandHandler.categories.values())) {
                content += stripIndent(`\n*${firstUpperCase(cat.name)}*\n${cat.commands.map(x => `*${this.handler.prefix}${x.id}* - ${x.description.content}`).join("\n")}`);
            }
            msg.reply(content, msg.from);
        } else {
            msg.reply(stripIndent(`
            Command info *${this.handler.prefix}${command.id}*
            ${command.description.content}

            *Aliases:* ${command.options.aliases.length > 0 ? command.options.aliases.map(x => x).join(", ") : "No Aliases"}
            `), msg.from);
        }
    }
}