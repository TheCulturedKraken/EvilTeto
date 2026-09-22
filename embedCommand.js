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

    const color = await askAndCollect(msg, "What color should it be? (hexcode)");
    if (color === null) {
        await msg.reply("Took too long, forget it.")
        return;
    }
    
    const embed = new EmbedBuilder()
        .setTitle(title)
        .setDescription(description)
        .setColor(color);
 
    await msg.channel.send({ embeds: [embed] });
}
 
module.exports = { createEmbed, askAndCollect };
