import { Message, PermissionsString } from "discord.js";
import { CustomClient } from "../index.js";

export default interface Command {
    name: string;
    Aliases: string[];
    type: string;
    usage: string;
    description: string;
    cooldown?: string;
    Permissions?:  PermissionsString;
    botPermission?: PermissionsString;
    roles: string[];
    dependencies: string[];
    flags?: {
        developerOnly?: boolean;
        mongodb?: boolean;
        ownerOnly?: boolean;
    };
    run: (client: CustomClient,message: Message, args: string[]) => Promise<any>;
}