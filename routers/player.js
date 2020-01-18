const router = require('express').Router()
const Player = require('../models/Player')
const baseUrl = 'https://localhost/players'


/**
 * JSON: Json Players Objects
 * HTML: Player list
 */
router.get('/', (req, res, next) => {  
    Player.getAll()
        .then((response) => {
            console.log(response)
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
    Player.getOne(req.params.id)
        .then((response) => {
            console.log(response)
            res.format({
                json: () => {
                    res.json({
                        player: response
                    })
                }
            })
        })
        .catch((err) => {
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
    Player.create(req.body)
        .then((result) => {
            res.format({
                json: () => { 
                    res.status(201).send({
                        player: result
                    }) 
                },
                // TODO : Redirect to /player/:id/edit
                html : () => {
                    res.redirect('/players/' + result._id)
                } 
            })
        })
        .catch(next)
})


/**
 * JSON: 406 NOT_API_AVAILABLE  
 * HTML:
 */
router.get('/:id/edit', (req, res, next) => {
    console.log(req.params.id)
    Player.edit(req.params.id) 
        .then((result) => {
            res.format({
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
        .catch((err) => {
            throw err
        })
})

module.exports = router