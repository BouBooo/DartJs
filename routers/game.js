const router = require('express').Router()
const Game = require('../models/Game')
const Player = require('../models/Player')
const GamePlayer = require('../models/GamePlayer')
const baseUrl = 'https://localhost/games'

router.get('/', (req, res, next) => {  
    Game.getAll()
    .then((result) => {
        res.format({
        html: () => {
            res.render('games', {
                games: result
            })
        },
        json: () => {
            res.json({
                games: result
            })
        }
    })  
    })   
})

/**
 * JSON: 406 NOT_API_AVAILABLE
 * HTML: Game creation form
 */
router.get('/new', (req, res, next) => {  
    res.format({
        html: () => {
            res.render('get_games_new', {
                title: 'Créer une partie',
                button: 'Créer',
            })
        },
        json: () => {
            res.json({
                error: {
                    type: '406 NOT_API_AVAILABLE',
                    message: 'Not API available for path : ' + baseUrl + req.path
                }
            })
        }
    })
})

router.get('/:id', (req, res, next) => {  
    if(!req.params.id) res.json({message: 'Missing argument : id'}) 
    Game.getOne(req.params.id)
        .then((response) => {
            console.log(response)
            res.format({
                json: () => {
                    res.json({
                        game: response
                    })
                }
            })
        })
        .catch((err) => {
            res.json({
                message: 'No game found'
            })
        })
})

/**
 * JSON: 201 Player Json Object 
 * HTML: Redirect to /games/:id
 */
router.post('/', (req, res, next) => {
    console.log(req.body)
    if(!req.body.name || !req.body.mode) return res.send({ error : 'Missing field name or mode'})
    Game.create(req.body)
        .then((result) => {
            res.format({
                json: () => { 
                    res.status(201).send({
                        game: result
                    }) 
                },
                html : () => {
                    res.redirect('/games/' + result._id + '/edit')
                } 
            })
        })
        .catch(next)
})

/**
 * JSON: 406 NOT_API_AVAILABLE  
 * HTML: Edit form
 */
router.get('/:id/edit', (req, res, next) => {
    Game.getOne(req.params.id)
        .then((result) => {
            res.format({
                json: () => {
                    res.json({
                        error: {
                            type: '406 NOT_API_AVAILABLE',
                            message: 'Not API available for path : ' + baseUrl + req.path
                        }
                    })
                },
                html: () => {
                    res.render('get_games_patch', {
                        title: 'Modifier une partie',
                        game: result,
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
 * JSON: 200 Game
 * HTML: Redirect to /games
 */
router.patch('/:id', (req, res, next) => {
    if(!req.params.id) res.json({message: 'Missing argument : id'}) 
    Game.update(req.params.id, req.body)
        .then((result) => {
            res.format({
                html: () => { 
                    res.redirect('/games') 
                },
                json: () => { 
                    res.status(200).send({ game: result }) 
                }
            })
        })
        .catch(next)
})

router.delete('/:id', (req, res, next) => {
    if(!req.params.id) res.json({message: 'Missing argument : id'}) 
    Game.remove(req.params.id)
        .then(() => {
            res.format({
                html: () => { 
                    res.redirect('/games') 
                },
                json: () => { 
                    res.status(204) 
                }
            })
        })
        .catch(next)
})  


// Game Players

router.get('/:id/players', (req, res, err) => {
    if(!req.params.id) res.json({message: 'Missing argument : id'}) 
    Game.getOne(req.params.id)
        .then((response) => {
            GamePlayer.getAll(response._id)
            .then((games) => {
                let playersId = []
                games.forEach(game => playersId.push(game.playerId))
                    console.log(playersId)
                    Player.getPlayerForGame(playersId)
                        .then((playersInGame) => {
                            res.format({
                                json: () => {
                                    res.json({
                                        game: response
                                    })
                                },
                                html: () => {
                                    res.render('get_games_players', {
                                        game: response,
                                        players: playersInGame
                                    })
                                }
                            })
                        })
                })
                
        })
        .catch(() => {
            res.json({
                message: 'No game found'
            })
        })
})

/**
 * JSON: 201 Player Json Object 
 * HTML: Redirect to /games/:id
 */
router.post('/:id/players', (req, res, next) => {
    if(!req.params.id) return res.send({ error : 'Id missing'})
    GamePlayer.create(req.body)
        .then((result) => {
            console.log(result)
            res.format({
                json: () => { 
                    res.status(201).send({
                        player_added: result
                    }) 
                },
                html : () => {
                    res.redirect('/games/' + result.gameId + '/players')
                } 
            })
        })
        .catch(next)
})

module.exports = router