import { model, Schema } from "mongoose";

const schema = new Schema({
    prefix: String,
    group: String,
    banlist: [String]
});
export const settings = model("settings", schema);
