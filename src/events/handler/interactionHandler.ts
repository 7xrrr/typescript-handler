
import config from "../../config.js";
import {client} from "../../index.js"
import mongoose from "mongoose";
import ms from "ms"
import humanizeDuration from "humanize-duration";
import EmbedBuilder from "../../handlers/autoLoad/CustomEmbed.js";


client.on("interactionCreate", async (interaction) => {
    
    if (!interaction.guild || !interaction.isCommand() ||  !interaction.inCachedGuild()) return;
    const lang = client.guildSettings.get(interaction.guild.id)?.lang || "ar";
    const i18n = client.I18n;
    const cooldowns = client.cooldowns;
    const cmd = interaction.commandName;
    let command = client.slashCommands.get(cmd);
    if (!command) return;

    let checkCoolDown = cooldowns.get(`${interaction.guildId}-${interaction.user.id}-${command.name}-slash`);
    if (checkCoolDown) {
        let time = checkCoolDown.time - Date.now();
        if (time > 0 && !checkCoolDown.reply) {
            checkCoolDown.reply = true;
            await interaction.reply({
                ephemeral: true, embeds: [new EmbedBuilder().setDescription(i18n.t("cooldown", lang, {
                    time: humanizeDuration(time, {
                        language: lang,
                        round: true,
                        units: ["m", "h", "s", "d"]
                    })
                }))]
            }).catch(err => null)
        };

        if (time > 0) return null;
    };
    if (command.flags?.developerOnly && !config.developers.includes(interaction.user.id)) return interaction.replied  ?  interaction.followUp({ content: i18n.t("developerOnly", lang)}) : interaction.reply({ content: i18n.t("developerOnly", lang), ephemeral: true });
    if (!command.flags?.noReply) await interaction.deferReply({ ephemeral: command.flags?.ephemeral || false }).then(() => interaction.replied = true).catch(err => null);
    if (command?.botPermission && !interaction.guild.members.me.permissions.has(command?.botPermission)) return interaction.replied ? interaction.editReply({ embeds: [new EmbedBuilder().setDescription(i18n.t("noPermissionBot", lang, { permissions: `\`${command.botPermission.join(", ")}\`` }))] }) : interaction.reply({ ephemeral: true, embeds: [new EmbedBuilder().setDescription(i18n.t("noPermissionBot", lang, { permissions: `\`${command.botPermission.toArray().join(", ")}\`` }))] });
    if ((
        command?.Permissions &&
            !interaction.member.permissions.has(command?.Permissions)
            ||
            !command?.Permissions && command?.roles?.length > 0 ? true : false) &&
        (command?.roles?.length > 0 &&
            !command?.roles?.find(d => interaction.member.roles.cache.get(d)))) {
                if(interaction.replied) return  interaction.followUp({
                    embeds: [new EmbedBuilder().setDescription(i18n.t("noPermmisionUser", lang, {
                        permissions: command?.Permissions?.toArray()?.length > 0 ? `\`${command?.Permissions?.toArray()?.join(", ")}\`` :
                            command.roles?.map(d => `<@&${d}>`).join(`, `)
                    }))]
                });
                else return interaction.reply({ ephemeral: true, embeds: [new EmbedBuilder().setDescription(i18n.t("noPermmisionUser", lang, { permissions: command?.Permissions?.toArray()?.length > 0 ? `\`${command?.Permissions?.toArray()?.join(", ")}\`` : command.roles?.map(d => `<@&${d}>`).join(`, `) }))] })
    }
    if (command.flags?.mongodb && mongoose.connection.readyState !== 1) return config.developers.includes(interaction.user.id) ? interaction.replied ? interaction.followUp({ embeds: [new EmbedBuilder().setDescription(i18n.t("noMongoDB", lang))] }) : interaction.reply({ ephemeral: true, embeds: [new EmbedBuilder().setDescription(i18n.t("noMongoDB", lang))] }) : null;
    if (command.flags?.ownerOnly && interaction.guild.ownerId !== interaction.user.id) return interaction.replied ? interaction.followUp({ embeds: [new EmbedBuilder().setDescription(i18n.t("ownerOnly", lang))] }) : interaction.reply({ ephemeral: true, embeds: [new EmbedBuilder().setDescription(i18n.t("ownerOnly", lang))] });
    console.log(command)
    command.run(client, interaction).catch((err) => console.error(err))
    cooldowns.set(`${interaction.guildId}-${interaction.user.id}-${command.name}-slash`, { time: Date.now() + ms(command.cooldown), reply: false });
    if (ms(command.cooldown) > 0 && ms(command.cooldown) < 2147483647) {
        setTimeout(() => {
            cooldowns.delete(`${interaction.guildId}-${interaction.user.id}-${command.name}-slash`);
        }, ms(command.cooldown));
    }














})