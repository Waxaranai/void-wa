import express from "express";
import { existsSync } from "fs";
import { resolve } from "path";
export default (port: number): void => {
    const app = express();
    if (existsSync("src/public")) app.use(express.static(resolve("src/public")));

    app.set("view engine", "html");
    app.get("/qr", (_, response) => {
        const authenticated = !existsSync("src/public/qrcode.png");
        if (authenticated) return response.status(200).send("Already authenticated!");
        return response.status(200).sendFile(resolve("src/public/index.html"));
    });
    app.get("*", (_, response) => response.redirect("/qr"));
    app.listen(port, () => console.log(`Listening to ${port}`));
};
