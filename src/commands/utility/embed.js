const { SlashCommandBuilder, ModalBuilder, TextInputStyle, TextInputBuilder, ActionRowBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName('embed')
    .setDescription('Construye y envia tu embed.'),
    async execute(interaction){
        const member = interaction.user;
        const memberGuild = await interaction.guild.members.fetch(member.id);

        const modal = new ModalBuilder()
            .setCustomId('EmbedBuilder')
            .setTitle('Construir Embed')
        
        const titleInput = new TextInputBuilder()
			.setCustomId('titulo')
			.setLabel("Titulo Principal")
			.setStyle(TextInputStyle.Short);

        const descInput = new TextInputBuilder()
			.setCustomId('desc')
			.setLabel("Parrafo")
			.setStyle(TextInputStyle.Paragraph);

        const imageInput = new TextInputBuilder()
            .setCustomId('image')
            .setLabel('Imagen')
            .setStyle(TextInputStyle.Short)

        const firstActionRow = new ActionRowBuilder().addComponents(titleInput);
		const secondActionRow = new ActionRowBuilder().addComponents(descInput);
		const thirdActionRow = new ActionRowBuilder().addComponents(imageInput);

        modal.addComponents(firstActionRow, secondActionRow, thirdActionRow);

        if(memberGuild.roles.cache.some(role => role.id === '1103133581469032488') || 
            memberGuild.roles.cache.some(role => role.id === '1072685807191740446') || 
            memberGuild.roles.cache.some(role => role.id === '1075958536468705310') ||
            memberGuild.roles.cache.some(role => role.id === '1075959255791837235'))
        {
            await interaction.showModal(modal);
        } else {
            return interaction.reply({ content: '¡No tienes permiso para usar ese comando!', ephemeral: true})
        }
    }
}