import {client} from "../../index.js"


client.on("ready", async () => {
     await client.application.commands.set(client.slashCommands.map(d => ({
        name: d.name.toLowerCase().trim(),
        description: d.description,
        options: d.options,
        defaultPermission: d.defaultPermission
    }))).catch(err => console.error(err));
    console.log(client.application.commands.cache.size + " slash commands registered")
})