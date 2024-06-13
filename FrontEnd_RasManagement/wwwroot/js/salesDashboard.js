// A $( document ).ready() block.
$(document).ready(function () {

//Card Total SalesPro
    viewCardSalesPro();
   

    $("#selectYear").datepicker({
        format: "yyyy", 
        viewMode: "years", 
        minViewMode: "years" 
    }).change(function () {
        viewChart(this.value);
    });

    $("#selectYearChartSales").datepicker({
        format: "yyyy",
        viewMode: "years",
        minViewMode: "years"
    }).change(function () {
        lineChartSalesPro(this.value);
 
    });

    //BarChart Positions
    $("#selectYear").val(new Date().getFullYear())
    viewChart(new Date().getFullYear());

    //LineChart SalesPro
    $("#selectYearChartSales").val(new Date().getFullYear())
    lineChartSalesPro(new Date().getFullYear());


    //View Close Lose Last Update
    viewCloseLoseLastUpdate();

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
//async function lineChartSalesPro() {
   
   
//    getDataSalesPro().then(data => {
//        if (data) {
//            const projects = data.data;
//            const projectCountByDateAndStatus = {};

           
//            projects.forEach(project => {
//                const date = project.entryDate.split("T")[0];
//                const status = project.projectStatus;

//                if (projectCountByDateAndStatus[date]) {
//                    if (projectCountByDateAndStatus[date][status]) {
//                        projectCountByDateAndStatus[date][status]++;
//                    } else {
//                        projectCountByDateAndStatus[date][status] = 1;
//                    }
//                } else {
//                    projectCountByDateAndStatus[date] = { [status]: 1 };
//                }
//            });

         
//            const labels = Object.keys(projectCountByDateAndStatus);

          
//            const statusColors = {
//                "string": "rgba(78, 115, 223, 1)",
//                "Close Win": "rgba(28, 200, 138, 1)",
//                "Best View": "rgba(54, 185, 204, 1)",
//                "Open": "rgba(246, 194, 62, 1)",
//                "Hold": "rgba(231, 74, 59, 1)",
//                "Close Lose": "rgba(133, 135, 150, 1)"
//            };

        
//            const projectStatusDatasets = {};

//            labels.forEach(date => {
//                const statuses = projectCountByDateAndStatus[date];
//                for (const status in statuses) {
//                    if (!projectStatusDatasets[status]) {
//                        projectStatusDatasets[status] = {
//                            label: status,
//                            data: [],
//                            backgroundColor: statusColors[status],
//                            borderColor: statusColors[status],
//                            lineTension: 0.3,
//                            fill: false
//                        };
//                    }
//                    projectStatusDatasets[status].data.push(statuses[status]);
//                }
//            });

          
//            for (const status in projectStatusDatasets) {
//                projectStatusDatasets[status].data = labels.map(date => projectCountByDateAndStatus[date][status] || 0);
//            }

            
//            const datasets = Object.values(projectStatusDatasets);

//            // Konfigurasi chart
//            var ctx = document.getElementById("lineChartSales");
//            var myLineChart = new Chart(ctx, {
//                type: 'line',
//                data: {
//                    labels: labels,
//                    datasets: datasets
//                },
//                options: {
//                    maintainAspectRatio: false,
//                    layout: {
//                        padding: {
//                            left: 10,
//                            right: 25,
//                            top: 0,
//                            bottom: 0
//                        }
//                    },
//                    scales: {
//                        xAxes: [{
//                            time: {
//                                unit: 'date'
//                            },
//                            gridLines: {
//                                display: false,
//                                drawBorder: false
//                            },
//                            ticks: {
//                                maxTicksLimit: 7
//                            }
//                        }],
//                        yAxes: [{
//                            ticks: {
//                                maxTicksLimit: 10,
//                                padding: 10
//                            }
//                        }]
//                    }
//                }
//            });
//        }
//    });

//}

// Line Chart Perbulan
 async function lineChartSalesPro(yearFilter) {

     getDataSalesPro().then(data => {
       
        if (data) {
            const allProjects = data.data;
     

            const projects = allProjects.filter(project => {
                const projectYear = new Date(project.entryDate).getFullYear();
                return projectYear == yearFilter;
            });
    
        
            const projectCountByDateAndStatus = {};
       
            const getMonthYearString = (dateString) => {
                const date = new Date(dateString);
                const month = date.getMonth() + 1;
                const year = date.getFullYear();
                return `${year}-${month < 10 ? '0' + month : month}`;
            };
            
            projects.forEach(project => {
                const monthYear = getMonthYearString(project.entryDate);
                const status = project.projectStatus;

                
                if (projectCountByDateAndStatus[monthYear]) {
                    if (projectCountByDateAndStatus[monthYear][status]) {
                        projectCountByDateAndStatus[monthYear][status]++;
                    } else {
                        projectCountByDateAndStatus[monthYear][status] = 1;
                    }
                } else {
                    projectCountByDateAndStatus[monthYear] = { [status]: 1 };
                }
            });

             
            const labels = Object.keys(projectCountByDateAndStatus).sort();


            const statusColors = {
          
                "Close Win": "rgba(28, 200, 138, 1)",
                "Best View": "rgba(54, 185, 204, 1)",
                "Open": "rgba(246, 194, 62, 1)",
                "Hold": "rgba(231, 74, 59, 1)",
                "Close Lose": "rgba(133, 135, 150, 1)"
            };

            const projectStatusDatasets = {};

            labels.forEach(monthYear => {
                const statuses = projectCountByDateAndStatus[monthYear];
                for (const status in statuses) {
                    if (!projectStatusDatasets[status]) {
                        projectStatusDatasets[status] = {
                            label: status,
                            data: [],
                            backgroundColor: statusColors[status],
                            borderColor: statusColors[status],
                            lineTension: 0.3,
                            fill: false
                        };
                    }
                    projectStatusDatasets[status].data.push(statuses[status]);
                }
            });

            for (const status in projectStatusDatasets) {
                projectStatusDatasets[status].data = labels.map(monthYear => projectCountByDateAndStatus[monthYear][status] || 0);
            }

            const datasets = Object.values(projectStatusDatasets);

            var ctx = document.getElementById("lineChartSales");
            var myLineChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: datasets
                },
                options: {
                    maintainAspectRatio: false,
                    layout: {
                        padding: {
                            left: 10,
                            right: 25,
                            top: 7,
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
                                maxTicksLimit: 7
                            }
                        }],
                        yAxes: [{
                            ticks: {
                                maxTicksLimit: 5,
                                padding: 10
                            }
                        }]
                    }
                }
            });
        
        }
    });

}


//View Close Lose Last Update
function viewCloseLoseLastUpdate() {

     getDataSalesProjectGroupByLastUpdate().then(data => {
        
         if (data) {
             const data_ = data.data;
             console.log(data_);
            const tableBody = document.getElementById('closeLose').getElementsByTagName('tbody')[0];

          
             const total = document.createElement("td");
             let number = 1;
             data_.forEach(function (item) {
                 if (item.lastUpdate == null || item.lastUpdate== "") {
                     item.lastUpdate = "Kosong";
                 }
                 const no = document.createElement("td");
                 const lastUpdate = document.createElement("td");
                 const total = document.createElement("td");
                 const tr = document.createElement("tr");
                 no.style.color = "black";
                 no.style.fontWeight = "bold";

                 no.innerText = number ++
                 lastUpdate.textContent = item.lastUpdate;
                 total.innerText = item.total;
                 tr.append(no, lastUpdate, total);
                 tableBody.append(tr);
             })

        } else {
            console.log("Error");
        }
    });
}

function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function countProjectsByDateAndStatus(data) {
 
    const counts = {};
    data.forEach(project => {
        const entryDate = project.entryDate.split('T')[0]; // Ambil bagian tanggal saja
        const status = project.projectStatus;
        if (!counts[entryDate]) {
            counts[entryDate] = {};
        }
        if (!counts[entryDate][status]) {
            counts[entryDate][status] = 0;
        }
        counts[entryDate][status]++;
    });
    return counts;
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

// Get Data Sales Project Group By Last Update
async function getDataSalesProjectGroupByLastUpdate() {

    const apiUrl = 'https://localhost:7177/api/SalesProjection/GetSalesProjectGroupByLastUpdate';

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



