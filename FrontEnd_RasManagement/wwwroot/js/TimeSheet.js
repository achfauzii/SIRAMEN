//var table = null;
$(document).ready(function () {
  var urlParams = new URLSearchParams(window.location.search);
  accountId = urlParams.get("accountId");

  //Employee Info
  getEmployee(accountId)
    .then(function (employee) {
      $(".fullName").text(employee.fullname);
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

  $("#download-button").on("click", function () {
    // Memuat konten header dari file header.html
    $.get("TimeSheetToPdf", function (headerContent) {
      // Menggabungkan konten header dengan konten DataTables
      var finalContent = headerContent + $("#timeSheetTable").html();

      // Membuat PDF menggunakan HTML2PDF
      html2pdf().from(finalContent).save();
    });
  });

  $(".timeSheetMonth").on("change", function () {
    var month = $(".timeSheetMonth").val();
    $("#timeSheetMonth").text(month);

    if (month !== "") {
      //GET datatable
      document.getElementById("badgeDisplay").hidden = true;
      document.getElementById("tableTimeSheet").hidden = false;
      if ($.fn.DataTable.isDataTable("#timeSheetTable")) {
        $("#timeSheetTable").DataTable().destroy();
      }
      $("#timeSheetTable").DataTable({
        responsive: true,
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

      //document.getElementById('badgeDisplay').hidden = true;
    } else {
      document.getElementById("badgeDisplay").hidden = false;
      document.getElementById("tableTimeSheet").hidden = true;
    }

    $("#ttd").hide();

    $("#previewPDF").on("click", function () {
      var dataTable = $("#timeSheetTable").DataTable().rows().data().toArray();
      openPreviewPdf(dataTable);
    });
  });
});

function submitMonth() {
  var urlParams = new URLSearchParams(window.location.search);
  accountId = urlParams.get("accountId");
  var month = $("#month").val();

  if (month !== "") {
    //GET datatable
    document.getElementById("badgeDisplay").hidden = true;
    document.getElementById("tableTimeSheet").hidden = false;
    if ($.fn.DataTable.isDataTable(".timeSheetTable")) {
      $(".timeSheetTable").DataTable().destroy();
    }
    $(".timeSheetTable").DataTable({
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

    //document.getElementById('badgeDisplay').hidden = true;
  } else {
    document.getElementById("badgeDisplay").hidden = false;
    document.getElementById("tableTimeSheet").hidden = true;
  }

  $("#ttd").hide();

  $("#previewPDF").on("click", function () {
    // const element = document.getElementById("timeSheetPdf");
    // $("#ttd").show();
    // html2pdf().from(element).save();
    openPreviewPdf(table.rows().data().toArray());
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

function openPreviewPdf(dataTable) {
  let tablePDF = $("#timeSheetTablePDF").DataTable();
  let data = table.rows().data().toArray();

  //   // Clear the second table (if needed)
  //   tablePDF.clear().draw();

  //   // Add the data to the second table
  tablePDF.rows.add(dataTable).draw();
  tablePDF.rows.add(data).draw();

  //   //   console.log(table.rows().data().toArray());
  console.log(tablePDF.rows().data().toArray());

  // Ubah URL sesuai dengan URL tempat PDF di-host atau disimpan
  var urlParams = new URLSearchParams(window.location.search);
  accountId = urlParams.get("accountId");
  var pdfURL = "/TimeSheets/Timesheettopdf?accountId=" + accountId; // Ganti dengan URL PDF Anda
  var urlParams = new URLSearchParams(window.location.search);
  accountId = urlParams.get("accountId");
  getEmployee(accountId)
    .then(function (employeeData) {
      // Mendapatkan elemen berdasarkan ID dan mengisikan data Employee ke dalamnya
      var fullNameElement = document.getElementById("fullName");
      fullNameElement.textContent = employeeData.fullName; // Mengisikan nama lengkap ke elemen
      //   var fulnameElement = document.getElementById("fullname-emp");
      //   fulnameElement.textContent = employeeData.fullName;
      //   $("#fullname-emp").text(employeeData.fullname);

      // Membuka PDF dalam tab baru saat tombol diklik
      window.open(pdfURL, "_blank");
      tablePDF.row
        .add([
          "1",
          "08/01/2024",
          "Uvuea shhdhdjh hshds osas",
          "WFC",
          "Discussion",
          "Done",
          "Anonymous",
        ])
        .draw();
    })
    .catch(function (error) {
      console.error("Error:", error);
    });
  tablePDF.rows.add(dataTable).draw();
  tablePDF.row
    .add([
      "1",
      "08/01/2024",
      "Uvuea shhdhdjh hshds osas",
      "WFC",
      "Discussion",
      "Done",
      "Anonymous",
    ])
    .draw();
}
