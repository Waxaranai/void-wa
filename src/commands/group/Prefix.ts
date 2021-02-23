import { Message } from "@open-wa/wa-automate";
import { DefineCommand } from "../../decorators/DefineCommand";
import BaseCommand from "../../libs/BaseCommand";

@DefineCommand("prefix", {
    adminOnly: true,
    aliases: [],
    category: "group",
    cooldown: 30,
    description: {
        content: "Change the bot prefix on this group (default prefix still usable), use *--reset* to reset the prefix",
        usage: "<new prefix | [--reset]>"
    },
    groupOnly: true
})
export default class extends BaseCommand {
    public async exec(msg: Message, query: string[]): Promise<void> {
        const regex = /^([-@.;^$!*=~+?<>\/#&+,\w])*$/;
        const defaultPrefix = this.client.config.prefix;
        const { flags, args } = this.parseArgs(query);
        if (flags.includes("reset")) {
            await this.client.db.models.settings.findOneAndUpdate({ group: msg.chatId }, { prefix: defaultPrefix });
            await this.client.reply(msg.chatId, `This group prefix has been reset to: *${defaultPrefix}*`, msg.id);
            return undefined;
        }
        const newPrefix = args[0];
        if (!newPrefix) {
            await this.client.reply(msg.chatId, "Please provide a new prefix to set!", msg.id);
            return undefined;
        } else if (!regex.exec(newPrefix)) {
            await this.client.reply(msg.chatId, "You can't use unsupported type of characters. only alphabets letters, or some special characters with maximum length of 5 letter!", msg.id);
            return undefined;
        } else if (newPrefix.length >= 5) {
            await this.client.reply(msg.chatId, "You can't use more than 5 letter!", msg.id);
            return undefined;
        }
        await this.client.db.models.settings.findOneAndUpdate({ group: msg.chatId }, { prefix: newPrefix.toLowerCase() });
        await this.client.reply(msg.chatId, `This group prefix has been changed to: *${newPrefix.toLowerCase()}*`, msg.id);
        return undefined;
    }
}
