const mongoose = require('mongoose')
const url = 'mongodb://localhost:27017/darts'
const Player = require('../models/Player')

mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

const GameShot = mongoose.model('game_shot', new mongoose.Schema({
    playerId: String,
    gameId: String,
    multiplicator: Number || null,
    sector: Number,
    createdAt: Date
}))

module.exports = {

    // Get game shots 
    getAll(game) {
        return GameShot.find({gameId: game._id})
    },

    // Create new game_shot
    async create(gameId, params) {
        var params = { 
            playerId: params.playerId,
            gameId: gameId,
            multiplicator: params.multiplicator,
            sector: params.sector,
            createdAt: Date.now()
        }
    
        let gameShot = new GameShot(params)
        gameShot.save()
        return gameShot
    },
}