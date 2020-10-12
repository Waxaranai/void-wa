import type { Client, Message } from "@open-wa/wa-automate";
import type MessageHandler from "../handler/Message";

export interface ICommand {
    id: string;
    path?: string;
    client?: Client;
    handler?: MessageHandler;
    categories?: ICategories;
    options: {
        cooldown?: number;
        aliases: string[];
        category: string;
        devOnly?: boolean;
        groupOnly?: boolean;
        privateOnly?: boolean;
    };
    description: {
        content: string;
        usage?: string;
    };
    exec(msg: Message, args?: string[]): Promise<any>;
}


export interface ICategories {
    name: string;
    path: string;
    commands: ICommand[];
}
export interface IHandler {
    message?: MessageHandler;
}
