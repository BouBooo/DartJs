class Player {
    constructor(number, name, score = 0) {
        this.number = number
        this.name = name
        this.score = score
        this.lastScore = []
    }
}


module.exports = Player