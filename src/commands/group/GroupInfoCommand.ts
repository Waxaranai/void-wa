import Command from "../../classes/Command";
import { stripIndent } from "common-tags";
import { MessageMedia } from "whatsapp-web.js";
import type { Message } from "whatsapp-web.js";
import type VoidClient from "../../classes/VoidClient";

export default class GroupInfoCommand extends Command {
    public constructor(readonly client: VoidClient) {
        super(client, "groupinfo", { content: "Gave group info." }, { category: "group", groupOnly: true, aliases: [] });
    }
    public async exec(msg: Message): Promise<void> {
        const chat = await msg.getChat() as any;
        const url = await this.client.getProfilePicUrl(msg.from);
        if (url) {
            const { body: img }: { body: Buffer } = await this.client.request.get(url);
            msg.reply(new MessageMedia("image/png", img.toString("base64"), "icon.png"), msg.from, {
                caption: stripIndent(`
                *Group Info* [${chat.groupMetadata.participants.length} members]
                - Name: ${chat.name}
                - ID: ${msg.from}
            `)
            });
        } else {
            msg.reply(stripIndent(`
            *Group Info* [${chat.groupMetadata.participants.length} members]
            - Name: ${chat.name}
            - ID: ${msg.from}
            `));
        }
    }
}