let express = require('express')
let app = express()
require('dotenv').config();

let router = express.Router();

app.use(express.static(__dirname));
// app.get('/', function (req, res, next) {
//     res.setHeader("Content-Security-Policy", "img-src 'self' ");
//     console.log('use')
//     res.status(200).send()
// })

// app.use(favicon(path.join(__dirname, 'favicon.ico')))

router.get('/clientkey', (request, response) => {
    let clientkey = process.env.CLIENT_KEY
    console.log('clientkey: ',clientkey)
    response.json(clientkey)
})

router.get('/clientsecret', (request, response) => {
    let clientsecret = process.env.CLIENT_SECRET
    console.log('clientsecret:', clientsecret)
    response.json(clientsecret)
})

router.get('/apikey', (request, response) => {
    let apikey = process.env.API_KEY
    console.log('apikey: ', apikey)
    response.json(apikey)
})


// app.get('/favicon.ico', (request, response) => {
//     console.log('fav')
//     response.sendStatus(200)
// })

// app.get('/', (request, response) => {
//     console.log('/')
//     response.sendStatus(200)
// })

// app.get("*", (req, res) => res.sendFile(resolve("index.html")));

app.use('/keys', router)

app.listen(process.env.PORT || 5000, () => {
    console.log('express in port 5000')
})