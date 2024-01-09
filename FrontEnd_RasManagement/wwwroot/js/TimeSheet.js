﻿//var table = null;
var month;
var accountId;
var table;
var tablePDF;
$(document).ready(function () {
  var urlParams = new URLSearchParams(window.location.search);
  accountId = urlParams.get("accountId");

  const button = document.getElementById("download-button");

  function generatePDF() {
    // Choose the element that your content will be rendered to.
    const element = document.getElementById("timeSheetPdf");

    var opt = {
      filename: "TimeSheet " + $(".fullName")[0].innerHTML + ".pdf",
      image: { type: "jpeg", quality: 1 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "A4", orientation: "portrait" },
    };

    // Choose the element and save the PDF for your user.
    html2pdf().set(opt).from(element).save();
  }

  button.addEventListener("click", generatePDF);

  //Employee Info
  getEmployee(accountId)
    .then(function (employee) {
      $(".fullName").text(employee.fullname);
      // $("#fullNamePreview").text(employee.fullname);
      // $("#fullnamePdf").text(employee.fullname);
    })
    .catch(function (error) {
      alert(error);
    });
  //Placment Comp Name
  getPlacement(accountId)
    .then(function (employee) {
      $("#compName").text(employee.companyName);
    })
    .catch(function (error) {
      alert(error);
    });

  $("#backButton").on("click", function () {
    history.back(); // Go back to the previous page
  });

  /*  $('#download-button').on('click', function () {
        // Memuat konten header dari file header.html
        $.get('TimeSheetToPdf', function (headerContent) {
            // Menggabungkan konten header dengan konten DataTables
            var finalContent = headerContent + $('#timeSheetTable').html();

            // Membuat PDF menggunakan HTML2PDF
            html2pdf().from(finalContent).save();
        });
    });*/
});

function submitMonth() {
  var urlParams = new URLSearchParams(window.location.search);
  accountId = urlParams.get("accountId");
  month = $("#month").val();

  if (month !== "") {
    //GET datatable
    document.getElementById("badgeDisplay").hidden = true;
    document.getElementById("tableTimeSheet").hidden = false;
    if ($.fn.DataTable.isDataTable("#timeSheetTable")) {
      $("#timeSheetTable").DataTable().destroy();
    }

    if ($.fn.DataTable.isDataTable("#timeSheetTablePdf")) {
      $("#timeSheetTablePdf").DataTable().destroy();
    }

    table = $("#timeSheetTable").DataTable({
      responsive: true,
      /*dom: 'Bfrtip',*/
      /*buttons: [
                {
                    extend: 'pdfHtml5',
                    text: 'Export PDF',
                    title: '',
                    filename: 'TimeSheet_Report',
                    download: 'open',
                    customize: function (doc) {
                        // Tambahkan konten khusus ke header
                        doc['header'] = function () {
                            return {
                                columns: [
                                    {
                                        alignment: 'left',
                                        text: ''
                                        // Tambahkan konten khusus header Anda di sini
                                    }
                                ],
                                margin: [10, 10] // Atur margin jika diperlukan
                            };
                        };
                        // Tambahkan konten khusus ke footer jika perlu
                        doc['footer'] = function () {
                            return {
                                columns: [
                                    {
                                        alignment: 'center',
                                        text: 'Footer Kustom di Sini'
                                        // Tambahkan konten khusus footer Anda di sini
                                    }
                                ],
                                margin: [10, 10] // Atur margin jika diperlukan
                            };
                        };
                    }
                }
            ],
           */
      ajax: {
        url:
          "https://localhost:7177/api/TimeSheet/TimeSheetByAccountIdAndMonth?accountId=" +
          accountId +
          "&month=" +
          month,
        type: "GET",
        contentType: "application/json",
        headers: {
          Authorization: "Bearer " + sessionStorage.getItem("Token"),
        },
      },
      columns: [
        {
          data: null,
          render: function (data, type, row, meta) {
            return meta.row + meta.settings._iDisplayStart + 1 + ".";
          },
        },
        {
          data: "date",
          render: function (data, type, row) {
            if (type === "display" || type === "filter") {
              // Format tanggal dalam format yang diinginkan
              return moment(data).format("DD MMMM YYYY");
            }
            // Untuk tipe data lain, kembalikan data aslinya

            return data;
          },
        },
        { data: "activity" },
        { data: "flag" },
        { data: "category" },
        { data: "status" },
        { data: "knownBy" },
      ],
    });

    fetch(
      "https://localhost:7177/api/TimeSheet/TimeSheetByAccountIdAndMonth?accountId=" +
        accountId +
        "&month=" +
        month
    )
      .then((response) => response.json())
      .then((data) => {
        // Manipulasi tabel dengan data yang didapat dari API
        const tableBody = document
          .getElementById("timeSheetTablePdf")
          .getElementsByTagName("tbody")[0];

        data.data.forEach((item) => {
          const row = tableBody.insertRow(-1);
          row.insertCell(0).textContent = item.id;
          row.insertCell(1).textContent = moment(data).format("DD MMMM YYYY");
          row.insertCell(2).textContent = item.activity;
          row.insertCell(3).textContent = item.flag;
          row.insertCell(4).textContent = item.category;
          row.insertCell(5).textContent = item.status;
          row.insertCell(6).textContent = item.knownBy;
        });
      });

    //document.getElementById('badgeDisplay').hidden = true;
  } else {
    document.getElementById("badgeDisplay").hidden = false;
    document.getElementById("tableTimeSheet").hidden = true;
  }

  openPreviewPdf(table.rows().data().toArray());
  document.getElementById("previewPDF").addEventListener("click", function () {
    window.location.href = "/TimeSheets/Timesheettopdf";

    console.log(accountId);
  });
}

function clearScreen() {
  $("#activity").val("");
  document.getElementById("flag").selectedIndex = 0;
  document.getElementById("category").selectedIndex = 0;
  document.getElementById("status").selectedIndex = 0;
  $("#knownBy").val("");

  $("#Update").hide();
  $("#Save").show();
}

function parseJwt(token) {
  var base64Url = token.split(".")[1];
  var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  var jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );

  return JSON.parse(jsonPayload);
}

function getEmployee(accountId) {
  return new Promise(function (resolve, reject) {
    $.ajax({
      url:
        "https://localhost:7177/api/Employees/accountId?accountId=" + accountId,
      type: "GET",
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      headers: {
        Authorization: "Bearer " + sessionStorage.getItem("Token"),
      },
      success: function (result) {
        var obj = result.data.result;
        resolve(obj);
      },
      error: function (errormessage) {
        alert(errormessage.responseText);
      },
    });
  });
}

function getPlacement(accountId) {
  return new Promise(function (resolve, reject) {
    //Get CompanyName (Placement)
    $.ajax({
      url:
        "https://localhost:7177/api/EmployeePlacements/accountId?accountId=" +
        accountId,
      type: "GET",
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      headers: {
        Authorization: "Bearer " + sessionStorage.getItem("Token"),
      },
      success: function (result) {
        var obj = result.data;
        var obj = result.data;
        if (obj && obj.length > 0) {
          var lastData = obj[0];

          resolve(lastData);
        } else {
          console.log("Tidak ada data");
        }
      },
      error: function (errormessage) {
        alert(errormessage.responseText);
      },
    });
  });
}

function openPreviewPdf(dataTS) {
  var dataTimeSheet = table.rows().data().toArray();
  console.log(dataTimeSheet);
  console.log(dataTS);
  // tablePdf.rows.add(dataTimeSheet).draw();
  $("#timeSheetMonth").text(moment(month).format("MMMM YYYY"));

  var urlParams = new URLSearchParams(window.location.search);
  accountId = urlParams.get("accountId");
  var pdfURL = "/TimeSheets/Timesheettopdf?accountId=" + accountId; // Ganti dengan URL PDF Anda
  var urlParams = new URLSearchParams(window.location.search);
  // debugger;
  accountId = urlParams.get("accountId");
  getEmployee(accountId)
    .then(function (employeeData) {
      // Mendapatkan elemen berdasarkan ID dan mengisikan data Employee ke dalamnya
      // var fullNameElement = document.getElementById("fullNamePreview");
      // fullNameElement.textContent = employeeData.fullName; // Mengisikan nama lengkap ke elemen
      // Membuka PDF dalam tab baru saat tombol diklik
      // window.open(pdfURL, "_blank");
    })
    .catch(function (error) {
      console.error("Error:", error);
    });
}
