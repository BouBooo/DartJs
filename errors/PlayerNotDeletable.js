class PlayerNotDeletable extends Error {
    constructor() {
        super()
        this.type = 'PLAYER_NOT_DELETABLE'
        this.message = 'Player not deletable when game is started or ended'
        
    }

}

module.exports = PlayerNotDeletable