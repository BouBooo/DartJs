class GameNotStarted extends Error {
    constructor() {
        super()
        // this.status = 404
        this.type = 'GAME_NOT_STARTED'
        this.message = 'Game Not Started'
        
    }

}

module.exports = GameNotStarted