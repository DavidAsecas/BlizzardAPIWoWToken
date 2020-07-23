let express = require('express')
let app = express()

let router = express.Router();

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

app.listen(process.env.PORT || 8000, () => {
    console.log('express in port 8000')
})