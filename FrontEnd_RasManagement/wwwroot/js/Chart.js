// Chart.js ini digunakan untuk menangani chart yang ada pada dashboard Admin
// View yang di tampilkan pada chart.js ini diantaranya :
// Top University By Employee (Table), Turn Over Employee (Pie Chart), Top 10 University By Employee (Bar Chart)

$(document).ready(function () {
    
    $("#loader").show();

    // Berikut adalah sebuah ajax yang digunakan dalam mendapatkan Educations untuk menampilkan data TOP University
    // Dan berisi pemanggilan fungsi untuk menampilkan data dalam bentuk table, dan chart setelah data education didapatkan
    $.ajax({
        url: "https://localhost:7177/api/Educations",
        type: "GET",
        datatype: "json",
        contentType: "application/json; charset=utf-8",
        headers: {
            Authorization: "Bearer " + sessionStorage.getItem("Token"),
        },
        success: function (education) {
            var result = education.data;

            // Buat objek untuk menyimpan informasi universitas dan jumlah akun
            var universitiesData = {};

            // Loop data dari API untuk menghitung jumlah akun yang berbeda di setiap universitas
            result.forEach((eduData) => {
                var { universityName, accountId } = eduData;

                // Gunakan nama universitas sebagai kunci
                var key = universityName;

                // Jika kunci belum ada di dalam objek universitiesData, tambahkan entri baru
                if (!(key in universitiesData)) {
                    universitiesData[key] = {
                        totalAccounts: new Set([accountId]),
                    };
                } else {
                    // Jika kunci sudah ada, tambahkan accountId ke set
                    universitiesData[key].totalAccounts.add(accountId);
                }
            });

            // Konversi objek universitiesData menjadi array
            var universitiesArray = Object.keys(universitiesData).map((key) => ({
                universityName: key,
                totalAccounts: universitiesData[key].totalAccounts.size,
            }));

            // Urutkan array berdasarkan total akun secara menurun
            universitiesArray.sort((a, b) => b.totalAccounts - a.totalAccounts);

            // Objek yang telah diurutkan
            var sortedUniversitiesData = {};
            universitiesArray.forEach((item) => {
                sortedUniversitiesData[item.universityName] = {
                    totalAccounts: item.totalAccounts,
                };
            });

            // Kemudian ini adalah pemanggilan function untuk menampilkan table dan chart nya
            // Mengirim data Universitas yang telah di filter berdasarkan seberapa banyak employee yang berada di univ tersebut
            tableUniv(sortedUniversitiesData);
            chartUniv(sortedUniversitiesData);

            // Sembunyikan loader setelah permintaan selesai
            $("#loader").hide();
        },
        error: function (errormessage) {
            alert(errormessage.responseText);

            // Sembunyikan loader jika ada kesalahan dalam permintaan
            $("#loader").hide();
        },
    });


    // Berikut adalah sebuah ajax untuk mendapatkaan data dari API yang digunakan utnuk menampilkan Data Turn Over
    $.ajax({
        url: "https://localhost:7177/api/TurnOver/TurnOverEmployee",
        type: "GET",
        datatype: "json",
        contentType: "application/json; charset=utf-8",
        headers: {
            Authorization: "Bearer " + sessionStorage.getItem("Token"),
        },
        success: function (turnover) {
            var result = turnover.data;

            var resign = 0;
            var blacklist = 0;
            var transfer = 0;

            result.forEach((item) => {
                if (item.status == "Blacklist") {
                    blacklist++;
                } else if (item.status == "Resign") {
                    resign++;
                } else if (item.status == "Transfer") {
                    transfer++;
                }
            });
            var data = [
                { label: "Resign", count: resign },
                { label: "Blacklist", count: blacklist },
                { label: "Transfer", count: transfer },
            ];

            // Pemanggilan function Pie Chart untuk menampilkan data Turn Over dengan Pie Chart
            myPieChart(data);

            // Sembunyikan loader setelah permintaan selesai
            $("#loader").hide();
        },
        error: function (errormessage) {
            alert(errormessage.responseText);

            // Sembunyikan loader jika ada kesalahan dalam permintaan
            $("#loader").hide();
        },
    });

  
});

//Table
// Function ini digunakan untuk menampilkan Top University By Employee dengan DataTable Javascript
// Function menerima Data Universitas yang telah dilakukan proses filter dari pemanggilan data universitas
// Kemudian data tersebut ditampilkan dalam bentuk table
function tableUniv(universitiesData) {

    var table = $("#tableUniv").DataTable({
        paging: true,
        pageLength: 5,
        "ordering": false,
        order: [[2, "desc"]],
        lengthChange: false,
        searching: false,
        // "order": [2, 'desc'], //kalau order nomer urutnya malah acak
        columnDefs: [
            {
                orderable: false,
                targets: 0,
                render: function (data, type, row, meta) {
                    return meta.row + 1 + ".";
                },
            },
        ],
    });


    table.clear().draw();

    var count = 1;
    for (const universityName in universitiesData) {
        var totalAccounts = universitiesData[universityName].totalAccounts;

        // Add data to the DataTable
        table.row.add([count, universityName, totalAccounts]).draw();

        count++;
    }
}


//Chart
// Function ini digunakan untuk membuat Bar Chart dari data yang di terima yaitu data Univeristas yang telah dilakukan proses pada ajax sebelumnya
// Selanjutnya data tersebut diolah lagi didalam function ini untuk ditampilkan dalam bentuk Bar Chart
function chartUniv(universitiesData) {
    (Chart.defaults.global.defaultFontFamily = "Nunito"),
        '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
    Chart.defaults.global.defaultFontColor = "#858796";

    function number_format(number, decimals, dec_point, thousands_sep) {
        // *     example: number_format(1234.56, 2, ',', ' ');
        // *     return: '1 234,56'
        number = (number + "").replace(",", "").replace(" ", "");
        var n = !isFinite(+number) ? 0 : +number,
            prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
            sep = typeof thousands_sep === "undefined" ? "," : thousands_sep,
            dec = typeof dec_point === "undefined" ? "." : dec_point,
            s = "",
            toFixedFix = function (n, prec) {
                var k = Math.pow(10, prec);
                return "" + Math.round(n * k) / k;
            };
        // Fix for IE parseFloat(0.55).toFixed(0) = 0;
        s = (prec ? toFixedFix(n, prec) : "" + Math.round(n)).split(".");
        if (s[0].length > 3) {
            s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
        }
        if ((s[1] || "").length < prec) {
            s[1] = s[1] || "";
            s[1] += new Array(prec - s[1].length + 1).join("0");
        }
        return s.join(dec);
    }
    var univName = [];
    var totalAccounts = [];
    var count = 0;

    // Berikut adalah baris code untuk mendapatkan Nama Univeritas dari universies data kemudian di simpan kedalam univName dan totalAccounts
    // Tujuannya adalah untuk digunakan pada lables tampilan bar chart
    for (const universityName in universitiesData) {
        if (count < 10) {
            univName.push(universityName);
            totalAccounts.push(universitiesData[universityName].totalAccounts);
            count++;
        } else {
            break; // Hentikan iterasi setelah 10 data pertama
        }
    }

    
  // Berikut adalah baris code untuk membuat sebuah bar chart Top 10 University By Employee
  // var UnivName tadi digunakan di dalam sini sebagai lables dari bar chart
  // Kemudian untuk datasetnya menggunakan variable data 'totalAccounts'
    var ctx = document.getElementById("myBarChart").getContext("2d");
    var myBarChart = new Chart(ctx, {
        type: "horizontalBar",
        data: {
            labels: univName,
            datasets: [
                {
                    label: "Alumni",
                    backgroundColor: "#4e73df",
                    hoverBackgroundColor: "#2e59d9",
                    borderColor: "#4e73df",
                    data: totalAccounts,
                },
            ],
        },
        options: {
            maintainAspectRatio: true,
            responsive: true,
            layout: {
                padding: {
                    left: 10,
                    right: 10,
                    bottom: 0,
                    top: 0,
                },
            },
            scales: {
                xAxes: [
                    {
                        ticks: {
                            maxTicksLimit: 5,
                            beginAtZero: true,
                        },
                        gridLines: {
                            display: false,
                            drawBorder: false,
                        },
                    },
                ],
                yAxes: [
                    {
                        ticks: {
                            display: false,
                        },
                        gridLines: {
                            color: "rgb(234, 236, 244)",
                            zeroLineColor: "rgb(234, 236, 244)",
                            drawBorder: true,
                        },
                    },
                ],
            },
            legend: {
                display: false,
            },
            tooltips: {
                enabled: true, // Show tooltips on hover
                mode: "index",
                intersect: false,
                titleMarginBottom: 10,
                titleFontColor: "#6e707e",
                titleFontSize: 14,
                backgroundColor: "rgb(255,255,255)",
                bodyFontColor: "#858796",
                borderColor: "#dddfeb",
                borderWidth: 1,
                xPadding: 15,
                yPadding: 15,
                displayColors: false,
                caretPadding: 10,
                callbacks: {
                    label: function (tooltipItem, chart) {
                        return "Value: " + tooltipItem.xLabel;
                    },
                },
            },
            events: false,
            showTooltips: true,
            animation: {
                duration: 500,
                easing: "easeOutQuart",
                onComplete: function () {
                    var ctx = this.chart.ctx;
                    ctx.font = Chart.helpers.fontString(
                        Chart.defaults.global.defaultFontFamily,
                        "normal",
                        Chart.defaults.global.defaultFontFamily
                    );
                    ctx.textAlign = "left";
                    ctx.textBaseline = "bottom";
                    this.data.datasets.forEach(function (dataset) {
                        for (var i = 0; i < dataset.data.length; i++) {
                            var model =
                                dataset._meta[Object.keys(dataset._meta)[0]].data[i]._model,
                                scale_max =
                                    dataset._meta[Object.keys(dataset._meta)[0]].data[i]._yScale
                                        .maxHeight;
                            left =
                                dataset._meta[Object.keys(dataset._meta)[0]].data[i]._xScale
                                    .left;
                            offset =
                                dataset._meta[Object.keys(dataset._meta)[0]].data[i]._xScale
                                    .longestLabelWidth;
                            ctx.fillStyle = "#fff";
                            var y_pos = model.y - 5;
                            var label = model.label;
                            // Make sure data value does not get overflown and hidden
                            // when the bar's value is too close to max value of scale
                            // Note: The y value is reverse, it counts from top down
                            if ((scale_max - model.y) / scale_max >= 0.93)
                                y_pos = model.y + 20;
                            // ctx.fillText(dataset.data[i], model.x, y_pos);
                            ctx.fillText(label, left + 10, model.y + 8);
                        }
                    });
                },
            },
        },
    });
}


// Function berikut digunakan untuk menampilkan Pie Chart dari data Turn Over
// Data tersebut berisi berapa jum Jumlah employe yang reign, blacklist, dan transfer
// Data didapat dari ajax sebelumnya tempat dimana function ini dipanggil
function myPieChart(data) {
    Chart.defaults.global.defaultFontFamily =
        'Nunito, -apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';
    Chart.defaults.global.defaultFontColor = "#858796";

    // Baris code berikut adalah code yang digunakan untuk menampilkan Piechart
    // labels berisi status turn over Reisgn, Blacklist,dan Transfer bseserta jumlah nya
    // kemudian unuk data di dalam dataset berisi jumlah dari setiap status tersebut
    // Unutk melihat tampilannya ada di dashboard admin
    var ctx = document.getElementById("ChartTurnOver");
    var data = {
        labels: data.map((item) => `${item.label} (${item.count})`),
        datasets: [
            {
                data: data.map((item) => `${item.count}`),
                backgroundColor: ["#e74a3b", "#5a5c69", "#4e73df"],
                hoverBackgroundColor: ["#ff6655", "#6e707e", "#6382eb"],
                hoverBorderColor: "rgba(234, 236, 244, 1)",
            },
        ],
    };

    var options = {
        maintainAspectRatio: false,
        tooltips: {
            callbacks: {
                label: function (tooltipItem, data) {
                    var label = data.labels[tooltipItem.index];
                    var labelText = label.replace("(", ": ").replace(")", "");
                    return labelText;
                },
            },
        },
    };

    var myPieChart = new Chart(ctx, {
        type: "pie", // Change the chart type to 'pie'
        data: data,
        options: options,
    });

  
    function toggleDataset(index) {
        var meta = myPieChart.getDatasetMeta(0);
        meta.data[index].hidden = !meta.data[index].hidden;
        myPieChart.update();
    }

   
    var legendContainer = document.getElementById("legendContainer");
    if (legendContainer) {
        legendContainer.innerHTML = myPieChart.generateLegend();
    }
}