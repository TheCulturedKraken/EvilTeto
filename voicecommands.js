//const { createAudioPlayer, createAudioResource, joinVoiceChannel, AudioPlayerStatus } = require("@discordjs/voice")
const DiscordVoice = require('@discordjs/voice')
const fs = require('fs')
const { join } = require('node:path')

const commands = require('./commands')

const audioFiles = {}

function playSong(msg) {

    let connection = DiscordVoice.getVoiceConnection(msg.guildId);
    if (!connection) {
        return msg.reply("I'm not even in a VC dumbass");
    }

    const files = fs.readdirSync(
        join(__dirname, "audio_files")
    )
    
    var audioPlayer = DiscordVoice.createAudioPlayer();
    
    const randomSong = files[Math.floor(Math.random() * files.length)]
    
    var song = DiscordVoice.createAudioResource(
        join(__dirname, 'audio_files', randomSong)
    );

    connection.subscribe(audioPlayer);
    audioPlayer.play(song);

    audioPlayer.on(DiscordVoice.AudioPlayerStatus.Playing, () => {
        msg.channel.send("Shit you'll fw this one")
    })

    audioPlayer.on(DiscordVoice.AudioPlayerStatus.Idle, () => {
        msg.channel.send("Finished with that one")
    })
}

async function muteMember(msg) {
    if (!commands.isItBoss(msg.author.id)) { return }

    try {
        const targetMessage = await msg.channel.messages.fetch(msg.reference.messageId)
        const targetMember = targetMessage.member
        
        if (targetMember.voice.channel) {
            await targetMember.voice.setMute(true, "Boss gave the order")
        }
    } catch(err) {
        console.error(err) 
        msg.reply("I fucked up")
    }
}

async function unMuteMember(msg) {
    if (!commands.isItBoss(msg.author.id)) { return }

    try {
        const targetMessage = await msg.channel.messages.fetch(msg.reference.messageId)
        const targetMember = targetMessage.member
        
        if (targetMember.voice.channel) {
            await targetMember.voice.setMute(false, "Boss gave the order")
        }
    } catch(err) {
        console.error(err) 
        msg.reply("I fucked up")
    }
}

async function deafenMember(msg) {
    if (!commands.isItBoss(msg.author.id)) { return }

    try {
        const targetMessage = await msg.channel.messages.fetch(msg.reference.messageId)
        const targetMember = targetMessage.member
        
        if (targetMember.voice.channel) {
            await targetMember.voice.setDeaf(true, "Boss gave the order")
        }
    } catch(err) {
        console.error(err) 
        msg.reply("I fucked up")
    }
}

async function unDeafenMember(msg) {
    if (!commands.isItBoss(msg.author.id)) { return }

    try {
        const targetMessage = await msg.channel.messages.fetch(msg.reference.messageId)
        const targetMember = targetMessage.member
        
        if (targetMember.voice.channel) {
            await targetMember.voice.setDeaf(false, "Boss gave the order")
        }
    } catch(err) {
        console.error(err) 
        msg.reply("I fucked up")
    }
}

async function disconnectMember(msg) {
    if (!commands.isItBoss(msg.author.id)) { return }

    try {
        const targetMessage = await msg.channel.messages.fetch(msg.reference.messageId)
        const targetMember = targetMessage.member

        if (targetMember.voice.channel) {
            targetMember.voice.disconnect()
            msg.reply("He's gone.")
        }
    } catch(err) {
        console.error(err)
        msg.reply("I fucked up")
    }
}

module.exports = {
    playSong, 
    muteMember,
    unMuteMember,
    deafenMember,
    unDeafenMember,
    disconnectMember
}