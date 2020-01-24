const mongoose = require('mongoose')
const url = 'mongodb://localhost:27017/darts'

mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

const Game = mongoose.model('game', new mongoose.Schema({
    mode: String,
    name: String,
    currentPlayerId: Number,
    status: String,
    createdAt: Date 
}))

module.exports = {

    // Get all games
    getAll() {
        return Game.find({})
    },

    // Get specific game
    async getOne(id) {
        let game = await Game.findOne({_id:id})
        return game
      },

    // Create new game
    async create(params) {
        var params = { 
            name: params.name,
            mode: params.mode,
            status: 'draft',
            createdAt: Date.now()
          }
      
          let newGame = new Game(params)
          newGame.save()
          return newGame
    },

    update: async (id, params) => {
        let els = { 
          name: params.name,
          mode: params.mode,
          status: params.status
        }
        return await Game.updateOne({_id: id}, els)
      },

    remove: async (id) => {
        return Game.findOneAndRemove({_id: id})
    }
}