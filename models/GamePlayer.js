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

    // Create new game
    async create(params) {
        console.log(params.game_id, params.player_id)
        var params = { 
            playerId: params.player_id,
            gameId: params.game_id,
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

    remove: async (id) => {
        return GamePlayer.findOneAndRemove({playerId: id})
    }
}