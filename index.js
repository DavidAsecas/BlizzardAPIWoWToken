let tokenDataArray
init()

async function init(){
    tokenDataArray = await getData()
    console.log(tokenDataArray)
    chart()
}

async function getData(){
    let options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    }
    let response = await fetch('api/tokenData', options)
    console.log(response)
    return await response.json()
}

function chart() {
    var ctx = document.getElementById('chart').getContext('2d');
    ctx.canvas.width = 1000;
    ctx.canvas.height = 300;
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