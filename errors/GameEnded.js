class GameEnded extends Error {
    constructor() {
        super()
        // this.status = 404
        this.type = 'GAME_ENDED'
        this.message = 'Game Ended'
        
    }

}

module.exports = GameEnded