const commands = require("./commands")
const Discord = require("discord.js")
const hangmanWords = [
  "apple",
  "banana",
  "cherry",
  "orange",
  "grape",
  "watermelon",
  "pineapple",
  "strawberry",
  "blueberry",
  "raspberry",
  "mango",
  "peach",
  "apricot",
  "coconut",
  "pomegranate",
  "computer",
  "keyboard",
  "monitor",
  "internet",
  "javascript",
  "discord",
  "database",
  "network",
  "browser",
  "software",
  "hardware",
  "algorithm",
  "developer",
  "terminal",
  "function",
  "variable",
  "elephant",
  "giraffe",
  "kangaroo",
  "alligator",
  "penguin",
  "dolphin",
  "cheetah",
  "rhinoceros",
  "hippopotamus",
  "chimpanzee",
  "dragon",
  "wizard",
  "sorcerer",
  "paladin",
  "necromancer",
  "warlock",
  "dungeon",
  "kingdom",
  "adventure",
  "treasure",
  "phoenix",
  "griffin",
  "vampire",
  "werewolf",
  "castle",
  "galaxy",
  "planet",
  "asteroid",
  "satellite",
  "spaceship",
  "nebula",
  "supernova",
  "comet",
  "meteor",
  "blackhole",
  "universe",
  "gravity",
  "oxygen",
  "hydrogen",
  "science",
  "biology",
  "chemistry",
  "physics",
  "equation",
  "molecule",
  "volcano",
  "earthquake",
  "hurricane",
  "tornado",
  "thunderstorm",
  "avalanche",
  "tsunami",
  "mountain",
  "desert",
  "rainforest",
  "cavern",
  "library",
  "museum",
  "restaurant",
  "hospital",
  "school",
  "university",
  "stadium",
  "airport",
  "highway",
  "submarine",
  "motorcycle",
  "bicycle",
  "helicopter",
  "parachute",
  "backpack",
  "flashlight",
  "notebook",
  "sandwich",
  "pancakes",
  "spaghetti",
  "hamburger",
  "milkshake",
  "chocolate",
  "popcorn",
  "marshmallow",
  "cinnamon",
  "diamond",
  "emerald",
  "sapphire",
  "crystal",
  "treasure",
  "mystery",
  "shadow",
  "silhouette",
  "midnight",
  "sunrise",
  "moonlight",
  "daydream",
  "nightmare",
  "labyrinth",
  "crossroad",
  "wanderer",
  "guardian",
  "champion",
  "outlaw",
  "mercenary",
  "assassin",
  "gladiator",
  "detective",
  "engineer",
  "architect",
  "musician",
  "painter",
  "sculpture",
  "festival",
  "fireworks",
  "celebration",
  "vacation",
  "adrenaline",
  "whirlwind",
  "masterpiece",
  "imagination",
  "friendship",
  "adversity",
  "resilience",
  "determination",
  "constellation",
  "symphony",
  "revolution",
  "civilization",
  "enchantment",
  "reincarnation",
  "metamorphosis"
]

const games = new Map()

var gameActive = new Map()
/*var usersPlaying = []
var guessedletters = []
var lives = 6;*/

function chooseWord() {
    return hangmanWords[Math.floor(Math.random() * hangmanWords.length)];
}

async function gatherPlayers(msg) {
    return new Promise((resolve, reject) => {

    if (gameActive.get(msg.guild.id)) {
        return msg.reply("Sorry, already playing a game!")
    }

    gameActive.set(msg.guild.id, true)
    msg.reply('Alright sure, whoever wants to play can just say "Join"')
    
    usersPlaying = []

    const filter = response => {
        return response.content.toLowerCase() === 'join';
    };

    const collector = msg.channel.createMessageCollector({
        filter, 
        time: 15000
    })

    collector.on('collect', m => {
        if (!usersPlaying.includes(m.author.id)) {
            usersPlaying.push(m.author.id)
            msg.channel.send(m.author.username + " is in")
        }
    });

    collector.on("end", () => {

        if (usersPlaying.length === 0) {
            gameActive.set(msg.guild.id, false)
            msg.channel.send("Guess nobody wanted to play")
            return resolve("no_players")
        }

        msg.channel.send(
            "Alright, we're starting with " + usersPlaying.length + " players then"
        )

        resolve(usersPlaying)
    })
})}

async function hangMan(msg) {
    return new Promise((resolve) => {

    const game = {
        word: "",
        guessedletters: [],
        lives: 6,
    }

    game.word = chooseWord();

    games.set(msg.guild.id, game)

    const finishGame = (result) => {
        gameActive.set(msg.guild.id, false);
        collector.stop();
        resolve(result);
    }

    let hiddenWord = game.word.split("").map(letter => ":white_large_square: ").join(" ")

    msg.channel.send(
        'Hangman started! \n\n' + hiddenWord + '\n\nLives: ' + game.lives
    )

    const filter = m => {
        if (m.author.bot) {return false}

        if (!usersPlaying.includes(m.author.id)) return false;

        if (m.content.length !== 1) {return false}

        return /^[a-zA-Z]$/.test(m.content);
    }

    const collector = msg.channel.createMessageCollector({
        filter,
    })

    collector.on('collect', async (m) => {
        const game = games.get(msg.guild.id)
        const guess = m.content.toLowerCase()

        if (game.guessedletters.includes(guess)) {
            return m.reply("That letter has already been guessed!")
        }
        
        game.guessedletters.push(guess);

        if (!game.word.includes(guess)) {
            m.reply("Nope! Guessed wrong dumbass!")
            game.lives--;
        }

        let displayWord = game.word.split("").map(letter =>
            game.guessedletters.includes(letter)?letter:":white_large_square: "
        ).join(" ")
        
        if (!displayWord.includes(":white_large_square: ")) {
            await msg.channel.send('You got it! Congrats!\n **' +game.word+ '**')
            return finishGame("win")
        }

        if (game.lives <= 0) {
            await msg.channel.send("You lost! Dumbass!\nThe word was **" + game.word + "**")
            return finishGame('lose')
        }

        await msg.channel.send(displayWord + '\n\nLives: ' + game.lives)
    })

    collector.on('end', () => {
        msg.channel.send("Thanks for playing!")
        finishGame("ended")
    })
})}

module.exports = {
    gatherPlayers,
    hangMan
}