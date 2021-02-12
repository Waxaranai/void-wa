import { Client, Message } from "@open-wa/wa-automate";
import BaseCommand from "../../libs/BaseCommand";

export default class MentionAllCommand extends BaseCommand {
    public constructor(public readonly client: Client) {
        super("mentionall", {
            aliases: ["everyone"],
            category: "group",
            groupOnly: true,
            adminOnly: true
        }, {
            content: "Mention all group members"
        });
    }

    public async exec(msg: Message): Promise<void> {
        const result: string[] = [];
        const members = await this.client.getGroupMembers(msg.chatId as any);
        for (const member of members) {
            if (member.isMe) continue;
            else result.push(`@${(member.id as string).replace(/@c.us/g, "")}`);
        }
        await this.client.sendTextWithMentions(msg.chatId as any, result.join(" "));
    }
}
