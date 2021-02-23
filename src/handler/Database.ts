import { Client } from "@open-wa/wa-automate";
import { connect, Connection } from "mongoose";

export class DatabaseHandler {
    public connected = false;
    public connection: Connection | undefined;
    public constructor(public readonly client: Client) { }
    public async connect(): Promise<void> {
        const uri = process.env.MONGODB_URI;
        if (!uri) {
            this.client.log.error("MONGODB_URI is missing, please fill the value!");
            process.exit(1);
        }
        try {
            const db = await connect(uri, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });
            db.connection.once("open", () => this.client.log.info("Database conmected!"));
            db.connection.on("connected", () => this.client.log.info("Database conmected!"));
            db.connection.on("error", error => this.client.log.error(error));
            this.connection = db.connection;
            this.connected = true;
        } catch (e) {
            this.client.log.error(e);
            this.connection = undefined;
            this.connected = false;
        }
    }
}
