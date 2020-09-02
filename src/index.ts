import VoidClient from "./classes/VoidClient";
import { resumeSession, sessionPath } from "./config";
import { existsSync } from "fs";
import type { ClientSession } from "whatsapp-web.js";

let sessionData: ClientSession;
if (existsSync(sessionPath) && resumeSession) sessionData = require(sessionPath);

new VoidClient({ session: sessionData! }).setup();
