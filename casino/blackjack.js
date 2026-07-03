const activeCasinoGames = require("./activeGames");
const economyModule = require('./economy');

function createBlackjackSession() {
    return {
        game: "blackjack",
        inRound: false,
        awaitingBet: true,
        awaitingContinue: false,
        deck: [],
        playerHand: [],
        dealerHand: [],
        bet: 0,
        status: "waiting_bet",
        //"waiting_bet" | "playing" | "finished"
    }
}

function formatHand(hand) {
    return hand.map(c => `${c.value}${c.suit}`).join(", ");
}

function createDeck() {
    const suits = ["♠", "♥", "♦", "♣"];
    const values = ["A","2","3","4","5","6","7","8","9","10","J","Q","K"]

    let deck = [];

    for (let s of suits) {
        for (v of values) {
            deck.push({ suit: s, value :v})
        }
    }

    return deck.sort(() =>  Math.random() - 0.5)
}

function getHandValues(hand) {
    let value = 0;
    let aces = 0;

    for (let card of hand) {
        if (card.value === "A") {
            value += 11;
            aces++;
        } else if (["K","Q","J"].includes(card.value)) {
            value += 10;
        } else {
            value += Number(card.value)
        }
    }

    while (value > 21 && aces > 0) {
        value -= 10;
        aces--;
    }

    return value
}

async function blackJack(msg) {
    const filter = (m) => m.author.id === msg.author.id;
    const collector = msg.channel.createMessageCollector({filter})
        
    collector.on("collect", (m) => {
        let game = activeCasinoGames.get(m.author.id);

        if (!game) {
            game = createBlackjackSession();
            activeCasinoGames.set(m.author.id, game);
        }
        const input = m.content.toLowerCase();
        let result;

        if (game.awaitingBet) {
            result = handleBet(game, input, m.author.id);
        } else if (game.awaitingContinue) {
            result = startNewRound(game, input, m.author.id);
        } else if (game.inRound && (input.includes("hit"))) {
            result = handleHit(game);
        } else if (game.inRound && (input.includes("stand"))) {
            result = handleStand(game, m.author.id);
        } else {
            return m.reply("The fuck are you saying, give an actual answer bro")
        }

        if (result?.state) {
            activeCasinoGames.set(m.author.id, result.state);
        }

        if (result?.end) {
            collector.stop("quit");
        }

        if (result?.message) return m.reply(result.message);
        if (result?.error) return m.reply(result.error);  
    });

    collector.on("end", (_, reason) => {
        activeCasinoGames.delete(msg.author.id)
    })
}

function handleBet(game, input, userId) {
    if (input.includes("cancel")) {
        return {
            end: true,
            message: "Pussy"
        };
    }

    const bet = parseInt(input);

    if (isNaN(bet) || bet <= 0) {
        return { error: "Give me an actual number dick." };
    }

    const balance = economyModule.getBalance(userId);
    const isAllIn = (bet >= balance)

    if (bet > balance) {
        return { error: "I know damn well you aint got allat." };
    }

    economyModule.takeMoney(userId, bet);

    if (isAllIn) {
        economyModule.addMoney(userId, 50)
    }

    const deck = createDeck();
    const playerHand = [deck.pop(), deck.pop()];
    const dealerHand = [deck.pop(), deck.pop()];
    
    return {
        state: {
            bet,
            deck,
            playerHand,
            dealerHand,
            inRound: true,
            awaitingBet: false
        },
        message:
            `Bet accepted: ${bet}\n` +
            `Remaining balance: ${balance - bet} chips\n\n` +
            `Your hand: ${formatHand(playerHand)} (${getHandValues(playerHand)})\n` +
            `Dealer shows: ${dealerHand[0].value}${dealerHand[0].suit}\n\n` +
            `Hit or stand?`
    };
}

function handleHit(game) {
    game.playerHand.push(game.deck.pop());
    const value = getHandValues(game.playerHand);

    if (value > 21) {
        game.inRound = false;
        game.awaitingContinue = true;
        return {
            state: game,
            message: `Got too greedy huh? Maybe think about that next time.\nHand: ${formatHand(game.playerHand)} (${value})\n\nWant another hand then?`
        };
    }

    return {
        state: game,
        message: `Fortune favors the weak.\nHand: ${formatHand(game.playerHand)} (${value})\nHit or Stand?`
    };
}

function handleStand(game, userId) {
    let dealerValue = getHandValues(game.dealerHand);
    const playerValue = getHandValues(game.playerHand);

    while (dealerValue < 17) {
        game.dealerHand.push(game.deck.pop());
        dealerValue = getHandValues(game.dealerHand);
    }

    let result;

    if (dealerValue > 21 || playerValue > dealerValue) {
        economyModule.addMoney(userId, game.bet * 2);
        result = "Look at that! I hope your luck can keep up with you";
    } else if (playerValue === dealerValue) {
        economyModule.addMoney(userId, game.bet);
        result = "Looks like neither of us got shit";
    } else {
        result = "Don't you know the house always wins?";
    }

    game.inRound = false;
    game.awaitingContinue = true;

    return {
        state: game,
        message:
            `${result}\n\n` +
            `Your hand: ${formatHand(game.playerHand)} (${playerValue})\n` +
            `Dealer hand: ${formatHand(game.dealerHand)} (${dealerValue})\n\n` +
            `Well then, want another hand?`
    };
}

function startNewRound(game, input, userId) {
    const balance = economyModule.getBalance(userId);

    if (input.includes('yes')) {
         return {
            state: createBlackjackSession(),
            message: `Your balance: ${balance} chips\n\n` +
                "How much are we putting down this time?"
        };
    }

    if (input.includes('no')) {
        return {
            end: true,
            message: `leaving with about ${balance} chips\n\n` +
                "Guess you're cashing out, hope you had fun."
        };
    }

    return {
        error: "Yes or no bro."
    };
}

module.exports = {
    blackJack
}