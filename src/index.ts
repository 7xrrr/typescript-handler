
import {Client, Options, Partials,Collection } from "discord.js";
import { loadCommands, loadEvents, loadSlashCommand, autoLoad } from "./handlers/Handlers.js";
import config from "./config.js";
import I18n from "./handlers/i18n.js";
import mongoose from "mongoose";

export class CustomClient extends Client {
    I18n: I18n = new I18n();
    guildSettings: Collection<String, any> = new Collection();
    commands: Collection<String, any> = new Collection();
    slashCommands: Collection<String, any> = new Collection();
    cooldowns: Collection<String, any> = new Collection();
    dependencies: any[] = [];
}

export let client = new CustomClient({
    
    intents: 3276799,
    partials: [Partials.Message, Partials.GuildMember, Partials.Channel, Partials.Reaction, Partials.User]
}); 
// Error Handling

process.on("unhandledRejection", console.error);
process.on("uncaughtException", console.error);


// Cache System




// Load Commands
(async () =>
  { 
await autoLoad(client);
await loadCommands(client);
await loadSlashCommand(client);
await loadEvents(client);
client.login(config.token).catch((err) => { console.log(err) });
  }
)()








mongoose.connect(config.mongoDB).then(() => { console.log("Connected to MongoDB") }).catch((err) => { console.log(err) });




































