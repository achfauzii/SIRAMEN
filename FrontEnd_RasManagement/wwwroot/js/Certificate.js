var table = null;
var initialCertificateData = {};
$(document).ready(function () {
    //debugger;

    $('input[required]').each(function () {
        $(this).prev('label').append('<span style="color: red;">*</span>');
    });
    
    const decodedtoken = parseJwt(sessionStorage.getItem("Token"));
    const accid = decodedtoken.AccountId;
    table = $("#TB_Certificate").DataTable({
        responsive: true,
        ajax: {
            url:
                "https://localhost:7177/api/Certificate/accountId?accountId=" + accid,
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
            { data: "publisher" },
            {
                data: "publicationYear",
                render: function (data) {
                    // Pastikan data tidak null atau undefined sebelum melakukan format tanggal
                    if (data) {
                        const date = new Date(data);
                        const options = { month: "long", year: "numeric" };
                        return date.toLocaleDateString("en-EN", options);
                    } else {
                        return ""; // Jika data null atau undefined, tampilkan string kosong
                    }
                },
            },
            {
                data: "validUntil",
                render: function (data) {
                    // Pastikan data tidak null atau undefined sebelum melakukan format tanggal
                    if (data) {
                        const date = new Date(data);
                        const options = { month: "long", year: "numeric" };
                        return date.toLocaleDateString("en-EN", options);
                    } else {
                        return ""; // Jika data null atau undefined, tampilkan string kosong
                    }
                },
            },
            {
                // Menambahkan kolom "Action" berisi tombol "Edit" dan "Delete" dengan Bootstrap
                data: null,
                render: function (data, type, row) {
                    var modalId = "modal-edit-" + data.certificateId;
                    var deleteId = "modal-delete-" + data.certificateId;
                    return (
                        '<button class="btn btn-warning " data-placement="left" data-toggle="modal" data-animation="false" title="Edit" onclick="return GetById(' +
                        row.certificateId +
                        ')"><i class="fa fa-edit"></i></button >' +
                        "&nbsp;" +
                        '<button class="btn btn-danger" data-placement="right" data-toggle="modal" data-animation="false" title="Delete" onclick="return Delete(' +
                        row.certificateId +
                        ')"><i class="fa fa-trash"></i></button >'
                    );
                },
            },
        ],

        order: [
            [2, "desc"],
            [3, "desc_nulls_last"],
        ],
        //"responsive": true,
        //Buat ngilangin order kolom No dan Action
        columnDefs: [
            {
                targets: [0, 4, 5],
                orderable: false,
            },
        ],
        aoColumnDefs: [
            {
                sType: "date", // Menggunakan pengurutan tanggal
                aTargets: [3, 4], // Terapkan pada kolom "Publication Year" dan "Valid Until"
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

function noHTML(input) {
    var value = input.value.replace(/<[^>]*>/g, "");
    var nohtml = value.replace(/[<>?/]/g, "");
    input.value = nohtml;
}

function handleInput(event, input) {
    // Menangani peristiwa oninput dan onpaste
    noHTML(input);
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

function ClearScreen() {
    $("#CertificateId").val("");
    $("#Name").val("");
    $("#Publisher").val("");
    $("#PublicationYear").val("");
    $("#ValidUntil").val("");
    $(".error-message").hide();
    $("#Update").hide();
    $("#Save").show();
    $("input[required]").each(function () {
        var input = $(this);

        input.next(".error-message").hide();
    });
}

function GetById(CertificateId) {
    //debugger;
    $.ajax({
        url: "https://localhost:7177/api/Certificate/" + CertificateId,
        type: "GET",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        headers: {
            Authorization: "Bearer " + sessionStorage.getItem("Token"),
        },
        success: function (result) {
            //debugger;
            var obj = result.data; //data yg dapet dr id
            initialCertificateData = {
   
                Name: obj.name,
                Publisher: obj.publisher,
                PublicationYear: obj.publicationYear,
                ValidUntil: obj.validUntil
            };
        
            $("#CertificateId").val(obj.certificateId); //ngambil data dr api
            $("#Name").val(obj.name);
            $("#Publisher").val(obj.publisher);
            $("#PublicationYear").val(obj.publicationYear);
            $("#ValidUntil").val(obj.validUntil);
            $("#Modal").modal("show");
            $("#Save").hide();
            $("#Update").show();
        },
        error: function (errormessage) {
            alert(errormessage.responseText);
        },
    });
}

// Tambahkan event listener untuk memantau perubahan pada kolom "Publication Year"
$("#PublicationYear").on('input', function () {
    validateDateInputs();
});

// Tambahkan event listener untuk memantau perubahan pada kolom "Valid Until"
$("#ValidUntil").on('input', function () {
    validateDateInputs();
});

function validateDateInputs() {
    var publicationYear = new Date($("#PublicationYear").val());
    var validUntil = new Date($("#ValidUntil").val());
    var errorMessageDateValid = "Valid until must be greater than publication year";

    if (publicationYear > validUntil) {
        $("#ValidUntil").next(".error-message").text(errorMessageDateValid);
        $("#ValidUntil").next(".error-message").show();
        $("#Save").prop('disabled', true); // Menonaktifkan tombol "Save"
        $("#Update").prop('disabled', true); // Menonaktifkan tombol "Save"
    } else {
        $("#ValidUntil").next(".error-message").hide();
        $("#Save").prop('disabled', false); // Mengaktifkan tombol "Save"
        $("#Update").prop('disabled', false); // Mengaktifkan tombol Update
    }
}

function Save() {
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

    var Certificate = new Object(); //bikin objek baru
    Certificate.name = $("#Name").val(); //value dari database\
    Certificate.publisher = $("#Publisher").val();
    Certificate.publicationYear = $("#PublicationYear").val();
    Certificate.validUntil = $("#ValidUntil").val();
    const decodedtoken = parseJwt(sessionStorage.getItem("Token"));
    const accid = decodedtoken.AccountId;
    Certificate.accountId = accid;
    $.ajax({
        type: "POST",
        url: "https://localhost:7177/api/Certificate",
        data: JSON.stringify(Certificate), //ngirim data ke api
        contentType: "application/json; charset=utf-8",
        headers: {
            Authorization: "Bearer " + sessionStorage.getItem("Token"),
        },
    }).then((result) => {
        // debugger;
        if (
            (result.status == result.status) == 201 ||
            result.status == 204 ||
            result.status == 200
        ) {
            //alert("Data Berhasil Dimasukkan");
            Swal.fire({
                icon: "success",
                title: "Success...",
                text: "Data has been added!",
                showConfirmButton: false,
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

function Delete(CertificateId) {
    // debugger;
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
                url: "https://localhost:7177/api/Certificate/" + CertificateId,
                type: "DELETE",
                dataType: "json",
                headers: {
                    Authorization: "Bearer " + sessionStorage.getItem("Token"),
                },
            }).then((result) => {
                // debugger;
                if (result.status == 200) {
                    Swal.fire("Deleted!", "Data has been deleted.", "success");
                    table.ajax.reload();
                } else {
                    Swal.fire("Error!", "Data failed to deleted.", "error");
                }
            });
        }
    });
}

function Update() {
    // debugger;
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
    var Certificate = new Object();
    Certificate.certificateId = $("#CertificateId").val();
    Certificate.name = $("#Name").val();
    Certificate.publisher = $("#Publisher").val();
    Certificate.publicationYear = $("#PublicationYear").val();
    Certificate.validUntil = $("#ValidUntil").val();
    const decodedtoken = parseJwt(sessionStorage.getItem("Token"));
    const accid = decodedtoken.AccountId;
    Certificate.accountId = accid;
    if (Certificate.name == initialCertificateData.Name &&
        Certificate.publisher == initialCertificateData.Publisher &&
        Certificate.publicationYear == initialCertificateData.PublicationYear &&
        Certificate.validUntil == initialCertificateData.ValidUntil) {
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
        url: "https://localhost:7177/api/Certificate",
        type: "PUT",
        data: JSON.stringify(Certificate),
        contentType: "application/json; charset=utf-8",
        headers: {
            Authorization: "Bearer " + sessionStorage.getItem("Token"),
        },
    }).then((result) => {
        // debugger;
        if (result.status == 200) {
            Swal.fire({
                icon: "success",
                title: "Success...",
                text: "Data has been update!",
                showConfirmButton: false,
                timer: 1500,
            });
            $("#Modal").modal("hide");
            table.ajax.reload();
        } else {
            Swal.fire("Error!", "Your failed to update", "error");
            table.ajax.reload();
        }
    });
}

