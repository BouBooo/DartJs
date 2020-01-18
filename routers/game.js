const router = require('express').Router()
const Game = require('../models/Game')
const baseUrl = 'https://localhost/games'

router.get('/', (req, res, next) => {  
    res.send('GET /games')   
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
                button: 'Créer'
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
 * HTML: Redirect to /player/:id
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
                    res.redirect('/games/' + result._id)
                } 
            })
        })
        .catch(next)
})

module.exports = router