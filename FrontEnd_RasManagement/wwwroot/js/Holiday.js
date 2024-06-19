//Holiday.js diguakn untuk menangani Hari Libur ataupun cuti bersama berada pada halaman manage holiday pada bagian admin
//Holiay.js digunakan untuk menampilkan table holiday, CRUD, dan generate data holiday dari api public holiday untuk disimpan ke server
//Generate Holiday berfungsi dalam menambahkan Hari Libur dengan API Public kemudian disimpan ke dalam database 
//File Csthml nya Holiday -> Index

var table = null;
var initialHoliday = {};
$(document).ready(function () {
    $('input[required]').each(function () {
        $(this).prev('label').append('<span style="color: red;">*</span>');
    });
    //debugger;
    var today = new Date();
    var dayOfWeek = today.getDay();

    //Get Year untuk digunakan dalam generate Holiday
    var year = today.getFullYear();
    $("#generateHoliday").append(`(${year})`)

    // Menampilkan Table Holiday
    $.fn.dataTable.moment('D MMMM YYYY')
    table = $("#tbDataHoliday").DataTable({
        responsive: true,
        columnDefs: [
            {
                targets: [0, 1, 3, 4],
                orderable: false,
            },
        ],
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
                    let date = moment.utc(data);
                    return date.format('D MMMM YYYY');
                },
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

        order: [[2, "asc"]],
        
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

// Function GenerateFoliday ini berjalan ketika admin klik tombol Generate Holiday pada halaman manage holiday
// Kemudian akan menyimpan data holiday yang di dapay dari api google calendar ke dalam database
// Terdapat juga validasi jika tanngal sudah ada pada dalam database maka tidak ditambahkan
async function generateHoliday() {
    
    $("#loader").show();
    let arrData = [];
    let today = new Date()
    const fetchData = await fetch("https://www.googleapis.com/calendar/v3/calendars/id.indonesian%23holiday%40group.v.calendar.google.com/events?key=AIzaSyDJdgeHataUs0i9mzkx9bMgGDyMyGcsSZk");
    const result = await fetchData.json();
    const events = result.items;
    events.forEach(function (data) {
        let insideData = null;
        let holidayDate = new Date(data.start.date);
        let desc = data.description
        if (holidayDate.getFullYear() === today.getFullYear() && !desc.includes("Perayaan")) {
            insideData = {
                name: data.summary,
                date: data.start.date
            }
            arrData.push(insideData);
        }
    })
    arrData.sort((a, b) => new Date(a.date) - new Date(b.date))
    let dataToInsert = null

    let existingDate = 0;
    let successInsert = 0;
    let failedInsert = 0;
    arrData.forEach(function (saveData) {
        dataToInsert = {
            name: saveData.name,
            date: saveData.date,
            description: null
        }
        $.ajax({
            type: "GET",
            url: "https://localhost:7177/api/MasterHoliday/getHolidayByDate?date=" + dataToInsert.date,
            contentType: "application/json; charset=utf-8",
            headers: {
                Authorization: "Bearer " + sessionStorage.getItem("Token"),
            },
            async:false,
            success: function (data) {
                    $.ajax({
                        type: "POST",
                        url: "https://localhost:7177/api/MasterHoliday",
                        data: JSON.stringify(dataToInsert),
                        contentType: "application/json; charset=utf-8",
                        async:false,
                        headers: {
                            Authorization: "Bearer " + sessionStorage.getItem("Token"),
                        },
                        success: function (succ) {
                            successInsert += 1;
                        },
                        error: function (err) {
                            failedInsert += 1;

                        }
                    });
            }, error: function (err) {
                existingDate += 1;
            }
        });
        dataToInsert = null
    })

    $("#loader").hide();
    Swal.fire({
        title: "Holiday Generated!",
        html: `${successInsert} Berhasil, ${failedInsert} Gagal, ${existingDate} Telah Ada`,
        icon: "info"
    });
    $("#tbDataHoliday").DataTable().ajax.reload();

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

function noHTML(input) {
    var value = input.value.replace(/<[^>]*>/g, "");
    var nohtml = value.replace(/[<>?/]/g, "");
    input.value = nohtml;
}

function handleInput(event, input) {
    // Menangani peristiwa oninput dan onpaste
    noHTML(input);
}


// Menyimpan data holiday ke server ketika admin klik tombol save pada form add Holiday
// Terdapat validasi pada backend pengecekan tanggal
// Jika tanggal yang sudah ada di input kembali maka muncul alert Date Existing!!
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
        type: "GET",
        url: "https://localhost:7177/api/MasterHoliday/getHolidayByDate?date=" + Holiday.date,
        contentType: "application/json; charset=utf-8",
        headers: {
            Authorization: "Bearer " + sessionStorage.getItem("Token"),
        },
        success: function (data) {
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
        }, error: function (err) {
            Swal.fire({
                icon: "warning",
                title: "Date Existing!!",
                showConfirmButtom: false,
                timer: 1500,
            });
        }
    })
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

//Function berikut digunakan untuk mendapatkan data holiday berdasarkan holiday id
//Digunakan untuk mengisi value ketika admin klik tombol edit pada manage holiday
function GetById(holiday_Id) {
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

// Function Update untuk update data holiday, berjalan ketika admin klik tombol update pada form edit holiday
// Terdapat validasi juga jika data sudah ada di dalam database muncul alert Data Existing
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
    let cond = 0;
    $.ajax({
        type: "GET",
        url: "https://localhost:7177/api/MasterHoliday/getHolidayByDate?date=" + Holiday.date,
        contentType: "application/json; charset=utf-8",
        async:false,
        headers: {
            Authorization: "Bearer " + sessionStorage.getItem("Token"),
        },
        success: function (data) {
            cond+=1
        },
        error: function (err) {
            if (err.responseJSON.search === 1 && Holiday.date === initialHoliday.HolidayDate) {
                cond+=1
            }
            
        }

    })
    if (cond > 0) {
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
    } else {
        Swal.fire({
            icon: "warning",
            title: "Date Existing!!",
            showConfirmButtom: false,
            timer: 1500,
        });
    }
    
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