export const name = "Void Bot";
export const prefix = "/";
export const PORT = 3000;
export const developers = ["6288215470045@c.us"] as string[];
export const resumeSession = true as boolean;
export const sessionPath = `${process.cwd()}/src/session.json`;
export default { name, prefix, PORT, developers, resumeSession, sessionPath };