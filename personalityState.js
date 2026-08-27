// Per-guild toggle, defaults to "on"
const disabledGuilds = new Set();

function isPersonalityDisabled(guildId) {
    return disabledGuilds.has(guildId);
}

function setPersonalityDisabled(guildId, disabled) {
    if (disabled) {
        disabledGuilds.add(guildId);
    } else {
        disabledGuilds.delete(guildId);
    }
}

module.exports = { isPersonalityDisabled, setPersonalityDisabled };
