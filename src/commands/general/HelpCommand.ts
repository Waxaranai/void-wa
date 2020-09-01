import Command from "../../classes/Command";
import { stripIndent } from "common-tags";
import { firstUpperCase } from "../../util/Util";
import type { Message } from "whatsapp-web.js";
import type VoidClient from "../../classes/VoidClient";

export default class HelpCommand extends Command {
    public constructor(readonly client: VoidClient) {
        super(client, "help", { content: "Display list commands!" }, { category: "general", aliases: [] });
    }
    public exec(msg: Message, args: string[]): void {
        const command = this.client.commandHandler.commands.get(args[0]);
        if (!command) {
            let content = "*Command's List*\n";
            for (const cat of Array.from(this.client.commandHandler.categories.values())) {
                content += stripIndent(`\n*${firstUpperCase(cat.name)}*\n${cat.commands.map(x => `*${this.handler.prefix}${x.id}* - ${x.description.content}`).join("\n")}`);
            }
            this.client.sendMessage(msg.from, content);
        } else {
            this.client.sendMessage(msg.from, `Command info *${this.handler.prefix}${command.id}*\n\`\`\`${command.description.content}\`\`\``);

        }
    }
}