const mongoose = require('mongoose')
const url = 'mongodb://localhost:27017/darts'
const Player = require('../models/Player')

mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

const GamePlayer = mongoose.model('game_player', new mongoose.Schema({
    playerId: String,
    gameId: String,
    remainingShots: Number || null,
    score: Number,
    rank: null || Number,
    order: Number || null,
    inGame: Boolean,
    createdAt: Date
}))

module.exports = {
    // Get all game players
    getAll(game) {
        return GamePlayer.find({gameId: game._id})
    },

    getGameForPlayer(playerId) {
        return GamePlayer.findOne({playerId: playerId})
    },

    isAlreadyInGame(playersId) {
        return GamePlayer.find({playerId: { $in : playersId }})
    },

    // Create new game
    async create(playerId, gameId) {
        var params = { 
            playerId: playerId,
            gameId: gameId,
            remainingShots: null,
            score: null,
            rank: null,
            order: null,
            inGame: true,
            createdAt: Date.now()
        }
    
        let newGame = new GamePlayer(params)
        newGame.save()
        return newGame
    },

    multipleRemove: async (id) => {
        return GamePlayer.remove({playerId: id})
    },

    remove: async (id) => {
        return GamePlayer.findOneAndRemove({playerId: id})
    }
}