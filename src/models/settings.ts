import { Document, model, Schema } from "mongoose";

interface IDefaultSettings extends Document {
    prefix: string;
    group: string;
    banlist: string[];
}

const schema = new Schema({
    prefix: String,
    group: String,
    banlist: [String]
});

export const settings = model<IDefaultSettings>("settings", schema);
