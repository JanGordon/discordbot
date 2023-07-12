const Discord = require('discord.js');

const client = new Discord.Client({ intents: ["GUILDS", "GUILD_MESSAGES", "GUILD_VOICE_STATES"] });

const token = process.env.TOKEN

let commands = {
    white : {
        filter: message=>message.content.includes("white"),
        callback: function(e){
            e.channel.send("Are you assuming my gender")
        }
    },
}

client.on('messageCreate', async message => {
	if (!message.author.bot) {
        for (let [key, value] of Object.entries(commands)) {
            if (value.filter(message)){
                let p = perms[key]
                let permitted = false;
                if (message.member.roles.cache.some(role => String(p).includes(role.name)) || p == undefined){
                    permitted = true
                }
                if (permitted) {
                    value.callback(message)
                }
            }
        
        }
    }
});
client.login(token)
