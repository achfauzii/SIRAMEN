//var table = null;
var month;
var accountId;
var table;
var tablePDF;
var comp;
$(document).ready(function () {
  var urlParams = new URLSearchParams(window.location.search);
  accountId = urlParams.get("accountId");
  var currentDate = new Date();
  var month = currentDate.toISOString().slice(0, 7);
  $("#month").val(month);
  submitMonth(month);
  $("#timeSheetPdf").hide();

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
        $(".companyName").text(employee.client.nameOfClient);
        $("#jobRole").text(employee.position.positionClient);
    })
    .catch(function (error) {
      alert(error);
    });

  $("#backButton").on("click", function () {
      window.location.href = "/ManageEmployee/Index"; // Go back to the previous page
  });
});

function submitMonth(month) {

  var urlParams = new URLSearchParams(window.location.search);
  accountId = urlParams.get("accountId");
  $("#timeSheetMonth").text(moment(month).format("MMMM YYYY"));

    if (month !== "") {

        getPlacement(accountId)
            .then(function (employee) {
                comp = employee.client.nameOfClient;
                
                var downloadUrl = "/TimeSheetPdf/GeneratePdfperEmployee?accountId=" + encodeURIComponent(accountId) + "&month=" + encodeURIComponent(month) + "&companyName=" + encodeURIComponent(comp);
                $("#exportPDF").attr("href", downloadUrl);
            })
            .catch(function (error) {
                alert(error);
            });

    //GET datatable
    document.getElementById("badgeDisplay").hidden = true;
    document.getElementById("tableTimeSheet").hidden = false;
    if ($.fn.DataTable.isDataTable("#timeSheetTable")) {
      $("#timeSheetTable").DataTable().destroy();
    }

    if ($.fn.DataTable.isDataTable("#timeSheetTablePdf")) {
      $("#timeSheetTablePdf").DataTable().destroy();
    }

    $.ajax({
      url:
        "https://localhost:7177/api/TimeSheet/TimeSheetByAccountIdAndMonth?accountId=" +
        accountId +
        "&month=" +
        month,
      type: "GET",
      contentType: "application/json;charset=utf-8",
      dataType: "json",
      headers: {
        Authorization: "Bearer " + sessionStorage.getItem("Token"),
      },
      success: function (response) {
        var data = response.data;
        var dataPdf = response.data;
        //addRowHoliday(month);

      
        table = $("#timeSheetTable").DataTable({
          data: data,
          columns: [
            {
              name: "one",
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
            { name: "two", data: "flag" },
            { data: "category" },
            { data: "status" },
            { data: "knownBy" },
          ],
          rowsGroup: ["one:name", "two:name"],
          order: [[0, "asc"]],
          // backgroud warna dengan flag holiday
          createdRow: function (row, data, dataIndex) {
            if (data.flag === "Holiday" || data.flag ==="Weekend") {
              $(row).css("background-color", "#fe6675");
              $(row).css("font-weight", "bold");
              $(row).find(".fa-edit").hide();
            }
          },
        });

        tablePDF = $("#timeSheetTablePdf").DataTable({
          data: dataPdf,
          paging: false,
          lengthMenu: false,
          searching: false,
          info: false,
          pageLength: -1,
          columns: [
            {
              name: "first",
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
            { name: "second", data: "flag" },
            { data: "category" },
            { data: "status" },
            { data: "knownBy" },
          ],
          rowsGroup: ["first:name", "second:name"],
          order: [[0, "asc"]],
          // backgroud warna dengan flag holiday
          createdRow: function (row, data, dataIndex) {
            if (data.flag === "Holiday") {
              $(row).css("background-color", "#fe6675");
              $(row).css("font-weight", "bold");
              $(row).find(".fa-edit").hide();
            }
          },
        });
      },
    });
  } else {
    document.getElementById("badgeDisplay").hidden = false;
    document.getElementById("tableTimeSheet").hidden = true;
  }
}

function addRowHoliday(month) {
  
  //GET data from tbDataHoliday
  $.ajax({
    url: "https://localhost:7177/api/MasterHoliday",
    type: "GET",
    contentType: "application/json",
    headers: {
      Authorization: "Bearer " + sessionStorage.getItem("Token"),
    },
    success: function (result) {
      // Assuming result.data contains the array of holiday objects
      var holidays = result.data;

      // Filter holidays based on the given month
      var filteredHolidays = holidays.filter(function (holiday) {
        // Check if the date of the holiday matches the given month
        return holiday.date.startsWith(month);
      });

        // GET data from TimeSheet API
        $.ajax({
            url:
                "https://localhost:7177/api/TimeSheet/TimeSheetByAccountIdAndMonth?accountId=" +
                accountId +
                "&month=" +
                month,
            type: "GET",
            contentType: "application/json;charset=utf-8",
            dataType: "json",
            headers: {
                Authorization: "Bearer " + sessionStorage.getItem("Token"),
            },
            success: function (timesheetResult) {
                // Assuming timesheetResult.data contains the array of timesheet objects
                var timesheets = timesheetResult.data;

                // Loop through each filtered holiday object
                filteredHolidays.forEach(function (holiday) {
                    // Check if the holiday date is already in timesheets
                    var holidayExistsInTimesheet = timesheets.some(function (timesheet) {
                        return timesheet.date === holiday.date;
                    });

                    // If holiday does not exist in timesheets, add it
                    if (!holidayExistsInTimesheet) {
                        var rowData = {
                            date: holiday.date,
                            activity: holiday.name,
                            flag: "Holiday", // Set flag as 'Holiday' for holidays
                            category: "", // You can set an appropriate category
                            status: "", // You can set an appropriate status
                            knownBy: "", // You can set an appropriate value for knownBy
                        };
                        // Add the holiday data to the timeSheetTable
                        table.row.add(rowData).draw();
                        tablePDF.row.add(rowData).draw();
                    } else {

                    }
                });

                // Get weekends and holidays for the given month and year
                var yearMonth = month.split("-");
                var year = parseInt(yearMonth[0]);
                var monthNum = parseInt(yearMonth[1]);
                var weekendsAndHolidays = getHolidaysAndWeekends(year, monthNum);
             
                // Append weekends to the timeSheetTable
                weekendsAndHolidays.weekends.forEach(function (weekend) {
                   
                    var formattedDateWeekend = weekend.toISOString().slice(0, 19);
               

                    var weekendInTimesheet = timesheets.some(function (timesheet) {
                        var formattedDate1 = timesheet.date.split("T")[0]; // Mengambil bagian tanggal saja
                        var formattedDate2 = formattedDateWeekend.split("T")[0];
                        return formattedDate1 == formattedDate2;
                   
                    });
              
                    if (!weekendInTimesheet) {
                     
                        var rowData = {
                            date: weekend.toISOString().slice(0, 10),
                            activity: "Weekend",
                            flag: "Weekend",
                            category: "",
                            status: "",
                            knownBy: "",
                        };
                        table.row.add(rowData).draw();
                        tablePDF.row.add(rowData).draw();

                    } 
                
                });
            },
            error: function (error) {
                alert(error.responseText);
            },
        });
       
    },
    error: function (errormessage) {
      alert(errormessage.responseText);
    },
  });
}

// Function to get holidays and weekends
function getHolidaysAndWeekends(year, month) {
    const holidays = [];
    const weekends = [];

    // Get holidays
    //$.ajax({
    //    url: "https://localhost:7177/api/MasterHoliday",
    //    type: "GET",
    //    contentType: "application/json",
    //    headers: {
    //        Authorization: "Bearer " + sessionStorage.getItem("Token"),
    //    },
    //    async: false, // Make the AJAX call synchronous
    //    success: function (result) {
    //        const allHolidays = result.data;
    //        allHolidays.forEach(function (holiday) {
    //            if (holiday.date.startsWith(year + "-" + month)) {
    //                holidays.push(new Date(holiday.date));
    //            }
    //        });
    //    },
    //    error: function (errormessage) {
    //        alert(errormessage.responseText);
    //    },
    //});

    // Get weekends
    const startDate = new Date(year, month - 1, 1); // First day of the month
    const endDate = new Date(year, month, 0); // Last day of the month

    for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
        if (date.getDay() === 0 || date.getDay() === 6) {
            weekends.push(new Date(date));
        }
    }

    return {
        holidays: holidays,
        weekends: weekends,
    };
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

function exportPDF() {
  var beforePrint = function () {
    $("#timeSheetPdf").show();
  };

  var afterPrint = function () {
    $("#timeSheetPdf").hide();

    location.reload();
  };

  if (window.matchMedia) {
    var mediaQueryList = window.matchMedia("print");
    mediaQueryList.addListener(function (mql) {
      if (mql.matches) {
        beforePrint();
      } else {
        afterPrint();
      }
    });
  }

  window.onbeforeprint = beforePrint;
  window.onafterprint = afterPrint;

  $("#timeSheetPdf").show();
  var printContents = document.getElementById("timeSheetPdf").innerHTML;
  var originalContents = document.body.innerHTML;

  document.body.innerHTML = printContents;

  window.print();

  if (window.matchMedia) {
    var mediaQueryList = window.matchMedia("print");
    mediaQueryList.addListener(function (mql) {
      if (mql.matches) {
        beforePrint();
      } else {
        afterPrint();
      }
    });
  }

  window.onbeforeprint = beforePrint;
  window.onafterprint = afterPrint;

  $("#timeSheetPdf").show();
  var printContents = document.getElementById("timeSheetPdf").innerHTML;
  var originalContents = document.body.innerHTML;

  document.body.innerHTML = printContents;

  window.print();

  document.body.innerHTML = originalContents;
}