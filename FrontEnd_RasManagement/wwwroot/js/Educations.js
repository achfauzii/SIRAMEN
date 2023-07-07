var table = null;
$(document).ready(function () {
    Educations();
})

function Educations() {
    table = $('#TB_FormalEdu').DataTable({
        "ajax": {
            url: "https://localhost:7177/api/Educations/accountId?accountId=0999",
            /*url: "https://localhost:7177/api/Educations",*/
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
            { "data": "universityName" },
            { "data": "location" },
            { "data": "major" },
            { "data": "degree" },
            { "data": "years" },
            {
                // Menambahkan kolom "Action" berisi tombol "Edit" dan "Delete" dengan Bootstrap
                "data": null,
                "render": function (data, type, row) {
                    var modalId = "modal-edit-" + data.formalEduId;
                    var deleteId = "modal-delete-" + data.formalEduId;
                    return '<button class="btn btn-warning " data-placement="left" data-toggle="modal" data-animation="false" title="Edit" onclick="return GetById(' + row.formalEduId + ')"><i class="fa fa-edit"></i></button >' + '&nbsp;' +
                        '<button class="btn btn-danger" data-placement="right" data-toggle="modal" data-animation="false" title="Delete" onclick="return Delete(' + row.formalEduId + ')"><i class="fa fa-trash"></i></button >'
                }
            }
        ],

        "order": [[1, "asc"]],
        //"responsive": true,
        //Buat ngilangin order kolom No dan Action
        "columnDefs": [
            {
                "targets": [0, 2, 3, 4, 5, 6],
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
}

function Save() {
    var FormalEdu = new Object(); //object baru
    FormalEdu.universityName = $('#UniversityName').val(); //value insert dari id pada input
    FormalEdu.location = $('#Location').val();
    FormalEdu.major = $('#Major').val();
    FormalEdu.degree = $('#Degree').val();
    FormalEdu.years = $('#Years').val();
    FormalEdu.accountId = $('#AccountId').val();
    $.ajax({
        type: 'POST',
        url: 'https://localhost:7177/api/Educations',
        data: JSON.stringify(FormalEdu),
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
    $('#FormalEduId').val('');
    $('#UniversityName').val('');
    $('#Location').val('');
    $('#Major').val('');
    $('#Degree').val('');
    $('#Years').val('');
    $('#AccountId').val('');
    $('#Update').hide();
    $('#Save').show();
}

function GetById(formalEduId) {
    debugger;
    $.ajax({
        url: "https://localhost:7177/api/Educations/" + formalEduId,
        type: "GET",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        headers: {
            "Authorization": "Bearer " + sessionStorage.getItem("tokenJWT")
        },
        success: function (result) {
            debugger;
            var obj = result.data; //data yg kita dapat dr API  
            $('#FormalEduId').val(obj.formalEduId);
            $('#UniversityName').val(obj.universityName);
            $('#Location').val(obj.location);
            $('#Major').val(obj.major);
            $('#Degree').val(obj.degree);
            $('#Years').val(obj.years);
            $('#AccountId').val(obj.accountId);
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
    var FormalEdu = new Object(); //object baru
    FormalEdu.UniversityName = $('#UniversityName').val(); //value insert dari id pada input
    FormalEdu.Location = $('#Location').val();
    FormalEdu.Major = $('#Major').val();
    FormalEdu.Degree = $('#Degree').val();
    FormalEdu.Years = $('#Years').val();
    FormalEdu.accountId = $('#AccountId').val();
    debugger;
    $.ajax({
        url: 'https://localhost:7177/api/Educations',
        type: 'PUT',
        data: JSON.stringify(FormalEdu),
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

function Delete(formalEduId) {
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
                url: "https://localhost:7177/api/Educations/" + formalEduId,
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