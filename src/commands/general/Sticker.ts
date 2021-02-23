import { Message, decryptMedia } from "@open-wa/wa-automate";
import { DefineCommand } from "../../decorators/DefineCommand";
import BaseCommand from "../../libs/BaseCommand";

@DefineCommand("sticker", {
    aliases: ["stiker"],
    category: "general",
    cooldown: 20,
    description: {
        content: "Create sticker from a image or video, use *--crop* to make the sticker cropped.",
        usage: "[--crop]"
    }
})
export default class extends BaseCommand {
    public async exec(msg: Message, query: string[]): Promise<void> {
        const { flags } = this.parseArgs(query);
        const isCropped = flags.includes("crop");
        const isQuotedImage = msg.quotedMsg && msg.quotedMsg.type === "image";
        const isQuotedVideo = msg.quotedMsg && msg.quotedMsg.type === "video";
        if (msg.type === "image" || isQuotedImage) {
            const wait = await this.client.reply(msg.chatId, "*Please wait...*", msg.id) as Message["id"];
            await this.create(msg, wait, isQuotedImage!, false, isCropped);
        } else if (msg.type === "video" || isQuotedVideo) {
            if ((Number(msg.duration) || Number(msg.quotedMsg!.duration)) >= 15) {
                await this.client.reply(msg.chatId, "Please use video/gif with duration under 15 seconds and try again.", msg.id);
                return undefined;
            }
            const wait = await this.client.reply(msg.chatId, "*Please wait...* (sometimes it takes 1-5 minutes to process)", msg.id) as Message["id"];
            await this.create(msg, wait, isQuotedVideo!, true, isCropped);
        } else {
            await this.client.reply(msg.chatId, `Please send image/video/gif with *${msg.prefix}sticker* caption or reply on the file!`, msg.id);
        }
    }

    private async create(message: Message, waitMsg: Message["id"], isQuoted: boolean, isGif = false, crop = false): Promise<void> {
        try {
            const msg = isQuoted ? message.quotedMsg! : message;
            const media = await decryptMedia(msg, this.client.config.UserAgent);
            const imageBase64 = `data:${msg.mimetype as string};base64,${media.toString("base64")}`;
            if (isGif) {
                await this.client.sendMp4AsSticker(message.chatId, media.toString("base64"), { crop }, { author: "Void", pack: "Created by" });
                await this.client.deleteMessage(message.chatId, waitMsg);
                return undefined;
            }
            await this.client.sendImageAsSticker(message.chatId, imageBase64, { keepScale: !crop, author: "Void", pack: "Created by" });
            await this.client.deleteMessage(message.chatId, waitMsg);
        } catch (e) {
            await this.client.deleteMessage(message.chatId, waitMsg);
            await this.client.reply(message.chatId, `An error occured when trying to create the sticker. ${isGif ? "try again with shorter video/gif" : ""}`, message.id);
        }
    }
}
