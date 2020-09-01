import type { Message } from "whatsapp-web.js";
import { CategoriesSchema } from "./CategoriesSchema";

export interface CommandSchema {
    id: string;
    dir?: string;
    categories?: CategoriesSchema;
    options?: {
        aliases?: string[];
        category?: string;
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