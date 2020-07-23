let database;
let tokenDataArray
firebaseConfiguration();
sequence();
setInterval(() => {
    sequence();
}, 1200000)

async function getToken() {
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

// firebaseConfiguration()
function firebaseConfiguration() {
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
    let ref = database.ref('tokenData');
    ref.on('value', gotTokenData, function () {
        console.error('no data')
    })
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
    chart()
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

async function sequence() {
    let accesToken = await getToken();
    let tokenData = await getWowTokenPrize(accesToken);
    pushTokenData(tokenData)
}

function chart() {
    var ctx = document.getElementById('chart').getContext('2d');
    ctx.canvas.width = 1000;
    ctx.canvas.height = 300;
    console.log(tokenDataArray)
    var cfg = {
        data: {
            datasets: [{
                label: 'WoW Token Price History',
                data: tokenDataArray,
                borderColor: "rgba(138, 97, 21, 1)",
                type: 'line',
                pointRadius: 0,
                fill: false,
                lineTension: 0,
                borderWidth: 2
            }]
        },
        options: {
            scales: {
                xAxes: [{
                    type: 'time',
                    distribution: 'series',
                    offset: true,
                    ticks: {
                        major: {
                            enabled: true,
                            fontStyle: 'bold'
                        },
                        source: 'data',
                        autoSkip: true,
                        autoSkipPadding: 75,
                        maxRotation: 0
                    }
                }],
                yAxes: [{
                    gridLines: {
                        drawBorder: false
                    },
                    scaleLabel: {
                        display: true,
                        labelString: 'Price in gold coins'
                    }
                }]
            },
            tooltips: {
                intersect: false,
                mode: 'index',
                callbacks: {
                    label: function(tooltipItem, myData) {
                        var label = myData.datasets[tooltipItem.datasetIndex].label || '';
                        if (label) {
                            label += ': ';
                        }
                        label += parseFloat(tooltipItem.value).toFixed(2);
                        return label;
                    }
                }
            }
        }
    };

    var chart = new Chart(ctx, cfg);
}