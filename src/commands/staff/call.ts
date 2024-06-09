import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import discordStaffRoles from "../../discordStaffRoles.js";
import Command from "../../examples/command.js";
import EmbedBuilder from "../../handlers/autoLoad/CustomEmbed.js";
import ms from "ms"
console.log(discordStaffRoles)

export default {
    name: "call",
    Aliases: ["استدعاء"],
    type: "staff",
    usage: "-call [user]",
    description: "استدعاء العضو للتكت",
    cooldown: "1m",
    roles: discordStaffRoles.discordLeader.concat(discordStaffRoles.discordStaff),
    Permissions: "Administrator",
    botPermission: "Administrator",
    async run (client,message, args) {
        if(!args[0]) return message.reply({
            embeds: [new EmbedBuilder().setDescription(`سوي منشن للعضو الذي تريد استدعائه`)],
        });
        const member = message.mentions.members.first();
        if(!member) return message.reply({
            embeds: [new EmbedBuilder().setDescription(`العضو غير موجود`)],
        });
        if(member.user.bot) return message.reply({
            embeds: [new EmbedBuilder().setDescription(`لا يمكن استدعاء بوت`)],
        });
        if(member.id === message.author.id) return message.reply({
            embeds: [new EmbedBuilder().setDescription(`لا يمكنك استدعاء نفسك`)],
        });
        if(client.cooldowns.has(`callCommand-${message.author.id}`)) return message.reply({
            embeds: [new EmbedBuilder().setDescription(`يجب عليك الانتظار 5 دقائق`)],
        });
        const msg = await member.send({
            content: `**- <@${member.user.id}> 

            - تم استدعائك الي التكت يرجى الحضور خلال 10 دقائق .
            
            - <#${message.channel.id}>. **`,
            components: [new ActionRowBuilder<any>().addComponents(new ButtonBuilder().setStyle(ButtonStyle.Link).setLabel("الذهاب").setEmoji("🔗").setURL(message.channel.url))]
        }).catch(() => null)
        if(!msg) return message.reply({
            embeds: [new EmbedBuilder().setDescription(`لا يمكن استدعاء العضو`)],
        });
        message.reply({
            embeds: [new EmbedBuilder().setDescription(`تم استدعاء العضو ${member.toString()}`)]
        });
        client.cooldowns.set(`callCommand-${message.author.id}`, { time: Date.now() + ms("5m")   } )
        setTimeout(() => {
            client.cooldowns.delete(`callCommand-${message.author.id}`)
        }, ms("5m"));
         
    },

} as Command