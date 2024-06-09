import slashCommand from "../examples/slashCommand.js";
import { client } from "../index.js";

export default {
    name: "test",
    options: [],
    Aliases: ["t"],
    type: "test",
    usage: "test",
    description: "test",
    cooldown: "5m",
    Permissions: "Administrator",
    flags: {
        noReply: true
    },
    botPermission: "Administrator",
    async run(client, interaction) {
        interaction.reply("test")
    },
       
} as slashCommand