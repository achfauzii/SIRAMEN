$(document).ready(function () {
  //debugger;
  $("#loader").show();

  // Lakukan permintaan AJAX untuk mendapatkan data placement berdasarkan accountId
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
  //hit api turnover
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
          if(item.status=="Blacklist"){
            blacklist++
          }else if(item.status=="Resign"){
            resign++
          }else if (item.status =="Transfer"){
            transfer++
          }
        })
        var data = [resign, blacklist, transfer];
        var labels = [
          { label: "Resign", count: resign },
          { label: "Transfers", count: transfer },
          { label: "Blacklist", count: blacklist },
        ];
        
        myPieChart(data, labels)

      // Sembunyikan loader setelah permintaan selesai
      $("#loader").hide();
    },
    error: function (errormessage) {
      alert(errormessage.responseText);

      // Sembunyikan loader jika ada kesalahan dalam permintaan
      $("#loader").hide();
    },
  });

  var idleCount = 0;
  var onsiteCount = 0;
  // Lakukan permintaan AJAX untuk mendapatkan data placement berdasarkan accountId

  $.ajax({
    url: "https://localhost:7177/api/Employees",
    type: "GET",
    datatype: "json",
    async: false,
    dataSrc: "data",
    headers: {
      Authorization: "Bearer " + sessionStorage.getItem("Token"),
    },
    success: function (employees) {
      var result = employees.data;
      for (var i = 0; i < result.length; i++) {
        var accountId = result[i].accountId;
        var roleId = result[i].roleId; // Ambil roleId dari data saat ini
        if (roleId === "3") {
          $.ajax({
            url:
              "https://localhost:7177/api/EmployeePlacements/accountId?accountId=" +
              accountId,
            type: "GET",
            datatype: "json",
            async: false, // Set async menjadi false agar tindakan ini menunggu respons dari permintaan AJAX sebelum melanjutkan
            headers: {
              Authorization: "Bearer " + sessionStorage.getItem("Token"),
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
            },
            error: function () {},
            complete: function () {
              // Sembunyikan loader setelah permintaan selesai
              $("#loader").hide();
            },
          });
        }
      }
      // Setelah selesai menghitung, Anda dapat menggunakan nilai idleCount dan onsiteCount
      document.getElementById("countIdle").textContent = idleCount;
      document.getElementById("countOnsite").textContent = onsiteCount;

      // Sembunyikan loader setelah semua permintaan selesai
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
function tableUniv(universitiesData) {
  var table = $("#tableUniv").DataTable({
    paging: true,
    pageLength: 5,
    order: [[2, "desc"]],
    lengthChange: false,
    searching: false,
    // "order": [2, 'desc'], //kalau order nomer urutnya malah acak
    columnDefs: [
      {
        orderable: false,
        targets: 0,
        render: function (data, type, row, meta) {
          return meta.row + meta.settings._iDisplayStart + 1 + ".";
        },
      },
    ],
    drawCallback: function (settings) {
      var api = this.api();
      var rows = api.rows({ page: "current" }).nodes();
      api
        .column(1, { page: "current" })
        .data()
        .each(function (group, i) {
          $(rows)
            .eq(i)
            .find("td:first")
            .html(i + 1);
        });
    },
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
function chartUniv(universitiesData) {
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
    toFixedFix = function(n, prec) {
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
  var univName = [];
  var totalAccounts = [];
  var count = 0;

  for (const universityName in universitiesData) {
    if (count < 10) {
      univName.push(universityName);
      totalAccounts.push(universitiesData[universityName].totalAccounts);
      count++;
    } else {
      break; // Hentikan iterasi setelah 10 data pertama
    }
  }

// Bar Chart Example
var univName = [];
var totalAccounts = [];
var count = 0;

for (const universityName in universitiesData) {
  if (count < 10) {
    univName.push(universityName);
    totalAccounts.push(universitiesData[universityName].totalAccounts);
    count++;
  } else {
    break; // Stop iteration after the first 10 data
  }
}

// Bar Chart Example
var univName = [];
var totalAccounts = [];
var count = 0;

for (const universityName in universitiesData) {
  if (count < 10) {
    univName.push(universityName);
    totalAccounts.push(universitiesData[universityName].totalAccounts);
    count++;
  } else {
    break; // Stop iteration after the first 10 data
  }
}

// Bar Chart Example
var univName = [];
var totalAccounts = [];
var count = 0;

for (const universityName in universitiesData) {
  if (count < 10) {
    univName.push(universityName);
    totalAccounts.push(universitiesData[universityName].totalAccounts);
    count++;
  } else {
    break; // Stop iteration after the first 10 data
  }
}

// Calculate height based on the number of bars


// Bar Chart Example
var ctx = document.getElementById("myBarChart").getContext("2d");
var myBarChart = new Chart(ctx, {
  type: 'horizontalBar',
  data: {
    labels: univName,
    datasets: [{
      label: "Alumni",
      backgroundColor: "#4e73df",
      hoverBackgroundColor: "#2e59d9",
      borderColor: "#4e73df",
      data: totalAccounts,
    }],
  },
  options: {
    maintainAspectRatio: true,
    responsive: true,
    layout: {
      padding: {
        left: 10,
        right: 10,
        bottom: 10,
        top: 10
      }
    },
    scales: {
      xAxes: [{
        ticks: {
          maxTicksLimit: 5
        },
        gridLines: {
          display: false,
          drawBorder: false
        },
        barThickness: 30, // Fixed size for bars
      }],
      yAxes: [{
        gridLines: {
          color: "rgb(234, 236, 244)",
          zeroLineColor: "rgb(234, 236, 244)",
          drawBorder: false,
          borderDash: [2],
          zeroLineBorderDash: [2],
        },
        barThickness: 30, // Fixed size for bars
      }],
    },
    legend: {
      display: false
    },
    tooltips: {
      enabled: true, // Show tooltips on hover
      mode: 'index',
      intersect: false,
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
        label: function(tooltipItem, chart) {
          return "Value: " + tooltipItem.xLabel;
        }
      }
    },
  }
});
}

function myPieChart(data, labels) {
  Chart.defaults.global.defaultFontFamily = 'Nunito, -apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';
  Chart.defaults.global.defaultFontColor = '#858796';

  // Pie Chart Example
  var ctx = document.getElementById("ChartTurnOver");
  var data = {
    labels: labels.map(item => `${item.label} (${item.count})`),
    datasets: [{
      data: data,
      backgroundColor: ['#e74a3b', '#4e73df', '#5a5c69',],
      hoverBackgroundColor: ['#ff6655',  '#6382eb', '#6e707e',],
      hoverBorderColor: "rgba(234, 236, 244, 1)",
    }],
  };

  var options = {
    maintainAspectRatio: false,
    tooltips: {
      callbacks: {
        label: function (tooltipItem, data) {
          var label = data.labels[tooltipItem.index];
          var labelText = label.replace('(', ': ').replace(')', '');
          return labelText;
        },
      },
    }
  };

  var myPieChart = new Chart(ctx, {
    type: 'pie', // Change the chart type to 'pie'
    data: data,
    options: options
  });

  // Add a function to toggle dataset visibility
  function toggleDataset(index) {
    var meta = myPieChart.getDatasetMeta(0);
    meta.data[index].hidden = !meta.data[index].hidden;
    myPieChart.update();
  }

  // Append legend to a container
  var legendContainer = document.getElementById("legendContainer");
  if (legendContainer) {
    legendContainer.innerHTML = myPieChart.generateLegend();
  }
}