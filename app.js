const app=require('express')()
const express = require('express');
const bodyParser = require('body-parser')
const PORT = process.env.PORT || 3010
const HOST = process.env.HOST || 'localhost'
const playerRouter = require('./routers/player')
const gameRouter = require('./routers/game')
const hbs = require('express-handlebars')
const methodOverride = require('method-override')

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


// MIDDLEWARE POUR PARSER LE BODY
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.listen(PORT, () => {
    console.log('Server is up on : http://' + HOST + ':' + PORT)
})

app.use('/players', playerRouter)
app.use('/games', gameRouter)

// Home page
app.get('/', (req, res) => {
    res.format({
        html: () => {
            res.redirect('/games')
        },
        json: () => {
            res.json({
                error : {
                    type: '406 NOT_API_AVAILABLE',
                    message: 'Not API available for path : ' + req.path
                }
            })
        }
    })
})

//MIDDLEWARE 404

app.use((err, req, res, next) => {
    res.format({
      html: () => {
        console.log(err)
        res.render("error", {
          error: err
        })
      },
      json: () => {
        res.status(err.status).json(err) 
      }
    })
  })
