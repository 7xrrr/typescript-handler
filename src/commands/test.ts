import Command from "../examples/command.js";
import EmbedBuilder from "../handlers/autoLoad/CustomEmbed.js";
import { client } from "../index.js";


export default {
    name: "test",
    Aliases: ["t"],
    type: "test",
    usage: "test",
    description: "test",
    cooldown: "5m",
    Permissions: "Administrator",
    botPermission: "Administrator",
    async run (client,message, args) {
        
        message.reply("test")
    },

} as Command