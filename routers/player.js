const router = require('express').Router()
const Player = require('../models/Player')
const Game = require('../models/Game')
const GamePlayer = require('../models/GamePlayer')
const baseUrl = 'https://localhost/players'
const validator = require('validator')
const NotFound = require('../errors/NotFound')
const ApiNotAvailable = require('../errors/ApiNotAvailable')
const PlayerNotDeletable = require('../errors/PlayerNotDeletable')


/**
 * JSON: Json Players Objects
 * HTML: Player list
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
            res.render('get_players_new', {
                title: 'Ajouter un joueur',
                button: 'Ajouter'
            })
        },
        json: () => {
            return res.json(new ApiNotAvailable)
        }
    })
})

router.get('/:id', (req, res, next) => {  
    if(!req.params.id) res.json({message: 'Missing argument : id'})
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
    if(!req.body.name || !req.body.email) return res.send({ error : 'Missing field name or email'})
    Player.checkValidEmail(req.body.email) 
    .then((alreadyExists) => {
        if(alreadyExists.length > 0) return new NotFound()
        if(!validator.isEmail(req.body.email)) return res.send({message : 'Email not correctly formatted'})
        Player.create(req.body)
        .then((player) => {
            res.format({
                json: () => { 
                    res.status(201).json(player) 
                },
                html : () => {
                    res.redirect('/players/' + result._id + '/edit')
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
                    return res.json(new ApiNotAvailable)
                },
                html: () => {
                    res.render('get_players_patch', {
                        title: 'Modifier un joueur',
                        player: result.toJSON(),
                        button: 'Modifier',
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
    if(!req.params.id) res.json({message: 'Missing argument : id'}) 
    Player.update(req.params.id, req.body)
        .then((player) => {
            res.format({
                html: () => { 
                    res.redirect(301, '/players') 
                },
                json: () => { 
                    res.status(200).send({ player }) 
                }
            })
        })
        .catch(next)
})

// Remove player & game_player associated
router.delete('/:id', (req, res, next) => {
    if(!req.params.id) res.json({message: 'Missing argument : id'}) 
    GamePlayer.getGameForPlayer(req.params.id) 
    .then((playerGame) => {
        Game.getOne(playerGame.gameId)
        .then((game) => {
            if(game.status != 'draft') {
                return res.json(new PlayerNotDeletable())
            } 
            else {
                Player.remove(req.params.id)
                .then(() => {
                    GamePlayer.multipleRemove(req.params.id)
                    .then(() => {
                        res.format({
                            html: () => { 
                                res.redirect('/players') 
                            },
                            json: () => { 
                                res.status(204) 
                            }
                        })
                    })
                    .catch(next)
                    
                })
            }
        })
    })
}) 

module.exports = router