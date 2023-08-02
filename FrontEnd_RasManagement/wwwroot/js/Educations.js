var table = null;
$(document).ready(function () {
    Educations();
})

function Educations() {
    const decodedtoken = parseJwt(sessionStorage.getItem("Token"));
    const accid = decodedtoken.AccountId;
    table = $('#TB_FormalEdu').DataTable({
        "ajax": {
            url: "https://localhost:7177/api/Educations/accountId?accountId=" + accid,
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
                        '<button class="btn btn-danger" data-placement="right" data-toggle="modal" data-animation="false" title="Delete" onclick="return DeleteFormal(' + row.formalEduId + ')"><i class="fa fa-trash"></i></button >'
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

function parseJwt(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

function SaveFormal() {
    var isValid = true;

    $('input[required]').each(function () {
        var input = $(this);
        if (!input.val()) {
            input.next('.error-message-formal').show();
            isValid = false;
        } else {
            input.next('.error-message-formal').hide();
        }
    });

    if (!isValid) {
        return;
    }

    var FormalEdu = new Object(); //object baru
    FormalEdu.universityName = $('#UniversityName').val(); //value insert dari id pada input
    FormalEdu.location = $('#Location').val();
    FormalEdu.major = $('#Major').val();
    FormalEdu.degree = $('#Degree').val();
    FormalEdu.years = $('#GraduationYears').val();
    const decodedtoken = parseJwt(sessionStorage.getItem("Token"));
    const accid = decodedtoken.AccountId;
    FormalEdu.AccountId = accid;
    $.ajax({
        type: 'POST',
        url: 'https://localhost:7177/api/Educations',
        data: JSON.stringify(FormalEdu),
        contentType: "application/json; charset=utf-8",
        /*headers: {
            "Authorization": "Bearer " + sessionStorage.getItem("tokenJWT")
        },*/
    }).then((result) => {
        //debugger;
        if (result.status == 200) {
            Swal.fire({
                icon: 'success',
                title: 'Success...',
                text: 'Data has been added!',
                showConfirmButtom: false,
                timer: 1500
            })
            $('#ModalFormal').modal('hide');
            table.ajax.reload();
        }
        else {
            Swal.fire({
                icon: 'warning',
                title: 'Data Gagal dimasukkan!',
                showConfirmButtom: false,
                timer: 1500
            })
            $('#ModalFormal').modal('hide');
            table.ajax.reload();
        }
    })
}

function ClearScreenFormal() {
    $('#FormalEduId').val('');
    $('#UniversityName').val('');
    $('#Location').val('');
    $('#Major').val('');
    $('#Degree').val('');
    $('#GraduationYears').val('');
    $('#Update').hide();
    $('#Save').show();
    $('input[required]').each(function () {
        var input = $(this);
        
            input.next('.error-message-formal').hide();
        
    });
}

function GetById(formalEduId) {
    //debugger;
    $.ajax({
        url: "https://localhost:7177/api/Educations/" + formalEduId,
        type: "GET",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        /*headers: {
            sessionStorage.getItem("Token")
        },*/
        success: function (result) {
            debugger;
            var obj = result.data; //data yg kita dapat dr API  
            $('#FormalEduId').val(obj.formalEduId);
            $('#UniversityName').val(obj.universityName);
            $('#Location').val(obj.location);
            $('#Major').val(obj.major);
            $('#Degree').val(obj.degree);
            $('#GraduationYears').val(obj.years);
            $('#AccountId').accid;
            $('#ModalFormal').modal('show');
            $('#Update').show();
            $('#Save').hide();
        },
        error: function (errormessage) {
            alert(errormessage.responseText);
        }
    })
}

function UpdateFormal() {
    var FormalEdu = new Object(); //object baru
    FormalEdu.FormalEduId = $('#FormalEduId').val();
    FormalEdu.UniversityName = $('#UniversityName').val(); //value insert dari id pada input
    FormalEdu.Location = $('#Location').val();
    FormalEdu.Major = $('#Major').val();
    FormalEdu.Degree = $('#Degree').val();
    FormalEdu.Years = $('#GraduationYears').val();
    const decodedtoken = parseJwt(sessionStorage.getItem("Token"));
    const accid = decodedtoken.AccountId;
    FormalEdu.AccountId = accid;
    debugger;
    $.ajax({
        type: 'PUT',
        url: 'https://localhost:7177/api/Educations',
        data: JSON.stringify(FormalEdu),
        contentType: "application/json; charset=utf-8"
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
            $('#ModalFormal').modal('hide');
            table.ajax.reload();
        }
        else {
            alert("Data gagal Diperbaharui");
        }
    });
}

function DeleteFormal(formalEduId) {
    debugger;
    Swal.fire({
        title: 'Kamu yakin?',
        text: "Anda tidak akan bisa mengembalikannya jika memilih Ya!",
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Ya',
        cancelButtonText: 'Tidak'
    }).then((result) => {
        if (result.value) {
            $.ajax({
                url: "https://localhost:7177/api/Educations/" + formalEduId,
                type: "DELETE",
                dataType: "json",
            }).then((result) => {
                debugger;
                if (result.status == 200) {
                    Swal.fire(
                        'Berhasil',
                        'Data sudah dihapus.',
                        'success'
                    )
                    $('#TB_FormalEdu').DataTable().ajax.reload();
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