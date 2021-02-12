import { Client } from "@open-wa/wa-automate";
import BaseCommand from "../libs/BaseCommand";
import { ICommandOptions } from "../typings";

export function DefineCommand(identifier: string, options: ICommandOptions) {
    // eslint-disable-next-line func-names
    return function <T extends BaseCommand>(target: new (...args: any[]) => T): new (client: Client) => T {
        return new Proxy(target, {
            construct: (ctx, [client]): T => new ctx(client, identifier, options)
        });
    };
}
