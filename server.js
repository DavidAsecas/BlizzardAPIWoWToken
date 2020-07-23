let express = require('express')
let app = express()

let router = express.Router();

app.use(function(req, res, next){
    if(req.originalUrl && req.originalUrl.split('/').pop() === 'favicon.ico'){
        res.sendStatus(204);
    }
    return next()
})

app.get('/clientkey', (request, response) => {
    let clientkey = process.env.CLIENT_KEY
    console.log('clientkey')
    response.json(clientkey)
})

app.get('/clientsecret', (request, response) => {
    let clientsecret = process.env.CLIENT_SECRET
    console.log('clientsecret')
    response.json(clientsecret)
})

app.get('/apikey', (request, response) => {
    let apikey = process.env.API_KEY
    console.log('apikey')
    response.json(apikey)
})


app.get('/favicon.ico', (request, response) => {
    console.log('fav')
    response.status(204).end()
})

app.listen(process.env.PORT, () => {
    console.log('express in port 5000')
})