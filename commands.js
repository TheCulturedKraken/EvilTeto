
const MeanThingsToSay = [
    // General disrespect
    "Shut the fuck up",
    "You talk too damn much",
    "Do you need to be diagnosed with somethin?",
    "Was anybody talking to you?",
    "I know damn well you're talking bullshit",
    "Fuck you",
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
    "Your existence is proof that God has a sense of humor",
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
    "You're proof that being loud and being right are unrelated",
    "You have the charisma of a software update",
    "Your brain has a terms and conditions page nobody read",
    "You bring absolutely nothing to the table except crumbs",
    "You're the reason group projects have peer evaluations",
    "I've seen more useful advice on a fortune cookie",
    "You could make a participation trophy feel unearned",
    "You're not the main character, you're the pop-up tutorial",
    "You have the common sense of a broken compass",
    "I would roast you harder but life clearly got there first",
    "You have the emotional range of a loading icon",
    "Your best argument is probably a typo",
    "You're an unfinished side character with no dialogue options",
    "You have the vibe of an expired coupon",
    "Your brain's running on a free trial",
    "Every time you speak, the conversation takes fall damage",
    "You could get outsmarted by a CAPTCHA",
    "You're the human equivalent of a mandatory update",
    "You have a PhD in missing the point",
    "You could make silence awkward",
    "Your comeback is still downloading",
    "You make mediocrity look ambitious",
    "You have the instincts of a moth in a hurricane",
    "You are an unskippable cutscene with no plot relevance",

    // League of Legends insults
    "You play League like your monitor is turned off",
    "Your macro is so bad even the minions are confused",
    "You're the reason your jungler has trust issues",
    "Bro has 300 CS and zero brain cells",
    "You could miss a skillshot on a training dummy",
    "Your map awareness is a myth",
    "You ward like you're personally funding the enemy jungler",
    "You have the mechanics of a disconnected Teemo",
    "You make Bronze look like a professional league",
    "Your KDA looks like a cry for help",
    "You roam like you don't know where the lanes are",
    "Your positioning is a charitable donation to the enemy team",
    "You hit more minions with your skillshots than champions",
    "You have the reaction time of a dead ward",
    "You blame your team like you're not the reason they're losing",
    "You could feed a whole server and still call it a team diff",
    "Your Yasuo has more deaths than a historical documentary",
    "You're the type to go 0/10 and blame the support",
    "Even your tower dives need a permission slip",
    "You play ranked like you're being held hostage",
    "Your ultimate is just an expensive way to miss",
    "You have Challenger-level confidence and Iron-level decision making",
    "Your jungle pathing looks procedurally generated",
    "You make cannon minions look mechanically gifted",
    "Your team would gain LP if you took a vacation",
    "You flash into walls with professional consistency",
    "You have the map awareness of a blindfolded pigeon",
    "You could lose a 5v1 and ask where your team was",
    "Your engage is just an elaborate suicide note",
    "You make the enemy ADC look like Faker",
    "You don't need a ban; you need a tutorial",
    "Your laning phase is a public safety concern",
    "You treat every cooldown like a personal suggestion",
    "You play like your LP is a social experiment",
    "Your ward placement is performance art",
    "You have more excuses than CS",
    "You're not carrying, you're being carried by matchmaking",
    "You'd lose lane to a minion with a keyboard",
    "Your decision making deserves a surrender vote",
    "Even the Nexus is tired of watching you",
    "You think a ping is a personal attack",
    "You have the game sense of a practice tool dummy",
    "You don't need coaching, you need divine intervention",
    "You'd miss Baron if it stood still and introduced itself",
    "Your death timer is the most consistent thing about you",
    "You make split-pushing look like getting lost",
    "Your biggest counter is the keyboard",
    "You are the reason the enemy team honors their jungler",

    // Minecraft insults
    "Your Minecraft house looks like a village unemployment office",
    "You have the survival instincts of a chicken in the Nether",
    "Bro punches trees and still can't build a personality",
    "You'd get lost in a two-by-two cave",
    "You mine diamonds like you're trying to avoid finding them",
    "You couldn't survive a night with Keep Inventory on",
    "Your house looks like a creeper built it after a divorce",
    "You'd fall into lava while holding a fire resistance potion",
    "Your PvP skills make baby zombies look terrifying",
    "You have the spatial awareness of a minecart",
    "You build dirt huts and call yourself an architect",
    "Your Nether portal is the only thing trying to escape you",
    "You'd lose a fight to an unarmed iron golem",
    "You have the farming efficiency of a desert",
    "You'd somehow starve with a stack of steak",
    "You mine straight down and act surprised when you die",
    "Your enchanted sword does more emotional damage to you",
    "You'd get outsmarted by a pressure plate",
    "Your base looks like a failed school project",
    "You have the same durability as a wooden pickaxe",
    "You couldn't find your own bed with coordinates",
    "Even Herobrine would leave your world out of disappointment",
    "Your hardcore world has a shorter lifespan than your attention span",
    "You'd die in Peaceful mode from poor decision making",
    "You have the survival skills of a villager stuck in a boat",
    "You couldn't craft a decent comeback with a full recipe book",
    "You'd trade 32 emeralds for a stick and call it business",
    "You have the mining efficiency of a wooden shovel",
    "You fight the Ender Dragon like you're trying to tame it",

    // Valorant insults
    "You aim like your mouse is having a seizure",
    "You have the crosshair placement of a confused Roomba",
    "Bro has wallhacks and still checks the wrong corner",
    "You could miss an AFK player",
    "Your reaction time is measured in business days",
    "You peek like you're trying to donate a free kill",
    "Your spray control is a weather forecast",
    "You have the game sense of a training bot",
    "You dry peek every angle like you owe the enemy money",
    "Your headshot percentage is classified for public safety",
    "You bottom frag with the confidence of an esports champion",
    "You use utility like it's a limited-edition collectible",
    "Your smokes help the enemy more than your team",
    "You flash your teammates with military precision",
    "Your entry frag is just an entry death",
    "You have the clutch potential of a wet napkin",
    "You could lose a 1v5 against five disconnected keyboards",
    "Your crosshair is on vacation",
    "You hear footsteps and somehow look the other direction",
    "You reload more than you shoot",
    "Your economy management is worse than your aim",
    "You save every round like you're investing for retirement",
    "You play Jett like the dash button is decorative",
    "You play Reyna like you've never seen a soul orb",
    "Your Chamber aim is an insult to expensive weapons",
    "You could whiff an Operator shot at point-blank range",
    "Your Cypher setups protect absolutely nobody",
    "Your Sage walls are more useful to the enemy",
    "You use your ultimate just to die immediately",
    "You have the positioning of a traffic cone in mid",
    "Your comms are 90% excuses and 10% background noise",
    "You could make a free Sheriff look overpriced",
    "You peek corners like you're allergic to living",
    "You have the consistency of a packet-loss warning",
    "You don't have aim diff, you have aim absence",
    "Your ranked teammates deserve hazard pay",
    "You turn a 5v1 into a highlight reel for the enemy",
    "You play like your sensitivity changes every bullet",
    "Even the spike is disappointed you couldn't plant it",

    // Roblox insults
    "You look like your avatar came free with the tutorial",
    "Your fit costs 2 Robux and 200 dollars in confidence",
    "You have the movement skills of a default obby NPC",
    "You'd lose an obby to someone playing with their feet",
    "Your avatar has more personality than you do",
    "You got the drip of a broken character creator",
    "You spend Robux to look like an unpaid intern",
    "Your fit is giving default settings",
    "You have the building skills of a Roblox physics glitch",
    "You'd get scammed by a trade request that says 'free'",
    "You play like your ping is older than the platform",
    "You couldn't survive five minutes in Natural Disaster Survival",
    "Your parkour skills belong in a safety demonstration",
    "You look like you were assembled with random parts",
    "Your avatar's face is doing more acting than you",
    "You'd lose a tycoon game to someone who just joined",
    "You have the combat skills of an idle animation",
    "You build houses like the delete button is your architect",
    "You have the drip of a free catalog accessory",
    "You'd get eliminated in Murder Mystery 2 as the lobby loads",
    "Your Arsenal aim is powered by wishful thinking",
    "You play Blox Fruits like you ate the tutorial instead",
    "You'd lose a trade to a cardboard cutout",
    "Your avatar looks like it owes the catalog Robux",
    "You have the intelligence of a disconnected obby checkpoint",
    "Your game passes are the only things carrying you",
    "You could get lost in a one-room tycoon",
    "You have more accessories than original thoughts",
    "You'd fail a simulator tutorial with the instructions on screen",
    "Your avatar looks like a before picture",
    "You're the reason the server needs a reset",
    "Your character customization is a cry for an undo button",
    "You have the parkour ability of a shopping cart",
    "You could lose a sword fight to the spawn animation",
    "Even the NPCs are pretending they can't see you",

    // Attack on Titan insults
    "You have the survival instincts of a Scout on their first expedition",
    "You'd be the first casualty in the opening scene",
    "You have the ODM gear coordination of a drunk butterfly",
    "Even a Pure Titan would question whether you're worth eating",
    "You'd see a Titan and forget how to operate your own legs",
    "You're the reason the Scouts need extra replacement uniforms",
    "You have the strategic intelligence of a Titan walking into a wall",
    "You'd miss a Titan's nape from three feet away",
    "Your ODM gear would file a resignation before you used it",
    "You have the bravery of a horse hearing thunder",
    "You'd lose a staring contest with a Titan and somehow blink first",
    "You'd get flattened during the opening credits",
    "Erwin would sacrifice you and still call it a net positive",
    "Hange would study you and conclude you're beyond science",
    "Levi would clean the entire barracks again just to avoid talking to you",
    "Jean has more main-character energy than you'll ever have",
    "You make Connie look like the strategic mastermind of the Scouts",
    "You'd get lost inside Wall Maria with a map",
    "Your battle plan has the life expectancy of a Scout",
    "You'd transform into a Titan and still be bottom frag",
    "You have the combat ability of a Titan with no knees",
    "You'd join the Military Police and somehow still get lost in the barracks",
    "You'd fail the 3D Maneuver Gear test while standing still",
    "Your situational awareness makes the Garrison look unemployed",
    "You have the leadership skills of a headless Titan",
    "You'd hear the Colossal Titan's footsteps and ask who's stomping",
    "Even the Female Titan wouldn't waste time chasing you",
    "You'd get outsmarted by a Titan lured by a steak",
    "Your plan has more holes than the Walls after the Colossal Titan visits",
    "You have the tactical instincts of a Titan chasing a decoy",
    "You'd somehow get eaten during a flashback",
    "You have the intimidation factor of a Titan wearing a party hat",
    "The Beast Titan throws better than you think",
    "You'd make Reiner question his entire life's purpose",
    "You have the discipline of a cadet on their first day",
    "Your ODM gas tank has more fight left than you do",
    "You'd turn the Rumbling into a minor inconvenience",
    "Even Floch would tell you to sit this one out",
    "You have the situational awareness of someone who forgot Titans exist",
    "Your fighting style is just Sasha dodging vegetables",
    "You'd get folded by a Titan and blamed for the repair bill",
    "You have the decision-making skills of Eren before breakfast",
    "You'd make the Armored Titan look like an actual tank",
    "You could stand next to Mikasa and still need protecting",
    "You have the aura of a background cadet with no name",
    "The Survey Corps would rather risk the Titan than send you",
    "You'd get your own character arc just to die in episode two",
    "You are living proof that not every Eldian can be built different",

    // General gaming insults
    "You play like your controller is connected to someone else's hands",
    "Your skill level is a DLC nobody wants",
    "You have more deaths than achievements",
    "You make bots look like tournament finalists",
    "You couldn't speedrun a game with the ending already unlocked",
    "You play on easy mode and still request a tutorial",
    "Your greatest enemy is the W key",
    "You have the reaction speed of a screenshot",
    "Your kill count is a rounding error",
    "You make every lobby feel like a charity event",
    "You could lose a tutorial to the skip button",
    "Your controller deserves a better owner",
    "You have the mechanical skill of a wet keyboard",
    "You don't have skill issues, you have an entire skill expansion pack",
    "Your game sense is still in early access",
    "You make NPC pathfinding look revolutionary",
    "You play like you're testing the game for bugs",
    "You have the competitive drive of an unplugged mouse",
    "Your win rate is a cry for technical support",
    "You're not throwing the game; you're launching it into orbit",
    "Your teammates aren't holding you back, they're holding back tears",
    "You treat every match like a tutorial you refuse to finish",
    "Your highlight reel would be a blank video",
    "You could get carried by a loading screen and still complain",
    "You have the movement of a fridge on ice",
    "Your keyboard has more APM than you",
    "You're a walking patch note titled 'Fixed a problem'",
    "Your rank is a warning label",
    "You make the practice range look like endgame content",
    "Your greatest achievement is making the enemy feel better about themselves",
    "You have the strategic depth of a puddle",
    "Your gameplay is an excellent argument for single-player games",
    "You are the human equivalent of a server maintenance notice",
    "You're not built different; you're built incorrectly",
    "Even the tutorial is considering uninstalling",
    "You have the gaming instincts of someone who lost the instruction manual",
    "Your skill tree is just a bunch of dead branches",
    "You couldn't carry a conversation, let alone a team",
    "You make losing look like a full-time profession",
    "You have the clutch factor of a car with no engine",
    "You play like your PC is rendering one frame per emotional breakdown",
    "You are the reason the matchmaking system needs therapy",
    "Your stats look like they were generated by a random number generator",
    "You don't need a gaming chair; you need gaming fundamentals",
    "You have the coordination of two people sharing one controller",
    "You're the final boss of being carried",
    "Your presence in the lobby is a debuff",
    "You could turn a guaranteed win into a historical disaster",
    "Your gameplay is what happens when patch notes become a person",
    "You make the word 'unranked' sound like a compliment"
];



const { PermissionsBitField, PermissionFlagBits } = require('discord.js');

const { isPersonalityDisabled } = require('./personalityState')
const Embedcommand = require('./embedCommand.js')

const BOSS_ID = '485675003354808320'

function isItBoss(id) {
    if (id === '485675003354808320') {
        return true
    } else {
        return false
    }
}

function isItAdmin(msg) {
    return msg.member?.permissions.has(PermissionsBitField.Flags.Administrator) ?? false
}

async function notifyBoss(msg) {
    if (isItBoss(msg.author.id)) return // don't DM yourself

    try {
        const boss = await msg.client.users.fetch(BOSS_ID)
        await boss.send(
            `**Command used:** ${msg.content}\n` +
            `**User ID:** ${msg.author.id}\n` +
            `**Nickname:** ${msg.member?.displayName ?? msg.author.username}\n` +
            `**Server:** ${msg.guild?.name}`
        )
    } catch (err) {
        console.error('Failed to DM boss:', err)
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
    if (!isItBoss(msg.author.id) && !isItAdmin(msg)) { return }
    
    if (isItBoss(msg.author.id)) {
        msg.reply("Consider it done boss")
    } else if (isItAdmin(msg)) {
        msg.reply("Aight, I got it handled")
    }
    
    var target = msg.mentions.members.first();

        if (isItBoss(target.id)) {
            msg.reply("Yeah nice try chud :joy::v:")
            return
        }

    console.log(target.id)
    try {
        const duration = 15 * 60 * 1000;
        target.timeout(duration, 'Boss told me too');
        if (isItBoss(msg.author.id)) {
            msg.reply('Got that grunt dealt with Boss.')
        } else if (isItAdmin(msg)) {
            msg.reply('Got it handled')
        }
    } catch (err) {
        console.error(err);
        msg.reply("I fucked up")
    }
}

function bulkDelete(msg) {
    if (isItBoss(msg.author.id) || isItAdmin(msg)) {

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
    if (!isItBoss(msg.author.id) && !isItAdmin(msg)) { return }
    try {
        const targetMessage = await msg.channel.messages.fetch(
            msg.reference.messageId
        );

        await targetMessage.delete();

        if (isItBoss(msg.author.id)) {
            msg.reply("Got it done for ya boss")
        } else if (isItAdmin(msg)) {
            msg.reply("Handled")
        }
    } catch(err) {
        msg.reply("I fucked up")
    }
}

async function getUserID(msg) {
    if (!isItBoss(msg.author.id) && !isItAdmin(msg)) { return }

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
    if (isItBoss(msg.author.id) || isItAdmin(msg)) {
        msg.reply("Oh hell yeah")
        var target = msg.mentions.members.first();

        if (isItBoss(target.id)) {
            msg.reply("Yeah bro you really thought :joy::v:")
            return
        }

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
    if (isItBoss(msg.author.id) || isItAdmin(msg)) {
        var target = msg.mentions.members.first();
        console.log(target.id)
        
        if (isItBoss(target.id)) {
            msg.reply("I don't think so :joy::v:")
            return
        }

        try {
            const duration = 40320 * 60 * 1000;
            await target.timeout(duration, 'Boss told me too');
            msg.reply("They won't be seen again")
        } catch (err) {
            console.error(err);

            if (err.code === 50013) {
                msg.reply("I don't have perms")
            } else {
                msg.reply("I fucked up")
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
    if (!isItBoss(msg.author.id) && !isItAdmin(msg)) {
        return msg.reply("I'll wait for the boss or an admin to call it.")
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

async function introduction(msg) {
    Embedcommand.createSetEmbed(msg, "Everything about me!", 
        `
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
        , "C42121", "Created by Boss")
}

async function adminIntroduction(msg) {
    if (!isItBoss(msg.author.id) && !isItAdmin(msg)) { return }
    Embedcommand.createSetEmbed(msg, "Everything about me!", 
        `

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
        , "C42121", "Watch your back.")
}

async function bossSetup(msg) {
    if (!isItBoss(msg.author.id)) { return }

    const tiers = ['Teto Hate', 'Super Teto Hate', 'Ultra Teto Hate', 'Pure Teto Spite'];
    var success = true

    for (const tier of tiers) {
        const role = msg.guild.roles.cache.find(r => r.name === tier);
        if (!role) {
            try {
                await msg.guild.roles.create({
                    name: tier,
                    color: 'C42121',
                    reason: 'Needed for Teto bot functionality',
                });
                msg.author.send(`Created role: ${tier}`);
            } catch (err) {
                success = false
                msg.author.send(`Failed to create role ${tier}: ${err.message}`);
            }
        }
    }

    if (success) {
        msg.reply("Made it all kinds of homey boss.");
    }

}

const LEAVE_PATTERN = /^yo teto,?\s+leave server off of id\s+\[(\d{17,20})\]\s*$/i;


async function leaveTargetServerID(msg, client) {
    if (!isItBoss(msg.author.id)) { return }
    if (msg.guild) {
        return msg.reply("This command can only be used in DMs.");
    }

    const match = msg.content.trim().match(LEAVE_PATTERN);
    if (!match) {
        return msg.reply("Say it like: `yo Teto, leave server off of id [server id]`");
    }
    const serverID = match[1];

    const guild = client.guilds.cache.get(serverID);
    if (!guild) {
        return msg.reply("I am not in a server with that ID.");
    }
    
    const name = guild.name;
    const owner = await guild.fetchOwner().catch(() => null) ;
    const memberCount = guild.memberCount;

    await msg.reply(`Leaving server: ${name}\nOwner: ${owner?.user.tag || "Unknown"}\nMember Count: ${memberCount}\nDo you confirm?`);

    let reply;
    try {
        const collected = await msg.channel.awaitMessages({
            filter: response => response.author.id === msg.author.id && ['yes', 'y', 'no', 'n'].includes(response.content.toLowerCase()),
            max: 1,
            time: 30000,
            errors: ['time']
        });
        reply = collected.first().content.toLowerCase();
    } catch (err) {
        console.error(err);
        return msg.reply("I fucked up");
    }

    if (reply === 'no' || reply === 'n') {
        return msg.reply("Action cancelled.");
    }

    try {
        await guild.leave();
        msg.reply(`Left the server with ID: ${serverID}`);
    } catch (err) {
        console.error(err);
        msg.reply("I fucked up");
    }
}

module.exports = {
    isItBoss,
    isItAdmin,
    notifyBoss,
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
}
