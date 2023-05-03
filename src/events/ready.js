const { Events } = require("discord.js");

module.exports = {
    name: Events.ClientReady,
    once: true,
    execute(client){
        console.log(`¡Preparado! Logueado como ${client.user.tag}`);
    }
}