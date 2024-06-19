//EmployementHistory.js ini menangani halaman Data For CV -> EmployementHistory pada bagian employee
//Sebagian besar berisi dalam menangani view table EmployementHistory, Add new, Edit data dan Delete Data

var table = null;
var initialEmployementHis = {};
$(document).ready(function () {
    //Date Picker untul form modal EmployementHistory
    $("#StartYear").datepicker({
        format: "yyyy-mm",
        viewMode: "months",
        minViewMode: "months"
    });
    //Date Picker untul form modal EmployementHistory
    $("#EndYear").datepicker({
        format: "yyyy-mm",
        viewMode: "months",
        minViewMode: "months"
    });

    $('select[required],input[required]').each(function () {
        $(this).prev('label').append('<span style="color: red;">*</span>');
    });
    $('input[required]').each(function () {
        $(this).closest('.col pr-0 form-group').prev('label').append('<span style="color: red;">*</span>');
    });
    $('input[required]').each(function () {
        $(this).closest('.col pl-0 form-group').prev('label').append('<span style="color: red;">*</span>');
    });

    // Get Account id dari hasril Parse JWT
    const decodedtoken = parseJwt(sessionStorage.getItem("Token"));
    const accid = decodedtoken.AccountId;

    // Menampilkan Table dalam bentuk datatable
    // Dari account id diatas atau accid digunakan untuk mendapatkan employement History berdasarkan account id
    // Table berikut berisi data employement history berdasarkan account Id
    table = $("#TB_EmploymentHistory").DataTable({
        responsive: true,
        ajax: {
            url:
                "https://localhost:7177/api/EmploymentHistory/accountId?accountId=" +
                accid,
            type: "GET",
            datatype: "json",
            dataSrc: "data",
            headers: {
                Authorization: "Bearer " + sessionStorage.getItem("Token"),
            },
        },
        pagingType: "full_numbers",
        columns: [
            {
                data: null,
                render: function (data, type, row, meta) {
                    return meta.row + meta.settings._iDisplayStart + 1 + ".";
                },
            },
            { data: "companyName" },
            { data: "job" },
            {
                data: "period",
                render: function (data) {
                    const parts = data.split(" - ");

                    const startDate = parts[0]; // "2023-08"
                    const endDate = parts[1]; // "Now"
                    // Pastikan data tidak null atau undefined sebelum melakukan format tanggal
                    if (startDate) {
                        var startDate_ = new Date(startDate);
                        if (endDate != "Now") {
                            var endDate_ = new Date(endDate);
                            const options = { month: "long", year: "numeric" };
                            endDate_ = endDate_.toLocaleDateString("en-EN", options);
                        } else {
                            endDate_ = "Now";
                        }

                        const options = { month: "long", year: "numeric" };
                        startDate_ = startDate_.toLocaleDateString("en-EN", options);
                        date = startDate_ + " - " + endDate_;
                        return date;
                    } else {
                        return ""; // Jika data null atau undefined, tampilkan string kosong
                    }
                },
            },
            { data: "description" },
            {
                // Menambahkan kolom "Action" berisi tombol "Edit" dan "Delete" dengan Bootstrap
                data: null,
                render: function (data, type, row) {
                    var modalId = "modal-edit-" + data.workExperienceId;
                    var deleteId = "modal-delete-" + data.workExperienceId;
                    return (
                        '<button class="btn btn-sm btn-warning mr-2 " data-placement="left" data-toggle="modal" data-animation="false" title="Edit" onclick="return GetById(' +
                        row.workExperienceId +
                        ')"><i class="fa fa-edit"></i></button >' +
                        '<button class="btn btn-sm btn-danger" data-placement="right" data-toggle="modal" data-animation="false" title="Delete" onclick="return Delete(' +
                        row.workExperienceId +
                        ')"><i class="fa fa-trash"></i></button >'
                    );
                },
            },
        ],

        order: [[2, "desc"]],
        //"responsive": true,
        //Buat ngilangin order kolom yang dipilih
        columnDefs: [
            {
                targets: [0, 2, 4, 5],
                orderable: false,
            },
        ],
        //Agar nomor tidak berubah
        drawCallback: function (settings) {
            var api = this.api();
            var rows = api.rows({ page: "current" }).nodes();
            var currentPage = api.page.info().page; // Mendapatkan nomor halaman saat ini
            var startNumber = currentPage * api.page.info().length + 1; // Menghitung nomor awal baris pada halaman saat ini

            api.column(0, { page: "current" })
                .nodes()
                .each(function (cell, i) {
                    cell.innerHTML = startNumber + i; // Mengupdate nomor baris pada setiap halaman
                });
        },
    });
});

// Function untuk melakukan parse pada Token JWT, memisah token menjadi beberapa bagian untuk di gunakan di function lainnya
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

// Tambahkan event listener untuk memantau perubahan pada kolom "Publication Year"
$("#StartYear").on('input', function () {
    validateDateInputs();
});

// Tambahkan event listener untuk memantau perubahan pada kolom "Valid Until"
$("#EndYear").on('input', function () {
    validateDateInputs();
});


// Function berikut digunakan untuk menyimpan data baru Employement History ke server
function Save() {
    var isValid = true;
    $("input[required]").each(function () {
        var input = $(this);
        var errorMessage = input.closest('.input-group').find('.error-message-p');
        if (!input.val()) {
            input.next(".error-message").show();
            errorMessage.show();
            isValid = false;
        } else {
            input.next(".error-message").hide();
            errorMessage.hide();
        }
    });

    if (!isValid) {
        return;
    }

    var startYear = $("#StartYear").val();
    var endYear = $("#EndYear").val();
    if (endYear == "") {
        endYear = "Now";
    }
    var period = startYear + " - " + endYear;

    var EmploymentHistory = {
        companyName: $("#CompanyName").val(),
        job: $("#Job").val(),
        period: period,
        description: $("#Description").val(),
    };
    
    // Account id didapatkan dari hasil parseJwt
    // Kemudiab disimpan kedalam   EmploymentHistory.AccountId untuk dikirim ke server
    const decodedtoken = parseJwt(sessionStorage.getItem("Token"));
    const accid = decodedtoken.AccountId;
    EmploymentHistory.AccountId = accid;

    $.ajax({
        type: "POST",
        url: "https://localhost:7177/api/EmploymentHistory",
        data: JSON.stringify(EmploymentHistory),
        contentType: "application/json; charset=utf-8",
        headers: {
            Authorization: "Bearer " + sessionStorage.getItem("Token"),
        },
    }).then((result) => {
        if (result.status == 200) {
            /*alert(result.message);
                  $('#TB_Department').DataTable().ajax.reload();*/
            Swal.fire({
                icon: "success",
                title: "Success...",
                text: "Data has been added!",
                showConfirmButtom: false,
                timer: 1500,
            });
            $("#Modal").modal("hide");
            table.ajax.reload();
        } else {
            Swal.fire({
                icon: "warning",
                title: "Data failed to added!",
                showConfirmButtom: false,
                timer: 1500,
            });
            $("#Modal").modal("hide");
            table.ajax.reload();
        }
    });
}

function ClearScreen() {
    $("#Update").hide();
    $("#Save").show();
    $('#Modal').find('input, textarea').each(function (e) {
        $(this).val('');
        $(this).val("").trigger("change");
    })
    $(".err").hide();

}

// Function GetById berikut digunakan untuk mendapatkan data employement history dari server
// Function ini menerima parameter workExperienceId yang dijalankan saat employee klik button edit
// Kemudian akan menampilkan value pada form employement History
function GetById(workExperienceId) {
    ClearScreen()
    $("#Update").show();
    $("#Save").hide();
    $.ajax({
        url: "https://localhost:7177/api/EmploymentHistory/" + workExperienceId,
        type: "GET",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        headers: {
            Authorization: "Bearer " + sessionStorage.getItem("Token"),
        },
        success: function (result) {
            var obj = result.data; // Data yang diterima dari API
            initialEmployementHis = {
                WorkExperienceId: obj.workExperienceId,
                CompanyName: obj.companyName,
                Job: obj.job,
                StartYear: obj.period.split(" - ")[0],
                EndYear: obj.period.split(" - ")[1],
                Description: obj.description,
            };
            $("#WorkExperienceId").val(obj.workExperienceId);
            $("#CompanyName").val(obj.companyName).attr("data-initial", obj.companyName);
            $("#Job").val(obj.job).attr("data-initial", obj.job);

            // Pisahkan Start Year dan End Year
            var periods = obj.period.split(" - ");
            $("#StartYear").val(periods[0]);
            $("#EndYear").val(periods[1]);

            $("#Description").val(obj.description).attr("data-initial", obj.description);
            $("#Modal").modal("show");
            $("#Update").show();
            $("#Save").hide();
        },
        error: function (errormessage) {
            alert(errormessage.responseText);
        },
    });
}

// Function Update berikut digunakan ketika ingin menyimpan perubahan pada Employement History
// Dijalankan saat employee klik tombol update pada form edit Employement History
function Update() {
    var isValid = true;

    $("input[required]").each(function () {
        var input = $(this);
        var errorMessage = input.closest('.input-group').find('.error-message-p');
        if (!input.val()) {
            input.next(".error-message").show();
            errorMessage.show();
            isValid = false;
        } else {
            input.next(".error-message").hide();
            errorMessage.hide();
        }
    });

    if (!isValid) {
        return;
    }
    var startYear = $("#StartYear").val();
    var endYear = $("#EndYear").val();
    if (endYear == "") {
        endYear = "Now";
    }

    var period = startYear + " - " + endYear;

    var EmploymentHistory = {
        workExperienceId: $("#WorkExperienceId").val(),
        companyName: $("#CompanyName").val(),
        job: $("#Job").val(),
        period: period,
        description: $("#Description").val(),
    };

    const decodedtoken = parseJwt(sessionStorage.getItem("Token"));
    const accid = decodedtoken.AccountId;
    EmploymentHistory.AccountId = accid;

    if (initialEmployementHis.CompanyName == EmploymentHistory.companyName &&
        initialEmployementHis.Job == EmploymentHistory.job &&
        initialEmployementHis.StartYear == startYear &&
        initialEmployementHis.EndYear == endYear &&
        initialEmployementHis.Description == EmploymentHistory.description
    ) {
        Swal.fire({
            icon: "info",
            title: "No Changes Detected",
            text: "No data has been modified.",
            showConfirmButton: false,
            timer: 2000,
        });
        $("#Modal").modal("hide");
        return;
    }
    $.ajax({
        type: "PUT",
        url: "https://localhost:7177/api/EmploymentHistory",
        data: JSON.stringify(EmploymentHistory),
        contentType: "application/json; charset=utf-8",
        headers: {
            Authorization: "Bearer " + sessionStorage.getItem("Token"),
        },
    }).then((result) => {
        if (result.status == 200) {
            Swal.fire({
                icon: "success",
                title: "Success...",
                text: "Data has been updated!",
                showConfirmButton: false,
                timer: 2000,
            });
            $("#Modal").modal("hide");
            table.ajax.reload();
        } else {
            Swal.fire("Error!", "Data failed to update", "error");
        }
    });
}


// Function Delete berikut digunakan untuk menghapus data
// Menerima parameter workExperienceId untuk di delte berdasarkan id tersebut
// Function ini berjalan saat employee klik tombol delete pada halaman Employement History
function Delete(workExperienceId) {
    Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
    }).then((result) => {
        if (result.value) {
            $.ajax({
                url: "https://localhost:7177/api/EmploymentHistory/" + workExperienceId,
                type: "DELETE",
                dataType: "json",

                headers: {
                    Authorization: "Bearer " + sessionStorage.getItem("Token"),
                },
            }).then((result) => {
                if (result.status == 200) {
                    Swal.fire("Deleted!", "Your data has been deleted.", "success");
                    table.ajax.reload();
                } else {
                    Swal.fire("Error!", "Data failed to delete", "error");
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
