class GameIsFull extends Error {
    constructor() {
        super()
        this.type = 'GAME_IS_FULL'
        this.message = 'Already 4 players in this game'
        
    }

}

module.exports = GameIsFull