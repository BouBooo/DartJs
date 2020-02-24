class PlayerNotAddableGameStarted extends Error {
    constructor() {
        super()
        this.type = 'PLAYER_NOT_ADDABLE_GAME_STARTED'
        this.message = 'Player not addable, the game already started'
        
    }

}

module.exports = PlayerNotAddableGameStarted