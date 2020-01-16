const router = require('express').Router()

router.get('/', (req, res, next) => {  
    res.send('GET /players')
})

module.exports = router