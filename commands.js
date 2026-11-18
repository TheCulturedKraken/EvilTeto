const { PermissionsBitField } = require('discord.js')

const { isPersonalityDisabled } = require('./personalityState')
const Embedcommand = require('./embedCommand.js')
const MeanThingsToSay = require('./meanThings')

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const BOSS_ID = '485675003354808320'

const BULK_DELETE_AMOUNT = 15
const SHORT_TIMEOUT_MS = 15 * 60 * 1000
const MAX_TIMEOUT_MS = 40320 * 60 * 1000 // 28 days
const CONFIRM_WAIT_MS = 15000
const LEAVE_CONFIRM_WAIT_MS = 30000
const TICKET_CLOSE_DELAY_MS = 5000
const DISCORD_MISSING_PERMISSIONS = 50013
const DISCORD_MESSAGE_CHUNK_LIMIT = 1900 // Discord caps messages at 2000 chars

const LEAVE_PATTERN = /^yo teto,?\s+leave server off of id\s+\[(\d{17,20})\]\s*$/i

// ---------------------------------------------------------------------------
// Small helpers
// ---------------------------------------------------------------------------

const isItBoss = (id) => id === BOSS_ID

function isItAdmin(msg) {
    return msg.member?.permissions.has(PermissionsBitField.Flags.Administrator) ?? false
}

/** Boss or server admin. */
const hasAuthority = (msg) => isItBoss(msg.author.id) || isItAdmin(msg)

const pickRandom = (list) => list[Math.floor(Math.random() * list.length)]

function rollChance(max) {
    return Math.floor(Math.random() * max) + 1
}

function shouldConfirm(chance, threshold) {
    return chance < threshold
}

/** Replies with one line for the boss and another for admins. */
function replyByRole(msg, bossText, adminText) {
    return msg.reply(isItBoss(msg.author.id) ? bossText : adminText)
}

/**
 * Returns the message the command was replying to, or null if the command
 * isn't a reply. Throws if the referenced message can't be fetched
 * (deleted, other channel), so call it inside a try/catch.
 */
async function fetchReferencedMessage(msg) {
    const id = msg.reference?.messageId
    if (!id) return null
    return msg.channel.messages.fetch(id)
}

/** First mentioned member, or replies and returns null if nobody was mentioned. */
function getMentionedMember(msg) {
    const target = msg.mentions.members?.first()
    if (!target) {
        msg.reply("Who? You gotta mention somebody.")
        return null
    }
    return target
}

/** For commands that only work in DMs with the boss. Returns true if allowed. */
function requireBossDM(msg) {
    if (!isItBoss(msg.author.id)) return false
    if (msg.guild) {
        msg.reply("This command can only be used in DMs.")
        return false
    }
    return true
}

// ---------------------------------------------------------------------------
// Boss notifications / error handling
// ---------------------------------------------------------------------------

async function dmBoss(client, text) {
    try {
        const boss = await client.users.fetch(BOSS_ID)
        await boss.send(text)
    } catch (err) {
        console.error('Failed to DM boss:', err)
    }
}

async function notifyBossOfAdminUse(msg) {
    if (isItBoss(msg.author.id)) return // don't DM yourself

    await dmBoss(msg.client,
        `**Command used:** ${msg.content}\n` +
        `**User ID:** ${msg.author.id}\n` +
        `**Nickname:** ${msg.member?.displayName ?? msg.author.username}\n` +
        `**Server:** ${msg.guild?.name}`
    )
}

async function notifyBossOfError(msg, error) {
    if (isItBoss(msg.author.id)) return // don't DM yourself

    await dmBoss(msg.client,
        `**Error occurred:** ${error.message}\n` +
        `**User ID:** ${msg.author.id}\n` +
        `**Channel:** ${msg.channel.name ?? 'DM'}\n` +
        `**Server:** ${msg.guild?.name}\n` +
        `**Command:** ${msg.content}`
    )
}

/** Log, tell the user, tell the boss. */
async function handleError(msg, err) {
    console.error(err)
    msg.reply("I fucked up")
    await notifyBossOfError(msg, err)
}

// ---------------------------------------------------------------------------
// Confirmation flow
// ---------------------------------------------------------------------------

async function confirmAction(msg, command, possibleText) {
    let text
    if (command) {
        text = isItBoss(msg.author.id)
            ? 'You really want me to boss..? :face_holding_back_tears:'
            : 'You mean it..? :face_holding_back_tears:'
    } else {
        text = possibleText
    }

    await msg.reply(text)

    const filter = (response) =>
        response.author.id === msg.author.id &&
        response.content.toLowerCase().includes('yes')

    try {
        await msg.channel.awaitMessages({
            filter,
            max: 1,
            time: CONFIRM_WAIT_MS,
            errors: ['time'],
        })
        return true
    } catch {
        return false
    }
}

async function maybeConfirm(msg, action) {
    if (isPersonalityDisabled(msg.guild.id)) {
        return action()
    }

    const chance = rollChance(100)
    if (chance > 89) {
        return msg.reply("Fuck off")
    }

    if (shouldConfirm(chance, 20)) {
        const confirmed = await confirmAction(msg, true, null)
        if (!confirmed) {
            return msg.reply("Oh.. alright..")
        }
    }
    return action()
}

// ---------------------------------------------------------------------------
// Public commands
// ---------------------------------------------------------------------------

function memberCount(msg) {
    msg.reply("Well shit you got about " + msg.guild.memberCount + " in here.")
}

function saySomethingMean(msg) {
    msg.reply(pickRandom(MeanThingsToSay))
}

async function saySomethingMeanTargetted(msg) {
    //if (!isItBoss(msg.author.id)) { return }

    try {
        const targetMessage = await fetchReferencedMessage(msg)

        if (!targetMessage) {
            msg.reply("wait who am I insulting? I need a message to reply to.")
            return
        }

        if (isItBoss(targetMessage.author.id)) {
            msg.reply("I'm way more loyal to him than you :joy::v:")
        } else {
            targetMessage.reply(pickRandom(MeanThingsToSay))
        }
    } catch (err) {
        await handleError(msg, err)
    }
}

// ---------------------------------------------------------------------------
// Moderation commands (boss / admin)
// ---------------------------------------------------------------------------

async function timeOutCommand(msg) {
    if (!hasAuthority(msg)) return

    const target = getMentionedMember(msg)
    if (!target) return

    if (isItBoss(target.id)) {
        msg.reply("Yeah nice try chud :joy::v:")
        return
    }

    replyByRole(msg, "Consider it done boss", "Aight, I got it handled")

    try {
        await target.timeout(SHORT_TIMEOUT_MS, 'Boss told me too')
        replyByRole(msg, 'Got that grunt dealt with Boss.', 'Got it handled')
    } catch (err) {
        await handleError(msg, err)
    }
}

async function bulkDelete(msg) {
    if (!hasAuthority(msg)) return

    try {
        await msg.channel.bulkDelete(BULK_DELETE_AMOUNT, true)
        msg.reply("Ah hell you got lazy again? Aight I got it")
    } catch (err) {
        await handleError(msg, err)
    }
}

async function deleteSpecific(msg) {
    if (!hasAuthority(msg)) return

    try {
        const targetMessage = await fetchReferencedMessage(msg)
        if (!targetMessage) {
            msg.reply("Reply to the message you want gone.")
            return
        }

        await targetMessage.delete()
        replyByRole(msg, "Got it done for ya boss", "Handled")
    } catch (err) {
        await handleError(msg, err)
    }
}

async function getUserID(msg) {
    if (!hasAuthority(msg)) return

    try {
        const targetMessage = await fetchReferencedMessage(msg)
        if (!targetMessage) {
            msg.reply("Reply to the message of the person you want the ID of.")
            return
        }

        msg.reply("This bum's ID is " + targetMessage.author.id)
    } catch (err) {
        await handleError(msg, err)
    }
}

async function kickMember(msg) {
    if (!hasAuthority(msg)) return

    const target = getMentionedMember(msg)
    if (!target) return

    if (isItBoss(target.id)) {
        msg.reply("Yeah bro you really thought :joy::v:")
        return
    }

    msg.reply("Oh hell yeah")

    try {
        await target.kick("Boss ordered it")
    } catch (err) {
        await handleError(msg, err)
    }
}

async function slaughter(msg) {
    if (!hasAuthority(msg)) {
        msg.reply("Random grunt thinks they're tuff LMAO!")
        return
    }

    const target = getMentionedMember(msg)
    if (!target) return

    if (isItBoss(target.id)) {
        msg.reply("I don't think so :joy::v:")
        return
    }

    try {
        await target.timeout(MAX_TIMEOUT_MS, 'Boss told me too')
        msg.reply("They won't be seen again")
    } catch (err) {
        if (err.code === DISCORD_MISSING_PERMISSIONS) {
            msg.reply("I don't have perms")
        } else {
            await handleError(msg, err)
        }
    }
}

async function closeTicket(msg) {
    if (!hasAuthority(msg)) {
        return msg.reply("I'll wait for the boss or an admin to call it.")
    }

    try {
        await msg.reply("Aight, closing this out in 5 seconds...")
        setTimeout(async () => {
            try {
                await msg.channel.delete()
            } catch (err) {
                console.error(err)
            }
        }, TICKET_CLOSE_DELAY_MS)
    } catch (err) {
        await handleError(msg, err)
    }
}

// ---------------------------------------------------------------------------
// Help embeds
// ---------------------------------------------------------------------------

const INTRO_TEXT = `
        --------------{Commands}--------------

        **Public use**

        > yo Teto, fry this bitch - I insult whoever you reply this too
        > yo Teto, hop in here - I join the vc
        > yo Teto, get out bro - I leave the vc
        > yo Teto, sing for me - I sing a random song
        > yo Teto, let's play hangman - I start a game of Hangman
        > yo Teto, let's go gambling! - We go to my casino! As of now it's only blackjack though.

        if you're an admin try the command
        > yo Teto, I'm an admin, tell me what you do

        --------------Me Being Mean--------------

        Whenever you send a message I have a chance to say something mean to you!
        Depending on which role you have it changes the percentage.

        @Teto Hate -> 5%
        @Super Teto Hate -> 10%
        @Ultra Teto Hate -> 40%
        @Pure Teto Spite-> 90%
        `

const ADMIN_INTRO_TEXT = `

        So you're an admin huh... Well here's a list of Commands my boss has given you permission to use. Don't abuse it or I'll tell on you.
       
        --------------{Admin Commands}--------------

        > yo Teto, silence this chud (server mutes)
        > yo Teto, let it speak (un-server mutes)
        > yo Teto, make it deaf (server deafens)
        > yo Teto, let it hear (un-server deafens)
        > yo Teto, get rid of this dickhead (disconnects)

        > yo Teto, cut the attitude (disables personality)
        > yo Teto, you can act up (enables personality)
        > yo Teto, how you feelin right now? (displays if personality is enabled or disabled)

        > yo Teto, time this grunt out (15 minute timeout)
        > yo Teto, nuke this chud (kicks user)
        > yo Teto, get rid of ts (deletes specific message)
        > yo Teto, clear some of this shit out (bulk deletes 15 messages)
        > yo Teto, kill them (28 day timeout)
        > yo Teto, close this ticket (closes ticket)
        > yo Teto, make an embed (creates embed)
        > yo Teto, make this guy rich asf (gives user 5000 casino chips)
        > yo Teto, give this chud a bailout (gives user 100 chips)
        `

async function introduction(msg) {
    Embedcommand.createSetEmbed(msg, "Everything about me!", INTRO_TEXT, "C42121", "Created by Boss")
}

async function adminIntroduction(msg) {
    if (!hasAuthority(msg)) return
    Embedcommand.createSetEmbed(msg, "Everything about me!", ADMIN_INTRO_TEXT, "C42121", "Watch your back.")
}

// ---------------------------------------------------------------------------
// Boss-only commands
// ---------------------------------------------------------------------------

async function leaveServer(msg) {
    if (!isItBoss(msg.author.id)) return
    msg.reply("Yeah you're right, they're not worth it.")
    await msg.guild.leave()
}

async function bossSetup(msg) {
    if (!isItBoss(msg.author.id)) return

    const tiers = ['Teto Hate', 'Super Teto Hate', 'Ultra Teto Hate', 'Pure Teto Spite']
    let success = true

    for (const tier of tiers) {
        const exists = msg.guild.roles.cache.some((r) => r.name === tier)
        if (exists) continue

        try {
            await msg.guild.roles.create({
                name: tier,
                color: 'C42121',
                reason: 'Needed for Teto bot functionality',
            })
            msg.author.send(`Created role: ${tier}`)
        } catch (err) {
            success = false
            msg.author.send(`Failed to create role ${tier}: ${err.message}`)
        }
    }

    if (success) {
        msg.reply("Made it all kinds of homey boss.")
    }
}

async function leaveTargetServerID(msg, client) {
    if (!requireBossDM(msg)) return

    const match = msg.content.trim().match(LEAVE_PATTERN)
    if (!match) {
        return msg.reply("Say it like: `yo Teto, leave server off of id [server id]`")
    }
    const serverID = match[1]

    const guild = client.guilds.cache.get(serverID)
    if (!guild) {
        return msg.reply("I am not in a server with that ID.")
    }

    const owner = await guild.fetchOwner().catch(() => null)

    await msg.reply(
        `Leaving server: ${guild.name}\n` +
        `Owner: ${owner?.user.tag || "Unknown"}\n` +
        `Member Count: ${guild.memberCount}\n` +
        `Do you confirm?`
    )

    let answer
    try {
        const collected = await msg.channel.awaitMessages({
            filter: (response) =>
                response.author.id === msg.author.id &&
                ['yes', 'y', 'no', 'n'].includes(response.content.toLowerCase()),
            max: 1,
            time: LEAVE_CONFIRM_WAIT_MS,
            errors: ['time'],
        })
        answer = collected.first().content.toLowerCase()
    } catch (err) {
        return handleError(msg, err)
    }

    if (answer === 'no' || answer === 'n') {
        return msg.reply("Action cancelled.")
    }

    try {
        await guild.leave()
        msg.reply(`Left the server with ID: ${serverID}`)
    } catch (err) {
        return handleError(msg, err)
    }
}

async function listServers(msg, client) {
    if (!requireBossDM(msg)) return

    const guilds = [...client.guilds.cache.values()]
        .sort((a, b) => b.memberCount - a.memberCount)

    if (guilds.length === 0) {
        return msg.reply("I'm not in any servers.")
    }

    const lines = guilds.map((g) => `**${g.name}**\nID: \`${g.id}\` | Members: ${g.memberCount}`)

    let chunk = `I'm in **${guilds.length}** servers:\n\n`
    for (const line of lines) {
        if (chunk.length + line.length + 2 > DISCORD_MESSAGE_CHUNK_LIMIT) {
            await msg.channel.send(chunk)
            chunk = ''
        }
        chunk += line + '\n\n'
    }
    if (chunk.trim()) await msg.channel.send(chunk)
}

module.exports = {
    isItBoss,
    isItAdmin,
    notifyBossOfAdminUse,
    notifyBossOfError,
    memberCount,
    timeOutCommand,
    bulkDelete,
    deleteSpecific,
    kickMember,
    maybeConfirm,
    getUserID,
    saySomethingMeanTargetted,
    saySomethingMean,
    confirmAction,
    slaughter,
    leaveServer,
    closeTicket,
    introduction,
    adminIntroduction,
    bossSetup,
    leaveTargetServerID,
    LEAVE_PATTERN,
    listServers,
}
