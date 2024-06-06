// A $( document ).ready() block.
$(document).ready(function () {

//Card Total SalesPro
    viewCardSalesPro();

//LineChart SalesPro
    lineChartSalesPro();
   


    $("#selectYear").datepicker({
        format: "yyyy", 
        viewMode: "years", 
        minViewMode: "years" 
    }).change(function () {

        viewChart(this.value);
    });

    $("#selectYear").val(new Date().getFullYear())
    viewChart(new Date().getFullYear());

});

document.getElementById('selectYear').addEventListener('change', function () {
    console.log("Year changed to:", this.value);
    // Call your function to handle the year change here
    viewChart(this.value);
});
function number_format(number, decimals, dec_point, thousands_sep) {
    // *     example: number_format(1234.56, 2, ',', ' ');
    // *     return: '1 234,56'
    number = (number + '').replace(',', '').replace(' ', '');
    var n = !isFinite(+number) ? 0 : +number,
        prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
        sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
        dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
        s = '',
        toFixedFix = function (n, prec) {
            var k = Math.pow(10, prec);
            return '' + Math.round(n * k) / k;
        };
    // Fix for IE parseFloat(0.55).toFixed(0) = 0;
    s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
    if (s[0].length > 3) {
        s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
    }
    if ((s[1] || '').length < prec) {
        s[1] = s[1] || '';
        s[1] += new Array(prec - s[1].length + 1).join('0');
    }
    return s.join(dec);
}

var positionName;
var count;


//Bar Chart Position
function viewChart(year) {

    $.ajax({
        url: "https://localhost:7177/api/SalesProjection/chartSalesPosition?year="+ year,
        type: "POST",
        datatype: "json",
        contentType: "application/json; charset=utf-8",
        headers: {
            Authorization: "Bearer " + sessionStorage.getItem("Token"),
        },
        success: function (positions) {

            var result = positions.data;

         
     

            //var top5PositionNames = result.slice(0, 5).map(function (item) {
            //    return item.positionType;
            //});

            //var top5count = result.slice(0, 5).map(function (item) {
            //    return item.count;
            //});

            // Bar Chart Example
            var ctx = document.getElementById("position");
            var myBarChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: result.map((item) => item.positionType),
                    datasets: [{

                        backgroundColor: "#4e73df",
                        hoverBackgroundColor: "#2e59d9",
                        borderColor: "#4e73df",
                        data: result.map((item) => item.count),
                    }],
                },
                options: {
                    maintainAspectRatio: false,
                    layout: {
                        padding: {
                            left: 2,
                            right: 2,
                            top: 2,
                            bottom: 0
                        }
                    },
                    scales: {
                        xAxes: [{
                            time: {
                                 unit: 'month'
                            },
                            gridLines: {
                                display: false,
                                drawBorder: false
                            },
                            ticks: {
                                maxTicksLimit: 10,
                                    fontSize: 10
                            },
                            maxBarThickness: 20,
                        }],
                        yAxes: [{
                            ticks: {
                                min: 0,
                                max: 20,
                                maxTicksLimit: 20,
                                padding: 10,
                            
                           
                            },
                            gridLines: {
                                color: "rgb(234, 236, 244)",
                                zeroLineColor: "rgb(234, 236, 244)",
                                drawBorder: false,
                                borderDash: [2],
                                zeroLineBorderDash: [2]
                            }
                        }],
                    },
                    legend: {
                        display: false
                    },
                    tooltips: {
                        titleMarginBottom: 5,
                        titleFontColor: '#6e707e',
                        titleFontSize: 11,
                        backgroundColor: "rgb(255,255,255)",
                        bodyFontColor: "#858796",
                        borderColor: '#dddfeb',
                        borderWidth: 1,
                        xPadding: 10,
                        yPadding: 10,
                        displayColors: false,
                        caretPadding: 10,
                        callbacks: {
                            label: function (tooltipItem, chart) {
                                var datasetLabel = chart.datasets[tooltipItem.datasetIndex].label || '';
                                return datasetLabel + 'Total : ' + number_format(tooltipItem.yLabel);
                            }
                        }
                    },
                }
            });

         
        },
        error: function (errormessage) {
            alert(errormessage.responseText);

        },
    });

}


//Card Total Sales Projection
async function viewCardSalesPro() {
    await getDataSalesPro().then(data => {
        if (data) {
            let total = data.message.split(' ');
           
            document.getElementById('totalSalesPro').textContent = total[0];
        } else {
            console.log('Failed to fetch sales projection data.');
        }
    });
}


//Line Chart Sales Projection
async function lineChartSalesPro() {
    getDataSalesPro().then(data => {
        if (data) {
            // data = seluruh data dari sales project
            console.log(data);

        } else {
            console.log('Failed to fetch sales projection data.');
        }
    });
}


// GET Sales Projection DATA
async function getDataSalesPro() {

    const apiUrl = 'https://localhost:7177/api/SalesProjection';

    try {
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: "Bearer " + sessionStorage.getItem("Token")
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
        return null;
    }
}



