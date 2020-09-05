import Command from "../../classes/Command";
import { stripIndent } from "common-tags";
import type { Message } from "whatsapp-web.js";
import type VoidClient from "../../classes/VoidClient";

export default class GroupInfoCommand extends Command {
    public constructor(readonly client: VoidClient) {
        super(client, "groupinfo", { content: "Gave group info." }, { category: "group", groupOnly: true, aliases: [] });
    }
    public async exec(msg: Message): Promise<void> {
        const chat = await msg.getChat();
        msg.reply(stripIndent(`
            *Group Info*
            - Name: ${chat.name}
            - ID: ${chat.id.user}@${chat.id.server}
        `));
    }
}