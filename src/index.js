const fs = require('node:fs');
const path = require('node:path');
require('dotenv').config();
const TOKEN = process.env.TOKEN
const { Client, GatewayIntentBits, Collection, Events, EmbedBuilder, ActivityType } = require('discord.js');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.cooldowns = new Collection();
client.commands = new Collection();

const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders){
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
    for (const file of commandFiles){
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        if('data' in command && 'execute' in command){
            client.commands.set(command.data.name, command);
        } else {
            console.log(`[PELIGRO] El comando ${filePath} necesita una propiedad "data" o "execute".`);
        }
    }
}

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = require(filePath);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    } else {
        client.on(event.name, (...args) => event.execute(...args));
    }
}

client.on(Events.InteractionCreate, async interaction => {
    if(!interaction.isModalSubmit()) return;

    if(interaction.customId === 'EmbedBuilder'){
        const title = interaction.fields.getTextInputValue('titulo'),
            desc = interaction.fields.getTextInputValue('desc'),
            image = interaction.fields.getTextInputValue('image')

        const modalEmbed = new EmbedBuilder()
            .setColor('#5166f7')
            .setTitle(title)
            .setDescription(desc)
            .setThumbnail('https://cdn.discordapp.com/attachments/1060037703212740689/1103210436414931014/sena_bot.jpg')
            .setImage(image)

            await interaction.channel.send({ embeds: [modalEmbed]})

            await interaction.reply({ content: '¡Se subio perfecto!', ephemeral: true})
    }

})

client.on('ready', (c) => {
    client.user.setActivity({
        name: "a programar.",
        type: ActivityType.Playing,
    });
});

client.login(TOKEN);