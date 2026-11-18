const hangmanWords = require('./hangmanWords')

const MAX_LIVES = 6
const LOBBY_MS = 15000
const GAME_IDLE_MS = 5 * 60 * 1000 // end an abandoned game so it can't block the server forever
const HIDDEN_TILE = ':white_large_square: ' // trailing space is intentional (matches the original layout)

/**
 * One entry per guild with a lobby or game in progress.
 * guildId -> { phase: 'lobby' | 'playing', players: string[], word, guessed: Set<string>, lives }
 */
const sessions = new Map()

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const chooseWord = () => hangmanWords[Math.floor(Math.random() * hangmanWords.length)]

const isSolved = ({ word, guessed }) => [...word].every((letter) => guessed.has(letter))

const renderWord = ({ word, guessed }) =>
    [...word].map((letter) => (guessed.has(letter) ? letter : HIDDEN_TILE)).join(' ')

function isGameActive(guildId) {
    return sessions.has(guildId)
}

// ---------------------------------------------------------------------------
// Lobby
// ---------------------------------------------------------------------------

/**
 * Opens a 15 second lobby where people can say "join".
 * Resolves with the array of player IDs, or "no_players" if nobody joined
 * or a game is already running in this server.
 */
function gatherPlayers(msg) {
    const guildId = msg.guild.id

    if (sessions.has(guildId)) {
        msg.reply('Sorry, already playing a game!')
        return Promise.resolve('no_players')
    }

    const session = { phase: 'lobby', players: [] }
    sessions.set(guildId, session)

    msg.reply('Alright sure, whoever wants to play can just say "Join"')

    return new Promise((resolve) => {
        const collector = msg.channel.createMessageCollector({
            filter: (response) => !response.author.bot && response.content.toLowerCase() === 'join',
            time: LOBBY_MS,
        })

        collector.on('collect', (m) => {
            if (session.players.includes(m.author.id)) return

            session.players.push(m.author.id)
            msg.channel.send(m.author.username + ' is in')
        })

        collector.on('end', () => {
            if (session.players.length === 0) {
                sessions.delete(guildId)
                msg.channel.send('Guess nobody wanted to play')
                return resolve('no_players')
            }

            msg.channel.send("Alright, we're starting with " + session.players.length + ' players then')
            resolve(session.players)
        })
    })
}

// ---------------------------------------------------------------------------
// Game
// ---------------------------------------------------------------------------

/**
 * Plays a game with the players from gatherPlayers.
 * Resolves with "win", "lose", "ended" (idle timeout / error), or
 * "no_players" if there is no lobby to start from.
 */
function hangMan(msg) {
    const guildId = msg.guild.id
    const session = sessions.get(guildId)

    // gatherPlayers never ran, nobody joined, or the game already started
    if (!session || session.phase !== 'lobby' || session.players.length === 0) {
        return Promise.resolve('no_players')
    }

    session.phase = 'playing'
    session.word = chooseWord()
    session.guessed = new Set()
    session.lives = MAX_LIVES

    return new Promise((resolve) => {
        let result = 'ended'
        let done = false

        const collector = msg.channel.createMessageCollector({
            filter: (m) =>
                !m.author.bot &&
                session.players.includes(m.author.id) &&
                /^[a-zA-Z]$/.test(m.content),
            idle: GAME_IDLE_MS,
        })

        const finish = (outcome) => {
            done = true
            result = outcome
            collector.stop()
        }

        msg.channel.send(
            'Hangman started! \n\n' + renderWord(session) + '\n\nLives: ' + session.lives
        )

        collector.on('collect', async (m) => {
            if (done) return

            try {
                const guess = m.content.toLowerCase()

                if (session.guessed.has(guess)) {
                    return m.reply('That letter has already been guessed!')
                }
                session.guessed.add(guess)

                if (!session.word.includes(guess)) {
                    m.reply('Nope! Guessed wrong dumbass!')
                    session.lives--
                }

                if (isSolved(session)) {
                    done = true // stop handling guesses while the message sends
                    await msg.channel.send('You got it! Congrats!\n **' + session.word + '**')
                    return finish('win')
                }

                if (session.lives <= 0) {
                    done = true
                    await msg.channel.send('You lost! Dumbass!\nThe word was **' + session.word + '**')
                    return finish('lose')
                }

                await msg.channel.send(renderWord(session) + '\n\nLives: ' + session.lives)
            } catch (err) {
                console.error(err)
                finish('ended')
            }
        })

        collector.on('end', () => {
            sessions.delete(guildId)
            msg.channel.send('Thanks for playing!')
            resolve(result)
        })
    })
}

module.exports = {
    gatherPlayers,
    hangMan,
    isGameActive,
}
