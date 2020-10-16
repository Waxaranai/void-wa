import express from "express";
import { existsSync } from "fs";
import { resolve } from "path";
export default (port: number): void => {
    const app = express();
    app.use("/style.css", express.static(resolve("src/public/style.css")));
    app.use("/qrcode.png", express.static(resolve("src/public/qrcode.png")));

    app.set("view engine", "html");
    const authenticated = !existsSync("src/public/qrcode.png");
    app.get("/qr", (_, response) => {
        if (authenticated) {
            return response.status(200).json({
                message: "Client already authenticated!",
                status: 200
            });
        }
        return response.status(200).sendFile(resolve("src/public/index.html"));
    });
    app.get("*", (_, response) => response.redirect("/qr"));
    app.listen(port, () => console.log(`Listening to ${port}`));
};
