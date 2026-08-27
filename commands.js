const MeanThingsToSay = [
    'Shut the fuck up',
    'You talk too damn much',
    'Do you need to be diagnosed with somethin?',
    'Was anybody talking to you?',
    "I know damn well you're talking bullshit",
    'Fuck you',
    "You're more of a bot than me.",
    "Nobody asked lil bro",
    "You just be saying anything huh",
    "That might be the dumbest shit I heard all day",
    "Please develop a survival instinct",
    "You type like your thoughts are buffering",
    "You're confidently wrong again",
    "I know your keyboard sighed before sending that",
    "You contribute absolutely nothing to the conversation",
    "Do you rehearse being annoying or does it come naturally?",
    "You sound like a tutorial NPC",
    "You got all that confidence for absolutely no reason",
    "I miss the person I was before reading that",
    "You are NOT beating the allegations",
    "That sentence fought for its life",
    "I'm starting to understand why people ignore you",
    "You really woke up and chose nonsense today",
    "You got negative aura",
    "I could've gone my whole life without hearing that",
    "Every day you discover a new way to embarrass yourself",
    "You speak fluent yapanese",
    "You built like a bad opinion",
    "I know damn well you thought that sounded smart too",
    "Your messages feel AI generated in the worst way possible",
    "You argue like a Twitter reply section",
    "Please return your talking privileges",
    "Your thought process needs adult supervision",
    "I'd explain why you're wrong but I don't think it'd help",
    "The confidence-to-intelligence ratio is CRAZY",
    "You are a side quest nobody accepted",
    "I'm convinced your brain runs on dial-up",
    "This is why nobody lets you cook",
    "You say things with the confidence of someone who didn't read a single word",
    "Even the voices in your head probably muted you",
    "I've seen loading screens smarter than this",
    "Your takes are sponsored by brain damage",
    "You type like a family disappointment",
    "You'd lose an argument with a brick wall",
    "You got the communication skills of a microwave",
    "The bar was on the floor and you still limbo'd under it",
    "Some thoughts should stay inside your head",
    "I'm praying for the people forced to deal with you daily",
    "You are the human equivalent of a typo",
    "I could study you in a laboratory",
    "You make wrong answers look talented",
    "I'm not mad, just disappointed and slightly concerned",
    "You are a bug in the group chat",
    "Your existence is proof that god has a sense of humor",
    "You sound like you drink warm soda",
    "You have the energy of someone who claps when the plane lands",
    "You text like your autocorrect gave up on you",
    "I can physically feel my IQ dropping reading your messages",
    "You're the reason warning labels exist",
    "Please log off for everyone's benefit",
    "You talk like a YouTube comment section",
    "You're built like an incorrect answer",
    "You have the survival instincts of a traffic cone",
    "I've met houseplants with more awareness",
    "You are chronically unserious",
    "You are not surviving the apocalypse",
    "I know your friends sigh when they see you typing",
    "You got the strategic mind of a goldfish",
    "That opinion should've stayed in drafts",
]

const { isPersonalityDisabled } = require('./personalityState')

function isItBoss(id) {
    if (id === '485675003354808320') {
        return true
    } else {
        return false
    }
}

function rollChance(max) {
    return Math.floor(Math.random() * max) + 1;
}

function shouldConfirm(chance, threshold) {
    return chance < threshold;
}

async function maybeConfirm(msg, action) {
    if (isPersonalityDisabled(msg.guild.id)) {
        return action();
    }
    const interActionChance = rollChance(100);
    if (interActionChance > 89) {
        return msg.reply("Fuck off");
    }

    if (shouldConfirm(interActionChance, 20)) {
        const confirmed = await confirmAction(msg, true, null);

        if (!confirmed) {
            return msg.reply("Oh.. alright..")
        }
    }
    return action();
}

async function confirmAction(msg, command, possibleText) {
    var text 
    if (command) {
        if (isItBoss(msg.author.id)) {
            text = 'You really want me to boss..? :face_holding_back_tears:'
        } else {
            text = 'You mean it..? :face_holding_back_tears:'
        }
    } else { text = possibleText}

    await msg.reply(text);
    const filter = response => {
        return response.author.id === msg.author.id &&
               response.content.toLowerCase().includes('yes');
    };
    
    try {
        const collected = await msg.channel.awaitMessages({
            filter,
            max: 1,
            time: 15000,
            errors: ['time']
        });
        return true;
    } catch {
        return false;
    }
}

function memberCount(msg) {
    const guild = msg.guild
    msg.reply("Well shit you got about " + guild.memberCount + " in here.")
}

function timeOutCommand(msg) {
    if (isItBoss(msg.author.id)) {
        msg.reply("Consider it done boss")
        var target = msg.mentions.members.first();
        console.log(target.id)
        
        try {
            const duration = 15 * 60 * 1000;
            target.timeout(duration, 'Boss told me too');
            msg.reply('Got that grunt dealt with Boss.')
        } catch (err) {
            console.error(err);
            msg.reply("Boss I fucked it up")
        }
    } else {
        msg.reply("Random grunt thinks they're tuff LMAO!")
    }
}

function bulkDelete(msg) {
    if (isItBoss(msg.author.id)) {

        var amount = 15;
        try {
            msg.channel.bulkDelete(amount, true)
            msg.reply("Ah hell you got lazy again? Aight I got it")
        } catch (err) {
            console.error(err)
            msg.reply("I fucked up")
        }
    }
}

async function deleteSpecific(msg) {
    if (!isItBoss(msg.author.id)) { return }
    try {
        const targetMessage = await msg.channel.messages.fetch(
            msg.reference.messageId
        );

        await targetMessage.delete();

        msg.reply("Got it done for ya boss")
    } catch(err) {
        msg.reply("I fucked up")
    }
}

async function getUserID(msg) {
    if (!isItBoss(msg.author.id)) { return }

    try {
        const targetMessage = await msg.channel.messages.fetch(
            msg.reference.messageId
        );

        msg.reply("This bum's ID is " + targetMessage.author.id)
    } catch(err) {
        msg.reply("I fucked up")
    }
}

function kickMember(msg) {
    if (isItBoss(msg.author.id)) {
        msg.reply("Oh hell yeah")
        var target = msg.mentions.members.first();
        try {
            target.kick("Boss ordered it")
        } catch (err) {
            console.error(err)
            msg.reply("I fucked up")
        }
    }
}

async function saySomethingMeanTargetted(msg) {
    //if (!isItBoss(msg.author.id)) { return }

    try {
        const targetMessage = await msg.channel.messages.fetch(msg.reference.messageId)

        if (isItBoss(targetMessage.author.id)) {
            msg.reply("I'm way more loyal to him than you :joy::v:")
        } else {
            targetMessage.reply(MeanThingsToSay[Math.floor(Math.random() * MeanThingsToSay.length)])
        }

    } catch(err) {
        console.error(err)
        msg.reply("I fucked up")
    }
}

function saySomethingMean(msg) {
    msg.reply(MeanThingsToSay[Math.floor(Math.random() * MeanThingsToSay.length)])
}

async function slaughter(msg) {
    if (isItBoss(msg.author.id)) {
        var target = msg.mentions.members.first();
        console.log(target.id)
        
        try {
            const duration = 40320 * 60 * 1000;
            await target.timeout(duration, 'Boss told me too');
            msg.reply("They won't be seen again")
        } catch (err) {
            console.error(err);

            if (err.code === 50013) {
                msg.reply("I don't have perms")
            } else {
                msg.reply("Boss I fucked it up")
            }
        }
    } else {
        msg.reply("Random grunt thinks they're tuff LMAO!")
    }
}

async function leaveServer(msg) {
    if (!isItBoss(msg.author.id)) { return }
    msg.reply("Yeah you're right, they're not worth it.")
    await msg.guild.leave();
}

async function closeTicket(msg) {
    if (!isItBoss(msg.author.id)) {
        return msg.reply("I'll wait for the boss to call it.")
    }

    try {
        await msg.reply("Aight, closing this out in 5 seconds...")
        setTimeout(async () => {
            try {
                await msg.channel.delete();
            } catch (err) {
                console.error(err)
            }
        }, 5000);
    } catch (err) {
        console.error(err)
        msg.reply("I fucked up")
    }
}

module.exports = {
    isItBoss,
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
}
