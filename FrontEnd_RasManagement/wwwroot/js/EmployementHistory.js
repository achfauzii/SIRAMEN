var table = null;
$(document).ready(function () {
    const decodedtoken = parseJwt(sessionStorage.getItem("Token"));
    const accid = decodedtoken.AccountId;
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

function validateDateInputs() {
    var startYear = new Date($("#StartYear").val());
    var endYear = new Date($("#EndYear").val());
    var errorMessageDateValid = "End year must be greater than start year";

    if (startYear > endYear) {
        $("#EndYear").next(".error-message").text(errorMessageDateValid);
        $("#EndYear").next(".error-message").show();
        $("#Save").prop('disabled', true); // Menonaktifkan tombol "Save"
        $("#Update").prop('disabled', true); // Menonaktifkan tombol "Save"
    } else {
        $("#EndYear").next(".error-message").hide();
        $("#Save").prop('disabled', false); // Mengaktifkan tombol "Save"
        $("#Update").prop('disabled', false); // Mengaktifkan tombol Update
    }
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
    $("#WorkExperienceId").val("");
    $("#CompanyName").val("");
    $("#Job").val("");
    $("#StartYear").val("");
    $("#EndYear").val("");
    $(".error-message").hide();
    $("#Description").val("");
    $("#Update").hide();
    $("#Save").show();
    $("input[required]").each(function () {
        var input = $(this);
        input.next(".error-message").hide();
    });
}

function GetById(workExperienceId) {
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

function Update() {
    var isValid = true;

    var existingData = {
        CompanyName: $("#CompanyName").val(),
        Job: $("#Job").val(),
        StartYear: $("#StartYear").val(),
        EndYear: $("#EndYear").val(),
        Description: $("#Description").val(),
    };

    var initialData = {
        CompanyName: $("#CompanyName").attr("data-initial"),
        Job: $("#Job").attr("data-initial"),
        StartYear: $("#StartYear").attr("data-initial"),
        EndYear: $("#EndYear").attr("data-initial"),
        Description: $("#Description").attr("data-initial"),
    };

    var hasChanged = JSON.stringify(existingData) !== JSON.stringify(initialData);

    console.log("Has data changed:", hasChanged);
    console.log("Exiting Data:", existingData);
    console.log("Initial Data:", initialData);


    if (!hasChanged) {
        Swal.fire({
            icon: "info",
            title: "No Data Has Been Changed",
            showConfirmButton: false,
            timer: 2000,
        }).then(() => {
            $("#Modal").modal("hide");
        });
        return;
    }

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
