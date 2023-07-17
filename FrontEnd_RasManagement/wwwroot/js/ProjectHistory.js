var table = null;
$(document).ready(function () {
    debugger;
    const decodedtoken = parseJwt(sessionStorage.getItem("Token"));
    const accid = decodedtoken.AccountId;
    table = $('#TB_ProjectHistory').DataTable({
        "ajax": {
            url: "https://localhost:7177/api/ProjectHistoryControler/accountId?accountId=" + accid,
            type: "GET",
            "datatype": "json",
            "dataSrc": "data",
            /*headers: {
                "Authorization": "Bearer " + sessionStorage.getItem("tokenJWT")
            },*/
            /*success: function (result) {
                console.log(result)
            }*/
        },

        "columns": [
            {
                render: function (data, type, row, meta) {
                    return meta.row + meta.settings._iDisplayStart + 1 + "."
                }
            },
            { "data": "projectName" },
            { "data": "jobSpec" },
            { "data": "year" },
            { "data": "companyName" },
            {
                // Menambahkan kolom "Action" berisi tombol "Edit" dan "Delete" dengan Bootstrap
                "data": null,
                "render": function (data, type, row) {
                    var modalId = "modal-edit-" + data.projectHistoryId;
                    var deleteId = "modal-delete-" + data.projectHistoryId;
                    return '<button class="btn btn-warning " data-placement="left" data-toggle="modal" data-animation="false" title="Edit" onclick="return GetById(' + row.projectHistoryId + ')"><i class="fa fa-edit"></i></button >' + '&nbsp;' +
                        '<button class="btn btn-danger" data-placement="right" data-toggle="modal" data-animation="false" title="Delete" onclick="return Delete(' + row.projectHistoryId + ')"><i class="fa fa-trash"></i></button >'
                }
            }
        ],

        "order": [[1, "asc"]],
        //"responsive": true,
        //Buat ngilangin order kolom No dan Action
        "columnDefs": [
            {
                "targets": [0, 2, 3, 4, 5],
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

function parseJwt(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

function Save() {
    var ProjectHistory = new Object(); //object baru
    ProjectHistory.projectName = $('#ProjectName').val(); //value insert dari id pada input
    ProjectHistory.jobSpec = $('#JobSpec').val();
    ProjectHistory.year = $('#Year').val();
    ProjectHistory.companyName = $('#CompanyName').val();
    const decodedtoken = parseJwt(sessionStorage.getItem("Token"));
    const accid = decodedtoken.AccountId;
    ProjectHistory.accountId = accid;
    $.ajax({
        type: 'POST',
        url: 'https://localhost:7177/api/ProjectHistoryControler',
        data: JSON.stringify(EmploymentHistory),
        contentType: "application/json; charset=utf-8",
        /*headers: {
            "Authorization": "Bearer " + sessionStorage.getItem("tokenJWT")
        },*/
    }).then((result) => {
        debugger;
        if (result.status == 200) {
            /*alert(result.message);
            $('#TB_Department').DataTable().ajax.reload();*/
            Swal.fire({
                icon: 'success',
                title: 'Success...',
                text: 'Data has been added!',
                showConfirmButtom: false,
                timer: 1500
            })
            //$('#Modal').modal('hide');
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
    $('#ProjectHistoryId').val('');
    $('#ProjectName').val('');
    $('#JobSpec').val('');
    $('#Year').val('');
    $('#CompanyName').val('');
    $('#Update').hide();
    $('#Save').show();
}

function GetById(projectHistoryId) {
    debugger;
    $.ajax({
        url: "https://localhost:7177/api/ProjectHistoryControler/" + projectHistoryId,
        type: "GET",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        /*headers: {
            "Authorization": "Bearer " + sessionStorage.getItem("tokenJWT")
        },*/
        success: function (result) {
            debugger;
            var obj = result.data; //data yg kita dapat dr API  
            $('#ProjectHistoryId').val(obj.projectHistoryId);
            $('#ProjectName').val(obj.projectName);
            $('#JobSpec').val(obj.jobSpec);
            $('#Year').val(obj.year);
            $('#CompanyName').val(obj.companyName);
            $('#Modal').modal('show');
            $('#Update').show();
            $('#Save').hide();
        },
        error: function (errormessage) {
            alert(errormessage.responseText);
        }
    })
}

function Update() {
    var ProjectHistory = new Object(); //object baru
    ProjectHistory.projectHistoryId = $('#ProjectHistoryId');
    ProjectHistory.projectName = $('#ProjectName').val(); //value insert dari id pada input
    ProjectHistory.jobSpec = $('#JobSpec').val();
    ProjectHistory.year = $('#Year').val();
    ProjectHistory.companyName = $('#CompanyName').val();
    debugger;
    $.ajax({
        url: 'https://localhost:7177/api/EmploymentHistory',
        type: 'PUT',
        data: JSON.stringify(EmploymentHistory),
        contentType: "application/json; charset=utf-8",
        /*headers: {
            "Authorization": "Bearer " + sessionStorage.getItem("tokenJWT")
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

function Delete(projectHistoryId) {
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
                url: "https://localhost:7177/api/ProjectHistoryControler/" + projectHistoryId,
                type: "DELETE",
                dataType: "json",

                /*headers: {
                    "Authorization": "Bearer " + sessionStorage.getItem("tokenJWT")
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