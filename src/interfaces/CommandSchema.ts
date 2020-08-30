import type { Message } from "whatsapp-web.js";

export interface CommandSchema {
    id: string;
    dir?: string;
    options?: {
        category: string;
        groupOnly?: boolean;
        privateOnly?: boolean;
    };
    description: {
        content: string;
    };
    exec(msg: Message, args?: string[]): Promise<any>;
}