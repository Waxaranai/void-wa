import type { Client, Message } from "@open-wa/wa-automate";
import { decryptMedia } from "@open-wa/wa-automate";
import BaseCommand from "../../libs/BaseCommand";

export default class StickerCommand extends BaseCommand {
    public constructor(public readonly client: Client) {
        super("sticker", {
            aliases: ["stiker"],
            category: "general",
            cooldown: 15
        }, {
            content: "Create sticker from a image."
        });
    }

    public async exec(msg: Message, query: string[]): Promise<void> {
        const { flags } = this.parseArgs(query);
        const isQuotedImage = msg.quotedMsg && msg.quotedMsg.type === "image";
        const isSticker = msg.quotedMsg && msg.quotedMsg.type === "sticker";
        if (msg.isMedia || isQuotedImage) {
            try {
                await this.create(msg, isQuotedImage);
            } catch (error) {
                await this.client.sendText(msg.chatId, "An error occured while trying to create the sticker!");
            }
        } else if (isSticker && flags.includes("to-image")) {
            try {
                await this.create(msg, true, true);
            } catch (error) {
                await this.client.sendText(msg.chatId, "An error occured while trying to convert the sticker!");
            }
        } else if (!isSticker && flags.includes("to-image")) {
            await this.client.sendText(msg.chatId, `Please reply a sticker with message *${this.handler!.prefix}sticker --to-image*`);
        } else {
            await this.client.sendText(msg.chatId, `Please send image with *${this.handler!.prefix}sticker* caption or reply on a image!`);
        }
    }

    private async create(message: Message, isQuoted: boolean, toImage = false): Promise<void> {
        const msg = isQuoted ? message.quotedMsg : message;
        const media = await decryptMedia(msg, this.client.config.UserAgent);
        const imageBase64 = `data:${msg.mimetype};base64,${media.toString("base64")}`;
        // eslint-disable-next-line no-negated-condition
        if (!toImage) {
            await this.client.sendImageAsSticker(message.chatId, imageBase64);
        } else {
            await this.client.sendFile(message.chatId, imageBase64, "converted.png", "");
        }
    }
}
