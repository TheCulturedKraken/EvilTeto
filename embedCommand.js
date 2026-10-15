const Commands = require('./commands.js')

const { EmbedBuilder } = require('discord.js');

async function askAndCollect(msg, prompt, timeoutMs = 60000) {
    await msg.channel.send(prompt);
 
    const collected = await msg.channel.awaitMessages({
        filter: (m) => m.author.id === msg.author.id,
        max: 1,
        time: timeoutMs,
        errors: ["time"]
    }).catch(() => null);
 
    if (!collected || collected.size === 0) {
        return null;
    }
 
    return collected.first().content;
}

async function createEmbed(msg) {
    const title = await askAndCollect(msg, "What title?");
    if (title === null) {
        await msg.reply("Took too long, forget it.");
        return;
    }
 
    const description = await askAndCollect(msg, "What should it say?");
    if (description === null) {
        await msg.reply("Took too long, forget it.");
        return;
    }
    
    const color = await askAndCollect(msg, "What color? (Hex code)");
    if (color === null) {
        await msg.reply("Took too long, forget it.");
        return;
    }

    const footer = await askAndCollect(msg, "What should the footer say?");
    if (footer === null) {
        await msg.reply("Took too long, forget it.");
        return;
    } else if (footer.toLowerCase().includes("no")) {
        footer = "";
    }

    const embed = new EmbedBuilder()
        .setTitle(title)
        .setDescription(description)
        .setColor(color)
        .setFooter({ text: footer });
 
    await msg.channel.send({ embeds: [embed] });
}

async function createSetEmbed(msg, title, description, color = "C42121",footer = "") {
    const embed = new EmbedBuilder()
        .setTitle(title)
        .setDescription(description)
        .setColor(color)
        .setFooter({ text: footer });

    await msg.channel.send({ embeds: [embed] });
}

async function introduction(msg) {
    createSetEmbed(msg, "Everything about me!", 
        `
        ~~~~~~~~~~~~~~{Commands}~~~~~~~~~~~~~~

        **Public use**

        > yo Teto, fry this bitch - I insult whoever you reply this too
        > yo Teto, hop in here - I join the vc
        > yo Teto, get out bro - I leave the vc
        > yo Teto, sing for me - I sing a random song
        > yo Teto, let's play hangman - I start a game of Hangman
        > yo Teto, let's go gambling! - We go to my casino! As of now it's only blackjack though.

        ~~~~~~~~~~~~~~{Me Being Mean}~~~~~~~~~~~~~~

        Whenever you send a message I have a chance to say something mean to you!
        Depending on which role you have it changes the percentage.

        @Teto Hate -> 5%
        @Super Teto Hate -> 10%
        @Ultra Teto Hate -> 40%
        @Pure Teto Spite-> 90%
        `
        , "C42121", "Created by Boss")
}

module.exports = { 
    createEmbed, 
    askAndCollect, 
    createSetEmbed,
    introduction
};
