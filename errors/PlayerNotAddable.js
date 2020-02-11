class PlayerNotAddable extends Error {
    constructor() {
        super()
        // this.status = 404
        this.type = 'PLAYER_NOT_ADDABLE'
        this.message = 'Player already in a game'
        
    }

}

module.exports = PlayerNotAddable