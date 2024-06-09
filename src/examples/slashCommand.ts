import {
    Client,
    CommandInteraction,
    AutocompleteInteraction,
    ApplicationCommandOption,
    PermissionsString,
    ChatInputCommandInteraction,
} from "discord.js";

interface slashCommand {
    name: string;
    description: string;
    type: string;
    usage: string;
    cooldown: string;
    Permissions?: PermissionsString;
    botPermission?: PermissionsString;
    options: ApplicationCommandOption[];
    roles?: string[];
    flags?: {
        noReply?: boolean;
        developerOnly?: boolean;
        ephemeral?: boolean;
        ownerOnly?: boolean;
        mongodb?: boolean;
    };
    autoComplete?: (interaction: AutocompleteInteraction) => Promise<any>;
    run: (client: Client, interaction: ChatInputCommandInteraction) => Promise<any>;
}


export default slashCommand
