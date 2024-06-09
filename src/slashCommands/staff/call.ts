import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ChatInputCommandInteraction, CommandInteraction, Interaction, SlashCommandStringOption, SlashCommandUserOption } from "discord.js";
import slashCommand from "../../examples/slashCommand.js";
import discordStaffRoles from "../../discordStaffRoles.js";
import EmbedBuilder from "../../handlers/autoLoad/CustomEmbed.js";
import { CustomClient } from "../../index.js";
import ms from "ms"

export default {
    name: "call",
    options: [new SlashCommandUserOption().setName("user").setDescription("User to call").setRequired(true),


],
    type: "staff",
    usage: "/call [user] [reason]",
    description: "امر استدعاء",
    cooldown: "1m",
    roles: discordStaffRoles.discordLeader.concat(discordStaffRoles.discordStaff),
    Permissions: "Administrator",
    run: async (client:CustomClient, interaction:ChatInputCommandInteraction)  => {
        
        if(!interaction.inCachedGuild() || !interaction.isCommand()) return;
        
        const member = interaction.options.getMember("user") 
        /*if(member?.id === interaction.user.id) return interaction.editReply({
            embeds: [new EmbedBuilder().setDescription("لا يمكنك استدعاء نفسك")],
        })*/
        if(member?.user.bot) return interaction.editReply({
            embeds: [new EmbedBuilder().setDescription("**لا يمكنك استدعاء بوت**")],
        })
        if(!member) return interaction.editReply({
            embeds: [new EmbedBuilder().setDescription("**العضو غير موجود**")],
        });
        if(client.cooldowns.has(`callCommand-${interaction.user.id}`)) return interaction.editReply({
            embeds: [new EmbedBuilder().setDescription(`**يجب عليك الانتظار 5 دقائق**`)],
        });
       

   



        const msg = await member.send({
            content: `**- <@${member.user.id}> 

            - تم استدعائك الي التكت يرجى الحضور خلال 10 دقائق .
            
            - <#${interaction.channel.id}>. **`,
            components: [new ActionRowBuilder<any>().addComponents(new ButtonBuilder().setStyle(ButtonStyle.Link).setLabel("الذهاب").setEmoji("🔗").setURL(interaction.channel.url))]
        }).catch(() => null)
        if(!msg) return interaction.editReply({
            embeds: [new EmbedBuilder().setDescription("لا يمكن استدعاء العضو")],
        });
       
        interaction.editReply({
            embeds: [new EmbedBuilder().setDescription(`**تم استدعاء العضو ${member.toString()}**`)]
        });
        client.cooldowns.set(`callCommand-${interaction.user.id}`, { time: Date.now() + ms("5m")   } )
        setTimeout(() => {
            client.cooldowns.delete(`callCommand-${interaction.user.id}`)
        }, ms("5m"));
     

      

      
    },
       
} as slashCommand