const activeCasinoGames = require("./activeGames");
const economyModule = require("./economy");
const Blackjack = require("./blackjack");

async function start(msg) {
    const userId = msg.author.id;

    if (activeCasinoGames.has(userId)) {
        return msg.reply("You're already gambling fuckwit");
    }

    const balance = economyModule.getBalance(userId);
    await msg.reply(
        "Oh hell yeah!\n\n" +
        "What you trying to play?\n" +
        "blackjack or cancel?"
    );

    return new Promise((resolve) => {
        const filter = (m) => m.author.id === userId;
        const collector = msg.channel.createMessageCollector({ filter, time: 15000 });

        collector.on("collect", async (m) => {
            const input = m.content.toLowerCase();

            if (input.includes("cancel")) {
                collector.stop("cancelled");
                return m.reply("Aight bet, maybe next time.");
            }

            if (input.includes("blackjack")) {
                collector.stop("start");
                msg.reply("Alright then! Let's hear the starting bet.")
                return Blackjack.blackJack(msg);
            }

            return m.reply("Say 'blackjack' or 'cancel'");
        });

        collector.on("end", (_, reason) => {
            if (reason !== "start") {
                resolve();
            }
        });
    });
}

module.exports = {
    start
};