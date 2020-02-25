class Player {
    constructor(number, name, score) {
        this.number = number
        this.name = name
        this.score = score
        this.targets = []
        this.closed = []
        this.lastScore = []
        this.count = 0
        this.shootLeft = 3
    }

    setScore(value) {
        this.score += value
    }
}


module.exports = Player