class Player {
    constructor(name) {
        this.id
        this.name = name,
        this.targets = [],
        this.score = 0,
        this.closed = []
    }

    setId(value) {
        this.id = value
    }

    setScore(value) {
        this.score += value
    }
}


module.exports = Player