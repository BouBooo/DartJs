class GamePlayerMissing extends Error {
    constructor() {
        super()
        // this.status = 404
        this.type = 'GAME_PLAYER_MISSING'
        this.message = 'Game player missing'
        
    }

}

module.exports = GamePlayerMissing