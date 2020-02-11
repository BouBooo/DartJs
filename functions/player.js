module.exports = {
    createCurrentPlayer(playersInGame) {
        return playersInGame[Math.floor(Math.random() * playersInGame.length)]
    },

    createRandomShot(currentPlayer, game) {
        return {
            playerId : currentPlayer._id,
            gameId : game._id,
            sector: Math.floor(Math.random() * 21),
            multiplicator: Math.floor(Math.random() * 3) + 1
        }
    }
}