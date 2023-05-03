const { SlashCommandBuilder, Client } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('grupo')
        .setDescription('Selecciona tu grupo de estudio.')
        .addStringOption(option =>
            option
                .setName('nombre')
                .setDescription('Escribe tu nombre.')
                .setRequired(true)    
        )
        .addStringOption(option =>
            option
                .setName('apellido')
                .setDescription('Escribe tu apellido.')
                .setRequired(true)    
        )
        .addStringOption(option =>
            option
                .setName('ficha')
                .setDescription('Selecciona tu grupo.')
                .setRequired(true)
                .addChoices(
                    { name: '2395871-G1', value: '1072687863348613140'},
                    { name: '2617510-G3', value: '1077018692837199932'}
                )
            ),
        async execute(interaction){
            const channel = interaction.channel;

            const member = interaction.user;
            const guildMember = await interaction.guild.members.fetch(member.id);

            const name = interaction.options.getString('nombre');
            const lastname = interaction.options.getString('apellido');

            const username = `${name} ${lastname}`;

            const arr = username.split(" ");

            for (var i = 0; i < arr.length; i++){
                arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);
            }
            const userCapitalize = arr.join(" ");

            const ficha = interaction.options.getString('ficha');

            const rol = interaction.guild.roles.cache.get(ficha);

            if(channel.id === "1049538187703369785" || channel.id === "1100301375436488795"){
                if(guildMember.roles.cache.some(role => role.name === 'ADMIN' || 'admin' || 'moderadores' || 'Profe')){
                    return interaction.reply({ content: `No se puede modificar a las personas con este rol.`, ephemeral: true})
                }else{
                    guildMember.roles.add(rol);
                    guildMember.roles.add('1103222659329818664');
                    guildMember.setNickname(userCapitalize);
    
                    return interaction.reply({ content: `Bienvenido **${userCapitalize}**, ahora estas en el grupo **${rol.name}**`, ephemeral: true})
                }
                
            } else {
                return interaction.reply({ content: `¡Este comando no se usa aquí!`, ephemeral: true})
            }
            
        }
}