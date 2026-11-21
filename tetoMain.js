require('dotenv').config()

const Discord = require('discord.js')
const DiscordVoice = require('@discordjs/voice')
const { ChannelType, PermissionFlagsBits } = Discord

const Commands = require('./commands.js')
const VoiceCommands = require('./voicecommands.js')
const Hangman = require('./hangman.js')
const Embedcommand = require('./embedCommand.js')
const { isPersonalityDisabled, setPersonalityDisabled } = require('./personalityState.js')

const Casino = require('./casino/CasinoRouter.js')
const economyModule = require('./casino/economy.js')

const client = new Discord.Client({
    intents: [
        Discord.GatewayIntentBits.Guilds,
        Discord.GatewayIntentBits.GuildMessages,
        Discord.GatewayIntentBits.MessageContent,
        Discord.GatewayIntentBits.DirectMessages,
        Discord.GatewayIntentBits.GuildPresences,
        Discord.GatewayIntentBits.GuildBans,
        Discord.GatewayIntentBits.GuildModeration,
        Discord.GatewayIntentBits.GuildVoiceStates,
        Discord.GatewayIntentBits.GuildMessageReactions,
        Discord.GatewayIntentBits.GuildMembers,
    ],
    partials: [
        Discord.Partials.Message,
        Discord.Partials.Channel,
        Discord.Partials.Reaction,
        Discord.Partials.User,
        Discord.Partials.GuildMember,
    ],
})

const COMMAND_PREFIX = 'yo Teto,'

// guild id -> true while a game (hangman) is running there
const Busy = new Map()

client.on('clientReady', () => {
    console.log('Logged in as ' + client.user.tag + '!')
})

//============================================================================================
// Shared helpers
//============================================================================================

const hasAuthority = (msg) => Commands.isItBoss(msg.author.id) || Commands.isItAdmin(msg)

/** Log, DM the boss, and tell the channel. */
async function reportError(msg, err) {
    console.error(err)
    await Commands.notifyBossOfError(msg, err)
    msg.reply('I fucked up')
}

/**
 * The message the command was replying to, or null if the command isn't a
 * reply. Throws if the referenced message can't be fetched.
 */
async function fetchReferencedMessage(msg) {
    const id = msg.reference?.messageId
    if (!id) return null
    return msg.channel.messages.fetch(id)
}

//============================================================================================
// Personality Block (random insults based on role)
//============================================================================================

const meanRoles = {
    'teto hate': 0.05,          // 5%
    'super teto hate': 0.10,    // 10%
    'ultra teto hate': 0.25,    // 25%
    'pure teto spite': 0.90,    // 90%
}

/** Highest insult chance among the member's "Teto hate" roles (0 if none). */
function getMeanChance(member) {
    let chance = 0
    for (const [roleName, roleChance] of Object.entries(meanRoles)) {
        if (member.roles.cache.some(role => role.name.toLowerCase() === roleName)) {
            chance = Math.max(chance, roleChance)
        }
    }
    return chance
}

client.on('messageCreate', msg => {
    try {
        if (msg.author.bot) return
        if (!msg.guild) return
        if (isPersonalityDisabled(msg.guild.id)) return

        const content = msg.content.toLowerCase()
        if (msg.mentions.has(client.user)) {
            if (content.includes('fuck you')) {
                msg.reply('I bet you wish you could twerp :v:')
            } else if (content.includes('ily') || content.includes('i love you')) {
                msg.reply("It's not mutual.")
            }
        }

        const chance = getMeanChance(msg.member)
        if (chance <= 0 || Busy.get(msg.guild.id)) return

        if (Math.random() < chance) {
            Commands.saySomethingMean(msg)
        }
    } catch (err) {
        console.error(err)
        msg.reply('I fucked up')
    }
})

//============================================================================================
// Command handlers that need more than a one-liner
//============================================================================================

async function joinVoice(msg) {
    const channel = msg.member.voice.channel
    if (!channel) {
        return msg.reply("Dick you ain't even in a channel")
    }

    DiscordVoice.joinVoiceChannel({
        channelId: channel.id,
        guildId: channel.guild.id,
        adapterCreator: channel.guild.voiceAdapterCreator,
    })
    msg.reply('Aight bet')
}

function leaveVoice(msg) {
    const connection = DiscordVoice.getVoiceConnection(msg.guildId)
    if (!connection) {
        return msg.reply('You tripping?')
    }

    connection.destroy()
    msg.reply("Aight I'm out")
}

async function playHangman(msg) {
    // Bail before touching Busy, or this request's finally would clear it for the running game
    if (Hangman.isGameActive(msg.guild.id)) {
        return msg.reply('Sorry, already playing a game!')
    }

    Busy.set(msg.guild.id, true)
    try {
        const players = await Commands.maybeConfirm(msg, () => Hangman.gatherPlayers(msg))
        if (!players || players === 'no_players') return

        await Hangman.hangMan(msg)
    } finally {
        Busy.set(msg.guild.id, false)
    }
}

/** Builds a boss/admin-only handler that gives chips to the author of the replied-to message. */
const giveChips = (amount, successText) => async (msg) => {
    if (!hasAuthority(msg)) return

    const targetMessage = await fetchReferencedMessage(msg)
    if (!targetMessage) {
        return msg.reply('Reply to the message of whoever you want to give chips to.')
    }

    economyModule.addMoney(targetMessage.author.id, amount)
    msg.reply(successText)
}

/** Builds a boss/admin-only handler that flips the personality switch for this server. */
const setPersonality = (disabled, successText) => (msg) => {
    if (!hasAuthority(msg)) return

    setPersonalityDisabled(msg.guild.id, disabled)
    msg.reply(successText)
}

function personalityStatus(msg) {
    if (isPersonalityDisabled(msg.guild.id)) {
        msg.reply('Got to control myself.. 🙄')
    } else {
        msg.reply("I'm completely free.")
    }
}

//============================================================================================
// Command tables
//
// directCommands: run as-is.
// gatedCommands:  run through Commands.maybeConfirm (Teto's random "are you sure?" / "fuck off").
//============================================================================================

const directCommands = new Map([
    // Voice
    ['yo Teto, hop in here', joinVoice],
    ['yo Teto, get out bro', leaveVoice],
    ['yo Teto, sing for me', (msg) => VoiceCommands.playSong(msg)],

    // Games
    ["yo Teto, let's play hangman", playHangman],
    ["yo Teto, let's go gambling", (msg) => Casino.start(msg)],
    ['yo Teto, give this chud a bailout', giveChips(100, 'Tossed that chud 100 chips for ya boss')],
    ['yo Teto, make this guy rich asf', giveChips(5000, 'Gave them about 5000 chips, they rich af now')],

    // Personality toggles
    ['yo Teto, cut the attitude', setPersonality(true, 'You got it boss')],
    ['yo Teto, you can act up', setPersonality(false, '*Malicious laughter*')],
    ['yo Teto, how you feelin right now?', personalityStatus],

    // Boss only (DMs)
    ['yo Teto, where all you at?', (msg) => Commands.listServers(msg, client)],
])

const gatedCommands = new Map([
    // Info
    ['yo Teto, how many bums I got in this server?', (msg) => Commands.memberCount(msg)],
    ['yo Teto, introduce yourself', (msg) => Commands.introduction(msg)],
    ["yo Teto, I'm an admin, tell me what you can do", (msg) => Commands.adminIntroduction(msg)],

    // Insults
    ['yo Teto, fry this bitch', (msg) => Commands.saySomethingMeanTargetted(msg)],

    // Moderation
    ['yo Teto, time this grunt out', (msg) => Commands.timeOutCommand(msg)],
    ['yo Teto, kill them', (msg) => Commands.slaughter(msg)],
    ['yo Teto, nuke this chud', (msg) => Commands.kickMember(msg)],
    ['yo Teto, clear some of this shit out', (msg) => Commands.bulkDelete(msg)],
    ['yo Teto, get rid of ts', (msg) => Commands.deleteSpecific(msg)],
    ['yo Teto, whats this dicks ID', (msg) => Commands.getUserID(msg)],
    ['yo Teto, close this ticket', (msg) => Commands.closeTicket(msg)],
    ['yo Teto, make an embed', (msg) => Embedcommand.createEmbed(msg)],

    // Voice moderation
    ['yo Teto, silence this chud', (msg) => VoiceCommands.muteMember(msg)],
    ['yo Teto, let it speak', (msg) => VoiceCommands.unMuteMember(msg)],
    ['yo Teto, make it deaf', (msg) => VoiceCommands.deafenMember(msg)],
    ['yo Teto, let it hear', (msg) => VoiceCommands.unDeafenMember(msg)],
    ['yo Teto, get rid of this dickhead', (msg) => VoiceCommands.disconnectMember(msg)],

    // Boss only
    ["yo Teto, they don't deserve you here, just leave em", (msg) => Commands.leaveServer(msg)],
    ['yo Teto, get comfortable', (msg) => Commands.bossSetup(msg)],
])

//============================================================================================
// Gatekept Command Logging (DM the boss when an admin uses one of these)
//============================================================================================

const GATEKEPT_COMMANDS = new Set([
    'yo Teto, time this grunt out',
    'yo Teto, nuke this chud',
    'yo Teto, get rid of ts',
    'yo Teto, kill them',
    'yo Teto, close this ticket',
    'yo Teto, make an embed',
    'yo Teto, whats this dicks ID',
    'yo Teto, clear some of this shit out',
    'yo Teto, silence this chud',
    'yo Teto, let it speak',
    'yo Teto, make it deaf',
    'yo Teto, let it hear',
    'yo Teto, get rid of this dickhead',
    'yo Teto, cut the attitude',
    'yo Teto, you can act up',
    'yo Teto, make this guy rich asf',
    'yo Teto, give this chud a bailout',
])

//============================================================================================
// Command dispatcher
//============================================================================================

async function runCommand(msg) {
    const direct = directCommands.get(msg.content)
    if (direct) return direct(msg)

    const gated = gatedCommands.get(msg.content)
    if (gated) return Commands.maybeConfirm(msg, () => gated(msg))

    // Boss only: leave a server by ID (DMs)
    if (Commands.LEAVE_PATTERN.test(msg.content.trim())) {
        return Commands.leaveTargetServerID(msg, client)
    }
}

client.on('messageCreate', async msg => {
    if (msg.author.bot) return
    if (!msg.content.startsWith(COMMAND_PREFIX)) return

    // Fire-and-forget: notifyBossOfAdminUse handles its own errors
    if (GATEKEPT_COMMANDS.has(msg.content) && Commands.isItAdmin(msg)) {
        Commands.notifyBossOfAdminUse(msg)
    }

    try {
        await runCommand(msg)
    } catch (err) {
        await reportError(msg, err)
    }
})

//============================================================================================
// Reactions: React Roles + Tickets
//============================================================================================

// message id -> { emoji -> role id }
const reactionRoles = {
    '1534778101328904322': { // Newsletter react roles
        '🎮': '1520165697374781591',
        '📺': '1525304843294478446',
        '📰': '1519512869853728998',
    },

    '1534784330344304773': { // Warhammer entry role
        '✅': '1534784621978321038',
    },

    '1543089909609529426': { // Warhammer faction roles
        '🐟': '1543094289129672806',
        '🦈': '1543094429227946074',
        '🪖': '1543094490959585342',
        '🧝‍♂️': '1543094565714788362',
        '🧝‍♀️': '1543094608571928728',
        '👮': '1543096571296612473',
        '⚜️': '1543094692365869137',
        '⛏️': '1543094803607060510',
        '🤖': '1543094885681201203',
        '☯️': '1543094969844240486',
        '😈': '1543095023673810994',
        '🏅': '1543095068825755678',
        '🐛': '1543095147234066462',
        '🛠️': '1543095194348556359',
        '💀': '1543095235444351086',
        '👽': '1543095282009378826',
    },
     
    '1550208562897223843': {
        '✅': '1550208300958621906', // Looking for game role
    },

    '1573593757402533981': { //Kress react roles
        '🎮': '1573593105628921886',
        ':SL:': '1573593178924253195',
        ':SG:': '1573593200050831503',
        ':MP:': '1573593217776099430',
        ':ti:': '1573593235086123108',
        ':teto_spin:': '1550211097892495415',
    }
}

// message id -> { emoji -> ticket category id }
const ticketMessages = {
    '1537569311269593229': {
        '✉️': '1537569586835366029',
        '🔨': '1537569634138722385',
    },
}

async function fetchPartials(reaction) {
    if (reaction.partial) await reaction.fetch()
    if (reaction.message.partial) await reaction.message.fetch()
}

/** Adds or removes the configured role for this reaction. action is 'add' or 'remove'. */
async function applyReactionRole(reaction, user, action) {
    const roleId = reactionRoles[reaction.message.id]?.[reaction.emoji.name]
    if (!roleId) return

    try {
        const member = await reaction.message.guild.members.fetch(user.id)
        await member.roles[action](roleId)
    } catch (err) {
        console.error(err)
    }
}

async function openTicket(reaction, user) {
    const guild = reaction.message.guild
    if (!guild) {
        console.log('No guild detected')
        return
    }

    const ticketCategory = ticketMessages[reaction.message.id]?.[reaction.emoji.name]
    if (!ticketCategory) return

    try {
        const ticketChannel = await guild.channels.create({
            name: (user.globalName ?? user.username) + "'s-ticket",
            type: ChannelType.GuildText,
            parent: ticketCategory,
            permissionOverwrites: [
                {
                    id: guild.roles.everyone.id,
                    deny: [PermissionFlagsBits.ViewChannel],
                },
                {
                    id: user.id,
                    allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages],
                },
            ],
        })

        await ticketChannel.send('<@' + user.id + ">, Here's your ticket. Wait for Kraken or some other bozo to get to you")
    } catch (err) {
        console.log(err)
    }
}

client.on('messageReactionAdd', async (reaction, user) => {
    if (user.bot) return

    try {
        await fetchPartials(reaction)
    } catch (err) {
        console.error(err)
        return
    }

    await applyReactionRole(reaction, user, 'add')
    await openTicket(reaction, user)
})

client.on('messageReactionRemove', async (reaction, user) => {
    if (user.bot) return

    try {
        await fetchPartials(reaction)
    } catch (err) {
        console.error(err)
        return
    }

    await applyReactionRole(reaction, user, 'remove')
})

client.login(process.env.TOKEN)
