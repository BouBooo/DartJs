const mongoose = require('mongoose')
const url = 'mongodb://localhost:27017/darts'

mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

const Player = mongoose.model('player', new mongoose.Schema({ 
    // rowid: String,
    name: String,
    email: String,
    gameWin: Number,
    gameLost: Number,
    createdAt: Date
  }))
  


module.exports = {
    
    // Get all players
    getAll : async (query) => {
      let limit = parseInt(query.limit)
      let sort = query.sort
      return await Player.find({}).limit(limit).sort({ [sort]: 1}) 
    },

    getPlayerForGame(idArray) {
        return Player.find({_id: { $in : idArray }})
    },

    getPlayerNotInGame(idArray) {
      return Player.find({_id: { $nin : idArray }})
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

    update: async (id, params) => {
      let els = { 
        name: params.name,
        email: params.email
      }
      return await Player.updateOne({_id: id}, els)
    },

    remove: async (id) => {
      return Player.findOneAndRemove({_id: id})
    }
}