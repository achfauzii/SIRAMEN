//var table = null;
var month;
var accountId;
var table;
var tablePDF;
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
            // $("#fullNamePreview").text(employee.fullname);
            // $("#fullnamePdf").text(employee.fullname);
        })
        .catch(function (error) {
            alert(error);
        });
    //Placment Comp Name
    getPlacement(accountId)
        .then(function (employee) {
            //console.log(employee.client.nameOfClient);
            $("#companyName").text(employee.client.nameOfClient);
        })
        .catch(function (error) {
            alert(error);
        });

    $("#backButton").on("click", function () {
        history.back(); // Go back to the previous page
    });
});

function submitMonth(month) {
    // $("#month").val()
    var urlParams = new URLSearchParams(window.location.search);
    accountId = urlParams.get("accountId");
    $("#timeSheetMonth").text(moment(month).format("MMMM YYYY"));

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
            scrollX: true,
            order: [1, "asc"],
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
            drawCallback: function (settings) {
                var api = this.api();
                var rows = api.rows({ page: "current" }).nodes();
                var currentPage = api.page.info().page; // Mendapatkan nomor halaman saat ini
                var startNumber = currentPage * api.page.info().length + 1; // Menghitung nomor awal baris pada halaman saat ini

                api
                    .column(0, { page: "current" })
                    .nodes()
                    .each(function (cell, i) {
                        cell.innerHTML = startNumber + i; // Mengupdate nomor baris pada setiap halaman
                    });
            },
            // backgroud warna dengan flag holiday 
            createdRow: function (row, data, dataIndex) {
                if (data.flag === 'Holiday') {
                    $(row).css('background-color', '#E4DEBE');
                    $(row).find('.fa-edit').hide();
                }
            }
        });

        // Memanggil addRowHoliday(month); jika data timesheet ada, jika kosong hide
        $.ajax({
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
            success: function (result) {
                if (result.message !== "Data not found") {
                    addRowHoliday(month);
                }
            },
            error: function (errormessage) {
                alert(errormessage.responseText);
            },
        });

        var tableBody = document
            .getElementById("timeSheetTablePdf")
            .getElementsByTagName("tbody")[0];
        tableBody.innerHTML = "";

        fetch(
            "https://localhost:7177/api/TimeSheet/TimeSheetByAccountIdAndMonth?accountId=" +
            accountId +
            "&month=" +
            month,
            {
                headers: {
                    Authorization: "Bearer " + sessionStorage.getItem("Token"),
                },
            }
        )
            .then((response) => response.json())
            .then((result) => {

                if (result.message == "Data not found") {
                    return;
                }
                // Manipulasi tabel dengan data yang didapat dari API
                const tableBody = document
                    .getElementById("timeSheetTablePdf")
                    .getElementsByTagName("tbody")[0];

                result.data.sort(function (a, b) {
                    return new Date(a.date) - new Date(b.date);
                });

                var number = 1;
                result.data.forEach((item) => {
                    const row = tableBody.insertRow(-1);
                    row.insertCell(0).textContent = number++;
                    row.insertCell(1).textContent = moment(item.date).format(
                        "DD MMMM YYYY"
                    );
                    row.insertCell(2).textContent = item.activity;
                    row.insertCell(3).textContent = item.flag;
                    row.insertCell(4).textContent = item.category;
                    row.insertCell(5).textContent = item.status;
                    row.insertCell(6).textContent = item.knownBy;
                });

                var placementId = result.data[0].placementStatusId;

                fetch(
                    "https://localhost:7177/api/EmployeePlacements/PlacementID?placementStatusId=" +
                    placementId,
                    {
                        headers: {
                            Authorization: "Bearer " + sessionStorage.getItem("Token"),
                        },
                    }
                )
                    .then((r) => r.json())
                    .then((res) => {
                        var res1;
                        console.log(res.data);
                        $(".companyName").text(res.data.client.nameOfClient);
                        $("#picName").text(res.data.picName);
                    });
            });

        //document.getElementById('badgeDisplay').hidden = true;
    } else {
        document.getElementById("badgeDisplay").hidden = false;
        document.getElementById("tableTimeSheet").hidden = true;
    }

    // openPreviewPdf(table.rows().data().toArray());
    // document.getElementById("previewPDF").addEventListener("click", function () {
    //   window.location.href = "/TimeSheets/Timesheettopdf";

    //   console.log(accountId);
    // });
}

function addRowHoliday(month) {
    console.log(month);
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

            // Loop through each filtered holiday object
            filteredHolidays.forEach(function (holiday) {
                // Append the holiday data to the timeSheetTable
                var rowData = {
                    date: holiday.date,
                    activity: holiday.name,
                    flag: 'Holiday', // Set flag as 'Holiday' for holidays
                    category: '', // You can set an appropriate category
                    status: '', // You can set an appropriate status
                    knownBy: '', // You can set an appropriate value for knownBy
                };
                // Add the holiday data to the timeSheetTable
                table.row.add(rowData).draw();
            });
        },
        error: function (errormessage) {
            alert(errormessage.responseText);
        },
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

    document.body.innerHTML = originalContents;
}