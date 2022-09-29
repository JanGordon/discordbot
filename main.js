const Discord = require('discord.js');
const nac = require('./nac.js')
const { joinVoiceChannel, createAudioPlayer, NoSubscriberBehavior, createAudioResource, AudioPlayerStatus, getVoiceConnection, entersState } = require('@discordjs/voice');
const play = require('play-dl'); // Everything
const solenolyrics = require("solenolyrics"); 
const perms = require("./perms.json")
const fs = require('fs');
const discordTTS = require('discord-tts');
const readline = require('readline');
const cron = require('node-cron');
const puppeteer = require("puppeteer");
const { count } = require('console');
const client = new Discord.Client({ intents: ["GUILDS", "GUILD_MESSAGES", "GUILD_VOICE_STATES"] });
const token = "OTg2NzEyNjkwOTA5MTI2NzI3.GHRoxX.qXw55gwyID_GwP0XsYAx9QAc6LAsIVE03vVfos"
client.once('ready', () => {
	console.log(`Ready`)
});

// client.on("ready", function (e) {

// })

cron.schedule("45 7 * * *", function() {
    client.channels.cache.get('986711573273935967').send('Hello World!')
  });
let player;
let leaveTimer;
let connection;
let musicStatus = "Idle"
let musicQueue = []
let serverStats = {
    users: client,
    messageRate: {

    }
}
for (let user of client.users.cache) {
    serverStats.messageRate[user] = {}
}

var countsd = 0
var insults = []
async function getInsults () {
    const fileStream = fs.createReadStream('insults.txt');

    var rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });
    for await (const line of rl) {
        countsd++
        insults.push(String(line))
    }
}

getInsults()

var jokeCount = 0
var jokes = []
async function getJokes () {
    const fileStream = fs.createReadStream('jokes.txt');

    var rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });
    for await (const line of rl) {
        jokeCount++
        jokes.push(String(line))
    }
}

getJokes()

let jo = JSON.parse(String(fs.readFileSync("yomama.json")))
let games = {}

let commands = {
    white : {
        filter: message=>message.content.includes("white"),
        callback: function(e){
            e.channel.send("Are you assuming my gender")
        }
    },
    yo : {
        filter: message=>message.content.includes("yo mama"),
        callback: function(e){
            for (let [key, value] of Object.entries(jo)) {
                if (e.content.includes(key)) {
                    console.log(jo[key], Math.random() * (jo[key].length-1) )
                    e.channel.send(jo[key][Math.floor(Math.random() * (jo[key].length-1))])
                    return
                }
                    
            }
            e.channel.send(insults[Math.floor(Math.random() * countsd)])

        }
    },
    chad : {
        filter: message=>message.content.includes("chad"),
        callback: function(e){
            e.channel.send("gigachad")
        }
    },
    gigachad : {
        filter: message=>message.content == "giga",
        callback: function(e){
            e.channel.send("chad")
        }
    },
    lord : {
        filter: message=>message.content.includes("lord"),
        callback: function(e){
            e.channel.send("Hello")
        }
    },
    prayer : {
        filter: message=>message.content.includes("!prayer"),
        callback: function(e){
            let prayer = `Dear Lord,

            Your presence is the eternity that shames all others.
            Your strength, an insult to the best.
            Your build, a palace for your potency -
            You dwarf those who quarrel with you.
            Forget not:
            Our Lord, who art a pigeon
            Your rule will never be forgotten.
            Honoured be thou name,
            
            Thou shalt be king forever and ever
            Amen
            `
            e.channel.send(prayer)
        }
    },
    anime : {
        filter: message=>message.content.includes("anime"),
        callback: function(e){
            e.channel.send("Anime is a bad thing")
        }
    },
    schedule : {
        filter: message=>message.content=="!schedule",
        callback: function(e){
            e.channel.send("What message?: ")
            requestNextAnswer(e.author, 100000)
            .then((msg)=>{
                e.channel.send("When? (21:21)")
                requestNextAnswer(e.author, 100000)
                .then((time)=>{
                    e.channel.send("Which thread (right-click copy id)?")
                    requestNextAnswer(e.author, 100000)
                    .then((thread)=>{
                        try {
                            client.channels.cache.get(thread.content)
                            e.channel.send(`Sending message at ${time.content}`)
                                cron.schedule(time.content, () => {
                                    client.channels.cache.get(thread.content).send(msg.content)
                            });
                        } catch (err) {e.channel.send("Please enter a valid thread id!")}
                    })
                .catch((msg)=>{e.channel.send("Schedule expired." + msg)})
                })
                .catch((msg)=>{e.channel.send("Schedule expired." + msg)})
            })
            .catch((msg)=>{e.channel.send("Schedule expired." + msg)})
        }
    },
    countdown : {
        filter: message=>message.content.startsWith("!countdown"),
        callback: function(e){
            var args = e.content.replace("!countdown ", "").split(" ")
            
            var i = Number.parseInt(args[0])
            try {
            function countdown () {
                if (i>0) {
                    setTimeout(countdown, 1000)
                    e.channel.send(String(i))
                } else if (i == 0) {
                    e.channel.send(args[1])
                }
                i -= 1
            }

            countdown()
            } catch (e) {e.channel.send("Please enter a valid time to count down!")}
        }
    },
    clear : {
        filter: message=>message.content.startsWith("!clear"),
        callback: function(e){
            var count = e.content.replace("!clear ", "")
            if (!count) {
                count = 1
            }
            //try {
               e.channel.bulkDelete(Number(count+1)) 
            //} catch (e) {e.channel.send("Please enter a valid amount of messages to delete!")}
            
        }
    },
    tictactoe : {
        filter: message=>message.content.startsWith("!tictactoe"),
        callback: function(e){
            const exampleEmbed = new Discord.MessageEmbed()
            .setColor('#0099ff')
            .setTitle('Noughts and Crosses')
            .addFields(
                { name: '□', value: '_', inline: true },
                { name: '□', value: '_', inline: true },
                { name: '□', value: '_', inline: true },
            )
            .addFields(
                { name: '□', value: '_', inline: true },
                { name: '□', value: '_', inline: true },
                { name: '□', value: '_', inline: true },
            )
            .addFields(
                { name: '□', value: '_', inline: true },
                { name: '□', value: '_', inline: true },
                { name: '□', value: '_', inline: true },
            )
            // const row = new Discord.MessageActionRow()
			// .addComponents(
			// 	new Discord.MessageButton()
			// 		.setCustomId('primary')
			// 		.setLabel('Primary')
			// 		.setStyle('SECONDARY'),
			// )
            
            
            
            e.channel.send({ components : [
                {type: 1, components: [
                    
                      new Discord.MessageButton()
                          .setCustomId('tt11')
                          .setLabel('■')
                          .setStyle('SECONDARY')

                      ,
                    new Discord.MessageButton()
                        .setCustomId('tt12')
                        .setLabel('■')
                        .setStyle('SECONDARY')
                        ,
                    new Discord.MessageButton()
                        .setCustomId('tt13')
                        .setLabel('■')
                        .setStyle('SECONDARY')
                        ,
                ]},
                {type: 1, components: [
                    new Discord.MessageButton()
                        .setCustomId('tt21')
                        .setLabel('■')
                        .setStyle('SECONDARY')
                        ,
                    new Discord.MessageButton()
                        .setCustomId('tt22')
                        .setLabel('■')
                        .setStyle('SECONDARY')
                        ,
                    new Discord.MessageButton()
                        .setCustomId('tt23')
                        .setLabel('■')
                        .setStyle('SECONDARY')
                        ,
                ]},
                {type: 1, components: [
                    new Discord.MessageButton()
                        .setCustomId('tt31')
                        .setLabel('■')
                        .setStyle('SECONDARY')
                        ,
                    new Discord.MessageButton()
                        .setCustomId('tt32')
                        .setLabel('■')
                        .setStyle('SECONDARY')
                        ,
                    new Discord.MessageButton()
                        .setCustomId('tt33')
                        .setLabel('■')
                        .setStyle('SECONDARY')
                        ,
                ]},
            ]}).then(e => {
                let game = new nac.game(client, e)
                game.id = e.id
                e.channel.send(e.id)
                games[e.id] = game
                var square = "987407124780945428"
            })

            
        }
    },
    racist : {
        filter: message=>String(message.content).includes("black"),
        callback: function(e){
            console.log(e.author)
            e.channel.send("racist");
        }
    },
    deeznutz : {
        filter: message=>message.content.startsWith("!deeznutz"),
        callback: function(e){
            e.channel.send("🥜 🌰");
            setTimeout(()=>{e.channel.send("LOL")}, 1000)
        }
    },
    stats : {
        filter: message=>message.content.startsWith("!stats"),
        callback: function(e){
            e.channel.send("Loading Stats...")
            let channels = client.channels.cache
            var startTime = client.uptime
            for (let i of client.users.cache) {
                serverStats.messageRate[i] = {}
            }
            for (var channel of channels) {
                console.log(channel)
                if (channel[1].type == "GUILD_TEXT") {
                    var currentStartTime = client.uptime
                    var currentUpperTime = currentStartTime + 3600000 
                    const allMessages = fetchAllMessages(channel[1])
                    
                    .then((e)=>{
                        // for (let message of i) {
                        //     if (message.createdTimestamp > currentStartTime && message.createdTimestamp <= currentUpperTime) {
                        //         if (serverStats.messageRate[message.author][currentStartTime] == undefined) {
                        //             serverStats.messageRate[message.author][currentStartTime] = 1
                        //         } else {
                        //             serverStats.messageRate[message.author][currentStartTime] += 1
                        //         }
                        //     }
                            
                            
                        // }
                        console.log(serverStats.messageRate)
                    })
                }
                
            }
            e.channel.send(`
                User Count: ${client.users.cache.size}
                Channel Count: ${client.channels.cache.size}
                Guild Count: ${client.guilds.cache.size}
                `);
            setTimeout(()=>{e.channel.send("LOL")})
        }
    },
    scout : {
        filter: message=>message.content.startsWith("!scout"),
        callback: async function(e){
            var args = e.content.replace("!scout ", "").split(" ")
            const browser = await puppeteer.launch();
            const page = await browser.newPage();
            try {
                await page.goto(args[0]);
                await page.screenshot({path: 'screenshot.png'});
                e.channel.send({files: ["screenshot.png"]})
            } catch (err) {
                e.channel.send("Failed to scout")
            }
            
            browser.close();
            
        }
    },
    play : {
        filter: message=>message.content.startsWith("!play"),
        callback: async function(e){
            playMusic(e)
        }
    },
    pause : {
        filter: message=>message.content.startsWith("!pause"),
        callback: async function(e){
            player.pause()
            e.channel.send("Music player paused")
        }
    },
    resume : {
        filter: message=>message.content.startsWith("!resume"),
        callback: async function(e){
            player.unpause()
            e.channel.send("Music player unpaused")
        }
    },
    skip : {
        filter: message=>message.content.startsWith("!skip") || message.content.startsWith("next song"),
        callback: async function(e){
            player.stop()
            e.channel.send("Music skipped")
        }
    },
    james : {
        filter: message=>String(message.author).includes("JAMES"),
        callback: async function(e){
            e.channel.send("JAMES has spoken")
        }
    },
    queue : {
        filter: message=>message.content.startsWith("!queue"),
        callback: async function(e){
            try {
               let titles = ""
                let temp = musicQueue.slice()
                temp.splice(0,1)
                console.log(musicQueue, temp)
                for (let video of temp) {
                    titles += `

                    ` + video.video_info.title
                }
                e.channel.send(`
                    Currently playing: ${musicQueue[0].video_info.title},
Queue: ${titles}
                `) 
            } catch (err) {
                e.channel.send("No songs in queue!")
            }
            
        }
    },
    lyrics : {
        filter: message=>message.content.startsWith("!lyrics"),
        callback: async function(e){
            function chunkSubstr(str, size) {
                const numChunks = Math.ceil(str.length / size)
                const chunks = new Array(numChunks)
              
                for (let i = 0, o = 0; i < numChunks; ++i, o += size) {
                  chunks[i] = str.substr(o, size)
                }
              
                return chunks
              }
            let lyrics = await solenolyrics.requestLyricsFor(musicQueue[0].video_info.title) || "Not Found!";
            let splitCount = Math.ceil(lyrics.length / 1800)
            let splitPositions = Math.ceil(lyrics.length/splitCount)
            let chunks = chunkSubstr(lyrics, splitPositions)
            for (let i of chunks) {
                e.channel.send(i)
            }
            
            
        }
    },
    speak : {
        filter: message=>message.content.startsWith("!speak"),
        callback: async function(e){
            var args = e.content.replace("!speak ", "").split(" ")
            let stream, resource;
            stream = await discordTTS.getVoiceStream('hee hee')
            resource = createAudioResource(stream.stream, {
            inputType: stream.type
            })
            resource.video_info = {}
            resource.video_info.title = args[0]
            
            musicQueue.push(resource)
        }
    },
    insult : {
        filter: message=>message.content.startsWith("!insult"),
        callback: function(e){
                e.channel.send(insults[Math.floor(Math.random() * countsd)])
            
        }
    },
    joke : {
        filter: message=>message.content.startsWith("!joke"),
        callback: function(e){
            var [joke, answer] = jokes[Math.floor(Math.random() *jokeCount)].split("<>")
                e.channel.send(joke)
                setTimeout(function() {e.channel.send(answer)}, 3000)
            
        }
    },
    shutup : {
        filter: message=>message.content.toLowerCase().replace( /\s/g, '').includes("shutup"),
        callback: function(e){
            e.channel.send("Calm it down now.")
        }
    },
    hi : {
        filter: message=>message.content.startsWith("!hi"),
        callback: function(e){
            e.channel.send("$hi")
        }
    },
    calc : {
        filter: message=>message.content.startsWith("!calc"),
        callback: function(e){
            var args = e.content.replace("!calc ", "")
            eval(args)
        }
    },
    rankdown : {
        filter: message=>message.content.includes("rank") && message.content.includes("down"),
        callback: function(e){
            e.channel.send("Ranking down should only be done in extreme circumstances and should therefore be very rarely done. For further information please ask Edache.")
        }
    },
    // hi : {
    //     filter: message=>message.content.startsWith("$hi"),
    //     callback: function(e){
    //         e.channel.send("No")
    //     }
    // },

    // permissions : {
    //     filter: message=>message.content.startsWith("!permissions"),
    //     callback: async function(e){
    //         var args = e.content.replace("!permissions ", "").split(" ")
    //         let roles = args.splice(0,1)
    //         perms.clear = []
            
            
            
    //     }
    // },

}
//countodown
client.on('messageCreate', async message => {
	// Turns the bot on
	
    console.log(message.author)
	if (!message.author.bot) {
        let temp = {...commands}
        for (let [key, value] of Object.entries(commands)) {

            // message.channel.send(p + " Permissions")

            
            
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
        // The bot will ignore messages from other bots
        
        //if (!message.content.startsWith(config.prefix)) return;
        // Ignores messages that don't start with the prefix

        if (message.content.includes("ping")) {
        // Read for the ping command
            message.channel.send(`Pong!`)
            // Send 'pong' into the channel if the ping command is heard
            }
        if (message.content.includes("pong")) {
            message.channel.send("Ping!")
        }
        }
        if (message.content.startsWith("Wassup, I am Danostevo Bot!") && message.author.id == "1023977043534286888") {
            message.channel.send("<@1023977043534286888> " + insults[Math.floor(Math.random() * countsd)])
        }
    }
    

    
);

client.on('interactionCreate', interaction => {
	if (!interaction.isButton()) return;
	const filter = i => true;

    const collector = interaction.channel.createMessageComponentCollector({ filter, time: 15000 });
    console.log(interaction)
    // interaction.channel.send(String(interaction.message))
    
    var game = games[interaction.message.id]
    game.place([...interaction.customId.replace("tt", "")], interaction.user)
    interaction.update({ components: game.getUpdate() });
    // collector.on('collect', i => {
    //         console.log(i)
    //         i.update({ content: 'A button was clicked!', components: [] });
        
    // });

    collector.on('end', collected => console.log(`Collected ${collected.size} items`));
});

let reqCount = 0
function requestNextAnswer (user, timeout) {
    return new Promise((resolve, reject)=>{
        commands[reqCount] = {   
            filter: message=>message.author==user,
            callback: function (message) {
                resolve(message)
                delete commands[reqCount]
            }
        }
        let tempCount = reqCount
        setTimeout(()=>{try {
            delete commands[tempCount]
            reject("Timeout");
        } catch (err){}},timeout)
        reqCount++
    })
}


async function fetchAllMessages(channel) {
    let messages = [];
  
    // Create message pointer
    let message = await channel.messages
      .fetch({ limit: 1 })
      .then(messagePage => (messagePage.size === 1 ? messagePage.at(0) : null));
    var currentStartTime = client.uptime
    var currentUpperTime = currentStartTime + 3600000 
    while (message) {
      await channel.messages
        .fetch({ limit: 100, before: message.id })
        .then(messagePage => {
          messagePage.forEach(message => {
            if ((message.createdTimestamp > currentStartTime && message.createdTimestamp <= currentUpperTime)==false) {
                currentStartTime = currentUpperTime
                currentUpperTime = currentStartTime + 3600000
            }
            console.log(serverStats.messageRate[message.author], currentStartTime)
            if (serverStats.messageRate[message.author] == undefined) {
                serverStats.messageRate[message.author] = {}
                serverStats.messageRate[message.author][currentStartTime] = 1
            } else {
                serverStats.messageRate[message.author][currentStartTime] += 1
            }
            messages.push(message)
        });
            
          // Update our message pointer to be last message in page of messages
          message = 0 < messagePage.size ? messagePage.at(messagePage.size - 1) : null;
        })
    }
  
    return messages  // Print all messages
  }

async function playMusic (e) {
    if (e.member.voice.channel == undefined) {
        e.channel.send("Please join a voice channel before running this command")
        return
    }
    if (connection == undefined || connection.channelID != e.member.id) {
        connection = joinVoiceChannel({
            channelId: e.member.voice.channel.id,
            guildId: e.guild.id,
            adapterCreator: e.guild.voiceAdapterCreator
        })
        connection.channelID = e.member.voice.channel.id
    }
    if (player == undefined) {
        
        player = createAudioPlayer()
        player.on(AudioPlayerStatus.Idle, () => {
            musicQueue.splice(0,1)
            console.log(musicQueue)
            if (musicQueue.length > 0) {
                console.log("Playing", musicQueue == [], musicQueue)
                try {
                    let r = musicQueue[0]
                    player.play(r)
                    e.channel.send(`Now Playing ${musicQueue[0].yt_info.title}`)
                    musicStatus = "Playing"
                    clearTimeout(leaveTimer)
                } catch (err) {
                    
                }
            } else {
                console.log("Leaving")
                e.channel.send("Leaving in 60 seconds...")
                leaveTimer = setTimeout(() => {leave(e)}, 60000)
                musicStatus = "Idle"
            }
        });
        connection.subscribe(player)
    }
    try {
        if (musicStatus == "Playing") {

            //Add song to queue
            console.log("addingsong")
            var args = [e.content.trim().replace("!play", "")]
            if (args[0] == "" || args[0] == undefined) {
                args[0] = "never gonna give you up"
            }
            let stream, resource;
            if (args[0].startsWith("https://")) {
                stream = await play.stream(args[0])
                resource = createAudioResource(stream.stream, {
                inputType: stream.type
                })
            } else {
                let yt_info = await play.search(args[0], {
                    limit: 1
                })
                
                stream = await play.stream(yt_info[0].url)
                
                resource = createAudioResource(stream.stream, {
                    inputType: stream.type
                })
                resource.video_info = yt_info[0]
                e.channel.send(`Added: "${yt_info[0].title}" to queue`)
            }
            
            musicQueue.push(resource)

            //if player isnt playing, play
            if (musicStatus != "Playing") {
                try {
                    let r = musicQueue[0]
                    player.play(r)
                    musicStatus = "Playing"
                    clearTimeout(leaveTimer)
                } catch (e) {}
            }
            // try {
            //     player.play(musicQueue[0])
            //     musicStatus = "Playing"
            //     e.channel.send("Playing Song")
            // } catch (err) {
                
            // }

            // try {
            //     player.play(musicQueue[0])
            //     musicStatus = "Playing"
            //     e.channel.send("Playing first song")
            // } catch (err) {
                
            // }
        } else {
            //add song to queue
            
            var args = [e.content.trim().replace("!play", "")]
                        if (args[0] == "" || args[0] == undefined) {
                args[0] = "never gonna give you up"
            }
            let stream, resource;
            if (args[0].startsWith("https://")) {
                stream = await play.stream(args[0])
                resource = createAudioResource(stream.stream, {
                inputType: stream.type
                })
            } else {
                let yt_info = await play.search(args[0], {
                    limit: 1
                })
                
                stream = await play.stream(yt_info[0].url)
                resource = createAudioResource(stream.stream, {
                    inputType: stream.type
                })
                resource.video_info = yt_info[0]
                
            }
            musicQueue.push(resource)
            console.log("addingsong and playing it", musicQueue )
            //play song
            // try {
                let r = musicQueue[0]
                player.play(r)
                musicStatus = "Playing"
                clearTimeout(leaveTimer)
                e.channel.send("Playing Song: " + musicQueue[0].video_info.title)
            // } catch (err) {
            //     console.log(err)
            // }
        }
    } catch (err) {
        return err
    }
    
}

function leave (e) {
    e.channel.send("Left");
    connection.destroy();
    player = undefined
    leaveTimer = undefined
    connection = undefined
    musicStatus = "Idle"
    currentPlaying = undefined
    musicQueue = []
}


client.login(token)
