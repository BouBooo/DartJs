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
    getAll : async (query) => {
      // Valid queries
      let sortValid = ['name', 'status', 'mode']
      let statusValid = ['draft', 'started', 'ended']

      let limit = parseInt(query.limit)
      let status = (statusValid.includes(query.status) ? query.status : statusValid)
      console.log(statusValid)
      let sort = query.sort
      let reverse = (query.reverse ? -1 : 1)
      
      // FIX: Reverse is only valid if value is passed 
      if(statusValid.includes(query.status)) return await Game.find({status: { $in : [status]}}).limit(limit).sort({ [sort]: 1, _id:[reverse]})
      return await Game.find().limit(limit).sort({ [sort]: 1, _id:[reverse]})
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
          status: 'draft'
        }
        return await Game.updateOne({_id: id}, els)
      },

    remove: async (id) => {
        return Game.findOneAndRemove({_id: id})
    }
}