class Player {
    constructor(number, name, score = 300) {
        this.number = number
        this.name = name
        this.score = score
        this.targets = []
        this.closed = []
        this.lastScore = []
        this.count = 0
        this.shootLeft = 3
    }
}


module.exports = Player