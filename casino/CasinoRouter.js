const activeCasinoGames = require("./activeGames");
const economyModule = require("./economy");
const Blackjack = require("./blackjack");
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

async function start(msg) {
    const userId = msg.author.id;

    if (activeCasinoGames.has(userId)) {
        return msg.reply("You're already gambling fuckwit");
    }

    const balance = economyModule.getBalance(userId);

    const embed = new EmbedBuilder()
        .setColor(0x2b2d31)
        .setTitle("🎰 Casino")
        .setDescription("Oh hell yeah! What you trying to play?")
        .addFields({ name: "Balance", value: `$${balance.toLocaleString()}`, inline: true })
        .setFooter({ text: "This menu expires in 15 seconds" });

    const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId("casino_blackjack")
            .setLabel("Blackjack")
            .setStyle(ButtonStyle.Success)
            .setEmoji("🃏"),
        new ButtonBuilder()
            .setCustomId("casino_cancel")
            .setLabel("Cancel")
            .setStyle(ButtonStyle.Danger)
    );

    const sentMsg = await msg.reply({ embeds: [embed], components: [row] });

    return new Promise((resolve) => {
        const filter = (i) => i.user.id === userId;
        const collector = sentMsg.createMessageComponentCollector({ filter, time: 15000 });

        collector.on("collect", async (interaction) => {
            if (interaction.customId === "casino_cancel") {
                collector.stop("cancelled");

                const cancelEmbed = EmbedBuilder.from(embed)
                    .setDescription("Aight bet, maybe next time.")
                    .setColor(0xed4245)
                    .setFooter(null);

                await interaction.update({ embeds: [cancelEmbed], components: [] });
                return;
            }

            if (interaction.customId === "casino_blackjack") {
                collector.stop("start");

                const startEmbed = EmbedBuilder.from(embed)
                    .setDescription("Alright then! Let's hear the starting bet.")
                    .setColor(0x57f287)
                    .setFooter(null);

                await interaction.update({ embeds: [startEmbed], components: [] });
                return Blackjack.blackJack(msg, interaction);
            }
        });

        collector.on("end", async (_, reason) => {
            if (reason !== "start" && reason !== "cancelled") {
                // timed out with no interaction
                const timeoutEmbed = EmbedBuilder.from(embed)
                    .setDescription("Menu timed out.")
                    .setColor(0x99aab5)
                    .setFooter(null);
                await sentMsg.edit({ embeds: [timeoutEmbed], components: [] }).catch(() => {});
            }
            if (reason !== "start") {
                resolve();
            }
        });
    });
}

module.exports = { start };
