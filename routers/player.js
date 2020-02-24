const router = require('express').Router()
const Player = require('../models/Player')
const Game = require('../models/Game')
const GamePlayer = require('../models/GamePlayer')
const baseUrl = 'https://localhost/players'
const validator = require('validator')
const NotFound = require('../errors/NotFound')
const ApiNotAvailable = require('../errors/ApiNotAvailable')
const ArgumentMissing = require('../errors/ArgumentMissing')
const PlayerNotDeletable = require('../errors/PlayerNotDeletable')


/**
 * JSON: Json Players Objects
 * HTML: Players list
 */
router.get('/', (req, res, next) => {  
    Player.getAll(req.query)
    .then((response) => {
        res.format({
            json: () => {
                res.json({
                    players: response
                })
            },
            html: () => {
                res.render('players', {
                    players: response
                })
            }
        })
    })
    .catch((err) => {
        throw err
    })
})

router.get('/new', (req, res, next) => {  
    res.format({
        html: () => {
            res.render('get_players_new')
        },
        json: () => {
            return res.status(406).send({
                error : new ApiNotAvailable()
            })
        }
    })
})

router.get('/:id', (req, res, next) => {  
    if(!req.params.id) return res.json(new ArgumentMissing())
    Player.getOne(req.params.id)
        .then((response) => {
            res.format({
                json: () => {
                    res.json({
                        player: response
                    })
                },
                html: () => {
                    res.redirect(301, '/players/' + response._id + '/edit')
                }
            })
        })
        .catch(() => {
            res.json({
                message: 'No player found'
            })
        })
})

/**
 * JSON: 201 Player Json Object 
 * HTML: Redirect to /player/:id
 */
router.post('/', (req, res, next) => {
    if(!req.body.name || !req.body.email) return res.json(new ArgumentMissing())
    Player.checkValidEmail(req.body.email) 
    .then((alreadyExists) => {
        if(alreadyExists.length > 0) return res.send({message : 'Email already used'})
        if(!validator.isEmail(req.body.email)) return res.send({message : 'Email not correctly formatted'})
        Player.create(req.body)
        .then((player) => {
            res.format({
                json: () => { 
                    res.status(201).send(player) 
                },
                html : () => {
                    res.redirect(301, '/players/' + player._id + '/edit')
                } 
            })
        })
        .catch(next)
    })
    .catch(() => {
        res.json({
            message : 'error'
        })
    })
})


/**
 * JSON: 406 NOT_API_AVAILABLE  
 * HTML: Edit form
 */
router.get('/:id/edit', (req, res, next) => {
    Player.getOne(req.params.id) 
        .then((result) => {
            res.format({
                json: () => {
                    return res.status(406).json({
                        error : new ApiNotAvailable()
                    })
                },
                html: () => {
                    res.render('get_players_patch', {
                        player: result,
                        id: result._id
                    })
                },
            })
        }) 
        .catch((err) => {
            throw err
        })
})

/**
 * JSON: 200 Player
 * HTML: Redirect to /players
 */
router.patch('/:id', (req, res, next) => {
    if(!req.params.id) return res.json(new ArgumentMissing())
    Player.update(req.params.id, req.body)
        .then((player) => {
            res.format({
                html: () => { 
                    res.redirect(301, '/players') 
                },
                json: () => { 
                    res.status(200).send({player}) 
                }
            })
        })
        .catch(next)
})

/**
 * JSON: 204
 * HTML: Redirect to /players
 */
router.delete('/:id', (req, res, next) => {
    if(!req.params.id) return res.json(new ArgumentMissing())
    GamePlayer.getGameForPlayer(req.params.id) 
    .then((playerGame) => {
        Game.getOne(playerGame.gameId)
        .then((game) => {
            if(game.status != 'draft') return res.json(new PlayerNotDeletable())
            Player.remove(req.params.id)
            .then(() => {
                GamePlayer.multipleRemove(req.params.id)
                .then(() => {
                    res.format({
                        html: () => { 
                            res.redirect(301, '/players') 
                        },
                        json: () => { 
                            res.status(204).send()
                        }
                    })
                })
                .catch(next)
                
            })
        })
    })
}) 

module.exports = router