const mongoose = require('mongoose')
const url = 'mongodb://localhost:27017/darts'

mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

const GamePlayer = mongoose.model('game_player', new mongoose.Schema({
    playerId: Number,
    gameId: Number,
    remainingShots: Number || null,
    score: Number,
    rank: null || Number,
    order: Number || null,
    inGame: Boolean,
    createdAt: Date
}))

module.exports = {
    // TODO
}