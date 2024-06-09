
import config from "../../config.js";
import {client} from "../../index.js"




client.on("interactionCreate", async (interaction) => {
    if(!interaction.inCachedGuild()) return
    
    if(!interaction.isAutocomplete() || !interaction.guild) return;
    const cmd = interaction.commandName;
    const command = client.slashCommands.get(cmd);
    if(!command) return;
    if((command?.Permissions && !interaction.member.permissions.has(command.Permissions)) || (command?.roles && command?.roles?.length > 0 && !command?.roles?.find(d =>  interaction.member.roles.cache.get(d)))) return;
    if(command.flags?.ownerOnly && interaction.guild.ownerId !== interaction.user.id) return 
    if(command.flags?.developerOnly && !config.developers.includes(interaction.user.id)) return
    if(command.autoComplete) {
       await command.autoComplete(interaction).catch(err => console.error(err))
    };

})