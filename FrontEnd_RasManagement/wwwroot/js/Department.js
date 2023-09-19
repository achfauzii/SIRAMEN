﻿var table = null;
$(document).ready(function () {
    debugger;
    table = $('#TB_Department').DataTable({
        
        "ajax": {
            url: "https://localhost:7177/api/Department",
            type: "GET",
            "datatype": "json",
            "dataSrc": "data",
        },

        "columns": [
            {
                render: function (data, type, row, meta) {
                    return meta.row + meta.settings._iDisplayStart + 1 + "."
                }
            },
            { "data": "namaDept" },
            {
                // Menambahkan kolom "Action" berisi tombol "Edit" dan "Delete" dengan Bootstrap
                "data": null,
                "render": function (data, type, row) {
                    var modalId = "modal-edit-" + data.deptId;
                    var deleteId = "modal-delete-" + data.deptId;
                    return '<button class="btn btn-sm btn-warning p-1 " data-placement="left" data-toggle="modal" data-animation="false" title="Edit" onclick="return GetByIdDept(' + row.deptId + ')"><i class="fa fa-edit"></i></button >' + '&nbsp;' +
                        '<button class="btn btn-sm btn-danger p-1" data-placement="right" data-toggle="modal" data-animation="false" title="Delete" onclick="return Delete(' + row.deptId + ')"><i class="fa fa-trash"></i></button >'
                }
            }
        ],

        "order": [[1, "desc"]],
        //"responsive": true,
        //Buat ngilangin order kolom No dan Action
        "columnDefs": [
            {
                "targets": [0, 2],
                "orderable": false
            }
        ],
        //Agar nomor tidak berubah
        "drawCallback": function (settings) {
            var api = this.api();
            var rows = api.rows({ page: 'current' }).nodes();
            api.column(1, { page: 'current' }).data().each(function (group, i) {
                $(rows).eq(i).find('td:first').html(i + 1);
            });
        }
    })
})

function Save() {
    var isValid = true;

    $('input[required]').each(function () {
        var element = $(this);
        if (!element.val()) {
            element.next('.error-message').show();
            isValid = false;
        } else {
            element.next('.error-message').hide();
        }
    });

    if (!isValid) {
        return;
    }

    var Department = new Object(); //object baru
    Department.namaDept = $('#NamaDept').val(); //value insert dari id pada input
    $.ajax({
        type: 'POST',
        url: 'https://localhost:7177/api/Department',
        data: JSON.stringify(Department),
        contentType: "application/json; charset=utf-8",
        headers: {
            "Authorization": "Bearer " + sessionStorage.getItem("Token")
        },
    }).then((result) => {
        debugger;
        if (result.status == 200) {
            Swal.fire({
                icon: 'success',
                title: 'Success...',
                text: 'Data has been added!',
                showConfirmButtom: false,
                timer: 1500
            })
            $('#Modal').modal('hide');
            table.ajax.reload();
        }
        else {
            Swal.fire({
                icon: 'warning',
                title: 'Data Gagal dimasukkan!',
                showConfirmButtom: false,
                timer: 1500
            })
            $('#Modal').modal('hide');
            table.ajax.reload();
        }
    })
}

function ClearScreen() {
    $('#DeptId').val('');
    $('#NamaDept').val('');
    $('#UpdateDept').hide();
    $('#Save').show();
    /*$('input[required],textarea[required]').each(function () {
        var input = $(this);
        var textarea = $(this);

        input.next('.error-message').hide();
        textarea.next('.error-message').hide();

    });*/
}

function GetByIdDept(deptId) {
    //debugger;
    $.ajax({
        url: "https://localhost:7177/api/Department/" + deptId,
        type: "GET",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        /*headers: {
            "Authorization": "Bearer " + sessionStorage.getItem("Token")
        },*/
        success: function (result) {
            //debugger;
            var obj = result.data; //data yg kita dapat dr API  
            $('#DeptId').val(obj.deptId);
            $('#NamaDept').val(obj.namaDept);
            $('#Modal').modal('show');
            $('#UpdateDept').show();
            $('#Save').hide();
        },
        error: function (errormessage) {
            alert(errormessage.responseText);
        }
    })
}

function UpdateDept() {
    var isValid = true;

    $('input[required]').each(function () {
        var element = $(this);
        if (!element.val()) {
            element.next('.error-message').show();
            isValid = false;
        } else {
            element.next('.error-message').hide();
        }
    });

    if (!isValid) {
        return;
    }

    var Department = new Object(); //object baru
    Department.deptId = $('#DeptId').val();
    Department.namaDept = $('#NamaDept').val(); //value insert dari id pada input
    debugger;
    $.ajax({
        url: 'https://localhost:7177/api/Department',
        type: 'PUT',
        data: JSON.stringify(Department),
        contentType: "application/json; charset=utf-8",
        /*headers: {
            "Authorization": "Bearer " + sessionStorage.getItem("Token")
        },*/
    }).then(result => {
        debugger;
        if (result.status == 200) {
            Swal.fire({
                icon: 'success',
                title: 'Success...',
                text: 'Data has been update!',
                showConfirmButtom: false,
                timer: 2000
            })
            $('#Modal').modal('hide');
            table.ajax.reload();
        }
        else {
            alert("Data gagal Diperbaharui");
        }
    });
}

function Delete(deptId) {
    debugger;
    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
        if (result.value) {
            $.ajax({
                url: "https://localhost:7177/api/Department/" + deptId,
                type: "DELETE",
                dataType: "json",

                /*headers: {
                    "Authorization": "Bearer " + sessionStorage.getItem("Token")
                },*/
            }).then((result) => {
                debugger;
                if (result.status == 200) {
                    Swal.fire(
                        'Deleted!',
                        'Your data has been deleted.',
                        'success'
                    )
                    table.ajax.reload();
                }
                else {
                    Swal.fire(
                        'Error!',
                        result.message,
                        'error'
                    )
                }
            });
        }
    })
}

const closeButton = document.querySelector('.btn.btn-danger[data-dismiss="modal"]');
closeButton.addEventListener('click', function () {
    // kode untuk menutup modal
});