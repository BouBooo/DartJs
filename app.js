const app=require('express')()
const bodyParser = require('body-parser')
const PORT=process.env.PORT || 3010
const HOST=process.env.HOST || 'localhost'
const playerRouter = require('./routers/player')
const gameRouter = require('./routers/game')
const hbs = require('express-handlebars')

/** 
 * Define template engine
 */
app.engine('hbs', hbs({extname: 'hbs', defaultLayout: 'layout'}))
app.set('views', './views') 
app.set('view engine', 'hbs')


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

// Game page
app.get('/games', (req, res) => {
    res.send('Games page')
});

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
        res.json("Error detected") 
      }
    })
  })