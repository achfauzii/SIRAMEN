var table = null;
var initialHoliday = {};
$(document).ready(function () {
    $('input[required]').each(function () {
        $(this).prev('label').append('<span style="color: red;">*</span>');
    });
    //debugger;
    var today = new Date();
    var dayOfWeek = today.getDay();

    // Cek jika hari ini adalah Sabtu (6) atau Minggu (0)
    if (dayOfWeek === 6 || dayOfWeek === 0) {

        var month = ("0" + (today.getMonth() + 1)).slice(-2); // Tambahkan "0" di depan jika bulan < 10
        var day = ("0" + today.getDate()).slice(-2); // Tambahkan "0" di depan jika hari < 10
        var formattedDate = today.getFullYear() + "-" + month + "-" + day;

        var weekendData = {
            name: "Weekend",
            date: formattedDate,
            description: "Weekend Activity",
        };

        //console.log(weekendData);
        //debugger;
        // Lakukan GET request untuk memeriksa apakah data sudah ada sebelumnya
        $.ajax({
            url: "https://localhost:7177/api/MasterHoliday",
            type: "GET",
            dataType: "json",
            headers: {
                Authorization: "Bearer " + sessionStorage.getItem("Token"),
            },
            success: function (response) {
                // Cek apakah data sudah ada
                var isDataExist = false;
                response.data.forEach(function (item) {
                    // Format tanggal dari data response menjadi "YYYY-MM-DD"
                    var dateObj = new Date(item.date);
                    var year = dateObj.getFullYear();
                    var month = ("0" + (dateObj.getMonth() + 1)).slice(-2); // Tambahkan "0" di depan jika bulan < 10
                    var day = ("0" + dateObj.getDate()).slice(-2); // Tambahkan "0" di depan jika hari < 10
                    var formattedResponseDate = year + "-" + month + "-" + day;

                    // Bandingkan tanggal yang diformat dengan formattedDate
                    if (formattedResponseDate === formattedDate) {
                        isDataExist = true;
                        return false; // Keluar dari loop jika data sudah ditemukan
                    }
                });

                // Jika data belum ada, lakukan POST
                if (!isDataExist) {
                    // Menambahkan data ke tabel tbDataHoliday
                    $.ajax({
                        url: "https://localhost:7177/api/MasterHoliday",
                        type: "POST",
                        contentType: "application/json",
                        data: JSON.stringify(weekendData),
                        headers: {
                            Authorization: "Bearer " + sessionStorage.getItem("Token"),
                        },
                        success: function (response) {
                            // Reload tabel setelah menambahkan data
                            table.ajax.reload();
                        },
                        error: function (err) {
                            console.error("Error adding weekend data:", err);
                        },
                    });
                }
            },

            error: function (err) {
                console.error("Error checking existing data:", err);
            },
        });
    }

    table = $("#tbDataHoliday").DataTable({
        responsive: true,

        ajax: {
            url: "https://localhost:7177/api/MasterHoliday",
            type: "GET",
            datatype: "json",
            dataSrc: "data",
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
            { data: "name" },
            {
                data: "date",
                render: function (data) {
                    var dateObj = new Date(data);
                    var day = dateObj.getDate();
                    var month = dateObj.getMonth() + 1;
                    var year = dateObj.getFullYear();
                    var formatDate = (day < 10 ? '0' : '') + day + '/' + (month < 10 ? '0' : '') + month + '/' + year;
                    return formatDate;
                }

            },
            { data: "description" },
            {
                // Menambahkan kolom "Action" berisi tombol "Edit" dan "Delete" dengan Bootstrap
                data: null,
                render: function (data, type, row) {
                    var modalId = "modal-edit-" + data.holiday_Id;
                    var deleteId = "modal-delete-" + data.holiday_Id;

                    return (
                        '<a class="text-warning ' +
                        '" data-placement="left" style="font-size: 14pt"data-toggle="modal" data-animation="false" title="Edit" onclick="return GetById(' +
                        row.holiday_Id +
                        ')"><i class="fa fa-edit edit-client"></i></a>' +
                        "&nbsp;" +
                        '<a class="text-danger ' +
                        '" data-placement="right" style="font-size: 14pt"data-toggle="modal" data-animation="false" title="Delete" onclick="return DeleteHoliday(\'' +
                        row.holiday_Id +
                        "', '" +
                        row.name +
                        "'" +
                        ')"><i class="fa fa-trash delete-client"></i></a>'
                    );
                },
            },
        ],

        order: [[2, "desc"]],
        columnDefs: [
            {
                targets: [0, 1, 3],
                orderable: false,
            },
        ],
        drawCallback: function (settings) {
            var api = this.api();
            var rows = api.rows({ page: "current" }).nodes();
            var currentPage = api.page.info().page;
            var startNumber = currentPage * api.page.info().length + 1;

            api
                .column(0, { page: "current" })
                .nodes()
                .each(function (cell, i) {
                    cell.innerHTML = startNumber + i;
                });
        },
        /*initComplete: function (settings, json) {
            console.log("Data yang diterima:", json);
        },*/
    });
});

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

function noHTML(input) {
    var value = input.value.replace(/<[^>]*>/g, "");
    var nohtml = value.replace(/[<>?/]/g, "");
    input.value = nohtml;
}

function handleInput(event, input) {
    // Menangani peristiwa oninput dan onpaste
    noHTML(input);
}

function Save() {
    var isValid = true;

    $("input[required]").each(function () {
        var input = $(this);
        if (!input.val()) {
            input.next(".error-message").show();
            isValid = false;
        } else {
            input.next(".error-message").hide();
        }
    });

    if (!isValid) {
        return;
    }

    var Holiday = new Object(); //object baru
    Holiday.name = $("#HolidayName").val();
    Holiday.date = $("#HolidayDate").val();
    Holiday.description = $("#Description").val();

    $.ajax({
        type: "POST",
        url: "https://localhost:7177/api/MasterHoliday",
        data: JSON.stringify(Holiday),
        contentType: "application/json; charset=utf-8",
        headers: {
            Authorization: "Bearer " + sessionStorage.getItem("Token"),
        },
    }).then((result) => {
        if (result.status == 200) {
            Swal.fire({
                icon: "success",
                title: "Success...",
                text: "Data has been added!",
                showConfirmButtom: false,
                timer: 2500,
            });
            const logMessage = `Add holiday ${Holiday.name} date ${Holiday.date}`
            SaveLogUpdate(logMessage);
            $("#Modal").modal("hide");
            $("#tbDataHoliday").DataTable().ajax.reload();
        } else {
            Swal.fire({
                icon: "warning",
                title: "Data failed to added!",
                showConfirmButtom: false,
                timer: 1500,
            });
            $("#Modal").modal("hide");
            $("#tbDataHoliday").DataTable().ajax.reload();
        }
    });
}

function ClearScreen() {
    $("#Holiday_Id").val("");
    $("#HolidayName").val("");
    $("#HolidayDate").val("");
    $("#Description").val("");
    $("#Update").hide();
    $("#Save").show();
    $("input[required]").each(function () {
        var input = $(this);
        input.next(".error-message").hide();
    });
    $("textarea[required]").each(function () {
        var input = $(this);
        input.next(".error-message").hide();
    });
}

function GetById(holiday_Id) {
    debugger;

    ClearScreen();
    $.ajax({
        url: "https://localhost:7177/api/MasterHoliday/" + holiday_Id,
        type: "GET",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        headers: {
            Authorization: "Bearer " + sessionStorage.getItem("Token"),
        },
        success: function (result) {
            var obj = result.data;
            $("#Holiday_Id").val(obj.holiday_Id);
            $("#HolidayName").val(obj.name);
            $("#HolidayDate").val(obj.date.substring(0, 10));
            $("#Description").val(obj.description);
            $("#Modal").modal("show");
            $("#Update").show();
            $("#Save").hide();

            initialHoliday = {
                HolidayName: obj.name,
                HolidayDate: obj.date.substring(0, 10),
                Description: obj.description,
            };
        },
        error: function (errormessage) {
            alert(errormessage.responseText);
        },
    });
}

function Update() {
    //debugger;
    var isValid = true;

    $("input[required]").each(function () {
        var input = $(this);
        if (!input.val()) {
            input.next(".error-message").show();
            isValid = false;
        } else {
            input.next(".error-message").hide();
        }
    });

    if (!isValid) {
        return;
    }

    var Holiday = new Object(); //object baru
    Holiday.holiday_Id = $("#Holiday_Id").val();
    Holiday.name = $("#HolidayName").val();
    Holiday.date = $("#HolidayDate").val();
    Holiday.description = $("#Description").val();

    //console.log(Holiday);
    //console.log(initialHoliday);
    if (Holiday.name == initialHoliday.HolidayName &&
        Holiday.date == initialHoliday.HolidayDate &&
        Holiday.description == initialHoliday.Description){
        Swal.fire({
            icon: "info",
            title: "No Changes Detected",
            text: "No data has been modified.",
            showConfirmButton: false,
            timer: 2000,
        });
        $("#Modal").modal("hide");
        $("#tbDataHoliday").DataTable().ajax.reload();
        return;
    }
    $.ajax({
        type: "PUT",
        url: "https://localhost:7177/api/MasterHoliday",
        data: JSON.stringify(Holiday),
        contentType: "application/json; charset=utf-8",
        headers: {
            Authorization: "Bearer " + sessionStorage.getItem("Token"),
        },
    }).then((result) => {
        if (result.status == 200) {
            Swal.fire({
                icon: "success",
                title: "Success...",
                text: "Data has been update!",
                showConfirmButtom: false,
                timer: 2000,
            });
            const logMessage = `Update holiday ${Holiday.name} date ${Holiday.date} ID:${Holiday.holiday_Id}`
            SaveLogUpdate(logMessage);
            $("#Modal").modal("hide");
            $("#tbDataHoliday").DataTable().ajax.reload();
        } else {
            alert("Data Failed to Update");
        }
    });
}

function DeleteHoliday(holiday_Id,name) {
    //debugger;

    // cek index pagination
    var currentPageIndex = $("#tbDataHoliday").DataTable().page.info().page;

    Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "No",
    }).then((result) => {
        if (result.value) {
            $.ajax({
                url: "https://localhost:7177/api/MasterHoliday/" + holiday_Id,
                type: "DELETE",
                dataType: "json",
                headers: {
                    Authorization: "Bearer " + sessionStorage.getItem("Token"),
                },
            }).then((result) => {
                if (result.status == 200) {
                    Swal.fire("Deleted!", "Your data has been deleted.", "success");
                    const logMessage = `Delete holiday ${name}`
                    SaveLogUpdate(logMessage);
                    // Reload data tabel
                    $("#tbDataHoliday").DataTable().ajax.reload(null, false);

                    // Setel kembali halaman tabel ke indeks yang disimpan
                    $("#tbDataHoliday").DataTable().page(currentPageIndex).draw(false);
                } else {
                    Swal.fire("Error!", result.message, "error");
                }
            });
        }
    });
}

const closeButton = document.querySelector(
    '.btn.btn-danger[data-dismiss="modal"]'
);
closeButton.addEventListener("click", function () {
    // kode untuk menutup modal
});