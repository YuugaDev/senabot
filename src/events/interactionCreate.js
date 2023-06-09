const { Events, Collection } = require("discord.js");

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        if(!interaction.isChatInputCommand()) return;

        const command = interaction.client.commands.get(interaction.commandName);

        if(!command){
            console.log(`No se encontró el comando ${interaction.commandName}.`);
            return;
        }

        const { cooldowns } = interaction.client;

        if(!cooldowns.has(command.data.name)){
            cooldowns.set(command.data.name, new Collection());
        }

        const now = Date.now();
        const timestamps = cooldowns.get(command.data.name);
        const defaultCooldownDuration = 3;
        const cooldownAmount = (command.cooldown ?? defaultCooldownDuration) * 1000;

        if(timestamps.has(interaction.user.id)){
            const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount;

            if(now < expirationTime){
                const expiredTimestamp = Math.round(expirationTime / 1000);
                return interaction.reply({ content: `Por favor espera, tienes un tiempo de espera por ${command.data.name}. Puedes usarlo de nuevo en <t:${expiredTimestamp}:R>`, ephemeral: true});
            }
        }

        timestamps.set(interaction.user.id, now);
        setTimeout(()=> timestamps.delete(interaction.user.id), cooldownAmount);

        try {
            await command.execute(interaction);
        } catch (error) {
            console.error(`Error ejecutando ${interaction.commandName}`);
            console.error(error);
        }
    },
};