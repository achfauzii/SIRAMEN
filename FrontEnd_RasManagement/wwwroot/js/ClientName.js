var table = null;
$(document).ready(function () {
    table = $("#tbDataCleint").DataTable({
        responsive: true,

        ajax: {
            url: "https://localhost:7177/api/ClientName",
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
            { data: "nameOfClient" },
            {
                // Menambahkan kolom "Action" berisi tombol "Edit" dan "Delete" dengan Bootstrap
                data: null,
                render: function (data, type, row) {
                    var modalId = "modal-edit-" + data.id;
                    var deleteId = "modal-delete-" + data.id;
                    return (
                        '<button class="btn btn-sm btn-warning p-1 " data-placement="left" data-toggle="modal" data-animation="false" title="Edit" onclick="return GetById(' +
                        row.id +
                        ')"><i class="fa fa-edit"></i></button >' +
                        "&nbsp;" +
                        '<button class="btn btn-sm btn-danger p-1" data-placement="right" data-toggle="modal" data-animation="false" title="Delete" onclick="return Delete(\'' +
                        row.id +
                        "', '" +
                        row.nameOfClient + "'" +
                        ')"><i class="fa fa-trash"></i></button >'
                    );
                },
            },
        ],

        order: [[1, "desc"]],
        //"responsive": true,
        //Buat ngilangin order kolom No dan Action
        columnDefs: [
            {
                targets: [0, 2],
                orderable: false,
            },
        ],
        //Agar nomor tidak berubah
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
});

function Save() {
    var isValid = true;

    $("input[required]").each(function () {
        var element = $(this);
        if (!element.val()) {
            element.next(".error-message").show();
            isValid = false;
        } else {
            element.next(".error-message").hide();
        }
    });

    if (!isValid) {
        return;
    }

    var CLientName = new Object(); //object baru
    CLientName.nameOfClient = $("#clientName").val(); //value insert dari id pada input
    $.ajax({
        type: "POST",
        url: "https://localhost:7177/api/ClientName/AddValidasi",
        data: JSON.stringify(CLientName),
        contentType: "application/json; charset=utf-8",
        headers: {
            Authorization: "Bearer " + sessionStorage.getItem("Token"),
        },

        success: function (result) {

            const logMessage = `Has added client ${CLientName.nameOfClient}`;
            SaveLogUpdate(logMessage);
            if (result.status == 200) {
                Swal.fire({
                    icon: "success",
                    title: "Success...",
                    text: "Data has been added!",
                    showConfirmButton: false,
                    timer: 1500,
                });
                $("#Modal").modal("hide");
                $('#tbDataCleint').DataTable().ajax.reload()
            }
        },
        error: function (xhr, status, error) {
            Swal.fire({
                icon: "error",
                title: "Error",
                html: "Client <span style='text-decoration: underline; font-weight: bold;'>" + CLientName.nameOfClient + "</span> already exists",
                showConfirmButton: false,
                timer: 1500,
            });
        }
    });
}

function ClearScreen() {
    $("#clientId").val("");
    $("#clientName").val("");
    $("#Update").hide();
    $("#Save").show();
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

function ClearScreen() {
    $("#clientId").val("");
    $("#clientName").val("");
    $(".error-message").hide();
    $("#Update").hide();
    $("#Save").show();
}

function GetById(id) {
    $.ajax({
        url: "https://localhost:7177/api/ClientName/" + id,
        type: "GET",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        headers: {
            Authorization: "Bearer " + sessionStorage.getItem("Token"),
        },
        success: function (result) {
            var obj = result.data; //data yg kita dapat dr API
            $("#clientId").val(obj.id);
            $("#clientName").val(obj.nameOfClient);
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

    $("input[required]").each(function () {
        var element = $(this);
        if (!element.val()) {
            element.next(".error-message").show();
            isValid = false;
        } else {
            element.next(".error-message").hide();
        }
    });

    if (!isValid) {
        return;
    }

    var ClientName = new Object(); //object baru
    ClientName.id = $("#clientId").val();
    ClientName.nameOfClient = $("#clientName").val(); //value insert dari id pada input

    $.ajax({
        url: "https://localhost:7177/api/ClientName",
        type: "PUT",
        data: JSON.stringify(ClientName),
        contentType: "application/json; charset=utf-8",
        headers: {
            Authorization: "Bearer " + sessionStorage.getItem("Token"),
        },
    }).then((result) => {
        if (result.status == 200) {
            const logMessage = `Has updated the client name, client Id ${ClientName.id}`;
            SaveLogUpdate(logMessage);
            Swal.fire({
                icon: "success",
                title: "Success...",
                text: "Data has been update!",
                showConfirmButtom: false,
                timer: 1500,
            });
            $("#Modal").modal("hide");
            $('#tbDataCleint').DataTable().ajax.reload()
        } else {
            Swal.fire("Error!", "Data failed to update", "error");
        }
    });
}

function Delete(id, nameOfClient) {
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
                url: "https://localhost:7177/api/ClientName/" + id,
                type: "DELETE",
                dataType: "json",

                headers: {
                    Authorization: "Bearer " + sessionStorage.getItem("Token"),
                },
                success: function (result) {
                    const logMessage = `Has deleted client ${nameOfClient}`;
                    SaveLogUpdate(logMessage);
                    Swal.fire("Deleted!", "Your data has been deleted.", "success");
                    $('#tbDataCleint').DataTable().ajax.reload()
                },
                error: function (errormessage) {
                    Swal.fire("Error!", "Cant Delete, client Is Not Empty", "error");
                },
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
