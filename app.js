const app=require('express')()
const express = require('express');
const bodyParser = require('body-parser')
const PORT = process.env.PORT || 3010
const HOST = process.env.HOST || 'localhost'
const playerRouter = require('./routers/player')
const gameRouter = require('./routers/game')
const hbs = require('express-handlebars')
const methodOverride = require('method-override')
const ApiNotAvailable = require('./errors/ApiNotAvailable')

/** 
 * Define template engine
 */
app.engine('hbs', hbs({extname: 'hbs', defaultLayout: 'layout', allowProtoMethodsByDefault: true}))
app.set('views', './views') 
app.set('view engine', 'hbs')

/**
 * Static files
 */
app.use('/', express.static(__dirname + '/assets'));


/**
 * Override method
 */
app.use(methodOverride('_method'))


/**
 * Body parser
 */
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))


/**
 * Server
 */
app.listen(PORT, () => {
    console.log('Server is up on : http://' + HOST + ':' + PORT)
})


/**
 * Routers
 */
app.use('/players', playerRouter)
app.use('/games', gameRouter)



// Home page
app.all('/', (req, res, next) => {
    res.format({
      html: () => {
        res.redirect('/games')
      },
      json: () => {
        res.status(406).json(new ApiNotAvailable())
      }
  })
    
})


/**
 * Middleware
 */
app.use((err, req, res, next) => {
    res.format({
      html: () => {
        res.render("error", {
          error: err
        })
      },
      json: () => {
        res.status(err.status).json(err) 
      }
    })
  })
