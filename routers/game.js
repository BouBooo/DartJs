const router = require('express').Router()

router.get('/', (req, res, next) => {  
    res.send('GET /games')   
})

module.exports = router