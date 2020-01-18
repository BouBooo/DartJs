const mongoose = require('mongoose')
const url = 'mongodb://localhost:27017/darts'

mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

var Player = mongoose.model('player', new mongoose.Schema({ 
    rowid: String,
    name: String,
    email: String,
    gameWin: Number,
    gameLost: Number,
    createdAt: Date
  }))
  


module.exports = {
    
    // Get all players
    getAll() {
        const all = Player.find({})
        return all
    },

    // Get specific player
    getOne: async (id) => {
        const player = await Player.findOne({_id:id})
        return player
      },

    // Create new player
    async create(params) {
        var params = { 
            name: params.name,
            email: params.email,
            gameWin: 0,
            gameLost: 0,
            createdAt: Date.now()
          }
      
          let newPlayer = new Player(params)
          newPlayer.save()
          return newPlayer
    },

    // Edit a specific player
    async edit(params) {
        var param = {
            id: params.id
        }
    }
}