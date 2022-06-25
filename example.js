const Discord = require('discord.js');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus, getVoiceConnection, entersState } = require('@discordjs/voice');
const play = require('play-dl');

const client = new Discord.Client({ intents: ["GUILDS", "GUILD_MESSAGES", "GUILD_VOICE_STATES"] });

client.on("messageCreate", async function (message) {
    if (message.content.startsWith("!play")) {
        const connection = joinVoiceChannel({
            channelId: message.member.voice.channel.id,
            guildId: message.guild.id,
            adapterCreator: message.guild.voiceAdapterCreator
        })
        let stream = await play.stream("https://www.youtube.com/watch?v=3mqb7jyCzE8")
        let resource = createAudioResource(stream.stream, {
            inputType: stream.type
        })

        let player = createAudioPlayer()

        player.on(AudioPlayerStatus.Idle, () => {
            console.log("Current Status is Idle")
        })
        player.play(resource);
        connection.subscribe(player)
    }
})


client.login("OTg2NzEyNjkwOTA5MTI2NzI3.GlmvSy.PxWUVnnsinsK6rcVs9cn_Q-ofvJ_RjghjpU9ys")