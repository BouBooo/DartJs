const router = require('express').Router()
const playerRouter = require('./routers/player.js')

router.use('/players', playerRouter);

module.exports = router