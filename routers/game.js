const router = require('express').Router()
const Game = require('../models/Game')
const Player = require('../models/Player')
const functions = require('../functions/player')
const GamePlayer = require('../models/GamePlayer')
const GameShot = require('../models/GameShot')
const baseUrl = 'https://localhost/games'
const PlayerNotDeletable = require('../errors/PlayerNotDeletable')
const PlayerNotAddable = require('../errors/PlayerNotAddable')
const ApiNotAvailable = require('../errors/ApiNotAvailable')
const GamePlayerMissing = require('../errors/GamePlayerMissing')
const InvalidFormat = require('../errors/InvalidFormat')
const GameNotStarted = require('../errors/GameNotStarted')
const GameEnded = require('../errors/GameEnded')
const GameIsFull = require('../errors/GameIsFull')


router.get('/', (req, res, next) => {  
    Game.getAll(req.query)
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
            res.render('get_games_new')
        },
        json: () => {
            res.json(new ApiNotAvailable())
        }
    })
})


router.get('/:id', (req, res, next) => {  
    if(!req.params.id) res.json(new ArgumentMissing())
    Game.getOne(req.params.id)
        .then((game) => {
            GamePlayer.getAll(game._id)
                .then((games) => {          
                    let playersId = []
                    games.forEach(game => playersId.push(game.playerId))
                    if(games.length === 0) return res.json(new GamePlayerMissing())
                    Player.getPlayerForGame(playersId)
                        .then((playersInGame) => {
                            console.log(playersInGame)
                            let currentPlayer = functions.createCurrentPlayer(playersInGame)
                            let randomShot = functions.createRandomShot(currentPlayer, game)
                            res.format({
                                json: () => {
                                    res.json(game)
                                },
                                html: () => {
                                    res.render('get_game', {
                                        game: game,
                                        players: playersInGame,
                                        playersId: playersId.length,
                                        currentPlayer: currentPlayer,
                                        randomShot: randomShot
                                    })
                                }
                            })
                        })
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
    if(!req.body.name || !req.body.mode) return res.json(new InvalidFormat())
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
                    res.json(new ApiNotAvailable())
                },
                html: () => {
                    res.render('get_games_patch', {
                        title: 'Modifier une partie',
                        game: result,
                        button: 'Sauvegarder',
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
    if(!req.params.id) res.json(new ArgumentMissing()) 
    Game.update(req.params.id, req.body)
        .then((result) => {
            console.log(result)
            res.format({
                html: () => { 
                    res.redirect('/games/' + req.params.id) 
                },
                json: () => { 
                    res.status(200).send({ game: result }) 
                }
            })
        })
        .catch(next)
})

router.delete('/:id', (req, res, next) => {
    if(!req.params.id) res.json(new ArgumentMissing()) 
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
    if(!req.params.id) res.json(new ArgumentMissing()) 
    Game.getOne(req.params.id)
        .then((response) => {
            GamePlayer.getAll(response._id)
            .then((games) => {
                let playersId = []
                games.forEach(game => playersId.push(game.playerId))
                    Player.getPlayerForGame(playersId)
                        .then((playersInGame) => {
                            Player.getPlayerNotInGame(playersId)
                                .then((playersNotInGame) => {
                                    res.format({
                                        json: () => {
                                            res.json({
                                                players: playersInGame
                                            })
                                        },
                                        html: () => {
                                            res.render('get_games_players', {
                                                game: response,
                                                players: playersInGame,
                                                noPlayers: playersNotInGame,
                                                playersId: playersId.length
                                            })
                                        }
                                    })
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
    if(!req.params.id) return res.send(new ArgumentMissing())
    Game.getOne(req.params.id)
    .then((game) => {
        if(game.status != 'draft') { return res.json(new PlayerNotAddableGameStarted()) }
        GamePlayer.getAll(game._id)
        .then((games) => {
            let gamesId = []
            games.forEach(game => { 
                gamesId.push(game.gameId)
            })
            if(gamesId.length >= 4) return res.json(new GameIsFull())
            let playersId = req.body.player_id.split(',')
            GamePlayer.isAlreadyInGame(playersId)
            .then((result) => {
                if(result.length > 0) return res.json(new PlayerNotAddable)
                playersId.forEach(player => 
                    GamePlayer.create(player, game._id)
                        .then((result) => {
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
                ) 
            })
        })
    })
})


router.delete('/:id/players', (req, res, next) => {
    Game.getOne(req.params.id)
        .then((game) => {
            if(game.status != 'draft') return res.json(new PlayerNotDeletable())
            if(!req.query.id && !req.body.id) return res.json({'error' : 'Id missing for remove a player from this room.'})
            if(!req.body.id) {
                req.query.id.forEach(id => 
                    GamePlayer.remove(id)
                    .then(() => {
                        res.format({
                            html: () => { 
                                res.redirect(301, '/games') 
                            },
                            json: () => { 
                                res.status(204) 
                            }
                        })
                    })
                )
            } else {
                GamePlayer.remove(req.body.id)
                .then(() => {
                    res.format({
                        html: () => { 
                            res.redirect(301, '/games/' + game._id + '/players') 
                        },
                        json: () => { 
                            res.status(204) 
                        }
                    })
                })
            }
        })
})

router.post('/:id/shot', (req, res, next) => {
    if(!req.params.id) return res.send(new ArgumentMissing())
    Game.getOne(req.params.id)
    .then((game) => {
        if(game.status == 'draft') return res.json(new GameNotStarted())
        if(game.status == 'ended') return res.json(new GameEnded())
        GameShot.create(game._id, req.body)
                .then((result) => {
                    res.format({
                        json: () => { 
                            res.status(201).send({
                                player_added: result
                            }) 
                        },
                        html : () => {
                            res.redirect('/games/' + result.gameId)
                        } 
                    })
                })
                .catch(next)
    })
})


module.exports = router