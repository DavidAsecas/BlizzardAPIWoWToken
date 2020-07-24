let express = require('express')
let fetch = require('node-fetch')
let firebase = require('firebase');
let moment = require('moment')
require('firebase/database')
require('dotenv').config();

let app = express()

let database;
let tokenDataArray

firebaseConfiguration();
listenToNewData();
sequence();
setInterval(() => {
    sequence();
}, 1200000)

let router = express.Router();

app.use(express.static(__dirname));

router.get('/tokenData', (request, response) => {
    response.json(tokenDataArray)
})

app.use('/api', router)

app.listen(process.env.PORT || 5000, () => {
    console.log('express in port 5000')
})

// firebaseConfiguration()
async function firebaseConfiguration() {
    // Your web app's Firebase configuration
    var firebaseConfig = {
        apiKey: process.env.API_KEY,
        authDomain: "wowtoken.firebaseapp.com",
        databaseURL: "https://wowtoken.firebaseio.com",
        projectId: "wowtoken",
        storageBucket: "wowtoken.appspot.com",
        messagingSenderId: "286941231448",
        appId: "1:286941231448:web:13d53f9f83d5ab1ffc4d2d",
        measurementId: "G-3DB3XT1XP6"
    };
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    database = firebase.database();
}

function listenToNewData(){
    let ref = database.ref('tokenData');
    ref.on('value', gotTokenData, function () {
        console.error('no data')
    })
}

async function sequence() {
    let accesToken = await getAccessToken();
    let tokenData = await getWowTokenPrize(accesToken);
    pushTokenData(tokenData)
}

async function getAccessToken() {
    let key = process.env.CLIENT_KEY
    let secret = process.env.CLIENT_SECRET
    let response = await fetch('https://eu.battle.net/oauth/token', {
        method: 'POST',
        body: 'grant_type=client_credentials&client_id=' + key + '&client_secret=' + secret,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'cache-control': 'no-cache'
        }
    })
    let json = await response.json()
    return json.access_token
}

async function getWowTokenPrize(accessToken) {
    let response = await fetch('https://eu.api.blizzard.com/data/wow/token/index?namespace=dynamic-eu', {
        method: 'GET',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'authorization': 'bearer ' + accessToken
        }
    })
    let json = await response.json();
    let tokenData = {
        price: json.price / 10000,
        date: json.last_updated_timestamp
    }
    return tokenData;
}

function pushTokenData(tokenData) {
    let ref = database.ref('tokenData')
    ref.orderByChild('date').equalTo(tokenData.date).once('value').then(snap =>{
        if(!snap.exists()){
            ref.push(tokenData)
        }
    })
}

function gotTokenData(data) {
    tokenDataArray = []
    let tokensData = data.val()
    // console.log(tokensData)
    let keys = Object.keys(tokensData)
    for (let i = 0; i < keys.length; i++) {
        let k = keys[i]
        let price = tokensData[k].price
        let date = tokensData[k].date
        tokenDataArray.push({
            x: moment(date),
            y: price
        })
    }
}