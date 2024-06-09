
import mongoose from "mongoose";
import {client} from "../index.js";
import GuildConfig from "../models/guildConfig.js";

client.setMaxListeners(99);



client.on("ready", async () => {
    console.log(`Logged in as ${client.user.tag}`);
    if (mongoose.connection.readyState === 1) {
        const guildsData = await GuildConfig.find();
        guildsData.forEach(guild => {
            client.guildSettings.set(guild.guildId, guild);
        });


    } else console.log("MongoDB is not connected");

    
    console.table({
        "Client": {
            Username: client.user.tag,
            ID: client.user.id,
            Commands: `${client.commands.size} Commands | ${client.slashCommands.size} Slash`,
            guilds: client.guilds.cache.size,
            Settings: client.guildSettings.size,
        }
    });

})

