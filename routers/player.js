const router = require('express').Router()
const Player = require('../models/Player')
const baseUrl = 'https://localhost/players'

router.get('/', (req, res, next) => {  
    Player.getAll()
        .then((response) => {
            console.log(response)
            res.format({
                json: () => {
                    res.json({
                        players: response
                    })
                }
            })
        })
        .catch((err) => {
            throw err
        })
})

router.get('/:id', (req, res, next) => {  
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
            throw err
        })
})

router.post('/', (req, res, next) => {
    if(!req.body.name || !req.body.email) return res.send({ error : 'Missing field name or email'})
    Player.create(req.body)
        .then((result) => {
            res.format({
                json: () => { 
                    res.status(201).send({
                        player: result
                    }) 
                }
            })
        })
        .catch(next)
})


router.get('/new', (req, res, next) => {  
    res.format({
        // html: () => {
        //     res.render('index')
        // },
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