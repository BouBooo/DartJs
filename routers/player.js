const router = require('express').Router()
const Player = require('../models/Player')

router.get('/', (req, res, next) => {  
    Player.getAll()
        .then((response) => {
            console.log(response)
            res.send('GET /players')
        })
        .catch((err) => {
            throw err
        })
})

router.post('/', (req, res) => {
    if(!req.body.name || !req.body.email) return res.send({ error : 'Missing field name or email'})
    Player.create(req.body)
        .then(() => {
            res.format({
            json: () => { res.status(201).send({message: 'success'}) }
            })
        })
        .catch(next)
    // res.send({  
    //     name: req.body.name,  
    //     email: req.body.email
    // })
    
})

module.exports = router