var table = null;
$(document).ready(function () {
    table = $("#TB_Department").DataTable({
        responsive: true,

        ajax: {
            url: "https://localhost:7177/api/Department",
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
            { data: "namaDept" },
            {
                // Menambahkan kolom "Action" berisi tombol "Edit" dan "Delete" dengan Bootstrap
                data: null,
                render: function (data, type, row) {
                    var modalId = "modal-edit-" + data.deptId;
                    var deleteId = "modal-delete-" + data.deptId;
                    return (
                        '<button class="btn btn-sm btn-warning p-1 " data-placement="left" data-toggle="modal" data-animation="false" title="Edit" onclick="return GetByIdDept(' +
                        row.deptId +
                        ')"><i class="fa fa-edit"></i></button >' +
                        "&nbsp;" +
                        '<button class="btn btn-sm btn-danger p-1" data-placement="right" data-toggle="modal" data-animation="false" title="Delete" onclick="return Delete(\'' +
                        row.deptId +
                        "', '" +
                        row.namaDept + "'" +
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
    table = $("#TB_Department").DataTable()
    console.log('Save function - table:', table);
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

    var Department = new Object(); //object baru
    Department.namaDept = $("#NamaDept").val(); //value insert dari id pada input
    $.ajax({
        type: "POST",
        url: "https://localhost:7177/api/Department/Departmentv2",
        data: JSON.stringify(Department),
        contentType: "application/json; charset=utf-8",
        headers: {
            Authorization: "Bearer " + sessionStorage.getItem("Token"),
        },

        success: function (result) {
            const logMessage = `Has added department ${Department.namaDept}`;
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
                $('#TB_Department').DataTable().ajax.reload()
            }
        },
        error: function (xhr, status, error) {
            Swal.fire({
                icon: "error",
                title: "Error",
                html: "Department <span style='text-decoration: underline; font-weight: bold;'>" + Department.namaDept + "</span> already exists",
                showConfirmButton: false,
                timer: 1500,
            });
        }
    });
}

function ClearScreen() {
    $("#DeptId").val("");
    $("#NamaDept").val("");
    $("#UpdateDept").hide();
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

function ClearScreenDept() {
    $("#DeptId").val("");
    $("#NamaDept").val("");
    $(".error-message").hide();
    $("#UpdateDept").hide();
    $("#Save").show();
}

function GetByIdDept(deptId) {
    $.ajax({
        url: "https://localhost:7177/api/Department/" + deptId,
        type: "GET",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        headers: {
            Authorization: "Bearer " + sessionStorage.getItem("Token"),
        },
        success: function (result) {
            var obj = result.data; //data yg kita dapat dr API
            $("#DeptId").val(obj.deptId);
            $("#NamaDept").val(obj.namaDept);
            $("#Modal").modal("show");
            $("#UpdateDept").show();
            $("#Save").hide();
        },
        error: function (errormessage) {
            alert(errormessage.responseText);
        },
    });
}

function UpdateDept() {
    table = $("#TB_Department").DataTable()
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

    var Department = new Object(); //object baru
    Department.deptId = $("#DeptId").val();
    Department.namaDept = $("#NamaDept").val(); //value insert dari id pada input

    $.ajax({
        url: "https://localhost:7177/api/Department/Departmentv2",
        type: "PUT",
        data: JSON.stringify(Department),
        contentType: "application/json; charset=utf-8",
        headers: {
            Authorization: "Bearer " + sessionStorage.getItem("Token"),
        },
        success: function (result) {
            const logMessage = `Has updated the department name, department Id ${Department.deptId}`;
            SaveLogUpdate(logMessage);
            if (result.status == 200) {
                Swal.fire({
                    icon: "success",
                    title: "Success...",
                    text: "Data has been updated!",
                    showConfirmButton: false,
                    timer: 1500,
                });
                $("#Modal").modal("hide");
                table.ajax.reload();
            } else if (result.status == 400) {
                Swal.fire({
                    icon: "error",
                    title: "Failed...",
                    text: "Department Name Already Exists!",
                    showConfirmButton: false,
                    timer: 1500,
                });
            }
        },
        error: function (errormessage) {
            Swal.fire({
                icon: "error",
                title: "Failed...",
                text: "Unknown",
                showConfirmButton: false,
                timer: 1500,
            });
        }
    });
}

function Delete(deptId, deptName) {
    table = $("#TB_Department").DataTable()
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
                url: "https://localhost:7177/api/Department/" + deptId,
                type: "DELETE",
                dataType: "json",

                headers: {
                    Authorization: "Bearer " + sessionStorage.getItem("Token"),
                },
                success: function (result) {
                    const logMessage = `Has deleted department ${deptName}`;
                    SaveLogUpdate(logMessage);
                    Swal.fire("Deleted!", "Your data has been deleted.", "success");
                    $('#TB_Department').DataTable().ajax.reload()
                },
                error: function (errormessage) {
                    Swal.fire("Error!", "Cant Delete, Department Is Not Empty", "error");
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
