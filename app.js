const app=require('express')()
const PORT=process.env.PORT || 3010
const HOST=process.env.HOST || 'localhost'

app.listen(PORT, () => {
    console.log('Server is up on : http://' + HOST + ':' + PORT)
})


// Home page
app.get('/', (req, res) => {
    res.format({
        html: () => {
            res.redirect('/games')
        },
        json: () => {
            res.json({
                error : '406 NOT_API_AVAILABLE'
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