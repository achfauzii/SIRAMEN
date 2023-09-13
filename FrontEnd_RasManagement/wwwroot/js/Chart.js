$(document).ready(function () {
    //debugger;
    $('#loader').show();
    // Lakukan permintaan AJAX untuk mendapatkan data placement berdasarkan accountId
    $.ajax({
        url: "https://localhost:7177/api/Educations",
        type: "GET",
        datatype: "json",
        contentType: "application/json; charset=utf-8",
        headers: {
            "Authorization": "Bearer " + sessionStorage.getItem("Token")
        },


        success: function (education) {
            var result = education.data;

            // Buat objek untuk menyimpan informasi universitas dan jumlah akun
            var universitiesData = {};
            // Loop data dari API untuk menghitung jumlah akun di setiap universitas
            result.forEach(eduData => {
                var { universityName } = eduData;

                // Jika universitas sudah ada di dalam objek universitiesData, tambahkan akun baru ke universitas tersebut
                if (universityName in universitiesData) {
                    universitiesData[universityName].totalAccounts += 1;
                } else {
                    // Jika universitas belum ada di dalam objek universitiesData, buat entri baru
                    universitiesData[universityName] = {
                        totalAccounts: 1
                    };
                }

            });
            tableUniv(universitiesData);
            chartUniv(universitiesData);

        }, error: function (errormessage) {
            alert(errormessage.responseText);

        }

    });

    var idleCount = 0;
    var onsiteCount = 0;
    // Lakukan permintaan AJAX untuk mendapatkan data placement berdasarkan accountId
    $.ajax({
        url: "https://localhost:7177/api/Employees",
        type: "GET",
        "datatype": "json",
        async: false,
        "dataSrc": "data",
        headers: {
            "Authorization": "Bearer " + sessionStorage.getItem("Token")
        },
        success: function (employees) {
            var result = employees.data;
            for (var i = 0; i < result.length; i++) {
                var accountId = result[i].accountId;
                var roleId = result[i].roleId; // Ambil roleId dari data saat ini
                if (roleId === "3") {
                    $.ajax({
                        url: "https://localhost:7177/api/EmployeePlacements/accountId?accountId=" + accountId,
                        type: "GET",
                        datatype: "json",
                        async: false, // Set async menjadi false agar tindakan ini menunggu respons dari permintaan AJAX sebelum melanjutkan
                        headers: {
                            "Authorization": "Bearer " + sessionStorage.getItem("Token")
                        },
                        success: function (placementData) {
                            if (placementData.data && placementData.data.length > 0) {
                                var placementStatus = placementData.data[0].placementStatus; // Ambil data yang pertama dari array data
                                if (placementStatus == "Idle") {
                                    idleCount++;
                                } else if (placementStatus == "Onsite") {
                                    onsiteCount++;
                                }
                            } else {
                                idleCount++;
                            }
                        }, error: function () {

                        }
                    });


                }
               
            }
            // Setelah selesai menghitung, Anda dapat menggunakan nilai idleCount dan onsiteCount
            document.getElementById("countIdle").textContent = idleCount;
            document.getElementById("countOnsite").textContent = onsiteCount;

        }, error: function (errormessage) {
            alert(errormessage.responseText);

        }

    });
    $('#loader').hide();
   

})



//Table
function tableUniv(universitiesData) {
    // Cetak hasil jumlah akun di setiap universitas
    var tbody = document.getElementById('tableUniv');
    // Loop melalui data universitas dan jumlah akun untuk membuat baris baru pada tabel
    var count = 1;
    for (const universityName in universitiesData) {
        var totalAccounts = universitiesData[universityName].totalAccounts;

        // Buat elemen baris (tr) dan kolom (td) baru untuk setiap entri universitas
        var row = document.createElement("tr");
        row.innerHTML = `
                    <td>${count}</td>
                    <td>${universityName}</td>
                    <td>${totalAccounts}</td>
                `;

        // Tambahkan baris ke elemen tbody tabel
        tbody.appendChild(row);
        count++;
    }
}


//Chart
function chartUniv(universitiesData) {
    // Set new default font family and font color to mimic Bootstrap's default styling
    Chart.defaults.global.defaultFontFamily = 'Nunito', '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
    Chart.defaults.global.defaultFontColor = '#858796';


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

    //array univName
    var univName = [];
    var totalAccounts = [];
    for (const universityName in universitiesData) {
        univName.push(universityName);
        totalAccounts.push(universitiesData[universityName].totalAccounts);
    }

    //var universityName =
    // Bar Chart Example

    var ctx = document.getElementById("myBarChart");
    var myBarChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: univName,
            datasets: [{
                label: "Employee",
                backgroundColor: "#4e73df",
                hoverBackgroundColor: "#2e59d9",
                borderColor: "#4e73df",
                data: totalAccounts,
            }],
        },
        options: {
            maintainAspectRatio: false,
            layout: {
                padding: {
                    left: 10,
                    right: 25,
                    top: 25,
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
                        maxTicksLimit: univName.length
                    },
                    maxBarThickness: 25,
                }],
                yAxes: [{
                    ticks: {
                        min: 0,
                        max: 10,
                        maxTicksLimit: 10,
                        padding: 10,
                        // Include a dollar sign in the ticks
                        callback: function (value, index, values) {
                            return number_format(value);
                        }
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
                titleMarginBottom: 10,
                titleFontColor: '#6e707e',
                titleFontSize: 14,
                backgroundColor: "rgb(255,255,255)",
                bodyFontColor: "#858796",
                borderColor: '#dddfeb',
                borderWidth: 1,
                xPadding: 15,
                yPadding: 15,
                displayColors: false,
                caretPadding: 10,
                callbacks: {
                    label: function (tooltipItem, chart) {
                        var datasetLabel = chart.datasets[tooltipItem.datasetIndex].label || '';
                        return datasetLabel + ': ' + number_format(tooltipItem.yLabel);
                    }
                }
            },
        }
    });

}
