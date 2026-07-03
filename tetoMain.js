require('dotenv').config()

const Discord = require("discord.js");
const DiscordVoice = require("@discordjs/voice")
const client = new Discord.Client({ intents : [
    Discord.GatewayIntentBits.Guilds,
    Discord.GatewayIntentBits.GuildMessages,
    Discord.GatewayIntentBits.MessageContent,
    Discord.GatewayIntentBits.GuildModeration,
    Discord.GatewayIntentBits.GuildVoiceStates
]});

const Busy = new Map()
const token = process.env.TOKEN
const Commands = require('./commands.js')
const VoiceCommands = require('./voicecommands.js')
const Hangman = require('./hangman.js');

//===========================================================================================
// Casino Variables
//===========================================================================================

const Casino = require("./casino/CasinoRouter.js")
const economyModule = require("./casino/economy.js");
const activeCasinoGames = require('./casino/activeGames')

client.on('clientReady', () => {
    console.log('Logged in as ' + client.user.tag + '!')
})

//============================================================================================
// Personality Block
//============================================================================================
const MeanTargets = {
    '485675003354808320': 0.01 , //Kraken, 1%
    '997186885011120138': 0.05 , //V, 5%
    '341642668675301376': 0.15 , //Winston, 15%
    '287364463877685251': 0.05 , //Griffin, 5%
    '721142232417173535': 0.05 , //Jasmine, 50%
    '670390082208923686': 0.67 , //Saiphex, 67%
    '526612976766287904': 0.50 , //Scarfty, 50%
    '746391979717558302': 0.21 , //Dawson, 21%
    '427863057906008094': 0.50 , //Delumine, 50%
    '1228610030362693724': 0.20 , //Lena, 20%
    '571972159631523850': 0.50 , //Krayt, 50%
    '313125650338676736': 0.01 , //Danhotshot, 1%
    '871920856719310898': 0.99, //Dem 100%
}

const meanRoles = {
    '1476927536490352671': 0.01 , //Ashbourne Bloodlines, 1%
}

client.on('messageCreate', msg => {
    try {
    
    var content = msg.content.toLowerCase();
    if (msg.mentions.has(client.user)) {
        if (content.includes("fuck you")) {
            msg.reply("I bet you wish you could twerp :v:")
        } else if (content.includes("ily") || content.includes("i love you")) {
            msg.reply("It's not mutual.")
        }
    }
    
    let chance = MeanTargets[msg.author.id] || 0;    
    
    for (const [roleId, rollChance] of Object.entries(meanRoles)) {
        if (msg.member.roles.cache.has(roleId)) {
            chance = Math.max(chance, rollChance);
        }
    }
    
    if (chance <= 0 || Busy.get(msg.guild.id)) { return; }

    if (Math.random() < chance) {
        Commands.saySomethingMean(msg)
    }
    } catch(err) {
        console.error(err)
        msg.reply("I fucked up")
    }
})

//============================================================================================
// Text Channel Commands
//============================================================================================
client.on('messageCreate', async msg => {
    if (!msg.content.startsWith("yo Teto,")) { return }

    // MemberCount command
    if (msg.content === 'yo Teto, how many bums I got in this server?') {
        try { await Commands.maybeConfirm(msg, () => Commands.memberCount(msg))} catch(err) { console.error(err); msg.reply("I fucked up")}
    // Timeout Command
    } else if (msg.content === "yo Teto, time this grunt out") { 
        try { await Commands.maybeConfirm(msg,() => Commands.timeOutCommand(msg))} catch(err) {console.error(err); msg.reply("I fucked up")}
    //delete message Command
    } else if (msg.content === "yo Teto, clear some of this shit out") {
        try {await Commands.maybeConfirm(msg, () => Commands.bulkDelete(msg))} catch(err) { console.error(err); msg.reply("I fucked up") }
    //kick Command
    } else if (msg.content === 'yo Teto, nuke this chud') {
        try {await Commands.maybeConfirm(msg, () => Commands.kickMember(msg))} catch(err) {console.error(err); msg.reply("I fucked up")}
    } else if (msg.content === 'yo Teto, get rid of ts') {
        try {await Commands.maybeConfirm(msg, () => Commands.deleteSpecific(msg))} catch(err) { console.error(err); msg.reply("I fucked up")}
    } else if (msg.content === "yo Teto, whats this dicks ID") {
        try {await Commands.maybeConfirm(msg, () => Commands.getUserID(msg))} catch(err) {console.error(err); msg.reply("I fucked up")}
    } else if (msg.content === 'yo Teto, fry this bitch') {
        try {await Commands.maybeConfirm(msg, () => Commands.saySomethingMeanTargetted(msg))} catch(err) { console.error(err); msg.reply("I fucked up") }
    } else if (msg.content === 'yo Teto, break the bad news') {
        try {msg.reply("Fuh no twin :broken_heart:")} catch(err) { console.error(err); msg.reply("I fucked up") }
    } else if (msg.content === 'yo Teto, kill them') {
        try {await Commands.maybeConfirm(msg, () => Commands.slaughter(msg))} catch(err) { console.error(err); msg.reply("I fucked up") }
    } else if (msg.content == "yo Teto, they don't deserve you here, just leave em") {
        try {await Commands.maybeConfirm(msg, () => Commands.leaveServer(msg))} catch(err) { console.error(err); msg.reply("I fucked up") }
    }
})

//============================================================================================
// Voice Channel Commands
//============================================================================================
client.on('messageCreate', async msg => {
    if (msg.content === "yo Teto, hop in here") {
        try {
            var channel = msg.member.voice.channel

            if (channel) {
                const connection = DiscordVoice.joinVoiceChannel({
                    channelId: channel.id,
                    guildId: channel.guild.id,
                    adapterCreator: channel.guild.voiceAdapterCreator
                });
                msg.reply("Aight bet")
            } else {
                msg.reply("Dick you ain't even in a channel")
            }
        } catch (err) {
            msg.reply("I fucked up")
        }
    } else if (msg.content === 'yo Teto, get out bro') {
        var connection = DiscordVoice.getVoiceConnection(msg.guildId);

        if (connection) {
            connection.destroy()
            msg.reply("Aight I'm out")
        } else {
            msg.reply("You tripping?")
        }
    } else if (msg.content === "yo Teto, sing for me") {
        try{VoiceCommands.playSong(msg)} catch(err) { console.error(err); msg.reply("I fucked up") }
    } else if (msg.content === "yo Teto, silence this chud") {
        try {await Commands.maybeConfirm(msg, () => VoiceCommands.muteMember(msg))} catch(err) { console.error(err); msg.reply("I fucked up")}
    } else if (msg.content === "yo Teto, let it speak") {
        try {await Commands.maybeConfirm(msg, () => VoiceCommands.unMuteMember(msg))} catch(err) { console.error(err); msg.reply("I fucked up")}
    } else if (msg.content === 'yo Teto, make it deaf') {
        try {await Commands.maybeConfirm(msg, () => VoiceCommands.deafenMember(msg))} catch(err) { console.error(err); msg.reply("I fucked up")}
    } else if (msg.content === "yo Teto, let it hear") {
        try {await Commands.maybeConfirm(msg, () => VoiceCommands.unDeafenMember(msg))} catch(err) { console.error(err); msg.reply("I fucked up")}
    } else if (msg.content === 'yo Teto, get rid of this dickhead') {
        try {await Commands.maybeConfirm(msg, () => VoiceCommands.disconnectMember(msg))} catch(err) { console.error(err); msg.reply("I fucked up") }
    }
})

//============================================================================================
// Games
//============================================================================================

client.on('messageCreate', async msg => {
    if (!msg.content.startsWith("yo Teto,")) { return }

    if (msg.content === "yo Teto, let's play hangman") {
        Busy.set(msg.guild.id, true)
        try {
            const players = await Commands.maybeConfirm(msg, () => Hangman.gatherPlayers(msg))
            
            if (!players || players === "no_players") {
                Busy.set(msg.guild.id, false);
                return;
            }

            await Hangman.hangMan(msg)

        } catch(err) { 
            console.error(err); msg.reply("I fucked up")
        }

        Busy.set(msg.guild.id, false);
    } else if (msg.content === "yo Teto, let's go gambling") {
        try {
            await Casino.start(msg)
        } catch(err) {
            console.error(err)
            msg.reply("I fucked up")
        }
    } else if (msg.content === "yo Teto, give this chud a bailout") {
        if (Commands.isItBoss(msg.author.id)) {
            try {
                const targetMessage = await msg.channel.messages.fetch(msg.reference.messageId)
                economyModule.addMoney(targetMessage.author.id, 100)
                msg.reply("Tossed that chud 100 chips for ya boss")

            } catch(err) {
                console.error(err)
                msg.reply("I fucked up")
            }
        }
    } else if (msg.content === "yo Teto, make this guy rich asf") {
        if (Commands.isItBoss(msg.author.id)) {
            try {
                const targetMessage = await msg.channel.messages.fetch(msg.reference.messageId)
                economyModule.addMoney(targetMessage.author.id, 5000)
                msg.reply("Gave them about 5000 chips, they rich af now")

            } catch(err) {
                console.error(err)
                msg.reply("I fucked up")
            }
        }
    }
})

client.login(token)
