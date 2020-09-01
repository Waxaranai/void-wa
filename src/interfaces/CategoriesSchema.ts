import { CommandSchema } from "./CommandSchema";

export interface CategoriesSchema {
    name: string;
    dir: string;
    commands: CommandSchema[];
}