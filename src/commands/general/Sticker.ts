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

    public async exec(msg: Message): Promise<void> {
        const isQuotedImage = msg.quotedMsg && msg.quotedMsg.type === "image";
        if (msg.isMedia || isQuotedImage) {
            try {
                await this.create(msg, isQuotedImage);
            } catch (error) {
                await this.client.sendText(msg.chatId, "An error occured while trying to create the sticker!");
            }
        } else {
            await this.client.sendText(msg.chatId, `Please send image with *${this.client.config.prefix}sticker* caption or reply on a image!`);
        }
    }

    private async create(message: Message, isQuoted: boolean): Promise<void> {
        const msg = isQuoted ? message.quotedMsg : message;
        const media = await decryptMedia(msg, this.client.config.UserAgent);
        const imageBase64 = `data:${msg.mimetype};base64,${media.toString("base64")}`;
        await this.client.sendImageAsSticker(message.chatId, imageBase64);
    }
}
